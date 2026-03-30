-- ============================================================================
-- 008_rls_role_refactor.sql — Mise à jour des fonctions RLS après refactor rôles
--
-- Contexte : La migration 007 renomme collector→buyer et professional→curator
-- dans public.users et auth.users, MAIS la fonction is_professional() de 002
-- vérifie encore role IN ('professional', 'admin').
--
-- Sans cette migration, les curators perdent l'accès :
--   - Création d'enchères (auctions INSERT policy)
--   - Création d'articles blog (blog_posts INSERT policy)
--   - Création d'avis (reviews INSERT policy)
--
-- Dépend de : 007_role_refactor.sql
-- ============================================================================

BEGIN;

-- 1. Corriger is_professional() pour vérifier 'curator' au lieu de 'professional'
CREATE OR REPLACE FUNCTION is_professional()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('curator', 'admin')
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- 2. Ajouter un alias is_curator() pour clarté dans les futures politiques RLS
--    is_professional() est conservé pour ne pas casser les politiques existantes
CREATE OR REPLACE FUNCTION is_curator()
RETURNS BOOLEAN AS $$
  SELECT is_professional();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

COMMIT;
