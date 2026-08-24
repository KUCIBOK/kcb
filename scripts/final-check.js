#!/usr/bin/env node

/**
 * Final check: Verify Missira's artworks are complete and visible
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://wyrmpddlhldjzoiwbshj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const MISSIRA_USER_ID = "adcff51e-d77a-46eb-9e88-9ae06ce8832d";
const MISSIRA_ARTIST_ID = "f1f5ea0f-fce3-45d8-a770-4c3297cee4e1";

async function finalCheck() {
  console.log("✅ FINAL CHECK — MISSIRA'S ARTWORKS\n");
  console.log("=".repeat(70) + "\n");

  try {
    // 1. Check user exists
    console.log("1️⃣  User Profile");
    const { data: user } = await supabase
      .from("users")
      .select("id, username, role, name")
      .eq("id", MISSIRA_USER_ID)
      .single();

    if (user) {
      console.log(`   ✅ ${user.name}`);
      console.log(`      Email: ${user.id}`);
      console.log(`      Role: ${user.role}`);
    } else {
      console.log("   ❌ User not found");
    }

    // 2. Check artist profile
    console.log("\n2️⃣  Artist Profile");
    const { data: artist } = await supabase
      .from("artists")
      .select("id, user_id, name")
      .eq("user_id", MISSIRA_USER_ID)
      .single();

    if (artist) {
      console.log(`   ✅ ${artist.name}`);
      console.log(`      Artist ID: ${artist.id}`);
    } else {
      console.log("   ❌ Artist profile not found");
    }

    // 3. Check artworks by artist_id
    console.log("\n3️⃣  Artworks (by artist_id)");
    const { data: artworksByArtist } = await supabase
      .from("artworks")
      .select("id, title, status, image")
      .eq("artist_id", MISSIRA_ARTIST_ID)
      .order("created_at", { ascending: false });

    if (artworksByArtist && artworksByArtist.length > 0) {
      console.log(`   ✅ Found ${artworksByArtist.length} artworks`);
      artworksByArtist.forEach((aw, i) => {
        const hasImage = aw.image ? "✅" : "❌";
        const isApproved = aw.status === "approved" ? "✅" : "⚠️";
        console.log(
          `      ${i + 1}. ${aw.title} [${isApproved} status: ${aw.status}] [${hasImage} image]`
        );
      });
    } else {
      console.log("   ❌ No artworks found");
    }

    // 4. Check artworks by user_id (fallback)
    console.log("\n4️⃣  Artworks (by user_id - fallback)");
    const { data: artworksByUser } = await supabase
      .from("artworks")
      .select("id, title, status")
      .eq("user_id", MISSIRA_USER_ID)
      .order("created_at", { ascending: false });

    if (artworksByUser && artworksByUser.length > 0) {
      console.log(`   ✅ Found ${artworksByUser.length} artworks`);
    } else {
      console.log("   ℹ️  No artworks found by user_id (expected)");
    }

    // Summary
    console.log("\n" + "=".repeat(70));
    console.log("\n📊 MISSIRA'S DASHBOARD STATUS:\n");

    const approved = artworksByArtist?.filter((a) => a.status === "approved").length || 0;
    const withImages = artworksByArtist?.filter((a) => a.image).length || 0;

    console.log(`   ✅ Artworks: ${artworksByArtist?.length || 0}/9`);
    console.log(`   ✅ Approved: ${approved}/9`);
    console.log(`   ✅ With images: ${withImages}/9`);

    if (artworksByArtist?.length === 9 && withImages === 9 && approved >= 8) {
      console.log("\n🎉 EVERYTHING IS READY!");
      console.log("\n   Missira should see all 9 artworks with images in:");
      console.log("   → Dashboard Artiste → Onglet 'Mes œuvres'");
      console.log("   → Curateur/Advisor → Section 'Sourcing'");
      console.log("   → Admin → Artwork Management");
    } else {
      console.log("\n⚠️  Some items are missing - check above for details");
    }
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}

finalCheck();
