-- ============================================================
-- 2k2 - Restore admin role + guard against admin demotion
-- Run in the Supabase SQL editor (runs as postgres).
--
-- NOTE: The live 'profiles_no_self_role_change' trigger blocks
-- ANY role change (even by postgres). We temporarily disable it
-- for the restore, then re-enable it, and add a dedicated
-- admin-demotion guard so an admin can never be relegated again.
-- Fully idempotent: safe to run multiple times.
-- ============================================================

-- ------------------------------------------------------------
-- Step 1: Temporarily suspend the self-role-change guard
-- ------------------------------------------------------------
alter table public.profiles disable trigger profiles_no_self_role_change;

-- ------------------------------------------------------------
-- Step 2: Restore the affected admin account to role='admin'
-- ------------------------------------------------------------
update public.profiles
set role = 'admin', updated_at = now()
where email = 'thandohlomuka8@gmail.com';

-- ------------------------------------------------------------
-- Step 3: Re-enable the self-role-change guard (re-applies
-- the original protection for all normal users)
-- ------------------------------------------------------------
alter table public.profiles enable trigger profiles_no_self_role_change;

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
