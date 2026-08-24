#!/usr/bin/env node

/**
 * Verify if images were actually saved to database
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://wyrmpddlhldjzoiwbshj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ARTIST_ID = "f1f5ea0f-fce3-45d8-a770-4c3297cee4e1";

async function verify() {
  console.log("🔍 VERIFYING IMAGES IN DATABASE\n");

  try {
    const { data: artworks, error } = await supabase
      .from("artworks")
      .select("id, title, image")
      .eq("artist_id", ARTIST_ID)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("❌ ERROR:", error.message);
      return;
    }

    console.log(`📊 Found ${artworks.length} artworks:\n`);

    let withImage = 0;
    let withoutImage = 0;

    artworks.forEach((aw) => {
      if (aw.image) {
        console.log(`✅ ${aw.title}`);
        console.log(`   Image: ${aw.image.substring(0, 80)}...`);
        withImage++;
      } else {
        console.log(`❌ ${aw.title}`);
        console.log(`   Image: NULL`);
        withoutImage++;
      }
    });

    console.log("\n" + "=".repeat(70));
    console.log(`\n📈 Summary:`);
    console.log(`   ✅ With images: ${withImage}`);
    console.log(`   ❌ Without images: ${withoutImage}`);

    if (withoutImage > 0) {
      console.log("\n⚠️  Images were NOT saved! Trying again...");
    }
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}

verify();
