-- Fix Missira's artwork status from 'available' to 'approved'
-- So they appear in dashboard and public galleries

-- First, verify Missira exists
SELECT u.id as user_id, a.id as artist_id, a.name
FROM users u
LEFT JOIN artists a ON a.user_id = u.id
WHERE u.username = 'missira_keita'
LIMIT 1;

-- Then update all her artworks with status 'available' to 'approved'
UPDATE artworks
SET status = 'approved'
WHERE artist_id IN (
  SELECT a.id
  FROM artists a
  JOIN users u ON u.id = a.user_id
  WHERE u.username = 'missira_keita'
)
AND status = 'available';

-- Verify the update - should see all her artworks with 'approved' status
SELECT title, status, for_sale, sold
FROM artworks
WHERE artist_id IN (
  SELECT a.id
  FROM artists a
  JOIN users u ON u.id = a.user_id
  WHERE u.username = 'missira_keita'
)
ORDER BY created_at DESC;
