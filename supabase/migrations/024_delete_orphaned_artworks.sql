-- ============================================================================
-- Migration 024: Delete Orphaned Artworks (193 from sourcing catalog)
-- ============================================================================
-- Remove artworks without artist_id from the sourcing catalog
-- These are imported collections (Avidlines, Azuki, Archetype, CMR, etc.)
-- that are not properly linked to creators
--
-- BEFORE DELETE: 469 approved artworks
-- AFTER DELETE: ~276 approved artworks (only those with artist_id)
-- ============================================================================

DELETE FROM artworks
WHERE artist_id IS NULL
  AND status = 'approved';

-- ============================================================================
-- Verification queries (run after delete):
-- SELECT COUNT(*) as total_artworks FROM artworks;
-- SELECT COUNT(*) as approved_with_artist FROM artworks WHERE status = 'approved' AND artist_id IS NOT NULL;
-- SELECT COUNT(*) as orphaned_remaining FROM artworks WHERE artist_id IS NULL;
-- ============================================================================
