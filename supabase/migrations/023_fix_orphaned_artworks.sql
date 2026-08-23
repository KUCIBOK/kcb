-- ============================================================================
-- Migration 023: Fix Orphaned Artworks (208 artworks without artist_id)
-- ============================================================================
-- This migration assigns artist_id to artworks that belong to artists
-- Strategy: Match artwork user_id/owner_id with artists.user_id
-- ============================================================================

-- Step 1: Update artworks where the user_id/owner_id has an artist profile
UPDATE artworks a
SET artist_id = artists.id
FROM artists
WHERE a.artist_id IS NULL
  AND (a.user_id = artists.user_id OR a.owner_id = artists.user_id)
  AND artists.id IS NOT NULL;

-- Step 2: Verification query - check how many are still orphaned
-- SELECT COUNT(*) as still_orphaned FROM artworks WHERE artist_id IS NULL;

-- ============================================================================
-- Migration Notes
-- ============================================================================
-- Expected to fix ~180-200 artworks (those where user/owner has artist profile)
-- Remaining orphaned artworks (~20-30) may need manual review:
--   - artworks uploaded by buyers/curators, not artists
--   - artworks with no artist profile attached to their user
-- ============================================================================
