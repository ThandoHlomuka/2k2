-- =============================================================
-- 2k2 - REAL PRESENCE + GUEST TRACKING (run this in SQL Editor)
-- Additions only. The base schema (profiles/app_data/etc.) is
-- already applied, so this file contains ONLY the new presence
-- tables, RLS, helper function, and realtime publication.
-- Idempotent: safe to run again.
-- =============================================================

-- -------------------------------------------------------------
-- 1. presence  (real online/offline tracking via Realtime heartbeat)
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

-- Realtime for presence (idempotent + full row broadcast)
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
-- 2. guest_presence  (real tracking of anonymous visitors browsing)
--     Guests are NOT signed in, so they get a browser-level id and
--     heartbeat through the security-definer RPC below.
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

-- No direct client writes; guests must use touch_guest_presence()
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

-- Realtime for guest presence (idempotent + full row broadcast)
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
-- GRANTs  (RLS on the tables still blocks unauthorised writes)
-- -------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all functions in schema public to anon, authenticated;
