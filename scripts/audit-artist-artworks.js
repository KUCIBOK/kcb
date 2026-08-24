#!/usr/bin/env node

/**
 * CRITICAL AUDIT: Check for duplicate artworks and wrong artist_id linkage
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://wyrmpddlhldjzoiwbshj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const MISSIRA_ARTIST_ID = "f1f5ea0f-fce3-45d8-a770-4c3297cee4e1";
const MISSIRA_USER_ID = "adcff51e-d77a-46eb-9e88-9ae06ce8832d";

async function auditArtworks() {
  console.log("🔍 CRITICAL AUDIT — ARTIST ARTWORK LINKAGE\n");
  console.log("=".repeat(70) + "\n");

  try {
    // 1. Get all artworks with artist info
    console.log("1️⃣  Scanning ALL artworks for duplicates/wrong linkage...\n");

    const { data: allArtworks } = await supabase
      .from("artworks")
      .select("id, title, artist_id, user_id")
      .order("created_at", { ascending: false });

    if (!allArtworks) {
      console.log("❌ Failed to fetch artworks");
      return;
    }

    console.log(`   Found: ${allArtworks.length} total artworks\n`);

    // 2. Check for Missira's artworks that might be linked to wrong artist
    console.log("2️⃣  Checking Missira's artworks...\n");

    const missiraArtworks = allArtworks.filter((a) => a.user_id === MISSIRA_USER_ID);
    console.log(`   Missira's artworks by user_id: ${missiraArtworks.length}`);

    const missiraCorrect = missiraArtworks.filter((a) => a.artist_id === MISSIRA_ARTIST_ID);
    const missiraWrong = missiraArtworks.filter((a) => a.artist_id !== MISSIRA_ARTIST_ID);

    if (missiraWrong.length > 0) {
      console.log(`   ⚠️  WRONG LINKAGE: ${missiraWrong.length} artworks with wrong artist_id!\n`);
      missiraWrong.forEach((aw) => {
        console.log(`      ❌ "${aw.title}"`);
        console.log(`         user_id: ${aw.user_id}`);
        console.log(`         artist_id: ${aw.artist_id} (WRONG!)`);
        console.log(`         Should be: ${MISSIRA_ARTIST_ID}\n`);
      });
    } else {
      console.log(`   ✅ All ${missiraCorrect.length} artworks correctly linked to Missira's artist_id\n`);
    }

    // 3. Check for duplicate titles
    console.log("3️⃣  Checking for duplicate artwork titles...\n");

    const titleCounts = {};
    allArtworks.forEach((aw) => {
      titleCounts[aw.title] = (titleCounts[aw.title] || 0) + 1;
    });

    const duplicates = Object.entries(titleCounts).filter(([_, count]) => count > 1);

    if (duplicates.length > 0) {
      console.log(`   ⚠️  DUPLICATES FOUND: ${duplicates.length}\n`);
      duplicates.forEach(([title, count]) => {
        const dups = allArtworks.filter((a) => a.title === title);
        console.log(`      "${title}" appears ${count} times`);
        dups.forEach((aw) => {
          const isMissira = aw.user_id === MISSIRA_USER_ID ? "✅ Missira" : "❌ Other artist";
          console.log(`         - ID: ${aw.id.substring(0, 8)}... [${isMissira}]`);
        });
        console.log("");
      });
    } else {
      console.log("   ✅ No duplicate titles found\n");
    }

    // 4. Get all artists
    console.log("4️⃣  Artists overview...\n");

    const { data: artists } = await supabase
      .from("artists")
      .select("id, name, user_id");

    artists?.forEach((artist) => {
      const count = allArtworks.filter((a) => a.artist_id === artist.id).length;
      const isMissira = artist.id === MISSIRA_ARTIST_ID ? "✅" : "  ";
      console.log(`   ${isMissira} ${artist.name}: ${count} artworks`);
    });

    // Summary
    console.log("\n" + "=".repeat(70));
    console.log("\n📊 AUDIT SUMMARY:\n");

    if (missiraWrong.length === 0 && duplicates.length === 0) {
      console.log("   ✅ ALL DATA IS CLEAN!");
      console.log("   ✅ No wrong linkages");
      console.log("   ✅ No duplicates");
      console.log("   ✅ Missira's artworks are correctly linked\n");
    } else {
      console.log("   ⚠️  ISSUES FOUND:");
      if (missiraWrong.length > 0) {
        console.log(`      - ${missiraWrong.length} artworks with wrong artist_id`);
      }
      if (duplicates.length > 0) {
        console.log(`      - ${duplicates.length} duplicate titles`);
      }
      console.log("\n   🔧 RUN THIS TO FIX:\n");
      console.log("      node scripts/fix-artwork-linkage.js\n");
    }
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}

auditArtworks();
