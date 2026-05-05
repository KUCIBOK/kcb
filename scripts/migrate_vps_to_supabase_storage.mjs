/**
 * migrate_vps_to_supabase_storage.mjs
 *
 * Moves every image still served by backend.kucibok.com into the matching
 * Supabase Storage bucket and updates the DB row to point at the new public
 * URL. The Hostinger VPS is the source of truth: once this migration runs
 * green, the VPS can be decommissioned.
 *
 * Tables and buckets:
 *   artworks.image    -> bucket "artworks"   path legacy/<original-path>
 *   profiles.image    -> bucket "profiles"   path legacy/<original-path>
 *   blog_posts.image  -> bucket "blogs"      path legacy/<original-path>
 *
 * Usage:
 *   node scripts/migrate_vps_to_supabase_storage.mjs            # dry-run (default)
 *   node scripts/migrate_vps_to_supabase_storage.mjs --live     # actually write
 *   node scripts/migrate_vps_to_supabase_storage.mjs --live --table=artworks
 *
 * Behavior:
 *   - Idempotent: re-running picks up only rows still pointing at the VPS.
 *   - Per-row error tolerance: failures are logged, processing continues.
 *   - Concurrency capped at MAX_CONCURRENCY to avoid hammering the VPS.
 *   - Writes a structured log to scripts/migration_vps_log.json after each run.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

// Config
const VPS_HOST = 'backend.kucibok.com';
const LEGACY_PREFIX = 'legacy';
const MAX_CONCURRENCY = 4;
const REQUEST_TIMEOUT_MS = 20000;
const LOG_FILE = 'scripts/migration_vps_log.json';

const TABLE_TO_BUCKET = {
  artworks: 'artworks',
  profiles: 'profiles',
  blog_posts: 'blogs',
};

// Env loading (ignores quoted/multiline values)
function parseEnv(path) {
  try {
    const raw = readFileSync(path, 'utf-8');
    const env = {};
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i === -1) continue;
      const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '').replace(/\\n/g, '').trim();
      if (v) env[t.slice(0, i).trim()] = v;
    }
    return env;
  } catch {
    return {};
  }
}

const env = { ...parseEnv('.env'), ...parseEnv('.env.local') };
const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env / .env.local');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

// CLI args
const args = process.argv.slice(2);
const live = args.includes('--live');
const tableArg = args.find((a) => a.startsWith('--table='));
const onlyTable = tableArg ? tableArg.split('=')[1] : null;
if (onlyTable && !TABLE_TO_BUCKET[onlyTable]) {
  console.error(`--table must be one of: ${Object.keys(TABLE_TO_BUCKET).join(', ')}`);
  process.exit(1);
}

/**
 * Map a VPS URL to a target storage path.
 * Input:  https://backend.kucibok.com/uploads/2022/02/9981.png.png
 * Output: legacy/2022/02/9981.png.png
 */
function vpsUrlToStoragePath(url) {
  try {
    const u = new URL(url);
    let p = u.pathname.replace(/^\/+/, '');
    if (p.startsWith('uploads/')) p = p.slice('uploads/'.length);
    return `${LEGACY_PREFIX}/${p}`;
  } catch {
    return null;
  }
}

