-- =============================================================================
-- 010_blog_archived_column.sql
-- Ajoute la colonne `archived` manquante sur blog_posts.
-- La table 001 n'incluait que `published` — le backend utilisait déjà
-- .eq('archived', true) ce qui causait une erreur 400 de Supabase.
-- =============================================================================

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;

-- S'assurer que published et archived sont mutuellement exclusifs
-- (un article publié ne peut pas être archivé simultanément)
UPDATE public.blog_posts
  SET archived = FALSE
  WHERE archived IS NULL;

CREATE INDEX IF NOT EXISTS idx_blog_posts_archived
  ON public.blog_posts(archived) WHERE archived = TRUE;
