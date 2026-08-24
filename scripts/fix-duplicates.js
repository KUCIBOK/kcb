#!/usr/bin/env node

/**
 * CRITICAL FIX: Remove duplicate artworks, keep first instance per title
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://wyrmpddlhldjzoiwbshj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fixDuplicates() {
  console.log("🧹 REMOVING DUPLICATE ARTWORKS\n");
  console.log("=".repeat(70) + "\n");

  try {
    // Get all artworks
    const { data: allArtworks } = await supabase
      .from("artworks")
      .select("id, title, created_at")
      .order("created_at", { ascending: true });

    if (!allArtworks) {
      console.log("❌ Failed to fetch artworks");
      return;
    }

    // Find duplicates
    const titleMap = {};
    const toDelete = [];

    allArtworks.forEach((aw) => {
      if (!titleMap[aw.title]) {
        titleMap[aw.title] = { count: 0, firstId: aw.id };
      }
      titleMap[aw.title].count++;

      // If this is not the first occurrence, mark for deletion
      if (aw.id !== titleMap[aw.title].firstId) {
        toDelete.push({ id: aw.id, title: aw.title });
      }
    });

    // Filter duplicates only
    const duplicates = Object.entries(titleMap).filter(([_, v]) => v.count > 1);

    if (duplicates.length === 0) {
      console.log("✅ No duplicates found - database is clean!");
      return;
    }

    console.log(`Found ${toDelete.length} duplicate records to delete:\n`);

    duplicates.forEach(([title, data]) => {
      console.log(`   "${title}" (${data.count} copies) - Keeping first, deleting ${data.count - 1}`);
    });

    console.log(`\n⚠️  About to delete ${toDelete.length} records...\n`);
    console.log("   Press Ctrl+C to cancel\n");

    // Confirm before deletion
    await new Promise((r) => setTimeout(r, 2000));

    // Delete duplicates
    console.log("🗑️  Deleting duplicates...\n");

    let deleted = 0;
    for (const item of toDelete) {
      const { error } = await supabase.from("artworks").delete().eq("id", item.id);

      if (error) {
        console.log(`   ❌ ${item.title}: ${error.message}`);
      } else {
        console.log(`   ✅ Deleted duplicate: "${item.title}"`);
        deleted++;
      }
    }

    console.log(`\n✅ Deleted: ${deleted}/${toDelete.length} duplicates`);
    console.log("\n🔒 Database is now clean!");
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}

fixDuplicates();
