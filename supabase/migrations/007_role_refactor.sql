-- ============================================================================
-- 007_role_refactor.sql — Role system refactor
--
-- Migrates:
--   collector   → buyer
--   professional → curator
--
-- New CHECK constraint: ('artist', 'admin', 'buyer', 'curator')
-- New DEFAULT: 'buyer'
-- ============================================================================

BEGIN;

-- 1. Expand CHECK constraint to include ALL values (old + new) during migration
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('artist', 'admin', 'collector', 'professional', 'buyer', 'curator'));

-- 2. Migrate data in public.users
UPDATE public.users SET role = 'buyer'   WHERE role = 'collector';
UPDATE public.users SET role = 'curator' WHERE role = 'professional';

-- 3. Migrate auth.users user_metadata (role stored in raw_user_meta_data jsonb)
UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"buyer"')
  WHERE raw_user_meta_data->>'role' = 'collector';

UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"curator"')
  WHERE raw_user_meta_data->>'role' = 'professional';

-- 4. Tighten CHECK constraint to only new values
ALTER TABLE public.users DROP CONSTRAINT users_role_check;
ALTER TABLE public.users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('artist', 'admin', 'buyer', 'curator'));

-- 5. Change DEFAULT from 'collector' to 'buyer'
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'buyer';

-- 6. Update handle_new_user() trigger to default to 'buyer'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, role, auth_provider, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
    CASE
      WHEN NEW.raw_app_meta_data->>'provider' = 'google' THEN 'google'
      ELSE 'email'
    END,
    TRUE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

COMMIT;
