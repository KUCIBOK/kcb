-- =============================================================================
-- 012_role_refactor_completion_and_cleanup.sql
--
-- Production data on Supabase reveals that migrations 007 and 008 never
-- applied (verified 2026-05-05): public.users.users_role_check still rejects
-- 'buyer' and 'curator', and 23 public.users + 27 auth.user_metadata rows
-- still hold the legacy role names. Combined with a separate column-name bug
-- in handle_new_user (NEW.app_metadata vs NEW.raw_app_meta_data), this left
-- 12 auth.users without a public.users row, blocking app rendering for those
-- accounts.
--
-- This migration brings prod into the intended post-007 state in a single
-- transaction:
--   1. Expand the CHECK constraint to accept BOTH legacy and new role names
--      (we keep both temporarily so a stale frontend reference doesn't
--      explode after deploy; tighten in a follow-up once the codebase is
--      verified clean).
--   2. Rename existing role data: collector -> buyer, professional -> curator,
--      in public.users AND auth.users.raw_user_meta_data.
--   3. Replace handle_new_user() with a corrected version that:
--        - reads raw_app_meta_data (not the non-existent app_metadata)
--        - normalizes legacy role values arriving from clients
--        - defaults to 'buyer' instead of 'collector'
--   4. Re-apply migration 008's RLS helpers (is_professional, is_curator)
--      so curator-gated policies work.
--   5. Set DEFAULT public.users.role to 'buyer'.
--   6. Backfill the 12 missing public.users rows from auth.users.
--   7. De-duplicate the plans table (each plan was inserted twice on
--      2025-06-03), re-pointing any referencing subscriptions to the
--      canonical plan_id before deleting the duplicates.
--
-- NOT included (intentional, separate concerns):
--   - Tightening the CHECK constraint to new names only (post-verification).
--   - Cleaning up 24 stuck-pending transactions (business decision).
--   - Expiring stale active subscriptions (needs a recurring job, not a
--     one-shot UPDATE).
--   - Removing test/automation auth.users (manual review).
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Expand CHECK constraint (legacy + new values both allowed)
-- -----------------------------------------------------------------------------
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('artist', 'admin', 'collector', 'professional', 'buyer', 'curator'));

-- -----------------------------------------------------------------------------
-- 2. Rename legacy role values to new names
-- -----------------------------------------------------------------------------
UPDATE public.users SET role = 'buyer'   WHERE role = 'collector';
UPDATE public.users SET role = 'curator' WHERE role = 'professional';

UPDATE auth.users
   SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"buyer"')
 WHERE raw_user_meta_data->>'role' = 'collector';

UPDATE auth.users
   SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"curator"')
 WHERE raw_user_meta_data->>'role' = 'professional';

