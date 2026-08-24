#!/usr/bin/env node

/**
 * Extract images from Missira's PDF catalogue using pdf.js
 */

import * as fs from "fs";
import * as path from "path";
import * as pdfjsLib from "pdfjs-dist";

const { createClient } = await import("@supabase/supabase-js");
const { Canvas, createCanvas } = await import("canvas").catch(() => null);

const SUPABASE_URL = "https://wyrmpddlhldjzoiwbshj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const ARTIST_ID = "f1f5ea0f-fce3-45d8-a770-4c3297cee4e1";
const PDF_PATH = path.join(path.dirname("."), "..", "Desktop", "_Catalogue MISS'ART_compressed.pdf");

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

async function extractAndUpload() {
  console.log("📄 EXTRACTING IMAGES FROM PDF\n");

  try {
    if (!fs.existsSync(PDF_PATH)) {
      console.log(`❌ PDF not found: ${PDF_PATH}`);
      return;
    }

    console.log(`✅ PDF found: ${PDF_PATH}\n`);

    // Load PDF
    const pdfBuffer = fs.readFileSync(PDF_PATH);
    const pdfData = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
    const numPages = pdfData.numPages;

    console.log(`📊 PDF has ${numPages} pages\n`);

    // Get artworks
    const { data: artworks } = await supabase
      .from("artworks")
      .select("id, title")
      .eq("artist_id", ARTIST_ID)
      .order("created_at", { ascending: false });

    if (!artworks) {
      console.log("❌ No artworks found");
      return;
    }

    console.log(`Extracting ${Math.min(artworks.length, numPages)} page(s)...\n`);

    // Extract pages as images
    let uploaded = 0;
    for (let pageNum = 1; pageNum <= Math.min(artworks.length, numPages); pageNum++) {
      const artwork = artworks[pageNum - 1];

      process.stdout.write(`   [${pageNum}/${artworks.length}] ${artwork.title}...`);

      try {
        const page = await pdfData.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });

        // Render page to canvas (if canvas available)
        if (createCanvas) {
          const canvas = createCanvas(viewport.width, viewport.height);
          const context = canvas.getContext("2d");

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;
          const imageBuffer = canvas.toBuffer("image/jpeg");
          const dataUri = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;

          // Update artwork
          const { error } = await supabase
            .from("artworks")
            .update({ image: dataUri })
            .eq("id", artwork.id);

          if (error) {
            console.log(` ❌`);
          } else {
            console.log(` ✅`);
            uploaded++;
          }
        } else {
          // Fallback: skip if canvas not available
          console.log(` ⏭️  (canvas not available)`);
        }
      } catch (err) {
        console.log(` ❌ ${err.message}`);
      }
    }

    console.log(`\n✅ Uploaded: ${uploaded}/${artworks.length}`);
    console.log("\n🔄 Next: Hard refresh (Ctrl+F5) to see PDF images!");
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}

extractAndUpload();
