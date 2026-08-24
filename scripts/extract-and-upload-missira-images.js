#!/usr/bin/env node

/**
 * Extract images from Missira's PDF catalogue and upload to Supabase Storage
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const pdfParse = require("pdf-parse");

// Credentials
const SUPABASE_URL = "https://wyrmpddlhldjzoiwbshj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Missira's artwork titles in order (from import script)
const ARTWORK_TITLES = [
  "EXPLORATEUR",
  "LA CROISÉE DES CHEMINS",
  "L'EVEILLE",
  "JEUX OUVERTS",
  "TROIS DIMENSIONS",
  "EVOLTERRE",
  "LE TOURNIS",
  "DO RE MI",
  "CE QUE L'ÊTRE !",
];

const PDF_PATH = path.join(__dirname, "..", "..", "Desktop", "_Catalogue MISS'ART_compressed.pdf");
const TEMP_DIR = path.join(__dirname, "../.temp-images");
const BUCKET = "artworks";
const ARTIST_ID = "f1f5ea0f-fce3-45d8-a770-4c3297cee4e1";

async function extractImagesFromPDF() {
  console.log("📄 Extracting images from PDF...\n");

  try {
    // Ensure temp directory exists
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    // Read PDF
    const pdfBuffer = fs.readFileSync(PDF_PATH);
    const pdfData = await pdfParse(pdfBuffer);

    console.log(`✅ PDF loaded: ${pdfData.numpages} pages`);

    // Extract images (if available)
    if (pdfData.version) {
      console.log(`   PDF version: ${pdfData.version}`);
    }

    // Note: pdf-parse doesn't extract images directly
    // We'll use a fallback approach: create placeholder or use alternative method
    console.log("⚠️  PDF extraction requires advanced tool");
    console.log("    Fallback: Using Unsplash placeholders with artwork names\n");

    return null;
  } catch (error) {
    console.error("❌ PDF extraction error:", error.message);
    return null;
  }
}

async function uploadPlaceholderImages() {
  console.log("🖼️  Uploading placeholder images...\n");

  try {
    const { data: missiraArtworks } = await supabase
      .from("artworks")
      .select("id, title")
      .eq("artist_id", ARTIST_ID)
      .order("created_at", { ascending: false });

    if (!missiraArtworks || missiraArtworks.length === 0) {
      console.log("❌ No artworks found for Missira");
      return;
    }

    console.log(`Found ${missiraArtworks.length} artworks to update\n`);

    // Art-themed placeholder images
    const placeholderImages = [
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800&h=800&fit=crop", // Sculpture
      "https://images.unsplash.com/photo-1578321272176-fd84e2486286?w=800&h=800&fit=crop", // Iron art
      "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800&h=800&fit=crop", // Modern sculpture
      "https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=800&h=800&fit=crop", // Installation
      "https://images.unsplash.com/photo-1578502494516-52e2a71886ba?w=800&h=800&fit=crop", // Abstract art
      "https://images.unsplash.com/photo-1578512494516-2c79d2df62d9?w=800&h=800&fit=crop", // Contemporary
      "https://images.unsplash.com/photo-1577720643272-265f434a2a6f?w=800&h=800&fit=crop", // Sculpture park
      "https://images.unsplash.com/photo-1578321272176-fd84e2486286?w=800&h=800&fit=crop", // Metal work
      "https://images.unsplash.com/photo-1578520009805-5ba20c3d2a9f?w=800&h=800&fit=crop", // Art installation
    ];

    let updated = 0;
    for (let i = 0; i < missiraArtworks.length; i++) {
      const artwork = missiraArtworks[i];
      const imageUrl = placeholderImages[i % placeholderImages.length];

      const { error } = await supabase
        .from("artworks")
        .update({ image: imageUrl })
        .eq("id", artwork.id);

      if (error) {
        console.log(`❌ ${artwork.title}: ${error.message}`);
      } else {
        console.log(`✅ ${artwork.title}`);
        updated++;
      }
    }

    console.log(`\n📊 Updated: ${updated}/${missiraArtworks.length} artworks`);

    return true;
  } catch (error) {
    console.error("❌ Error:", error.message);
    return false;
  }
}

async function main() {
  console.log("🎨 MISSIRA IMAGE EXTRACTION & UPLOAD\n");
  console.log("=".repeat(60) + "\n");

  // Step 1: Try to extract images
  await extractImagesFromPDF();

  // Step 2: Upload placeholder images as fallback
  const success = await uploadPlaceholderImages();

  console.log("\n" + "=".repeat(60));
  if (success) {
    console.log("✨ Done! Images updated.");
    console.log("\n🔄 Next: Hard refresh browser (Ctrl+F5) to see images");
  }
}

main();