-- -----------------------------------------------------------------------------
-- 3. Replace handle_new_user() with corrected version
--    Fixes: (a) raw_app_meta_data column name, (b) legacy-role normalization,
--    (c) safe fallback when an unexpected role arrives.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
  v_provider TEXT;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'buyer');
  v_role := CASE v_role
    WHEN 'collector'    THEN 'buyer'
    WHEN 'professional' THEN 'curator'
    ELSE v_role
  END;
  IF v_role NOT IN ('artist', 'admin', 'buyer', 'curator') THEN
    v_role := 'buyer';
  END IF;

  v_provider := CASE
    WHEN NEW.raw_app_meta_data->>'provider' = 'google' THEN 'google'
    ELSE 'email'
  END;

  INSERT INTO public.users (id, name, username, role, country, telephone, auth_provider, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    NULL,
    v_role,
    NEW.raw_user_meta_data->>'country',
    NEW.raw_user_meta_data->>'telephone',
    v_provider,
    TRUE
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- 4. RLS helpers (formerly migration 008)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_professional()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('curator', 'admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_curator()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT public.is_professional();
$$;

-- -----------------------------------------------------------------------------
-- 5. New default role
-- -----------------------------------------------------------------------------
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'buyer';

-- -----------------------------------------------------------------------------
-- 6. Backfill public.users rows for auth.users without one
--    Uses the same logic as the corrected trigger so future inserts and
--    backfills stay consistent.
-- -----------------------------------------------------------------------------
INSERT INTO public.users (id, name, username, role, country, telephone, auth_provider, is_active)
SELECT
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', SPLIT_PART(au.email, '@', 1)),
  NULL,
  CASE
    WHEN au.raw_user_meta_data->>'role' IN ('artist', 'admin', 'buyer', 'curator')
      THEN au.raw_user_meta_data->>'role'
    WHEN au.raw_user_meta_data->>'role' = 'collector'    THEN 'buyer'
    WHEN au.raw_user_meta_data->>'role' = 'professional' THEN 'curator'
    ELSE 'buyer'
  END,
  au.raw_user_meta_data->>'country',
  au.raw_user_meta_data->>'telephone',
  CASE WHEN au.raw_app_meta_data->>'provider' = 'google' THEN 'google' ELSE 'email' END,
  TRUE
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL;

-- -----------------------------------------------------------------------------
-- 7. De-duplicate plans table
--    Each plan was inserted twice on 2025-06-03. For each duplicated name,
--    keep the one referenced by the most subscriptions (tiebreak: oldest
--    created_at, then lowest id). Re-point referencing subscriptions to the
--    canonical plan_id, then delete the duplicates.
-- -----------------------------------------------------------------------------
WITH ranked AS (
  SELECT
    p.id,
    p.name,
    ROW_NUMBER() OVER (
      PARTITION BY p.name
      ORDER BY
        (SELECT COUNT(*) FROM public.subscriptions s WHERE s.plan_id = p.id) DESC,
        p.created_at ASC,
        p.id ASC
    ) AS rn
  FROM public.plans p
),
remap AS (
  SELECT d.id AS dup_id, k.id AS keep_id
  FROM ranked d
  JOIN ranked k ON k.name = d.name AND k.rn = 1
  WHERE d.rn > 1
)
UPDATE public.subscriptions s
   SET plan_id = r.keep_id
  FROM remap r
 WHERE s.plan_id = r.dup_id;

WITH ranked AS (
  SELECT
    p.id,
    ROW_NUMBER() OVER (
      PARTITION BY p.name
      ORDER BY
        (SELECT COUNT(*) FROM public.subscriptions s WHERE s.plan_id = p.id) DESC,
        p.created_at ASC,
        p.id ASC
    ) AS rn
  FROM public.plans p
)
DELETE FROM public.plans
 WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

COMMIT;

-- =============================================================================
-- POST-MIGRATION VERIFICATION (run as separate statements after COMMIT)
-- =============================================================================
-- Expected: roles distribution shows only artist/admin/buyer/curator
--   SELECT role, COUNT(*) FROM public.users GROUP BY role ORDER BY role;
--
-- Expected: zero auth.users with legacy roles
--   SELECT raw_user_meta_data->>'role' AS role, COUNT(*)
--   FROM auth.users
--   GROUP BY raw_user_meta_data->>'role' ORDER BY role;
--
-- Expected: zero auth.users without public.users row
--   SELECT au.email
--   FROM auth.users au
--   LEFT JOIN public.users pu ON pu.id = au.id
--   WHERE pu.id IS NULL;
--
-- Expected: each plan name appears exactly once
--   SELECT name, COUNT(*) FROM public.plans GROUP BY name HAVING COUNT(*) > 1;
--
-- Expected: no orphan subscriptions (every plan_id resolves)
--   SELECT s.id FROM public.subscriptions s
--   LEFT JOIN public.plans p ON p.id = s.plan_id
--   WHERE p.id IS NULL;
--
-- =============================================================================
-- FOLLOW-UPS (separate migration once verified)
-- =============================================================================
-- After confirming no client-side code still sends 'collector' or
-- 'professional', tighten CHECK to new values only:
--
--   ALTER TABLE public.users DROP CONSTRAINT users_role_check;
--   ALTER TABLE public.users ADD CONSTRAINT users_role_check
--     CHECK (role IN ('artist', 'admin', 'buyer', 'curator'));
-- =============================================================================
