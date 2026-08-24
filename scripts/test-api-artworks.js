#!/usr/bin/env node

/**
 * Test: Call /api/artworks?artist_id=... directly
 */

const ARTIST_ID = "f1f5ea0f-fce3-45d8-a770-4c3297cee4e1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDYwNDcsImV4cCI6MjA4ODI4MjA0N30.obQvW3kEYqmxqLIFHvwGVVk-i5-1ZhCPPgJu6J2MWi4";

async function testAPI() {
  console.log("🧪 Testing GET /api/artworks?artist_id=...\n");

  try {
    // Option 1: Test with localhost (dev)
    console.log("1️⃣  Testing local endpoint...");
    try {
      const devResponse = await fetch(
        `http://localhost:3000/api/artworks?artist_id=${ARTIST_ID}&status=approved`,
        {
          headers: {
            "kcb-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (devResponse.ok) {
        const data = await devResponse.json();
        console.log(`   ✅ DEV endpoint works!`);
        console.log(`   Found: ${Array.isArray(data) ? data.length : data?.artworks?.length || 0} artworks`);
      } else {
        console.log(`   ⚠️  Dev endpoint returned ${devResponse.status}`);
      }
    } catch (err) {
      console.log(`   ℹ️  Dev endpoint not available (expected if not running locally)`);
    }

    // Option 2: Test with production URL (requires internet)
    console.log("\n2️⃣  Testing production endpoint...");
    console.log("   URL: https://kucibok.com/api/artworks?artist_id=...");
    console.log("   Note: Requires Vercel deployment to be complete");

    console.log("\n📋 Expected URL query:");
    console.log(`   https://kucibok.com/api/artworks?artist_id=${ARTIST_ID}`);
    console.log(`   https://kucibok.com/api/artworks?artist_id=${ARTIST_ID}&status=approved`);

    console.log("\n🔍 What the response should contain:");
    console.log(`   - Array of 9 artworks`);
    console.log(`   - Each with: id, title, status, artist_id, image (NULL)`);
    console.log(`   - Filter by status='approved' should return 8 artworks`);
  } catch (error) {
    console.error("❌ ERROR:", error.message);
  }
}

testAPI();
