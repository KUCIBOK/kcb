#!/usr/bin/env python3
"""
Extract PDF pages as images and upload to Missira's artworks
Requires: pip install pdf2image pillow requests
"""

import os
import sys
import json
import base64
import requests
from pathlib import Path

# Try imports
try:
    from pdf2image import convert_from_path
    from PIL import Image
    import io
except ImportError as e:
    print(f"❌ Missing dependency: {e}")
    print("\n📦 Install with:")
    print("   pip install pdf2image pillow requests")
    sys.exit(1)

# Config
PDF_PATH = r"C:\Users\Moctar Sidibe\Desktop\_Catalogue MISS'ART_compressed.pdf"
SUPABASE_URL = "https://wyrmpddlhldjzoiwbshj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs"
ARTIST_ID = "f1f5ea0f-fce3-45d8-a770-4c3297cee4e1"

def extract_and_upload():
    print("📄 EXTRACTING PDF IMAGES\n")

    # Check PDF exists
    if not os.path.exists(PDF_PATH):
        print(f"❌ PDF not found: {PDF_PATH}")
        return

    print(f"✅ PDF found: {PDF_PATH}\n")

    # Convert PDF pages to images
    print("🔄 Converting PDF pages to images...\n")
    try:
        images = convert_from_path(PDF_PATH, first_page=1, last_page=9)
        print(f"✅ Extracted {len(images)} pages\n")
    except Exception as e:
        print(f"❌ Extraction error: {e}")
        return

    # Get artworks from Supabase
    print("🔍 Fetching artworks...\n")
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }

    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/artworks?"
        f"artist_id=eq.{ARTIST_ID}&select=id,title&order=created_at.desc",
        headers=headers,
    )

    if response.status_code != 200:
        print(f"❌ Failed to fetch artworks: {response.text}")
        return

    artworks = response.json()
    print(f"✅ Found {len(artworks)} artworks\n")

    # Upload images
    print("📤 Uploading images...\n")
    uploaded = 0

    for i, artwork in enumerate(artworks[: len(images)]):
        print(f"   [{i+1}/{len(artworks)}] {artwork['title']}...", end="", flush=True)

        try:
            # Convert image to JPEG
            img = images[i]
            img_resized = img.resize((800, 600), Image.Resampling.LANCZOS)

            # Convert to base64
            img_bytes = io.BytesIO()
            img_resized.save(img_bytes, format="JPEG", quality=85)
            img_base64 = base64.b64encode(img_bytes.getvalue()).decode()
            data_uri = f"data:image/jpeg;base64,{img_base64}"

            # Update artwork
            update_response = requests.patch(
                f"{SUPABASE_URL}/rest/v1/artworks?id=eq.{artwork['id']}",
                json={"image": data_uri},
                headers=headers,
            )

            if update_response.status_code == 204:
                print(" ✅")
                uploaded += 1
            else:
                print(f" ❌ ({update_response.status_code})")
        except Exception as e:
            print(f" ❌ ({e})")

    print(f"\n✅ Uploaded: {uploaded}/{len(artworks)}")
    print("\n🔄 Next: Hard refresh (Ctrl+F5) to see PDF images!")

if __name__ == "__main__":
    extract_and_upload()
