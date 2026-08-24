#!/usr/bin/env node

/**
 * Fallback fix: Add user_id to Missira's artworks for backward compatibility
 * In case /api/profile/:id returns user_id instead of artist_id
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://wyrmpddlhldjzoiwbshj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const MISSIRA_USER_ID = "adcff51e-d77a-46eb-9e88-9ae06ce8832d";
const MISSIRA_ARTIST_ID = "f1f5ea0f-fce3-45d8-a770-4c3297cee4e1";

async function addUserIdFallback() {
  console.log("🔧 ADDING USER_ID FALLBACK TO MISSIRA'S ARTWORKS\n");

  try {
    // Get all Missira's artworks
    const { data: artworks, error: fetchError } = await supabase
      .from("artworks")
      .select("id, title, user_id")
      .eq("artist_id", MISSIRA_ARTIST_ID);

    if (fetchError || !artworks) {
      console.log("❌ ERROR:", fetchError?.message);
      return;
    }

    console.log(`Found ${artworks.length} artworks\n`);

    // Check how many already have user_id
    const withUserId = artworks.filter((a) => a.user_id).length;
    const withoutUserId = artworks.filter((a) => !a.user_id).length;

    console.log(`   With user_id: ${withUserId}`);
    console.log(`   Without user_id: ${withoutUserId}\n`);

    if (withoutUserId === 0) {
      console.log("✅ All artworks already have user_id!");
      return;
    }

    // Update missing user_id
    console.log(`Updating ${withoutUserId} artworks...\n`);

    let updated = 0;
    for (const artwork of artworks) {
      if (!artwork.user_id) {
        const { error } = await supabase
          .from("artworks")
          .update({ user_id: MISSIRA_USER_ID })
          .eq("id", artwork.id);

        if (error) {
          console.log(`❌ ${artwork.title}: ${error.message}`);
        } else {
          console.log(`✅ ${artwork.title}`);
          updated++;
        }
      }
    }

    console.log(`\n✅ Updated: ${updated} artworks`);
  } catch (error) {
    console.error("❌ ERROR:", error.message);
  }
}

addUserIdFallback();
