-- =============================================================================
-- Kucibok — Storage buckets & RLS policies
-- À exécuter dans le SQL Editor Supabase (ou via Supabase CLI)
--
-- Buckets :
--   profiles     public  — photos de profil
--   artworks     public  — images d'œuvres
--   blogs        public  — images articles
--   certificates private — certificats PDF (accès signé uniquement)
-- =============================================================================

-- ─── Création des buckets ─────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('profiles',     'profiles',     true,  10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('artworks',     'artworks',     true,  10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('blogs',        'blogs',        true,  10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('certificates', 'certificates', false, 20971520, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE
  SET public            = EXCLUDED.public,
      file_size_limit   = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =============================================================================
-- BUCKET : profiles (public)
-- Chemin attendu : profiles/{userId}/avatar.{ext}
-- =============================================================================

-- Lecture publique (pas besoin d'auth pour afficher les avatars)
CREATE POLICY "profiles: lecture publique"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profiles');

-- Un utilisateur authentifié peut uploader dans son propre dossier
CREATE POLICY "profiles: upload propre"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profiles'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Mise à jour dans son propre dossier
CREATE POLICY "profiles: update propre"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Suppression dans son propre dossier
CREATE POLICY "profiles: delete propre"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- =============================================================================
-- BUCKET : artworks (public)
-- Chemin attendu : artworks/{userId}/{filename}
-- =============================================================================

CREATE POLICY "artworks: lecture publique"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'artworks');

CREATE POLICY "artworks: upload propre"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'artworks'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "artworks: update propre"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'artworks'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "artworks: delete propre"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'artworks'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- =============================================================================
-- BUCKET : blogs (public)
-- Chemin attendu : blogs/{userId}/{filename}
-- =============================================================================

CREATE POLICY "blogs: lecture publique"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blogs');

CREATE POLICY "blogs: upload pro ou admin"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blogs'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "blogs: update propre"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'blogs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "blogs: delete propre"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'blogs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- =============================================================================
-- BUCKET : certificates (private — accès via signed URL uniquement)
-- Upload/suppression : service_role uniquement (via Vercel Function)
-- Lecture : propriétaire de l'œuvre ou admin (via signed URL)
-- =============================================================================

-- Pas de policy SELECT publique — accès uniquement via createSignedUrl (service_role)
-- La Vercel Function génère une signed URL valable 1h (cf. api/[...path].js)

-- Pas de policy INSERT/UPDATE/DELETE client — tout passe par service_role bypass
-- Note : service_role bypass RLS, donc aucune policy n'est nécessaire pour le serveur.
