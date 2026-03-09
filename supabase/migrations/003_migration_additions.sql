-- =============================================================================
-- Migration 003 — Colonnes manquantes pour la migration depuis MongoDB backup
-- Ajouter avant de lancer migrate_from_backup.js
-- =============================================================================

-- plans : ajouter description et role (presents dans les donnees MongoDB)
ALTER TABLE plans ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS role        TEXT;

-- artists : ajouter featured et totaux manquants
ALTER TABLE artists ADD COLUMN IF NOT EXISTS featured      BOOLEAN DEFAULT FALSE;
ALTER TABLE artists ADD COLUMN IF NOT EXISTS total_sales   NUMERIC DEFAULT 0;
ALTER TABLE artists ADD COLUMN IF NOT EXISTS total_earnings NUMERIC DEFAULT 0;
