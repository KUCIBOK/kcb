-- 016_fix_admin_role_escalation.sql
-- FIX CRITICAL: Prevent privilege escalation via client-supplied role in raw_user_meta_data
--
-- The trigger handle_new_user() was accepting 'admin' role from client-supplied
-- raw_user_meta_data, allowing any authenticated user to self-assign admin privileges
-- by calling Supabase Auth directly with data.role = 'admin'.
--
-- This migration hardens the trigger to reject 'admin' (and any unknown role)
-- and fall back to the safe default 'buyer'.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT;
  v_name TEXT;
BEGIN
  v_role := NEW.raw_user_meta_data->>'role';
  v_name := COALESCE(NEW.raw_user_meta_data->>'name', '');

  -- Role normalization: only allow these roles from client.
  -- Admin can ONLY be assigned by backend or database admin, never from client signup.
  v_role := CASE v_role
    WHEN 'collector'    THEN 'buyer'
    WHEN 'professional' THEN 'curator'
    WHEN 'artist'       THEN 'artist'
    WHEN 'curator'      THEN 'curator'
    WHEN 'advisor'      THEN 'advisor'
    -- REMOVED: WHEN 'admin' THEN 'admin'
    -- Any unknown role (including 'admin') falls through to default
    ELSE 'buyer'
  END;

  INSERT INTO public.users (id, email, role, name)
  VALUES (NEW.id, NEW.email, v_role, v_name)
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        role  = EXCLUDED.role,
        name  = COALESCE(EXCLUDED.name, public.users.name);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Verification: confirm the constraint still allows admin in DB (for legitimate backend assignment)
-- and no existing users are affected (role = 'admin' should only exist from direct schema changes)
-- Run this query manually if needed:
-- SELECT COUNT(*) as admin_users FROM public.users WHERE role = 'admin';
