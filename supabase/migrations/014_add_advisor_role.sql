-- 014_add_advisor_role.sql
-- Ajoute le rôle "advisor" (wealth manager art) à la plateforme Kucibok.
-- L'advisor gère des portefeuilles de collectionneurs / institutions.

-- 1. Mettre à jour le CHECK constraint sur users.role
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('buyer', 'artist', 'curator', 'admin', 'advisor'));

-- 2. Mettre à jour la fonction is_professional() pour inclure l'advisor
CREATE OR REPLACE FUNCTION is_professional()
RETURNS BOOLEAN AS $$
  SELECT role IN ('curator', 'advisor', 'admin')
  FROM users
  WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER SET search_path = public;

-- 3. Mettre à jour le trigger handle_new_user pour normaliser 'advisor'
-- (le trigger existant passe déjà les valeurs inconnues telles quelles —
--  on ajoute advisor explicitement au CASE pour clarté)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT;
  v_name TEXT;
BEGIN
  v_role := NEW.raw_user_meta_data->>'role';
  v_name := COALESCE(NEW.raw_user_meta_data->>'name', '');

  -- Normalisation des rôles legacy et validation
  v_role := CASE v_role
    WHEN 'collector'    THEN 'buyer'
    WHEN 'professional' THEN 'curator'
    WHEN 'artist'       THEN 'artist'
    WHEN 'curator'      THEN 'curator'
    WHEN 'advisor'      THEN 'advisor'
    WHEN 'admin'        THEN 'admin'
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

-- 4. RLS : l'advisor peut lire le catalogue certifié (comme le curator)
-- Les politiques existantes pour 'curator' doivent aussi couvrir 'advisor'.
-- Si des politiques spécifiques existent pour curator, les dupliquer pour advisor.
-- Exemple (à adapter selon les politiques existantes) :
-- CREATE POLICY "advisor_read_artworks" ON artworks
--   FOR SELECT USING (auth.uid() IN (
--     SELECT id FROM users WHERE role IN ('curator', 'advisor', 'admin')
--   ));

-- Note : les politiques RLS complètes sont gérées dans les migrations 002 et 008.
-- Pour l'instant, l'advisor hérite des droits publics (lecture catalogue approuvé).
-- Une migration dédiée étendra les droits B2B si nécessaire (Phase 2).
