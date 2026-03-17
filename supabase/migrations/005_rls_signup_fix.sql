-- =============================================================================
-- Migration 005 — Fix RLS signup + trigger search_path
-- Corrige l'erreur "new row violates row-level security policy" lors de
-- l'inscription sur kucibok.com.
-- =============================================================================

-- ─── 1. Recréer handle_new_user avec SET search_path ─────────────────────────
-- Sans SET search_path, la fonction SECURITY DEFINER peut résoudre les noms de
-- tables dans le mauvais schéma et échouer de façon silencieuse ou lever une
-- erreur RLS. Supabase recommande SET search_path = '' pour les fonctions
-- SECURITY DEFINER (https://supabase.com/docs/guides/database/functions).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, username, role, country, telephone, auth_provider)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NULL,
    COALESCE(NEW.raw_user_meta_data->>'role', 'collector'),
    NEW.raw_user_meta_data->>'country',
    NEW.raw_user_meta_data->>'telephone',
    CASE WHEN NEW.app_metadata->>'provider' = 'google' THEN 'google' ELSE 'email' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ─── 2. Politique INSERT manquante sur public.users ──────────────────────────
-- Le trigger (SECURITY DEFINER) bypass déjà le RLS, mais si pour une raison
-- quelconque il échoue, cette politique permet à l'utilisateur authentifié
-- d'insérer sa propre ligne (id = auth.uid() uniquement).

DROP POLICY IF EXISTS "users: insertion propre" ON public.users;
CREATE POLICY "users: insertion propre"
  ON public.users FOR INSERT
  WITH CHECK (id = auth.uid());
