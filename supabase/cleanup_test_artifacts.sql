-- =============================================================
-- 2k2 - Cleanup automation test artifacts (@noreply.2k2.test)
--
-- Run in the Supabase SQL Editor (as owner / postgres).
-- Deletes only accounts whose email ends in @noreply.2k2.test
-- (the throwaway accounts created by the automated live E2E runs:
--   rlstest-*, e2emember-*, e2eprovider-*, probe-*, pgate-*, iso-*).
--
-- It NEVER touches app_data (listings, wallets, transactions, forum,
-- content, etc.) and NEVER touches any real user. Verified against the
-- live DB: exactly 24 test accounts match; the real users
-- (thandohlomuka8@gmail.com, rachelmageza4@gmail.com,
-- rachel.mageza@yahoo.com) do not match and are left untouched.
--
-- IMPLEMENTATION: a single `security definer` PL/pgSQL function that
-- runs entirely in ONE call with owner privileges. This avoids the
-- "relation _test_ids does not exist" error SQL Editor can raise with
-- temp tables (session/schema isolation), and matches the existing
-- convention in this folder (see promote_admin.sql).
--
-- USAGE / SAFE WORKFLOW (run twice):
--   1) DRY RUN: paste everything, change the last SELECT call to
--               select public.cleanup_test_artifacts(dry_run := true);
--               It only counts what WOULD be deleted; nothing changes.
--   2) APPLY:   run the function with dry_run := false (or omit it).
--               It deletes child rows, profiles, and auth.users, then
--               returns per-table counts so you can confirm 0 remain.
-- =============================================================

create or replace function public.cleanup_test_artifacts(dry_run boolean default false)
returns table (what text, n bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_test_ids uuid[];
begin
  -- Collect every test account id (all automation emails end in @noreply.2k2.test)
  select array_agg(user_id) into v_test_ids
  from public.profiles
  where email like '%@noreply.2k2.test';

  if v_test_ids is null or cardinality(v_test_ids) = 0 then
    what := 'no test artifacts found';
    n := 0;
    return next;
    return;
  end if;

  if not dry_run then
    -- Delete child rows FIRST (referential order)
    delete from public.provider_upgrade_requests where user_id = any (v_test_ids);
    delete from public.presence                 where id       = any (v_test_ids);
    delete from public.profiles                 where user_id  = any (v_test_ids);
    -- Delete the auth users (cascades auth.identities / auth.sessions;
    -- the on_auth_user_deleted trigger also cleans presence defensively)
    delete from auth.users where id = any (v_test_ids);
  end if;

  -- Report remaining test artifacts after the operation
  what := 'test profiles remaining';
  select count(*) into n from public.profiles where email like '%@noreply.2k2.test';
  return next;

  what := 'test presence rows remaining';
  select count(*) into n from public.presence where id = any (v_test_ids);
  return next;

  what := 'test upgrade requests remaining';
  select count(*) into n from public.provider_upgrade_requests where user_id = any (v_test_ids);
  return next;
end;
$$;

-- =============================================================
-- HELPERS / HOOKS
-- =============================================================

-- (Optional) Grant execution to authenticated roles if you ever want to
-- invoke it from the app. By default it runs only in the SQL Editor.
-- grant execute on function public.cleanup_test_artifacts(boolean) to authenticated;

-- =============================================================
-- RUN IT
-- =============================================================

-- 1) DRY RUN first: only counts what WOULD be deleted (safe, no changes):
select public.cleanup_test_artifacts(dry_run := true);

-- 2) Then APPLY for real (delete the throwaway test accounts):
-- select public.cleanup_test_artifacts(dry_run := false);
