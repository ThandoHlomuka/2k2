-- =============================================================
-- 2k2 - RLS hardening
-- Run in the Supabase SQL Editor (or `supabase db query` once
-- the project is linked). Idempotent; safe to run again.
-- Requires elevated rights (dashboard / owner).
--
-- Fixes vs. the original schema.sql
--  1. Replaces the deprecated auth.role() predicates with
--     explicit TO anon/authenticated targets.
--  2. app_data: gives ANON read access so guests can browse the
--     public collections (hydrate fails for anon today); writes
--     stay authenticated-only.
--  3. Adds WITH CHECK to every update policy (self-escalation and
--     self-approval vectors were wide open).
--  4. provider_upgrade_requests updates are admin-only; clients
--     only ever insert. Plus a trigger blocks a second pending
--     request per account (duplicate submission guard).
--  5. Profiles: users can no longer change their own role
--     (admin-only via trigger).
-- =============================================================

-- Helper lockdown: is_admin() only tells the caller about
-- THEMSELVES, so keep EXECUTE limited to authenticated.
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- -------------------------------------------------------------
-- profiles
-- -------------------------------------------------------------
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles
  for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update to authenticated
  using (user_id = (select auth.uid()) or public.is_admin())
  with check (user_id = (select auth.uid()) or public.is_admin());

-- Self-escalation guard: a signed-in user must never change their
-- own role/status columns. Only admins (public.is_admin()) may.
create or replace function public.profiles_no_self_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role)
     and not public.is_admin()
  then
    raise exception 'You are not allowed to change your own role.';
  end if;
  if (new.status is distinct from old.status)
     and not public.is_admin()
  then
    raise exception 'You are not allowed to change your own status.';
  end if;
  return new;
end;
$$;

drop trigger if exists on_profiles_role_protect on public.profiles;
create trigger on_profiles_role_protect
  before update on public.profiles
  for each row execute function public.profiles_no_self_role_change();

-- -------------------------------------------------------------
-- app_data  (communal JSON-blob store)
--   anon  -> SELECT only, and ONLY the public browse collections
--            (deny private collections: wallets/transactions/
--            messages/conversations/bookings/tips/follows/orders/
--            saved/downloads/help-escalation/etc.)
--   auth  -> FULL access (existing communal read/write model)
-- -------------------------------------------------------------
drop policy if exists "app_data_select" on public.app_data;
create policy "app_data_select" on public.app_data
  for select to authenticated
  using (true);

drop policy if exists "app_data_select_anon_public" on public.app_data;
create policy "app_data_select_anon_public" on public.app_data
  for select to anon
  using (collection in (
    'users','providers','listings','venues','ads','services','service_types',
    'content','events','content_comments','content_reactions','reviews',
    'forum_threads','forum_replies','forum_likes','gigs','experiences','products'
  ));

drop policy if exists "app_data_insert" on public.app_data;
create policy "app_data_insert" on public.app_data
  for insert to authenticated
  with check (true);

drop policy if exists "app_data_update" on public.app_data;
create policy "app_data_update" on public.app_data
  for update to authenticated
  using (true)
  with check (true);

drop policy if exists "app_data_delete" on public.app_data;
create policy "app_data_delete" on public.app_data
  for delete to authenticated
  using (true);

-- -------------------------------------------------------------
-- provider_upgrade_requests
--   users  -> select own + insert own only
--   admins -> select/update all (approve / reject)
-- -------------------------------------------------------------
drop policy if exists "upg_select" on public.provider_upgrade_requests;
create policy "upg_select" on public.provider_upgrade_requests
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());

drop policy if exists "upg_insert" on public.provider_upgrade_requests;
create policy "upg_insert" on public.provider_upgrade_requests
  for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "upg_update" on public.provider_upgrade_requests;
create policy "upg_update" on public.provider_upgrade_requests
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Duplicate-submission guard at the database level: at most one
-- pending request per account (users can never update their own
-- request, so only admins transition pending -> approved/rejected).
create or replace function public.prevent_duplicate_pending_upgrade()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'pending' and exists (
    select 1 from public.provider_upgrade_requests
    where user_id = new.user_id
      and status = 'pending'
      and id <> new.id
  ) then
    raise exception 'A service provider request is already pending for this account.';
  end if;
  return new;
end;
$$;

drop trigger if exists on_pending_upgrade_unique on public.provider_upgrade_requests;
create trigger on_pending_upgrade_unique
  before insert or update on public.provider_upgrade_requests
  for each row execute function public.prevent_duplicate_pending_upgrade();

-- -------------------------------------------------------------
-- presence
-- -------------------------------------------------------------
drop policy if exists "presence_select" on public.presence;
create policy "presence_select" on public.presence
  for select to anon, authenticated
  using (true);

drop policy if exists "presence_insert_own" on public.presence;
create policy "presence_insert_own" on public.presence
  for insert to authenticated
  with check (id = (select auth.uid()));

drop policy if exists "presence_update_own" on public.presence;
create policy "presence_update_own" on public.presence
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- -------------------------------------------------------------
-- guest_presence
-- -------------------------------------------------------------
drop policy if exists "guest_presence_select" on public.guest_presence;
create policy "guest_presence_select" on public.guest_presence
  for select to anon, authenticated
  using (true);

drop policy if exists "guest_presence_no_insert" on public.guest_presence;
create policy "guest_presence_no_insert" on public.guest_presence
  for insert to anon, authenticated
  with check (false);

drop policy if exists "guest_presence_no_update" on public.guest_presence;
create policy "guest_presence_no_update" on public.guest_presence
  for update to anon, authenticated
  using (false);

drop policy if exists "guest_presence_no_delete" on public.guest_presence;
create policy "guest_presence_no_delete" on public.guest_presence
  for delete to anon, authenticated
  using (false);