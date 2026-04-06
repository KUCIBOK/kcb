-- =============================================================================
-- 009_security_search_path.sql
-- Corrige les warnings Supabase Linter (avril 2026)
--
-- 1. Function Search Path Mutable : ajout de SET search_path = '' sur les
--    fonctions définies dans les migrations précédentes.
-- 2. RLS Policy Always True : suppression des politiques INSERT permissives
--    sur les tables de service (analytics, visitors, logidoo_alerts).
--    Ces tables sont uniquement alimentées via supabaseAdmin (service_role)
--    qui bypasse RLS — les politiques WITH CHECK (true) sont inutiles et
--    exposent les tables aux insertions anonymes.
--
-- Non couvert ici (fonctions créées hors migrations, à corriger manuellement
-- dans le SQL Editor Supabase) :
--   - public.kcb_user_role      → ajouter SET search_path = '' à la définition
--   - public.handle_new_auth_user → idem
-- Voir section ACTIONS MANUELLES en bas de ce fichier.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. trigger_set_updated_at
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- 2. generate_kucibok_id  (référence public.artworks qualifiée)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_kucibok_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  new_id   TEXT;
  attempts INTEGER := 0;
BEGIN
  LOOP
    new_id := 'KCB-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::TEXT) FROM 1 FOR 8));
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.artworks WHERE kucibok_id = new_id
    );
    attempts := attempts + 1;
    IF attempts > 10 THEN
      RAISE EXCEPTION 'Impossible de générer un kucibok_id unique';
    END IF;
  END LOOP;
  NEW.kucibok_id := new_id;
  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- 3. is_professional  (mise à jour depuis 008 : curator au lieu de professional)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_professional()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('curator', 'admin')
  );
$$;

-- is_curator délègue à is_professional — même correctif
CREATE OR REPLACE FUNCTION public.is_curator()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT public.is_professional();
$$;

-- -----------------------------------------------------------------------------
-- 4. Suppression des politiques INSERT WITH CHECK (true) sur tables de service
--    Les insertions viennent exclusivement de supabaseAdmin (service_role) qui
--    bypasse RLS — ces politiques ne sont donc pas nécessaires.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "analytics: insertion service"     ON public.analytics;
DROP POLICY IF EXISTS "visitors: insertion service"      ON public.visitors;
DROP POLICY IF EXISTS "logidoo_alerts: insertion service" ON public.logidoo_alerts;

COMMIT;

-- =============================================================================
-- ACTIONS MANUELLES REQUISES (SQL Editor Supabase)
-- =============================================================================
-- Les fonctions suivantes ont été créées directement dans Supabase (hors
-- migrations) et ne peuvent pas être corrigées automatiquement ici car leur
-- implémentation exacte est inconnue. Exécuter dans le SQL Editor :
--
-- Pour chaque fonction, récupérer la définition actuelle puis la recréer avec
-- SET search_path = '' :
--
--   SELECT pg_get_functiondef(oid)
--   FROM pg_proc
--   WHERE proname IN ('kcb_user_role', 'handle_new_auth_user')
--     AND pronamespace = 'public'::regnamespace;
--
-- Puis adapter la définition retournée en ajoutant SET search_path = '' avant
-- le corps de la fonction. Exemple de pattern :
--
--   CREATE OR REPLACE FUNCTION public.kcb_user_role()
--   RETURNS text           -- adapter selon la signature réelle
--   LANGUAGE sql
--   SECURITY DEFINER
--   STABLE
--   SET search_path = ''
--   AS $$ ... corps original ... $$;
--
-- LEAKED PASSWORD PROTECTION
-- À activer dans : Supabase Dashboard → Authentication → Settings →
-- Password Security → Enable "Leaked Password Protection" (HaveIBeenPwned)
-- =============================================================================
