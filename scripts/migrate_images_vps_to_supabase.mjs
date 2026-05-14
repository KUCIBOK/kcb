/**
 * migrate_images_vps_to_supabase.mjs
 * Migre les images artworks stockées sur le VPS Hostinger (backend.kucibok.com)
 * vers Supabase Storage (bucket: artworks), puis met à jour l'URL en base.
 *
 * Usage:
 *   node scripts/migrate_images_vps_to_supabase.mjs
 *   node scripts/migrate_images_vps_to_supabase.mjs --dry-run   (simulation sans écriture)
 *   node scripts/migrate_images_vps_to_supabase.mjs --limit 50  (migrer seulement 50 images)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// ── Config ────────────────────────────────────────────────────────────────────

function parseEnv(path) {
  try {
    const content = readFileSync(path, 'utf-8');
    const env = {};
    for (const line of content.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const idx = t.indexOf('=');
      if (idx === -1) continue;
      env[t.slice(0, idx).trim()] = t.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    }
    return env;
  } catch { return {}; }
}

const env = parseEnv('scripts/.env.migration');
const SUPABASE_URL = env.SUPABASE_URL;
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans scripts/.env.migration');
  process.exit(1);
}

const DRY_RUN   = process.argv.includes('--dry-run');
const limitArg  = process.argv.indexOf('--limit');
const LIMIT     = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : Infinity;
const BATCH     = 5; // requêtes parallèles max
const TIMEOUT   = 20_000; // ms par image

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const SEP = '═'.repeat(62);

// ── Helpers ───────────────────────────────────────────────────────────────────

function extFromUrl(url) {
  try {
    const path = new URL(url).pathname;
    const parts = path.split('.');
    const raw = parts[parts.length - 1].toLowerCase().split('?')[0];
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(raw)) return raw === 'jpeg' ? 'jpg' : raw;
  } catch {}
  return 'jpg';
}

function mimeFromExt(ext) {
  const map = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };
  return map[ext] ?? 'image/jpeg';
}

async function downloadImage(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    return new Uint8Array(buffer);
  } finally {
    clearTimeout(timer);
  }
}

async function uploadToSupabase(artworkId, artistId, buffer, ext) {
  const folder = artistId ?? 'unknown';
  const path   = `${folder}/${artworkId}_migrated.${ext}`;
  const { error } = await supabase.storage
    .from('artworks')
    .upload(path, buffer, { contentType: mimeFromExt(ext), upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('artworks').getPublicUrl(path);
  return data.publicUrl;
}

async function updateArtworkImage(artworkId, newUrl) {
  const { error } = await supabase
    .from('artworks')
    .update({ image: newUrl })
    .eq('id', artworkId);
  if (error) throw new Error(error.message);
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log(`\n${SEP}`);
console.log('  KUCIBOK — MIGRATION IMAGES VPS → SUPABASE STORAGE');
if (DRY_RUN) console.log('  ⚠️  MODE DRY-RUN : aucune écriture ne sera effectuée');
if (LIMIT !== Infinity) console.log(`  ⚠️  LIMITE : ${LIMIT} images`);
console.log(`${SEP}\n`);

// 1. Charger toutes les œuvres avec image VPS
console.log('── 1. CHARGEMENT DES ŒUVRES AVEC IMAGES VPS ────────────────────');
const { data: artworks, error: awErr } = await supabase
  .from('artworks')
  .select('id, title, image, artist_id, status')
  .ilike('image', '%backend.kucibok.com%');

if (awErr) { console.error('❌', awErr.message); process.exit(1); }

const toMigrate = artworks.slice(0, LIMIT === Infinity ? artworks.length : LIMIT);
console.log(`  Trouvées : ${artworks.length} | À traiter : ${toMigrate.length}\n`);

if (toMigrate.length === 0) {
  console.log('  ✅ Rien à migrer.\n');
  process.exit(0);
}

// 2. Migration par batchs
console.log('── 2. MIGRATION ─────────────────────────────────────────────────');
let ok = 0, skipped = 0, failed = 0;
const errors = [];

for (let i = 0; i < toMigrate.length; i += BATCH) {
  const batch = toMigrate.slice(i, i + BATCH);
  await Promise.all(batch.map(async (artwork) => {
    const idx  = toMigrate.indexOf(artwork) + 1;
    const tag  = `[${String(idx).padStart(3)}/${toMigrate.length}]`;
    const name = (artwork.title ?? artwork.id).slice(0, 45);

    try {
      const ext    = extFromUrl(artwork.image);
      const buffer = await downloadImage(artwork.image);

      if (DRY_RUN) {
        console.log(`  ${tag} ✅ DRY  ${name}`);
        ok++;
        return;
      }

      const newUrl = await uploadToSupabase(artwork.id, artwork.artist_id, buffer, ext);
      await updateArtworkImage(artwork.id, newUrl);
      console.log(`  ${tag} ✅ OK   ${name}`);
      ok++;
    } catch (e) {
      const msg = e.message ?? String(e);
      console.log(`  ${tag} ❌ ERR  ${name} — ${msg.slice(0, 60)}`);
      failed++;
      errors.push({ id: artwork.id, title: artwork.title, url: artwork.image, error: msg });
    }
  }));
}

// 3. Résumé
console.log(`\n${SEP}`);
console.log('  RÉSUMÉ');
console.log(`${SEP}`);
console.log(`  ✅ Migrées avec succès : ${ok}`);
console.log(`  ❌ Erreurs             : ${failed}`);

if (errors.length > 0) {
  console.log('\n  Images en erreur :');
  errors.forEach(e => {
    console.log(`    • [${e.id}] ${(e.title ?? '').slice(0, 40)} — ${e.error.slice(0, 70)}`);
  });
  console.log('\n  → Relancer le script pour retenter les images en erreur.');
}

if (!DRY_RUN && ok > 0) {
  console.log(`\n  ✅ ${ok} image(s) sont maintenant servies depuis Supabase Storage.`);
}

console.log(`\n${SEP}\n`);
