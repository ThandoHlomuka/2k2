-- ============================================================
-- 2k2 - Restore admin role + guard against admin demotion
-- Run this in the Supabase SQL editor (runs as postgres,
-- bypasses RLS + the "cannot change own role" trigger).
--
-- 1) Restores thandohlomuka8@gmail.com to role='admin'.
-- 2) Adds a DATABASE-LEVEL guard so an admin can NEVER be
--    demoted/relegated to provider/user again by any app path.
-- ============================================================

-- Step 1: Restore the affected admin account to role='admin'
update public.profiles
set role = 'admin', updated_at = now()
where email = 'thandohlomuka8@gmail.com'
  and role = 'provider';   -- only touch it if it was wrongly demoted

-- Step 2: Guardian trigger - never allow a role change away from 'admin'
create or replace function public.prevent_admin_demotion()
returns trigger
language plpgsql
as $$
begin
  -- Reject ANY attempt to change an existing admin's role
  -- (this fires for the app's anon/authenticated clients AND
  --  protects against the approveUpgrade/role-update code paths).
  if old.role = 'admin' and new.role is distinct from old.role then
    raise exception 'Admin accounts cannot be demoted or have their role changed.';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_admin_demotion on public.profiles;
create trigger prevent_admin_demotion
  before update on public.profiles
  for each row execute function public.prevent_admin_demotion();

grant execute on function public.prevent_admin_demotion() to anon, authenticated;

-- Step 3 (optional but recommended): Confirm the result
select email, user_id, role, updated_at
from public.profiles
where email = 'thandohlomuka8@gmail.com';
