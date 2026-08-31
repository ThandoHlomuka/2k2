-- =============================================================
-- 2k2 - Supabase schema
-- Paste this ENTIRE file into the Supabase SQL Editor and run.
-- Creates all app tables, RLS policies, and grants.
-- Run once. Safe to re-run (idempotent via IF NOT EXISTS / OR REPLACE).
-- =============================================================

-- -------------------------------------------------------------
-- 1. profiles  (one per auth account -> enforces one profile type)
-- -------------------------------------------------------------
create table if not exists public.profiles (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,                    -- FK -> auth.users.id
  role text not null default 'user'         -- 'user' | 'provider' | 'admin'
    check (role in ('user','provider','admin')),
  status text not null default 'active',
  full_name text,
  display_name text,
  email text,
  avatar_url text,
  profile_data jsonb default '{}'::jsonb,   -- denormalized profile payload (keeps JS shapes)
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id),
  unique (user_id)
);
alter table public.profiles enable row level security;

-- -------------------------------------------------------------
-- 2. app_data  (one row per collection; jsonb array = the full list)
--    collection = the storage key:
--    'users','providers','listings','venues','ads','services',
--    'bookings','tips','service_types','wallets','transactions',
--    'topup_requests','withdrawal_requests','content','events',
--    'content_comments','content_reactions','reviews',
--    'forum_threads','forum_replies','forum_likes','gigs',
--    'conversations','messages','saved_items','downloads',
--    'experiences','experience_purchases','fantasy_requests'
--    This 1:1-maps the current localStorage Storage API to rows,
--    so getX() reads the whole array and setX() upserts it.
-- -------------------------------------------------------------
create table if not exists public.app_data (
  collection text not null,
  data jsonb not null default '[]'::jsonb,
  owner_user_id uuid,                        -- auth uid (system 'global' row or owner)
  updated_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (collection)
);
alter table public.app_data enable row level security;

-- -------------------------------------------------------------
-- 3. provider_upgrade_requests  (pricing -> payment -> admin approval)
-- -------------------------------------------------------------
create table if not exists public.provider_upgrade_requests (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  plan text not null,
  amount numeric(10,2) not null,
  payment_ref text,
  status text not null default 'pending'     -- pending | approved | rejected
    check (status in ('pending','approved','rejected')),
  notes text,
  decided_by uuid,
  created_at timestamptz default now(),
  decided_at timestamptz,
  primary key (id)
);
alter table public.provider_upgrade_requests enable row level security;

-- -------------------------------------------------------------
-- Helper: is the current user an admin?
-- security definer => runs as owner, bypassing RLS internally,
-- so referencing `profiles` here does NOT cause infinite recursion
-- when used from a policy on `profiles` itself.
-- -------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- -------------------------------------------------------------
-- RLS policies
-- -------------------------------------------------------------
-- profiles: user can read/update own; admins read all.
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select"
  on public.profiles for select
  using (user_id = auth.uid() or auth.role() = 'service_role' or public.is_admin());

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert"
  on public.profiles for insert
  with check (user_id = auth.uid() or auth.role() = 'service_role');

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update"
  on public.profiles for update
  using (user_id = auth.uid() or auth.role() = 'service_role' or public.is_admin());

-- app_data: shared dataset; authenticated users R/W (mirrors the
-- communal localStorage model). Service role used for admin/system ops.
drop policy if exists "app_data_select" on public.app_data;
create policy "app_data_select"
  on public.app_data for select
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

drop policy if exists "app_data_insert" on public.app_data;
create policy "app_data_insert"
  on public.app_data for insert
  with check (auth.role() in ('authenticated','service_role'));

drop policy if exists "app_data_update" on public.app_data;
create policy "app_data_update"
  on public.app_data for update
  using (auth.role() in ('authenticated','service_role'));

drop policy if exists "app_data_delete" on public.app_data;
create policy "app_data_delete"
  on public.app_data for delete
  using (auth.role() in ('authenticated','service_role'));

-- provider_upgrade_requests: user reads/inserts own; service_role manages.
drop policy if exists "upg_select" on public.provider_upgrade_requests;
create policy "upg_select"
  on public.provider_upgrade_requests for select
  using (user_id = auth.uid() or auth.role() = 'service_role' or public.is_admin());

drop policy if exists "upg_insert" on public.provider_upgrade_requests;
create policy "upg_insert"
  on public.provider_upgrade_requests for insert
  with check (user_id = auth.uid() or auth.role() = 'service_role');