function publicStorageUrl(bucket, path) {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

function inferContentType(filename) {
  const ext = filename.toLowerCase().split('.').pop();
  return {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
    avif: 'image/avif', bmp: 'image/bmp',
  }[ext] || 'application/octet-stream';
}

async function fetchWithTimeout(url, init = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

async function alreadyInStorage(bucket, path) {
  const dir = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
  const name = path.includes('/') ? path.slice(path.lastIndexOf('/') + 1) : path;
  const { data, error } = await sb.storage.from(bucket).list(dir, { limit: 1000, search: name });
  if (error) return false;
  return (data || []).some((f) => f.name === name);
}

// Concurrency-limited Promise.all
async function pMap(items, concurrency, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

// Inventory
async function inventory() {
  const tables = onlyTable ? [onlyTable] : Object.keys(TABLE_TO_BUCKET);
  const rows = [];
  for (const table of tables) {
    let from = 0;
    while (true) {
      const { data, error } = await sb
        .from(table)
        .select('id,image')
        .like('image', `%${VPS_HOST}%`)
        .range(from, from + 999);
      if (error) {
        console.error(`[${table}] inventory error:`, error.message);
        break;
      }
      for (const r of data || []) rows.push({ table, id: r.id, oldUrl: r.image });
      if ((data || []).length < 1000) break;
      from += 1000;
    }
  }
  return rows;
}

// Per-row migration
async function migrateOne(row) {
  const bucket = TABLE_TO_BUCKET[row.table];
  const target = vpsUrlToStoragePath(row.oldUrl);
  if (!target) {
    return { ...row, status: 'error', reason: 'cannot parse URL' };
  }

  const filename = target.split('/').pop();
  const contentType = inferContentType(filename);
  const newUrl = publicStorageUrl(bucket, target);

  // Idempotency check: if file already in storage, we may have migrated
  // previously; still update the DB row in case the URL wasn't flipped.
  const exists = await alreadyInStorage(bucket, target);

  if (!exists) {
    // Dry-run: HEAD only
    if (!live) {
      const head = await fetchWithTimeout(row.oldUrl, { method: 'HEAD' }).catch((e) => ({ ok: false, status: 0, _err: e.message }));
      if (!head.ok) {
        return { ...row, status: 'error', reason: `HEAD ${head.status || 'fail'}: ${head._err || ''}` };
      }
      return { ...row, status: 'dry-run-ok', target, bucket, size: head.headers?.get('content-length') };
    }

    // Live: download
    const dl = await fetchWithTimeout(row.oldUrl).catch((e) => ({ ok: false, _err: e.message }));
    if (!dl.ok) return { ...row, status: 'error', reason: `download ${dl.status || 'fail'}: ${dl._err || ''}` };
    const buf = Buffer.from(await dl.arrayBuffer());

    // Upload
    const { error: upErr } = await sb.storage.from(bucket).upload(target, buf, {
      contentType,
      upsert: true,
    });
    if (upErr) return { ...row, status: 'error', reason: `upload: ${upErr.message}` };
  }

  if (!live) {
    return { ...row, status: 'dry-run-already-uploaded', target, bucket };
  }

  // Update DB row
  const { error: updErr } = await sb.from(row.table).update({ image: newUrl }).eq('id', row.id);
  if (updErr) return { ...row, status: 'error', reason: `db update: ${updErr.message}`, target, bucket, newUrl };

  return { ...row, status: exists ? 'updated-existing-storage' : 'migrated', target, bucket, newUrl };
}

// Main
console.log(`\n${'='.repeat(60)}`);
console.log(`  VPS -> SUPABASE STORAGE MIGRATION`);
console.log(`  mode: ${live ? '[LIVE - will write]' : '[DRY-RUN - no writes]'}`);
console.log(`  scope: ${onlyTable || 'all tables'}`);
console.log(`${'='.repeat(60)}\n`);

const rows = await inventory();
console.log(`Rows pointing to ${VPS_HOST}: ${rows.length}`);
const byTable = rows.reduce((a, r) => ((a[r.table] = (a[r.table] || 0) + 1), a), {});
console.log('  ', byTable);

if (rows.length === 0) {
  console.log('\nNothing to migrate. Exit.');
  process.exit(0);
}

const startedAt = Date.now();
let done = 0;
const results = await pMap(rows, MAX_CONCURRENCY, async (row, i) => {
  const r = await migrateOne(row);
  done++;
  if (done % 25 === 0 || done === rows.length) {
    const pct = ((done / rows.length) * 100).toFixed(0);
    console.log(`  [${done}/${rows.length}] (${pct}%)`);
  }
  return r;
});

const elapsed = Math.round((Date.now() - startedAt) / 1000);
console.log(`\nFinished in ${elapsed}s.\n`);

const summary = results.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
console.table(summary);

const errors = results.filter((r) => r.status === 'error');
if (errors.length) {
  console.log(`\nErrors (${errors.length}, first 10):`);
  errors.slice(0, 10).forEach((e) => console.log(`  ${e.table}#${e.id}  ${e.reason}  url=${e.oldUrl}`));
}

writeFileSync(LOG_FILE, JSON.stringify({
  finishedAt: new Date().toISOString(),
  mode: live ? 'live' : 'dry-run',
  scope: onlyTable || 'all',
  total: rows.length,
  summary,
  results,
}, null, 2));
console.log(`\nFull log: ${LOG_FILE}`);

if (!live) {
  console.log('\nDRY-RUN complete. Re-run with --live to actually migrate.');
}
