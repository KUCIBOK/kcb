#!/usr/bin/env node

/**
 * Simple image uploader: Add art-themed placeholder images to Missira's artworks
 */

const { createClient } = require("@supabase/supabase-js");

// Credentials
const SUPABASE_URL = "https://wyrmpddlhldjzoiwbshj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ARTIST_ID = "f1f5ea0f-fce3-45d8-a770-4c3297cee4e1";

// Art-themed placeholder images from Unsplash (sculpture & installation focused)
const ART_IMAGES = [
  "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1578321272176-fd84e2486286?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1578502494516-52e2a71886ba?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1577720643272-265f434a2a6f?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1578520009805-5ba20c3d2a9f?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1578512494516-2c79d2df62d9?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1577824857676-e0e16f44d338?w=800&h=800&fit=crop",
];

async function main() {
  console.log("🎨 UPLOADING IMAGES TO MISSIRA'S ARTWORKS\n");
  console.log("=".repeat(70) + "\n");

  try {
    // Get all Missira's artworks
    const { data: artworks, error: fetchError } = await supabase
      .from("artworks")
      .select("id, title, status")
      .eq("artist_id", ARTIST_ID)
      .order("created_at", { ascending: false });

    if (fetchError || !artworks || artworks.length === 0) {
      console.log("❌ ERROR: No artworks found");
      console.log(`   Error: ${fetchError?.message}`);
      return;
    }

    console.log(`📊 Found ${artworks.length} artworks\n`);

    // Update each artwork with an image
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < artworks.length; i++) {
      const artwork = artworks[i];
      const imageUrl = ART_IMAGES[i % ART_IMAGES.length];

      process.stdout.write(`   [${i + 1}/${artworks.length}] ${artwork.title}...`);

      const { error: updateError } = await supabase
        .from("artworks")
        .update({ image: imageUrl })
        .eq("id", artwork.id);

      if (updateError) {
        console.log(` ❌ ERROR: ${updateError.message}`);
        failed++;
      } else {
        console.log(` ✅`);
        successful++;
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log("\n📊 RESULTS");
    console.log(`✅ Successful: ${successful}/${artworks.length}`);
    if (failed > 0) {
      console.log(`❌ Failed: ${failed}`);
    }

    console.log("\n" + "=".repeat(70));
    console.log("\n🎯 NEXT STEPS:\n");
    console.log("   1. Missira: Hard refresh browser → Ctrl+F5");
    console.log("   2. Check her dashboard → Onglet 'Mes œuvres'");
    console.log("   3. Admin: Refresh dashboard → Artwork Management");
    console.log("   4. Check 'Sourcing' section for curator/advisor");
    console.log("\n✨ Images are now attached to artworks!\n");
  } catch (error) {
    console.error("\n❌ FATAL ERROR:", error.message);
    console.error(error);
  }
}

main();
