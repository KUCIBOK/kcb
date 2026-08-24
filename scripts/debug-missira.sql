-- Debug Missira's data
SELECT 'USERS' as table_name;
SELECT id, name, username, role FROM users WHERE username = 'missira_keita';

SELECT 'ARTISTS' as table_name;
SELECT id, user_id, name, username FROM artists WHERE username = 'missira_keita';

SELECT 'ARTWORKS COUNT' as table_name;
SELECT COUNT(*) as total, 
       COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
       COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
       COUNT(CASE WHEN image IS NOT NULL THEN 1 END) as with_image,
       COUNT(CASE WHEN image IS NULL THEN 1 END) as without_image
FROM artworks
WHERE artist_id IN (SELECT id FROM artists WHERE username = 'missira_keita');

SELECT 'ARTWORKS DETAILS' as table_name;
SELECT id, title, status, artist_id, image, for_sale, sold 
FROM artworks
WHERE artist_id IN (SELECT id FROM artists WHERE username = 'missira_keita')
ORDER BY created_at DESC;
