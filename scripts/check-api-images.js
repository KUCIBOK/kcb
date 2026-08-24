#!/usr/bin/env node

/**
 * Check if /api/artworks returns image URLs
 */

const fetch = require("node-fetch");

const ARTIST_ID = "f1f5ea0f-fce3-45d8-a770-4c3297cee4e1";
const USER_ID = "adcff51e-d77a-46eb-9e88-9ae06ce8832d";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDYwNDcsImV4cCI6MjA4ODI4MjA0N30.obQvW3kEYqmxqLIFHvwGVVk-i5-1ZhCPPgJu6J2MWi4";

async function checkAPI() {
  console.log("🧪 CHECKING /api/artworks responses\n");

  const endpoints = [
    {
      name: "By artist_id",
      url: `https://kucibok.com/api/artworks?artist_id=${ARTIST_ID}&status=approved`,
    },
    {
      name: "By user_id",
      url: `https://kucibok.com/api/artworks?user_id=${USER_ID}&status=approved`,
    },
  ];

  for (const endpoint of endpoints) {
    console.log(`\n📍 Testing: ${endpoint.name}`);
    console.log(`   URL: ${endpoint.url}`);

    try {
      const res = await fetch(endpoint.url, {
        headers: {
          "kcb-api-key": API_KEY,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        console.log(`   ✅ Response: ${data.length} artworks`);
        if (data.length > 0) {
          const first = data[0];
          console.log(`   First artwork:`);
          console.log(`      - Title: ${first.title}`);
          console.log(`      - Image: ${first.image ? "✅ Present" : "❌ NULL"}`);
          if (first.image) {
            console.log(`      - URL: ${first.image.substring(0, 80)}...`);
          }
        }
      } else if (data.data) {
        console.log(`   ✅ Response: ${data.data.length} artworks (wrapped in .data)`);
        if (data.data.length > 0) {
          const first = data.data[0];
          console.log(`   First artwork:`);
          console.log(`      - Title: ${first.title}`);
          console.log(`      - Image: ${first.image ? "✅ Present" : "❌ NULL"}`);
        }
      } else {
        console.log(`   Response structure:`);
        console.log(`   ${JSON.stringify(data).substring(0, 200)}...`);
      }
    } catch (err) {
      console.log(`   ❌ ERROR: ${err.message}`);
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("💡 If images are NULL, run:");
  console.log("   node scripts/upload-missira-images.js");
}

checkAPI();
