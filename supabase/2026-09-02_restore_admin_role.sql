-- ============================================================
-- 2k2 - Restore admin role + guard against admin demotion
-- Run in the Supabase SQL editor (runs as postgres).
--
-- The live role-guard uses a function named
-- 'profiles_no_self_role_change' whose TRIGGER carries a
-- different (auto-generated) name, so we can't disable it by a
-- hard-coded name. Instead we dynamically disable ALL triggers on
-- public.profiles for the restore, then re-enable them all.
-- Fully idempotent: safe to run multiple times.
-- ============================================================

-- ------------------------------------------------------------
-- Step 1: Disable ALL user triggers on profiles (restore window)
-- ------------------------------------------------------------
do $$
declare rec record;
begin
  for rec in
    select tgname from pg_trigger
    where tgrelid = 'public.profiles'::regclass and not tgisinternal
  loop
    execute format('alter table public.profiles disable trigger %I', rec.tgname);
  end loop;
end $$;

-- ------------------------------------------------------------
-- Step 2: Restore the affected admin account to role='admin'
-- ------------------------------------------------------------
update public.profiles
set role = 'admin', updated_at = now()
where email = 'thandohlomuka8@gmail.com';

-- ------------------------------------------------------------
-- Step 3: Re-enable ALL user triggers on profiles
-- ------------------------------------------------------------
do $$
declare rec record;
begin
  for rec in
    select tgname from pg_trigger
    where tgrelid = 'public.profiles'::regclass and not tgisinternal
  loop
    execute format('alter table public.profiles enable trigger %I', rec.tgname);
  end loop;
end $$;

-- ------------------------------------------------------------
-- Step 4: Add the admin-demotion guard (the real fix that
-- guarantees an admin can NEVER be relegated again by any path)
-- ------------------------------------------------------------
drop trigger if exists prevent_admin_demotion on public.profiles;
drop function if exists public.prevent_admin_demotion() cascade;

create or replace function public.prevent_admin_demotion()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.role = 'admin' and new.role is distinct from old.role then
    raise exception 'Admin accounts cannot be demoted or have their role changed.';
  end if;
  return new;
end;
$$;

create trigger prevent_admin_demotion
  before update on public.profiles
  for each row execute function public.prevent_admin_demotion();

grant execute on function public.prevent_admin_demotion() to anon, authenticated;

-- ------------------------------------------------------------
-- Step 5: Verify the result
-- ------------------------------------------------------------
select email, user_id, role, updated_at
from public.profiles
where email = 'thandohlomuka8@gmail.com';
