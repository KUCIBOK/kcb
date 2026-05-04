/**
 * audit_images.mjs — Deep audit des images artworks
 * Usage: node scripts/audit_images.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

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

const env  = parseEnv('scripts/.env.migration');
const URL  = env.SUPABASE_URL;
const KEY  = env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans scripts/.env.migration');
  process.exit(1);
}

const supabase = createClient(URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const SEP  = '═'.repeat(60);
const LINE = '─'.repeat(56);

console.log(`\n${SEP}`);
console.log('  KUCIBOK — DEEP AUDIT IMAGES ARTWORKS');
console.log(`${SEP}\n`);

// ── 1. Récupère toutes les œuvres ─────────────────────────────
console.log('── 1. CHARGEMENT ARTWORKS ───────────────────────────────────');
const { data: artworks, error: awErr } = await supabase
  .from('artworks')
  .select('id, title, image, artist_id, status');

if (awErr || !artworks) {
  console.log(`  ❌ Erreur: ${awErr?.message}`);
  process.exit(1);
}
console.log(`  ✅ ${artworks.length} œuvres chargées`);

// ── 2. Lookup artistes ────────────────────────────────────────
const { data: artistRows } = await supabase.from('artists').select('id, name');
const artistMap = {};
(artistRows ?? []).forEach(a => { artistMap[a.id] = a.name; });
console.log(`  ✅ ${Object.keys(artistMap).length} artistes chargés`);

// ── 3. Classement URLs ────────────────────────────────────────
console.log('\n── 2. RÉPARTITION DES URLs ──────────────────────────────────');
const groups = { supabase: [], cloudinary: [], vps: [], empty: [], other: [] };
for (const a of artworks) {
  const img = a.image;
  if (!img)                               groups.empty.push(a);
  else if (img.includes('.supabase.co')) groups.supabase.push(a);
  else if (img.includes('cloudinary.com'))groups.cloudinary.push(a);
  else if (img.includes('backend.kucibok'))groups.vps.push(a);
  else                                    groups.other.push(a);
}

const total = artworks.length;
const pct = n => `${((n / total) * 100).toFixed(1)}%`;

console.log(`  Total            : ${total}`);
console.log(`  ${LINE}`);
console.log(`  ✅ Supabase      : ${String(groups.supabase.length).padStart(4)}  (${pct(groups.supabase.length)})  images OK`);
console.log(`  🔶 Cloudinary    : ${String(groups.cloudinary.length).padStart(4)}  (${pct(groups.cloudinary.length)})  à migrer`);
console.log(`  ❌ VPS mort      : ${String(groups.vps.length).padStart(4)}  (${pct(groups.vps.length)})  images perdues`);
console.log(`  ⬜ Vide/null     : ${String(groups.empty.length).padStart(4)}  (${pct(groups.empty.length)})  jamais uploadée`);
console.log(`  ❓ Autre domaine : ${String(groups.other.length).padStart(4)}  (${pct(groups.other.length)})`);

// ── 4. Test connectivité Supabase (5 URLs) ────────────────────
console.log('\n── 3. CONNECTIVITÉ SUPABASE STORAGE (5 tests) ──────────────');
const sample = [...groups.supabase].sort(() => Math.random() - 0.5).slice(0, 5);
let ok = 0, ko = 0;
for (const a of sample) {
  try {
    const r = await fetch(a.image, { method: 'HEAD', signal: AbortSignal.timeout(6000) });
    if (r.ok) { ok++; console.log(`  ✅ ${r.status}  ${a.image.slice(0, 65)}…`); }
    else       { ko++; console.log(`  ❌ ${r.status}  ${a.image.slice(0, 65)}…`); }
  } catch (e) {
    ko++;
    console.log(`  ❌ ERR  ${String(e.message).slice(0, 55)}`);
  }
}
if (sample.length === 0) console.log('  ℹ️  Aucune URL Supabase à tester');
else console.log(`\n  → ${ok}/${sample.length} OK  ${ko > 0 ? '⚠️  des URLs Supabase sont inaccessibles' : '✅ bucket public opérationnel'}`);

// ── 5. Artistes impactés (VPS mort) ──────────────────────────
if (groups.vps.length > 0) {
  console.log('\n── 4. ARTISTES IMPACTÉS — VPS mort ─────────────────────────');
  const byArtist = {};
  for (const a of groups.vps) {
    const name = artistMap[a.artist_id] ?? '(artiste inconnu)';
    if (!byArtist[name]) byArtist[name] = 0;
    byArtist[name]++;
  }
  const sorted = Object.entries(byArtist).sort((a, b) => b[1] - a[1]);
  sorted.slice(0, 20).forEach(([name, count]) => {
    console.log(`  ❌  ${name.padEnd(38)} ${String(count).padStart(3)} œuvre(s)`);
  });
  if (sorted.length > 20) console.log(`  … et ${sorted.length - 20} autre(s) artiste(s)`);
  console.log(`\n  Total artistes affectés : ${sorted.length} / ${Object.keys(artistMap).length}`);
}

// ── 6. Statut des œuvres VPS ──────────────────────────────────
if (groups.vps.length > 0) {
  console.log('\n── 5. STATUT DES ŒUVRES VPS MORTES ─────────────────────────');
  const byStatus = {};
  for (const a of groups.vps) {
    const s = a.status ?? 'unknown';
    byStatus[s] = (byStatus[s] || 0) + 1;
  }
  Object.entries(byStatus).sort((a, b) => b[1] - a[1]).forEach(([s, n]) => {
    const icon = s === 'approved' ? '✅' : s === 'pending' ? '⏳' : '❌';
    console.log(`  ${icon} ${s.padEnd(15)} ${n} œuvre(s)`);
  });
}

// ── 7. Domaines inconnus ──────────────────────────────────────
if (groups.other.length > 0) {
  console.log('\n── 6. DOMAINES INCONNUS ─────────────────────────────────────');
  const domains = {};
  for (const a of groups.other) {
    try { const d = new URL(a.image).hostname; domains[d] = (domains[d] || 0) + 1; } catch {}
  }
  Object.entries(domains).sort((a, b) => b[1] - a[1]).forEach(([d, n]) => {
    console.log(`  ❓ ${d.padEnd(42)} ${n}`);
  });
}

console.log(`\n${SEP}\n`);
