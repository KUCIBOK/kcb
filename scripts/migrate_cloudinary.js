/**
 * migrate_cloudinary.js — Migration des images Cloudinary → Supabase Storage
 *
 * Ce script parcourt toutes les URL Cloudinary stockées dans Supabase PostgreSQL,
 * télécharge chaque image, la ré-upload dans le bucket Supabase Storage correspondant,
 * puis met à jour la colonne `image` dans la table Supabase.
 *
 * USAGE :
 *   node scripts/migrate_cloudinary.js [options]
 *
 * OPTIONS :
 *   --dry-run          Simule sans télécharger ni écrire
 *   --table=artworks   Migre une seule table (défaut : all)
 *   --limit=N          Migre seulement les N premières images
 *   --offset=N         Commence à partir de la Nième image
 *
 * TABLES TRAITÉES :
 *   artworks   → bucket "artworks"  → colonne image
 *   artists    → bucket "profiles"  → colonne image
 *   profiles   → bucket "profiles"  → colonne image
 *   blog_posts → bucket "blogs"     → colonne image
 *
 * PRÉREQUIS :
 *   Variables d'env dans .env.migration :
 *   - SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   (Pas de clé Cloudinary nécessaire — téléchargement via URL publique)
 *
 * @module migrate_cloudinary
 */

'use strict';

require('dotenv').config({ path: '.env.migration' });

const { createClient } = require('@supabase/supabase-js');
const https  = require('https');
const http   = require('http');
const path   = require('path');
const { URL } = require('url');

// ─── Configuration ────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const DRY_RUN   = process.argv.includes('--dry-run');
const TARGET    = process.argv.find(a => a.startsWith('--table='))?.split('=')[1] ?? 'all';

const limitArg  = process.argv.find(a => a.startsWith('--limit='));
const offsetArg = process.argv.find(a => a.startsWith('--offset='));
const LIMIT     = limitArg  ? parseInt(limitArg.split('=')[1],  10) : Infinity;
const OFFSET    = offsetArg ? parseInt(offsetArg.split('=')[1], 10) : 0;

/** Timeout de telechargement en ms */
const DOWNLOAD_TIMEOUT_MS = 30_000;

/** Pause entre chaque image pour eviter le rate-limit Cloudinary (ms) */
const DELAY_MS = 200;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('[ERREUR] SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis dans .env.migration');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// ─── Logger ───────────────────────────────────────────────────────────────────

/** @param {string} msg */
const log  = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

/** @param {string} msg */
const warn = (msg) => console.warn(`[WARN] ${msg}`);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Verifie si une URL est une URL Cloudinary.
 *
 * @param {string|null} url
 * @returns {boolean}
 */
function isCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('cloudinary.com');
}

/**
 * Construit le chemin de stockage dans le bucket Supabase.
 * Exemple : cloudinary.com/.../upload/v1234/artworks/abc.jpg → artwork_artworks_abc.jpg
 *
 * @param {string} url
 * @param {string} prefix
 * @returns {string}
 */
function buildStoragePath(url, prefix) {
  try {
    const parsed   = new URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    const uploadIdx = segments.findIndex(s => s === 'upload');
    const relevant  = uploadIdx >= 0 ? segments.slice(uploadIdx + 2) : segments.slice(-2);
    const fileName  = relevant.join('_').replace(/[^a-zA-Z0-9._-]/g, '_');
    return `${prefix}_${fileName}`;
  } catch {
    const ext = path.extname(new URL(url).pathname) || '.jpg';
    return `${prefix}_${Date.now()}${ext}`;
  }
}

/**
 * Telecharge une image depuis une URL HTTP/HTTPS et retourne son Buffer.
 *
 * @param {string} imageUrl
 * @returns {Promise<{ buffer: Buffer, contentType: string }>}
 */
