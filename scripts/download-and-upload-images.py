#!/usr/bin/env python3
"""
Download images from Google Drive folder and upload to Missira's artworks
Requires: pip install gdown requests
"""

import os
import sys
import base64
import requests
from pathlib import Path

# Config
GOOGLE_DRIVE_FOLDER = "1qzhFB2Vhae_ckw5Yu76Vy79uQVjLKqEP"  # Folder ID from URL
TEMP_DIR = r"C:\Users\Moctar Sidibe\Downloads\Kucibok\Kucibok\temp-images"
SUPABASE_URL = "https://wyrmpddlhldjzoiwbshj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs"
ARTIST_ID = "f1f5ea0f-fce3-45d8-a770-4c3297cee4e1"

# Artwork titles in order (1-9)
ARTWORK_TITLES = [
    "EXPLORATEUR",                # 1
    "LA CROISÉE DES CHEMINS",    # 2
    "L'EVEILLE",                  # 3
    "JEUX OUVERTS",               # 4
    "TROIS DIMENSIONS",           # 5
    "EVOLTERRE",                  # 6
    "LE TOURNIS",                 # 7
    "DO RE MI",                   # 8
    "CE QUE L'ÊTRE !",           # 9
]

def check_dependencies():
    """Check if gdown is installed"""
    try:
        import gdown
        return True
    except ImportError:
        print("❌ gdown not installed")
        print("\n📦 Install with:")
        print("   pip install gdown")
        return False

def download_from_drive():
    """Download images from Google Drive folder"""
    print("📥 DOWNLOADING IMAGES FROM GOOGLE DRIVE\n")

    try:
        import gdown
    except ImportError:
        print("❌ Please install: pip install gdown")
        return []

    # Create temp directory
    os.makedirs(TEMP_DIR, exist_ok=True)

    print(f"📁 Folder: https://drive.google.com/drive/folders/{GOOGLE_DRIVE_FOLDER}\n")
    print(f"💾 Saving to: {TEMP_DIR}\n")

    # Download all files from folder
    gdown.download_folder(
        url=f"https://drive.google.com/drive/folders/{GOOGLE_DRIVE_FOLDER}?usp=sharing",
        output=TEMP_DIR,
        quiet=False,
    )

    # Get downloaded files
    image_files = sorted([f for f in os.listdir(TEMP_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif'))])

    print(f"\n✅ Downloaded {len(image_files)} images\n")
    return image_files

def upload_images(image_files):
    """Upload images to Missira's artworks"""
    print("📤 UPLOADING IMAGES TO SUPABASE\n")

    # Get artworks
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

    uploaded = 0

    for i, artwork in enumerate(artworks[: len(image_files)]):
        image_file = image_files[i]
        image_path = os.path.join(TEMP_DIR, image_file)

        print(f"   [{i+1}/{len(artworks)}] {artwork['title']}...", end="", flush=True)

        try:
            # Read image
            with open(image_path, "rb") as f:
                image_data = f.read()

            # Get MIME type
            mime_type = "image/jpeg" if image_file.lower().endswith(('.jpg', '.jpeg')) else "image/png"

            # Convert to base64
            img_base64 = base64.b64encode(image_data).decode()
            data_uri = f"data:{mime_type};base64,{img_base64}"

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
    print("\n🔄 Next: Hard refresh (Ctrl+F5) to see images!")

def main():
    print("=" * 70)
    print("🎨 MISSIRA IMAGES: DOWNLOAD & UPLOAD")
    print("=" * 70 + "\n")

    # Check dependencies
    if not check_dependencies():
        return

    # Download images
    image_files = download_from_drive()

    if not image_files:
        print("❌ No images downloaded")
        return

    # Upload to Supabase
    upload_images(image_files)

if __name__ == "__main__":
    main()
