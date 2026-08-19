-- =============================================================================
-- Migration 018: Add Shortlisting Feature
-- Purpose: Enable users to save/shortlist artworks to their list
-- Created: 2026-08-19
-- =============================================================================

-- =============================================================================
-- 1. Shortlisted Artworks Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS shortlisted_artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, artwork_id)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_shortlist_user
ON shortlisted_artworks(user_id);

CREATE INDEX IF NOT EXISTS idx_shortlist_artwork
ON shortlisted_artworks(artwork_id);

CREATE INDEX IF NOT EXISTS idx_shortlist_created
ON shortlisted_artworks(created_at DESC);

-- =============================================================================
-- 2. Row-Level Security (RLS)
-- =============================================================================

ALTER TABLE shortlisted_artworks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own shortlist
CREATE POLICY "users_read_own_shortlist" ON shortlisted_artworks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert into their own shortlist
CREATE POLICY "users_insert_own_shortlist" ON shortlisted_artworks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own shortlist items
CREATE POLICY "users_update_own_shortlist" ON shortlisted_artworks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own shortlist items
CREATE POLICY "users_delete_own_shortlist" ON shortlisted_artworks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admin bypass (service role)
CREATE POLICY "admin_all_shortlist" ON shortlisted_artworks
  USING (auth.jwt() ->> 'role' = 'admin');

-- =============================================================================
-- 3. Optional: Shortlist Tags (for organizing)
-- =============================================================================

CREATE TABLE IF NOT EXISTS shortlist_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#d4a574',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_shortlist_tags_user
ON shortlist_tags(user_id);

ALTER TABLE shortlist_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_manage_own_tags" ON shortlist_tags
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 4. Trigger: Update updated_at on shortlisted_artworks
-- =============================================================================

CREATE OR REPLACE FUNCTION update_shortlist_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shortlist_update_timestamp
BEFORE UPDATE ON shortlisted_artworks
FOR EACH ROW
EXECUTE FUNCTION update_shortlist_timestamp();

-- =============================================================================
-- DOCUMENTATION
-- =============================================================================

-- SHORTLISTED_ARTWORKS TABLE:
-- - user_id: FK to users — who saved it
-- - artwork_id: FK to artworks — what was saved
-- - notes: Optional personal notes about the artwork
-- - created_at: When was it added to shortlist
-- - UNIQUE(user_id, artwork_id): Can't shortlist same artwork twice
--
-- RLS POLICIES:
-- - Users can only see their own shortlist
-- - Users can only add/remove from their own list
-- - Admin (service_role) can see/manage all shortlists
--
-- API ENDPOINTS (to be implemented):
-- - POST /api/shortlist/:artworkId — Add artwork to shortlist
-- - DELETE /api/shortlist/:artworkId — Remove from shortlist
-- - GET /api/my-shortlist — Get all user's shortlisted artworks
-- - PATCH /api/shortlist/:artworkId — Update notes
-- - GET /api/shortlist/check/:artworkId — Check if artwork is shortlisted
--
-- FEATURE GATING:
-- - Shortlisting requires plan: Explorer/Pro (27€+)
-- - Free users cannot shortlist (PlanGate wrapper)
-- - Paywall shown if free user tries to shortlist