drop policy if exists "upg_update" on public.provider_upgrade_requests;
create policy "upg_update"
  on public.provider_upgrade_requests for update
  using (user_id = auth.uid() or auth.role() = 'service_role' or public.is_admin());

-- -------------------------------------------------------------
-- Auto-create a profile when a new auth user signs up.
-- Guarantees one profile (role='user') per account, even before
-- email confirmation (there is no session yet, so the client
-- could not insert it itself).
-- -------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, role, status, full_name, email, profile_data)
  values (
    new.id,
    'user',
    'active',
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email),
    new.email,
    '{}'::jsonb
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

grant execute on function public.handle_new_user() to anon, authenticated;

-- -------------------------------------------------------------
-- 4. presence  (real online/offline tracking via Realtime heartbeat)
--    id = auth user id. Clients upsert last_seen on a heartbeat;
--    others read it to decide online (last_seen < ~60s).
-- -------------------------------------------------------------
create table if not exists public.presence (
  id uuid not null,                          -- auth.users.id
  role text not null default 'user',
  display_name text,
  email text,
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (id)
);
alter table public.presence enable row level security;

-- Presence RLS:
--   select : anon + authenticated may read presence (to see who's online)
--   upsert : a user may only write their OWN presence row (service_role for system)
drop policy if exists "presence_select" on public.presence;
create policy "presence_select"
  on public.presence for select
  using (auth.role() in ('anon','authenticated','service_role'));

drop policy if exists "presence_insert_own" on public.presence;
create policy "presence_insert_own"
  on public.presence for insert
  with check (id = auth.uid() or auth.role() = 'service_role');

drop policy if exists "presence_update_own" on public.presence;
create policy "presence_update_own"
  on public.presence for update
  using (id = auth.uid() or auth.role() = 'service_role');

-- Auto-remove presence when an auth user is deleted
create or replace function public.clear_presence_on_user_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.presence where id = old.id;
  return old;
end;
$$;

drop trigger if exists on_auth_user_deleted on auth.users;
create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute function public.clear_presence_on_user_delete();

-- Enable Realtime for the presence table and broadcast full row data
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'presence'
  ) then
    alter publication "supabase_realtime" add table public.presence;
  end if;
end $$;
alter table public.presence replica identity full;

-- -------------------------------------------------------------
-- 4b. guest_presence  (real tracking of anonymous visitors browsing)
--     guest_id = persistent browser-level UUID stored in localStorage.
--     Clients (maybe anonymously) call touch_guest_presence() to
--     heartbeat their guest row. Read to show "Guests browsing now".
-- -------------------------------------------------------------
create table if not exists public.guest_presence (
  guest_id text not null,
  label text,
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (guest_id)
);
alter table public.guest_presence enable row level security;

-- anyone (anon/authenticated) may READ guest presence
drop policy if exists "guest_presence_select" on public.guest_presence;
create policy "guest_presence_select"
  on public.guest_presence for select
  using (auth.role() in ('anon','authenticated','service_role'));

-- No direct insert/update/delete by clients; they must use
-- touch_guest_presence() below (security definer). This keeps the
-- table free of anon-table grants.
drop policy if exists "guest_presence_no_insert" on public.guest_presence;
create policy "guest_presence_no_insert"
  on public.guest_presence for insert
  with check (false);

drop policy if exists "guest_presence_no_update" on public.guest_presence;
create policy "guest_presence_no_update"
  on public.guest_presence for update
  using (false);

drop policy if exists "guest_presence_no_delete" on public.guest_presence;
create policy "guest_presence_no_delete"
  on public.guest_presence for delete
  using (false);

-- security definer RPC so anonymous clients can heartbeat their guest row
create or replace function public.touch_guest_presence(p_guest_id text, p_label text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.guest_presence (guest_id, label, last_seen)
  values (p_guest_id, p_label, now())
  on conflict (guest_id)
  do update set label = excluded.label, last_seen = now();
end;
$$;

grant execute on function public.touch_guest_presence(text, text) to anon, authenticated;

-- Enable Realtime for guest presence and broadcast full rows
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'guest_presence'
  ) then
    alter publication "supabase_realtime" add table public.guest_presence;
  end if;
end $$;
alter table public.guest_presence replica identity full;

-- -------------------------------------------------------------
-- GRANTs  (required since 2026-04-28: new tables are not exposed
--  to the Data API by default)
-- -------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all functions in schema public to anon, authenticated;
