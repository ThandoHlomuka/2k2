-- =============================================================
-- 2k2 - Promote account to Admin (idempotent)
--
-- Run this in the Supabase SQL Editor AFTER signing up on the
-- live site with:  email: thando8@gmail.com  /  pass: Nozibusiso89
--
-- This works whether or not the signup trigger has created the
-- profile row yet (it upserts if missing).
-- =============================================================

-- Helper: get auth user id by email
create or replace function public.promote_admin_by_email(target_email text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  target_uid uuid;
begin
  select id into target_uid from auth.users where email = target_email;
  if target_uid is null then
    return 'ERROR: No auth user found with email ' || target_email;
  end if;

  insert into public.profiles (user_id, role, status, email, profile_data)
  values (target_uid, 'admin', 'active', target_email, '{}'::jsonb)
  on conflict (user_id)
  do update set role = 'admin', status = 'active',
                email = target_email, updated_at = now();

  return 'OK: ' || target_email || ' promoted to admin';
end;
$$;

select public.promote_admin_by_email('thando8@gmail.com') as result;

-- Verify (run after) — should show role = 'admin':
select p.email, p.role, p.status
from public.profiles p
join auth.users u on u.id = p.user_id
where u.email = 'thando8@gmail.com';
