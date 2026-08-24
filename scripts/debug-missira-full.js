#!/usr/bin/env node

/**
 * Debug script: Full diagnosis of Missira's artwork loading issue
 * No Supabase dashboard needed - direct API testing
 */

const { createClient } = require("@supabase/supabase-js");

// Credentials from .env.production.local
const SUPABASE_URL = "https://wyrmpddlhldjzoiwbshj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log("🔍 MISSIRA DEBUG — Full Diagnosis\n");

  try {
    // Step 1: Find Missira user
    console.log("1️⃣  Finding Missira user...");
    const { data: missiraUser, error: userError } = await supabase
      .from("users")
      .select("id, username, role, name")
      .eq("username", "missira_keita")
      .single();

    if (userError || !missiraUser) {
      console.log("   ❌ ERROR: Missira user not found");
      console.log(`   Error: ${userError?.message}`);
      return;
    }

    console.log(`   ✅ Found: ${missiraUser.name}`);
    console.log(`      user_id: ${missiraUser.id}`);
    console.log(`      role: ${missiraUser.role}`);

    // Step 2: Find Missira artist profile
    console.log("\n2️⃣  Finding Missira artist profile...");
    const { data: artistProfile, error: artistError } = await supabase
      .from("artists")
      .select("id, user_id, name")
      .eq("user_id", missiraUser.id)
      .single();

    if (artistError || !artistProfile) {
      console.log("   ❌ ERROR: Artist profile not found");
      console.log(`   Error: ${artistError?.message}`);
      return;
    }

    console.log(`   ✅ Found artist profile`);
    console.log(`      artist_id: ${artistProfile.id}`);
    console.log(`      name: ${artistProfile.name}`);

    // Step 3: Find artworks with artist_id
    console.log("\n3️⃣  Finding artworks by artist_id...");
    const { data: artworksByArtistId, error: artworksError } = await supabase
      .from("artworks")
      .select("id, title, status, image, artist_id")
      .eq("artist_id", artistProfile.id);

    if (artworksError) {
      console.log(`   ❌ ERROR: ${artworksError.message}`);
    } else {
      console.log(`   ✅ Found ${artworksByArtistId?.length || 0} artworks`);
      artworksByArtistId?.slice(0, 3).forEach((aw) => {
        console.log(`      - ${aw.title} (status: ${aw.status}, image: ${aw.image ? "✅" : "❌"})`);
      });
    }

    // Step 4: Simulate what /api/profile/:id would return
    console.log("\n4️⃣  Simulating GET /api/profile/:id response...");
    console.log(`   Checking: role = '${missiraUser.role}'`);
    if (missiraUser.role === "artist") {
      console.log(`   ✅ Role is 'artist' — should return artist profile`);
      console.log(`   Response would be:`);
      console.log(`   {`);
      console.log(`     "success": true,`);
      console.log(`     "data": {`);
      console.log(`       "id": "${artistProfile.id}",`);
      console.log(`       "user_id": "${artistProfile.user_id}",`);
      console.log(`       "name": "${artistProfile.name}"`);
      console.log(`     }`);
      console.log(`   }`);
    } else {
      console.log(`   ❌ Role is not 'artist'! It's: '${missiraUser.role}'`);
    }

    // Step 5: Verify getMyArtworks call would work
    console.log("\n5️⃣  Verifying getMyArtworks(artistProfile.id) query...");
    console.log(`   Query: GET /api/artworks?artist_id=${artistProfile.id}`);
    console.log(`   Expected results: ${artworksByArtistId?.length || 0} artworks`);
    if (artworksByArtistId?.length === 0) {
      console.log(`   ⚠️  WARNING: No artworks found!`);
    } else if (artworksByArtistId?.length > 0) {
      console.log(`   ✅ Artworks should load correctly`);
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ Missira user exists: ${missiraUser.id}`);
    console.log(`✅ Artist profile exists: ${artistProfile.id}`);
    console.log(`✅ Artworks exist: ${artworksByArtistId?.length || 0}`);
    console.log(`❌ Images: ${artworksByArtistId?.filter((a) => !a.image).length} missing`);
    console.log("\n🔧 Next steps:");
    console.log("   1. Hard refresh browser (Ctrl+F5)");
    console.log("   2. Check deployment status on Vercel");
    console.log("   3. Add placeholder images with SQL");
  } catch (error) {
    console.error("❌ ERROR:", error.message);
  }
}

main();
