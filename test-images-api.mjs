#!/usr/bin/env node

/**
 * Test direct: What does /api/artworks?user_id=... return?
 */

const USER_ID = "adcff51e-d77a-46eb-9e88-9ae06ce8832d";

// Local test (requires yarn dev or vercel dev running)
const testLocal = async () => {
  console.log("Testing local API (localhost:3000 or localhost:5173)...\n");

  try {
    const res = await fetch(
      `http://localhost:3000/api/artworks?user_id=${USER_ID}&status=approved`,
      {
        headers: {
          "kcb-api-key": "test",
        },
      }
    );

    if (!res.ok) {
      console.log(`❌ Local API returned ${res.status}`);
      return;
    }

    const data = await res.json();
    const artworks = Array.isArray(data) ? data : data?.data || data?.artworks;

    if (artworks && artworks.length > 0) {
      console.log(`✅ Found ${artworks.length} artworks\n`);
      const first = artworks[0];
      console.log("First artwork:");
      console.log(`  title: ${first.title}`);
      console.log(`  image: ${first.image ? "✅ " + first.image.substring(0, 80) : "❌ NULL"}`);
      console.log(`  status: ${first.status}`);
      console.log(`  user_id: ${first.user_id}`);
      console.log(`  artist_id: ${first.artist_id}`);

      // Check if ALL have images
      const withImage = artworks.filter(a => a.image).length;
      console.log(`\n📊 Summary: ${withImage}/${artworks.length} with images`);
    } else {
      console.log("❌ No artworks returned");
    }
  } catch (err) {
    console.log(`⚠️  Local API not running: ${err.message}`);
    console.log("   Run: yarn dev (in another terminal)\n");
  }
};

testLocal();
