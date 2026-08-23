-- ============================================================================
-- Migration 026: Enrich Artists Table with Tier, Experience, Disciplines
-- ============================================================================
-- Adds detailed artist information for sourcing dossiers
-- ============================================================================

-- Add missing columns to artists table
ALTER TABLE artists
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'Tier 3 — Incubation' CHECK (tier IN (
  'Tier 1 — Vitrine int.',
  'Tier 2 — Montée en puissance',
  'Tier 3 — Incubation'
)),
ADD COLUMN IF NOT EXISTS years_experience INTEGER,
ADD COLUMN IF NOT EXISTS disciplines TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS artistic_statement TEXT,
ADD COLUMN IF NOT EXISTS market_presence TEXT,
ADD COLUMN IF NOT EXISTS location TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_artists_tier ON artists(tier);
CREATE INDEX IF NOT EXISTS idx_artists_country ON artists(country);

-- ============================================================================
-- NOTES:
-- - tier: Tier 1 (Established), Tier 2 (Rising), Tier 3 (Emerging)
-- - years_experience: Number of years practicing
-- - disciplines: Array of disciplines (e.g., ['Peinture', 'Sculpture'])
-- - artistic_statement: Artist's approach/style
-- - market_presence: Platform presence (e.g., 'ABAC.art')
-- - location: Specific practice location (e.g., 'Lac Rose, Sénégal')
-- ============================================================================
