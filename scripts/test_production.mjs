/**
 * test_production.mjs — Tests fonctionnels production kucibok.com
 * Usage: node scripts/test_production.mjs
 */

const BASE = 'https://kucibok.com';
const API  = `${BASE}/api`;

import { readFileSync } from 'fs';
function parseEnv(p) {
  const env = {};
  try {
    readFileSync(p,'utf-8').split('\n').forEach(l => {
      l = l.trim(); if (!l || l.startsWith('#')) return;
      const i = l.indexOf('='); if (i < 0) return;
      let v = l.slice(i+1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1,-1);
      env[l.slice(0,i).trim()] = v;
    });
  } catch {}
  return env;
}
const env = { ...parseEnv('.env'), ...parseEnv('.env.production.local') };
const API_KEY = env.API_KEY || env.VITE_API_KEY;

const headers = { 'Content-Type': 'application/json', 'kcb-api-key': API_KEY };

let pass = 0, fail = 0, warn = 0;

function ok(label)   { console.log(`  ✅ ${label}`); pass++; }
function ko(label, detail) { console.log(`  ❌ ${label}${detail ? ' — '+detail : ''}`); fail++; }
function wn(label, detail) { console.log(`  ⚠️  ${label}${detail ? ' — '+detail : ''}`); warn++; }

async function get(path, opts = {}) {
  const res = await fetch(`${API}${path}`, { headers, ...opts });
  let body;
  try { body = await res.json(); } catch { body = null; }
  return { status: res.status, body };
}

async function post(path, data) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST', headers, body: JSON.stringify(data)
  });
  let body;
  try { body = await res.json(); } catch { body = null; }
  return { status: res.status, body };
}

// ─── 1. INFRASTRUCTURE ────────────────────────────────────────────────────────
console.log('\n── 1. INFRASTRUCTURE ───────────────────────────────────────');

const health = await get('/health');
if (health.body?.status === 'ok' && health.body?.supabase === true) {
  ok(`Healthcheck OK — supabase: ${health.body.supabase}, DB: ${health.body.database}`);
} else {
  ko('Healthcheck', JSON.stringify(health.body));
}

// ─── 2. PAGES PUBLIQUES ───────────────────────────────────────────────────────
console.log('\n── 2. PAGES PUBLIQUES ──────────────────────────────────────');

const pages = ['/', '/explore', '/artists', '/blog', '/about', '/faq', '/contact', '/sign-in', '/sign-up', '/africa', '/global'];
for (const page of pages) {
  const res = await fetch(`${BASE}${page}`);
  if (res.ok) ok(`GET ${page} → ${res.status}`);
  else ko(`GET ${page}`, res.status);
}

// ─── 3. SITEMAP & ROBOTS ──────────────────────────────────────────────────────
console.log('\n── 3. SEO ──────────────────────────────────────────────────');

const sitemap = await fetch(`${BASE}/sitemap.xml`);
if (sitemap.ok) ok('sitemap.xml accessible');
else ko('sitemap.xml', sitemap.status);

const robots = await fetch(`${BASE}/robots.txt`);
if (robots.ok) ok('robots.txt accessible');
else ko('robots.txt', robots.status);

// ─── 4. API ARTWORKS ──────────────────────────────────────────────────────────
console.log('\n── 4. API ARTWORKS ─────────────────────────────────────────');

const artworks = await get('/artworks');
if (artworks.status === 200 && (Array.isArray(artworks.body) || artworks.body?.data)) {
  const list = Array.isArray(artworks.body) ? artworks.body : artworks.body.data;
  ok(`GET /api/artworks → ${list?.length} œuvres`);

  if (list?.length > 0) {
    const first = list[0];
    const aw = await get(`/artworks/${first.id || first._id}`);
    if (aw.status === 200) ok(`GET /api/artworks/:id → OK`);
    else ko(`GET /api/artworks/:id`, aw.status);

    // Test vérification KCB ID
    if (first.kucibok_id) {
      const verify = await get(`/artworks/verify/${first.kucibok_id}`);
      if (verify.status === 200) ok(`GET /api/artworks/verify/${first.kucibok_id} → OK`);
      else ko(`Vérification KCB ID`, verify.status);
    }
  }
} else {
  ko('GET /api/artworks', `${artworks.status} — ${JSON.stringify(artworks.body)?.slice(0,80)}`);
}

