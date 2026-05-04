/**
 * audit_supabase.mjs — Audit complet configuration Supabase
 * Usage: node scripts/audit_supabase.mjs
 * Lit les credentials depuis scripts/.env.migration
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Parse .env.migration manually (pas de dotenv requis)
function parseEnv(path) {
  try {
    const content = readFileSync(path, 'utf-8');
    const env = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = val;
    }
    return env;
  } catch {
    return {};
  }
}

const env = parseEnv('scripts/.env.migration');
const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans scripts/.env.migration');
  process.exit(1);
}

const urlRef = SUPABASE_URL.replace('https://', '').split('.')[0];
console.log(`\n${'═'.repeat(60)}`);
console.log(`  KUCIBOK — AUDIT SUPABASE`);
console.log(`  Projet : ${urlRef}`);
console.log(`${'═'.repeat(60)}\n`);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ─── 1. Storage Buckets ────────────────────────────────────────
console.log('── 1. STORAGE BUCKETS ──────────────────────────────────────');
const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
if (bucketsErr) {
  console.log(`  ❌ Erreur: ${bucketsErr.message}`);
} else {
  const expected = ['artworks', 'profiles', 'blogs', 'certificates'];
  for (const name of expected) {
    const b = buckets.find(x => x.name === name);
    if (b) {
      const visibility = b.public ? '🌐 public ' : '🔒 private';
      const certOk = name === 'certificates' ? !b.public : b.public;
      const icon = certOk ? '✅' : '⚠️ ';
      console.log(`  ${icon} ${visibility}  ${name}`);
    } else {
      console.log(`  ❌ MANQUANT        ${name}`);
    }
  }
  const extra = buckets.filter(b => !expected.includes(b.name));
  if (extra.length) console.log(`  ℹ️  Autres buckets: ${extra.map(b => b.name).join(', ')}`);
}

// ─── 2. Tables & Counts ───────────────────────────────────────
console.log('\n── 2. TABLES & DONNÉES ─────────────────────────────────────');
const tables = [
  'users', 'artists', 'profiles', 'artworks', 'transactions',
  'subscriptions', 'plans', 'delivery_requests', 'delivery_events',
  'categories', 'blog_posts', 'sourcing_inquiries', 'documents',
  'liked_artworks', 'galleries', 'logs'
];
for (const t of tables) {
  const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
  if (error) console.log(`  ❌ ${t.padEnd(25)} — ${error.message}`);
  else console.log(`  ✅ ${t.padEnd(25)} — ${count} lignes`);
}

// ─── 3. Auth users count ─────────────────────────────────────
console.log('\n── 3. AUTH USERS ────────────────────────────────────────────');
const { data: authData, error: authErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
if (authErr) console.log(`  ❌ Erreur: ${authErr.message}`);
else {
  const users = authData.users ?? [];
  const confirmed = users.filter(u => u.email_confirmed_at).length;
  const google = users.filter(u => u.app_metadata?.provider === 'google').length;
  const email = users.filter(u => u.app_metadata?.provider === 'email' || !u.app_metadata?.provider).length;
  console.log(`  ✅ Total auth.users     : ${users.length}`);
  console.log(`  ✅ Email confirmés      : ${confirmed}`);
  console.log(`  ℹ️  Provider email      : ${email}`);
  console.log(`  ℹ️  Provider google     : ${google}`);

  // Check if providers are set
  const hasGoogle = users.some(u => u.app_metadata?.provider === 'google');
  console.log(`\n  Google OAuth utilisé    : ${hasGoogle ? '✅ Oui' : 'ℹ️  Pas encore (aucun user Google)'}`);
}

// ─── 4. Triggers check (via artworks insert test) ─────────────
console.log('\n── 4. TRIGGERS ──────────────────────────────────────────────');
// Check if artworks have KCB IDs
const { data: artworkSample } = await supabase
  .from('artworks')
  .select('kucibok_id')
  .not('kucibok_id', 'is', null)
  .limit(3);
if (artworkSample?.length > 0) {
  console.log(`  ✅ Trigger kucibok_id  : actif (ex: ${artworkSample[0].kucibok_id})`);
} else {
  const { data: noKid } = await supabase.from('artworks').select('kucibok_id').limit(3);
  console.log(`  ⚠️  kucibok_id sample: ${JSON.stringify(noKid?.map(a => a.kucibok_id))}`);
}

// Check on_auth_user_created trigger by comparing auth.users vs public.users
const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
const { count: pubCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
const authCount = authUsers?.users?.length ?? 0;
console.log(`  ℹ️  auth.users: ${authCount} | public.users: ${pubCount}`);
if (Math.abs(authCount - pubCount) <= 2) {
  console.log(`  ✅ Trigger on_auth_user_created : sync OK`);
} else {
  console.log(`  ⚠️  Différence auth/public : ${authCount - pubCount} (migration en cours ou trigger KO)`);
}

// ─── 5. RLS check (lecture sans auth doit être bloquée sur users) ─
console.log('\n── 5. RLS — TEST ACCÈS ANON ─────────────────────────────────');
// Parse anon key from main .env
const mainEnv = parseEnv('.env');
const ANON_KEY = mainEnv.VITE_SUPABASE_ANON_KEY || mainEnv.SUPABASE_ANON_KEY;

if (ANON_KEY) {
  const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false }
  });

  // users table should be blocked for anon
  const { data: usersAnon, error: usersAnonErr } = await anonClient
    .from('users').select('id, email').limit(3);
  if (usersAnonErr || !usersAnon?.length) {
    console.log(`  ✅ users           — bloqué anon (RLS OK)`);
  } else {
    console.log(`  ❌ users           — accessible anon ! (${usersAnon.length} lignes) RLS KO`);
  }

  // artworks should be readable by anon (public)
  const { data: artworksAnon, error: artworksAnonErr } = await anonClient
    .from('artworks').select('id').limit(3);
  if (!artworksAnonErr && artworksAnon?.length > 0) {
    console.log(`  ✅ artworks        — lisible anon (RLS OK — public read)`);
  } else {
    console.log(`  ⚠️  artworks       — ${artworksAnonErr?.message ?? 'aucune donnée'}`);
  }

  // transactions should be blocked
  const { data: txAnon, error: txAnonErr } = await anonClient
    .from('transactions').select('id').limit(3);
  if (txAnonErr || !txAnon?.length) {
    console.log(`  ✅ transactions    — bloqué anon (RLS OK)`);
  } else {
    console.log(`  ❌ transactions    — accessible anon ! RLS KO`);
  }
} else {
  console.log(`  ⚠️  ANON_KEY manquant dans .env — test ignoré`);
}

// ─── 6. Migrations status ────────────────────────────────────
console.log('\n── 6. MIGRATIONS ────────────────────────────────────────────');
const migrationFiles = ['001_initial_schema', '002_rls_policies', '003_migration_additions', '004_indexes_and_security'];
// Check via supabase_migrations table if it exists
let migData = null, migErr = null;
try {
  const res = await supabase.from('schema_migrations').select('version');
  migData = res.data;
  migErr = res.error;
} catch { migErr = 'catch'; }

if (migErr) {
  console.log(`  ℹ️  Migration tracking non disponible via API`);
  console.log(`  ℹ️  Fichiers locaux : ${migrationFiles.join(', ')}`);
  console.log(`  ℹ️  Vérifier dans Dashboard → Database → Migrations`);
} else {
  console.log(`  ✅ Migrations appliquées: ${migData?.length ?? 0}`);
}

// ─── 7. Deep Audit URLs images artworks ─────────────────────
console.log('\n── 7. DEEP AUDIT — IMAGES ARTWORKS ─────────────────────────');

// Récupère toutes les œuvres + artiste associé
// Pagination manuelle par blocs de 500
const PAGE = 500;
let allArtworkRows = [];
let pageIdx = 0;
while (true) {
  const { data: chunk, error: chunkErr } = await supabase
    .from('artworks')
    .select('id, title, image, artist_id, status')
    .range(pageIdx * PAGE, (pageIdx + 1) * PAGE - 1);
  if (chunkErr) { console.log(`  ❌ Erreur fetch artworks p${pageIdx}: ${chunkErr.message}`); break; }
  if (!chunk || chunk.length === 0) break;
  allArtworkRows = allArtworkRows.concat(chunk);
  if (chunk.length < PAGE) break;
  pageIdx++;
}

// Lookup artistes séparé (table légère)
const artistMap = {};
const { data: allArtists } = await supabase.from('artists').select('id, name');
(allArtists ?? []).forEach(a => { artistMap[a.id] = a.name; });

const finalList = allArtworkRows.map(a => ({
  ...a,
  artistName: artistMap[a.artist_id] ?? '(artiste inconnu)',
}));

if (!finalList || finalList.length === 0) {
  console.log('  ℹ️  Aucune œuvre trouvée');
} else {
  const total = finalList.length;

  // ── Classement des URLs ──────────────────────────────────────
  const groups = { supabase: [], cloudinary: [], vps: [], empty: [], other: [] };
  for (const a of finalList) {
    if (!a.image)                               groups.empty.push(a);
    else if (a.image.includes('.supabase.co'))  groups.supabase.push(a);
    else if (a.image.includes('cloudinary.com'))groups.cloudinary.push(a);
    else if (a.image.includes('backend.kucibok'))groups.vps.push(a);
    else                                         groups.other.push(a);
  }

  const pct = (n) => `${((n / total) * 100).toFixed(1)}%`;
  console.log(`\n  RÉPARTITION (${total} œuvres analysées)`);
  console.log(`  ${'─'.repeat(50)}`);
  console.log(`  ✅ Supabase Storage  : ${String(groups.supabase.length).padStart(4)}  (${pct(groups.supabase.length)})  — images affichées`);
  console.log(`  🔶 Cloudinary        : ${String(groups.cloudinary.length).padStart(4)}  (${pct(groups.cloudinary.length)})  — à migrer`);
  console.log(`  ❌ VPS mort          : ${String(groups.vps.length).padStart(4)}  (${pct(groups.vps.length)})  — images perdues`);
  console.log(`  ⬜ Vide / null       : ${String(groups.empty.length).padStart(4)}  (${pct(groups.empty.length)})  — jamais uploadée`);
  console.log(`  ❓ Autre domaine     : ${String(groups.other.length).padStart(4)}  (${pct(groups.other.length)})`);

  // ── Test connectivité Supabase (5 URLs aléatoires) ───────────
  console.log(`\n  TEST CONNECTIVITÉ — Supabase Storage (5 échantillons)`);
  console.log(`  ${'─'.repeat(50)}`);
  const supabaseSample = groups.supabase.sort(() => Math.random() - 0.5).slice(0, 5);
  let okCount = 0, failCount = 0;
  for (const a of supabaseSample) {
    try {
      const r = await fetch(a.image, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
      if (r.ok) { okCount++; console.log(`  ✅ ${r.status}  ${a.image.slice(0, 70)}…`); }
      else       { failCount++; console.log(`  ❌ ${r.status}  ${a.image.slice(0, 70)}…`); }
    } catch (e) {
      failCount++;
      console.log(`  ❌ ERR  ${String(e.message).slice(0, 60)}`);
    }
  }
  if (supabaseSample.length === 0) console.log('  ℹ️  Aucune URL Supabase à tester');
  else console.log(`\n  → ${okCount}/${supabaseSample.length} accessibles — ${failCount > 0 ? '⚠️  certaines URLs Supabase KO' : '✅ bucket public OK'}`);

  // ── Artistes les plus impactés (VPS mort) ────────────────────
  if (groups.vps.length > 0) {
    console.log(`\n  ARTISTES IMPACTÉS — images VPS perdues`);
    console.log(`  ${'─'.repeat(50)}`);
    const byArtist = {};
    for (const a of groups.vps) {
      const name = a.artistName ?? '(artiste inconnu)';
      const aid  = a.artist_id ?? 'no-id';
      if (!byArtist[aid]) byArtist[aid] = { name, count: 0, artworkIds: [] };
      byArtist[aid].count++;
      byArtist[aid].artworkIds.push(a.id);
    }
    const sorted = Object.entries(byArtist).sort((a, b) => b[1].count - a[1].count);
    sorted.slice(0, 15).forEach(([, v]) => {
      console.log(`  ❌ ${v.name.padEnd(35)} ${String(v.count).padStart(3)} œuvre(s) sans image`);
    });
    if (sorted.length > 15) console.log(`  … et ${sorted.length - 15} autre(s) artiste(s)`);
    console.log(`\n  Total artistes affectés : ${sorted.length}`);
  }

  // ── Œuvres "autres domaines" ─────────────────────────────────
  if (groups.other.length > 0) {
    console.log(`\n  URLs INCONNUES (domaine non reconnu)`);
    console.log(`  ${'─'.repeat(50)}`);
    const domains = {};
    for (const a of groups.other) {
      try { const d = new URL(a.image).hostname; domains[d] = (domains[d] || 0) + 1; } catch {}
    }
    Object.entries(domains).forEach(([d, n]) => console.log(`  ❓ ${d.padEnd(40)} ${n} œuvre(s)`));
  }

  // ── Répartition par statut des œuvres VPS ───────────────────
  if (groups.vps.length > 0) {
    const byStatus = {};
    for (const a of groups.vps) {
      byStatus[a.status ?? 'unknown'] = (byStatus[a.status ?? 'unknown'] || 0) + 1;
    }
    console.log(`\n  STATUT des ${groups.vps.length} œuvres VPS`);
    console.log(`  ${'─'.repeat(50)}`);
    Object.entries(byStatus).sort((a,b) => b[1]-a[1]).forEach(([s, n]) => {
      const icon = s === 'approved' ? '✅' : s === 'pending' ? '⏳' : '❌';
      console.log(`  ${icon} ${s.padEnd(15)} ${n}`);
    });
  }
}

// ─── RÉSUMÉ ──────────────────────────────────────────────────
console.log(`\n${'═'.repeat(60)}`);
console.log(`  RÉSUMÉ`);
console.log(`${'═'.repeat(60)}`);
console.log(`  Vérifications à faire manuellement dans Supabase Dashboard :`);
console.log(`  → Auth → Providers : Email + Google activés ?`);
console.log(`  → Auth → SMTP : Resend configuré ?`);
console.log(`  → Auth → URL Config : Site URL + Redirects ?`);
console.log(`  → Auth → Email Templates : Confirm + Reset personnalisés ?`);
console.log(`  → Auth → Sessions : JWT expiry + Refresh rotation ?`);
console.log(`  → Storage → Policies : policies définies sur chaque bucket ?`);
console.log(`${'═'.repeat(60)}\n`);
