/**
 * retry_vps_migration_failures.mjs
 *
 * Reprocesses every row that failed during the initial
 * migrate_vps_to_supabase_storage.mjs run. Fixes:
 *   - Invalid storage keys (mojibake'd UTF-8, special chars) by sanitizing
 *     to ASCII-safe characters before upload.
 *   - Wrong/odd content-types: relies on the bucket allow-list expansion
 *     applied separately.
 *   - HEIC URLs that have a trailing ".undefined" extension: strips the
 *     suffix so the real .heic extension is used.
 *
 * Reads the existing log at scripts/migration_vps_log.json, retries every
 * row whose status === 'error', then writes the new run to
 * scripts/migration_vps_retry_log.json.
 *
 * Usage:
 *   node scripts/retry_vps_migration_failures.mjs        # dry-run (default)
 *   node scripts/retry_vps_migration_failures.mjs --live # actually write
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

const VPS_HOST = 'backend.kucibok.com';
const LEGACY_PREFIX = 'legacy';
const MAX_CONCURRENCY = 4;
const REQUEST_TIMEOUT_MS = 60000;
const SOURCE_LOG = 'scripts/migration_vps_log.json';
const TARGET_LOG = 'scripts/migration_vps_retry_log.json';

const TABLE_TO_BUCKET = { artworks: 'artworks', profiles: 'profiles', blog_posts: 'blogs' };

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
  } catch { return {}; }
}

const env = { ...parseEnv('.env'), ...parseEnv('.env.local') };
const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const live = process.argv.includes('--live');

/**
 * Sanitize a storage key path. Supabase Storage rejects keys containing
 * characters outside [A-Za-z0-9!\-_.*'()/] (and a few more). Strip every
 * non-ASCII byte and replace anything outside the safe set with "_".
 * Preserves the slash separators.
 */
function sanitizeKey(key) {
  return key
    .split('/')
    .map((seg) =>
      seg
        .normalize('NFKD')
        .replace(/[^\x20-\x7E]/g, '')          // strip non-ASCII (mojibake)
        .replace(/[^A-Za-z0-9._\-()]/g, '_')   // safe chars only
        .replace(/_+/g, '_')                    // collapse repeats
        .replace(/^_+|_+$/g, '')                // trim leading/trailing _
    )
    .filter(Boolean)
    .join('/');
}

/** Strip a trailing ".undefined" segment that appears in some HEIC URLs. */
function fixUndefinedExt(p) {
  return p.replace(/\.undefined$/, '');
}

function vpsUrlToStoragePath(url) {
  try {
    const u = new URL(url);
    let p = u.pathname.replace(/^\/+/, '');
    if (p.startsWith('uploads/')) p = p.slice('uploads/'.length);
    p = fixUndefinedExt(p);
    return sanitizeKey(`${LEGACY_PREFIX}/${p}`);
  } catch { return null; }
}

function publicStorageUrl(bucket, path) {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

function inferContentType(filename) {
  const ext = filename.toLowerCase().split('.').pop();
  return {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
    avif: 'image/avif', bmp: 'image/bmp', heic: 'image/heic', heif: 'image/heif',
  }[ext] || 'application/octet-stream';
}

async function fetchWithTimeout(url, init = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try { return await fetch(url, { ...init, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

async function pMap(items, concurrency, worker) {
  const out = new Array(items.length);
  let next = 0;
  async function run() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      out[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return out;
}

async function retryOne(row) {
  const bucket = TABLE_TO_BUCKET[row.table];
  const target = vpsUrlToStoragePath(row.oldUrl);
  if (!target) return { ...row, retryStatus: 'error', retryReason: 'cannot parse URL' };

  const filename = target.split('/').pop();
  const contentType = inferContentType(filename);
  const newUrl = publicStorageUrl(bucket, target);

  if (!live) {
    return { ...row, retryStatus: 'dry-run', target, bucket, contentType };
  }

  const dl = await fetchWithTimeout(row.oldUrl).catch((e) => ({ ok: false, _err: e.message }));
  if (!dl.ok) return { ...row, retryStatus: 'error', retryReason: `download ${dl.status || 'fail'}: ${dl._err || ''}` };
  const buf = Buffer.from(await dl.arrayBuffer());

  const { error: upErr } = await sb.storage.from(bucket).upload(target, buf, { contentType, upsert: true });
  if (upErr) return { ...row, retryStatus: 'error', retryReason: `upload: ${upErr.message}`, target };

  const { error: updErr } = await sb.from(row.table).update({ image: newUrl }).eq('id', row.id);
  if (updErr) return { ...row, retryStatus: 'error', retryReason: `db update: ${updErr.message}`, target, newUrl };

  return { ...row, retryStatus: 'migrated', target, bucket, newUrl };
}

// Main
const sourceLog = JSON.parse(readFileSync(SOURCE_LOG, 'utf-8'));
const failures = sourceLog.results.filter((r) => r.status === 'error');

console.log(`\n${'='.repeat(60)}`);
console.log(`  RETRY VPS MIGRATION FAILURES`);
console.log(`  mode: ${live ? '[LIVE]' : '[DRY-RUN]'}`);
console.log(`  failures to retry: ${failures.length}`);
console.log(`${'='.repeat(60)}\n`);

if (failures.length === 0) {
  console.log('Nothing to retry.');
  process.exit(0);
}

const startedAt = Date.now();
let done = 0;
const results = await pMap(failures, MAX_CONCURRENCY, async (row) => {
  const r = await retryOne(row);
  done++;
  console.log(`  [${done}/${failures.length}] ${r.retryStatus.padEnd(10)} ${r.table}#${r.id.slice(0,8)} ${r.target ? '-> '+r.target.slice(-60) : ''}`);
  return r;
});

const elapsed = Math.round((Date.now() - startedAt) / 1000);
console.log(`\nFinished in ${elapsed}s.\n`);

const summary = results.reduce((a, r) => ((a[r.retryStatus] = (a[r.retryStatus] || 0) + 1), a), {});
console.table(summary);

const stillErrors = results.filter((r) => r.retryStatus === 'error');
if (stillErrors.length) {
  console.log(`\nStill failing (${stillErrors.length}):`);
  stillErrors.forEach((e) => console.log(`  ${e.table}#${e.id}  ${e.retryReason}\n     url=${e.oldUrl}`));
}

writeFileSync(TARGET_LOG, JSON.stringify({
  finishedAt: new Date().toISOString(),
  mode: live ? 'live' : 'dry-run',
  total: failures.length,
  summary,
  results,
}, null, 2));
console.log(`\nFull log: ${TARGET_LOG}`);
