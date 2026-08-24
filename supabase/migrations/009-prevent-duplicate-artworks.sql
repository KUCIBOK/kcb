-- Migration 009: Add data validation to prevent duplicate artworks
-- Prevents the same artist from uploading duplicate artworks with same title

-- Add unique constraint: one artwork title per artist
ALTER TABLE artworks
ADD CONSTRAINT unique_artwork_title_per_artist
UNIQUE (artist_id, title) DEFERRABLE INITIALLY DEFERRED;

-- Add trigger to prevent duplicate titles for same artist
CREATE OR REPLACE FUNCTION check_duplicate_artwork_title()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM artworks
    WHERE artist_id = NEW.artist_id
      AND title = NEW.title
      AND id != NEW.id
      AND status != 'rejected'
  ) THEN
    RAISE EXCEPTION 'Artwork with this title already exists for this artist';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_duplicate_artwork_title_trigger ON artworks;
CREATE TRIGGER check_duplicate_artwork_title_trigger
BEFORE INSERT OR UPDATE ON artworks
FOR EACH ROW
EXECUTE FUNCTION check_duplicate_artwork_title();

-- Log data quality check
INSERT INTO audit_log (
  description,
  user_id,
  created_at
)
VALUES (
  'Applied duplicate artwork prevention (Migration 009)',
  '00000000-0000-0000-0000-000000000000',
  NOW()
) ON CONFLICT DO NOTHING;
