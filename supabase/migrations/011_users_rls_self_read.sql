-- =============================================================================
-- 011_users_rls_self_read.sql
-- Permet à chaque utilisateur authentifié de lire son propre enregistrement
-- dans public.users (rôle, nom, statut).
--
-- Sans cette politique, loadDbRole() dans AuthContext fait une requête
-- directe avec le client Supabase (anon key) → RLS bloque → 406 Not Acceptable.
-- Le service_role (Vercel Functions) n'est pas affecté (bypass RLS).
-- =============================================================================

-- Politique SELECT : un utilisateur ne peut lire que sa propre ligne
CREATE POLICY IF NOT EXISTS "users: authenticated can read own record"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Politique SELECT publique minimale pour la vérification de disponibilité username
-- (optionnel — à activer uniquement si nécessaire)
-- CREATE POLICY "users: public can check username" ON public.users
--   FOR SELECT TO anon
--   USING (true)
--   WITH CHECK (false);