function downloadImage(imageUrl) {
  return new Promise((resolve, reject) => {
    let parsed;
    try { parsed = new URL(imageUrl); } catch { return reject(new Error(`URL invalide : ${imageUrl}`)); }

    const transport = parsed.protocol === 'https:' ? https : http;
    const request   = transport.get(imageUrl, { timeout: DOWNLOAD_TIMEOUT_MS }, (res) => {
      // Suivre les redirections
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadImage(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end',  () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] ?? 'image/jpeg' }));
      res.on('error', reject);
    });

    request.on('error',   reject);
    request.on('timeout', () => { request.destroy(); reject(new Error('Timeout')); });
  });
}

/**
 * Upload un buffer vers Supabase Storage et retourne l'URL publique.
 *
 * @param {string} bucket
 * @param {string} storagePath
 * @param {Buffer} buffer
 * @param {string} contentType
 * @returns {Promise<string>}
 */
async function uploadToSupabase(bucket, storagePath, buffer, contentType) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, buffer, { contentType, upsert: true });

  if (error) throw new Error(`Upload ${bucket}/${storagePath} : ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Configurations des tables a migrer ───────────────────────────────────────

/**
 * @typedef {object} TableConfig
 * @property {string} table   - Nom de la table Supabase
 * @property {string} column  - Colonne contenant l'URL image
 * @property {string} bucket  - Bucket Supabase Storage cible
 * @property {string} prefix  - Prefixe pour le chemin Storage
 */

/** @type {Record<string, TableConfig>} */
const TABLE_CONFIGS = {
  artworks:   { table: 'artworks',   column: 'image', bucket: 'artworks', prefix: 'artwork'  },
  artists:    { table: 'artists',    column: 'image', bucket: 'profiles', prefix: 'artist'   },
  profiles:   { table: 'profiles',   column: 'image', bucket: 'profiles', prefix: 'profile'  },
  blog_posts: { table: 'blog_posts', column: 'image', bucket: 'blogs',    prefix: 'blog'     },
};

// ─── Migration d'une table ─────────────────────────────────────────────────────

/**
 * Migre les images Cloudinary d'une table vers Supabase Storage.
 *
 * @param {TableConfig} config
 * @returns {Promise<{ total: number, migrated: number, skipped: number, errors: number }>}
 */
async function migrateTable(config) {
  const { table, column, bucket, prefix } = config;
  log(`=== Migration : ${table}.${column} → bucket "${bucket}" ===`);

  const stats = { total: 0, migrated: 0, skipped: 0, errors: 0 };

  const rangeEnd = OFFSET + (LIMIT === Infinity ? 99_999 : LIMIT) - 1;
  const { data: rows, error: fetchError } = await supabase
    .from(table)
    .select(`id, ${column}`)
    .not(column, 'is', null)
    .range(OFFSET, rangeEnd);

  if (fetchError) {
    warn(`Impossible de lire ${table} : ${fetchError.message}`);
    return stats;
  }

  const cloudinaryRows = (rows ?? []).filter(r => isCloudinaryUrl(r[column]));
  log(`  ${cloudinaryRows.length} images Cloudinary dans ${table}`);
  stats.total = cloudinaryRows.length;

  for (let i = 0; i < cloudinaryRows.length; i++) {
    const row         = cloudinaryRows[i];
    const originalUrl = row[column];

    process.stdout.write(`  [${i + 1}/${cloudinaryRows.length}] ${originalUrl.slice(0, 55)}... `);

    if (DRY_RUN) {
      console.log('[DRY-RUN]');
      stats.skipped++;
      continue;
    }

    try {
      const { buffer, contentType } = await downloadImage(originalUrl);
      const storagePath = buildStoragePath(originalUrl, prefix);
      const newUrl      = await uploadToSupabase(bucket, storagePath, buffer, contentType);

      const { error: updateError } = await supabase
        .from(table)
        .update({ [column]: newUrl })
        .eq('id', row.id);

      if (updateError) throw new Error(updateError.message);

      console.log(`OK`);
      stats.migrated++;
    } catch (err) {
      console.error(`ERREUR: ${err.message}`);
      stats.errors++;
    }

    await sleep(DELAY_MS);
  }

  return stats;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

/**
 * Point d'entree principal.
 *
 * @returns {Promise<void>}
 */
async function main() {
  log(`\n=== Migration images Cloudinary → Supabase Storage ===`);
  log(`Mode  : ${DRY_RUN ? 'DRY-RUN' : 'LIVE'}`);
  log(`Table : ${TARGET}`);

  if (TARGET !== 'all' && !TABLE_CONFIGS[TARGET]) {
    console.error(`Table inconnue : ${TARGET}. Options : ${Object.keys(TABLE_CONFIGS).join(', ')}`);
    process.exit(1);
  }

  const configs     = TARGET === 'all' ? Object.values(TABLE_CONFIGS) : [TABLE_CONFIGS[TARGET]];
  const totalStats  = { total: 0, migrated: 0, skipped: 0, errors: 0 };

  for (const config of configs) {
    const stats      = await migrateTable(config);
    totalStats.total    += stats.total;
    totalStats.migrated += stats.migrated;
    totalStats.skipped  += stats.skipped;
    totalStats.errors   += stats.errors;
  }

  log('\n=== Resultats ===');
  log(`  Total trouve  : ${totalStats.total}`);
  log(`  Migre         : ${totalStats.migrated}`);
  log(`  Ignore (dry)  : ${totalStats.skipped}`);
  log(`  Erreurs       : ${totalStats.errors}`);

  if (totalStats.errors > 0) {
    warn('Relancer avec --table=<table> pour rejouer les tables en erreur.');
    process.exit(1);
  }

  log('\nMigration images terminee.');
  process.exit(0);
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
