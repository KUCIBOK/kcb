#!/usr/bin/env node

/**
 * Upload images from a local folder to Missira's artworks
 * Usage: Place images in ./temp-images/ folder with names matching artwork titles
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://wyrmpddlhldjzoiwbshj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ARTIST_ID = "f1f5ea0f-fce3-45d8-a770-4c3297cee4e1";
const IMAGES_FOLDER = path.join(__dirname, "../temp-images");
const BUCKET = "artworks";

// Artwork titles in order
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

async function uploadImagesFromFolder() {
  console.log("📁 UPLOADING IMAGES FROM FOLDER\n");

  // Check if folder exists
  if (!fs.existsSync(IMAGES_FOLDER)) {
    console.log(`❌ Folder not found: ${IMAGES_FOLDER}`);
    console.log("\n📋 Steps:");
    console.log(`  1. Create folder: ${IMAGES_FOLDER}`);
    console.log("  2. Download images from Google Drive");
    console.log("  3. Name them as: 1.jpg, 2.jpg, 3.jpg... or matching artwork titles");
    console.log("  4. Run this script again\n");
    return;
  }

  // Get all image files
  const imageFiles = fs
    .readdirSync(IMAGES_FOLDER)
    .filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
    .sort();

  if (imageFiles.length === 0) {
    console.log("❌ No images found in folder");
    console.log(`   Folder: ${IMAGES_FOLDER}\n`);
    return;
  }

  console.log(`✅ Found ${imageFiles.length} images\n`);

  // Get Missira's artworks
  const { data: artworks } = await supabase
    .from("artworks")
    .select("id, title")
    .eq("artist_id", ARTIST_ID)
    .order("created_at", { ascending: false });

  if (!artworks || artworks.length === 0) {
    console.log("❌ No artworks found");
    return;
  }

  console.log(`Matching to ${artworks.length} artworks:\n`);

  let uploaded = 0;

  // Upload each image
  for (let i = 0; i < Math.min(imageFiles.length, artworks.length); i++) {
    const imageFile = imageFiles[i];
    const artwork = artworks[i];
    const imagePath = path.join(IMAGES_FOLDER, imageFile);

    process.stdout.write(
      `   [${i + 1}/${Math.min(imageFiles.length, artworks.length)}] ${artwork.title}...`
    );

    try {
      // Read image file
      const imageBuffer = fs.readFileSync(imagePath);
      const mimeType = getMimeType(imageFile);

      // Convert to data: URI (embed in database)
      const dataUri = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;

      // Update artwork
      const { error } = await supabase
        .from("artworks")
        .update({ image: dataUri })
        .eq("id", artwork.id);

      if (error) {
        console.log(` ❌ ${error.message}`);
      } else {
        console.log(` ✅`);
        uploaded++;
      }
    } catch (err) {
      console.log(` ❌ ${err.message}`);
    }
  }

  console.log(`\n✅ Uploaded: ${uploaded}/${Math.min(imageFiles.length, artworks.length)}`);
  console.log("\n🔄 Next: Hard refresh (Ctrl+F5) to see new images!");
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return types[ext] || "image/jpeg";
}

uploadImagesFromFolder();
