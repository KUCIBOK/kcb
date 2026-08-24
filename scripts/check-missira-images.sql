-- Check if Missira's artworks have images
SELECT
  title,
  image,
  CASE
    WHEN image IS NULL THEN 'NO IMAGE ❌'
    WHEN image = '' THEN 'EMPTY IMAGE ❌'
    ELSE 'IMAGE URL ✅'
  END as image_status,
  status,
  for_sale,
  sold,
  created_at
FROM artworks
WHERE artist_id IN (
  SELECT a.id
  FROM artists a
  JOIN users u ON u.id = a.user_id
  WHERE u.username = 'missira_keita'
)
ORDER BY created_at DESC;
