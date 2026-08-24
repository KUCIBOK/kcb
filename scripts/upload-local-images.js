#!/usr/bin/env node

/**
 * Generate and upload placeholder images to Supabase Storage
 * Using data: URIs (embeds image directly in database)
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://wyrmpddlhldjzoiwbshj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ARTIST_ID = "f1f5ea0f-fce3-45d8-a770-4c3297cee4e1";

// SVG placeholder images (embedded as data: URIs)
const SVG_TEMPLATES = [
  // Sculpture 1
  `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a2e" width="800" height="600"/><text x="400" y="300" font-size="32" fill="#ffd700" text-anchor="middle" font-family="Playfair Display" font-weight="bold">Sculpture I</text></svg>`,
  // Sculpture 2
  `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><rect fill="#16213e" width="800" height="600"/><circle cx="400" cy="300" r="150" fill="#c9a961"/><text x="400" y="450" font-size="28" fill="#fff" text-anchor="middle" font-family="Playfair Display">Installation II</text></svg>`,
  // Sculpture 3
  `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><rect fill="#0f3460" width="800" height="600"/><rect x="200" y="150" width="400" height="300" fill="#d4af37" stroke="#ffd700" stroke-width="2"/><text x="400" y="320" font-size="24" fill="#000" text-anchor="middle" font-family="Playfair Display" font-weight="bold">Œuvre III</text></svg>`,
  // Sculpture 4
  `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a1a" width="800" height="600"/><polygon points="400,100 650,450 150,450" fill="#8b7355"/><text x="400" y="500" font-size="26" fill="#c9a961" text-anchor="middle" font-family="Playfair Display">Création IV</text></svg>`,
  // Sculpture 5
  `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><rect fill="#2d2d2d" width="800" height="600"/><circle cx="250" cy="200" r="80" fill="#a0826d"/><circle cx="550" cy="250" r="100" fill="#b8956a"/><text x="400" y="500" font-size="28" fill="#ffd700" text-anchor="middle" font-family="Playfair Display" font-weight="bold">Assemblage V</text></svg>`,
  // Sculpture 6
  `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><rect fill="#1f1f1f" width="800" height="600"/><rect x="150" y="100" width="500" height="400" fill="none" stroke="#c9a961" stroke-width="3"/><text x="400" y="310" font-size="32" fill="#c9a961" text-anchor="middle" font-family="Playfair Display" font-weight="bold">Frame VI</text></svg>`,
  // Sculpture 7
  `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><rect fill="#0a0a0a" width="800" height="600"/><path d="M 100 500 L 200 200 L 400 400 L 600 200 L 700 500" stroke="#a0826d" stroke-width="4" fill="none"/><text x="400" y="550" font-size="26" fill="#b8956a" text-anchor="middle" font-family="Playfair Display">Ligne VII</text></svg>`,
  // Sculpture 8
  `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a1a" width="800" height="600"/><rect x="200" y="200" width="200" height="200" fill="#8b7355"/><rect x="450" y="200" width="150" height="250" fill="#a0826d"/><text x="400" y="520" font-size="24" fill="#c9a961" text-anchor="middle" font-family="Playfair Display" font-weight="bold">Volumes VIII</text></svg>`,
  // Sculpture 9
  `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><rect fill="#2d2d2d" width="800" height="600"/><circle cx="400" cy="300" r="120" fill="#d4af37" opacity="0.8"/><text x="400" y="310" font-size="28" fill="#1a1a1a" text-anchor="middle" font-family="Playfair Display" font-weight="bold">IX</text></svg>`,
];

async function uploadImages() {
  console.log("🖼️  UPLOADING PLACEHOLDER IMAGES\n");

  try {
    // Get artworks
    const { data: artworks } = await supabase
      .from("artworks")
      .select("id, title")
      .eq("artist_id", ARTIST_ID)
      .order("created_at", { ascending: false });

    if (!artworks || artworks.length === 0) {
      console.log("❌ No artworks found");
      return;
    }

    console.log(`Found ${artworks.length} artworks\n`);

    // Upload SVG as data: URI
    let updated = 0;
    for (let i = 0; i < artworks.length; i++) {
      const artwork = artworks[i];
      const svgData = SVG_TEMPLATES[i % SVG_TEMPLATES.length];
      const dataUri = `data:image/svg+xml;base64,${Buffer.from(svgData).toString("base64")}`;

      process.stdout.write(`   [${i + 1}/${artworks.length}] ${artwork.title}...`);

      const { error } = await supabase
        .from("artworks")
        .update({ image: dataUri })
        .eq("id", artwork.id);

      if (error) {
        console.log(` ❌`);
      } else {
        console.log(` ✅`);
        updated++;
      }
    }

    console.log(`\n✅ Updated: ${updated}/${artworks.length}`);
    console.log("\n💡 Next: Hard refresh (Ctrl+F5) to see new images!");
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}

uploadImages();