// ─── 5. API ARTISTS ───────────────────────────────────────────────────────────
console.log('\n── 5. API ARTISTS ──────────────────────────────────────────');

const artists = await get('/artist');
if (artists.status === 200) {
  const list = Array.isArray(artists.body) ? artists.body : artists.body?.data;
  ok(`GET /api/artist → ${list?.length ?? '?'} artistes`);
} else {
  ko('GET /api/artist', artists.status);
}

// ─── 6. API BLOG ──────────────────────────────────────────────────────────────
console.log('\n── 6. API BLOG ─────────────────────────────────────────────');

const blog = await get('/blog');
if (blog.status === 200) {
  const list = Array.isArray(blog.body) ? blog.body : blog.body?.data;
  ok(`GET /api/blog → ${list?.length ?? '?'} articles`);
} else {
  ko('GET /api/blog', blog.status);
}

// ─── 7. API CATEGORIES & PLANS ────────────────────────────────────────────────
console.log('\n── 7. API CATEGORIES & PLANS ───────────────────────────────');

const cats = await get('/categories');
if (cats.status === 200) ok(`GET /api/categories → OK`);
else ko('GET /api/categories', cats.status);

const plans = await get('/plans');
if (plans.status === 200) ok(`GET /api/plans → OK`);
else ko('GET /api/plans', plans.status);

// ─── 8. AUTH ──────────────────────────────────────────────────────────────────
console.log('\n── 8. AUTH ─────────────────────────────────────────────────');

// Test signin avec mauvais mot de passe (doit retourner erreur 401, pas 500)
const badLogin = await post('/auth/signin', { email: 'test@test.com', password: 'wrongpassword' });
if (badLogin.status === 401 || badLogin.body?.error) {
  ok(`POST /api/auth/signin (bad creds) → ${badLogin.status} erreur correcte`);
} else {
  ko('POST /api/auth/signin (bad creds)', `${badLogin.status} — attendu 401`);
}

// Test forgot password (endpoint doit répondre)
const forgot = await post('/auth/forgot-password', { email: 'nonexistent@test.com' });
if (forgot.status === 200 || forgot.status === 404 || forgot.body?.ok || forgot.body?.error) {
  ok(`POST /api/auth/forgot-password → ${forgot.status}`);
} else {
  ko('POST /api/auth/forgot-password', forgot.status);
}

// ─── 9. DELIVERY TRACKING PUBLIC ─────────────────────────────────────────────
console.log('\n── 9. DELIVERY TRACKING ────────────────────────────────────');

const track = await get('/delivery/track/INVALID-ID');
if (track.status === 404 || track.body?.error) {
  ok(`GET /api/delivery/track/:id (invalid) → 404 correct`);
} else {
  ko('GET /api/delivery/track/:id', track.status);
}

// ─── 10. SOURCING ─────────────────────────────────────────────────────────────
console.log('\n── 10. SOURCING ────────────────────────────────────────────');

const sourcing = await get('/sourcing');
if (sourcing.status === 200 || sourcing.status === 401) {
  ok(`GET /api/sourcing → ${sourcing.status}`);
} else {
  ko('GET /api/sourcing', sourcing.status);
}

// ─── RÉSUMÉ ───────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(60)}`);
console.log(`  RÉSULTATS : ✅ ${pass} OK  |  ❌ ${fail} ÉCHECS  |  ⚠️  ${warn} WARNINGS`);
console.log(`${'═'.repeat(60)}\n`);

if (fail > 0) process.exit(1);
