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

// ─── 7. Audit URLs images artworks ──────────────────────────
console.log('\n── 7. IMAGES ARTWORKS — ÉTAT DES URLs ───────────────────────');
const { data: artworkImages } = await supabase
  .from('artworks')
  .select('id, title, image')
  .limit(1000);

if (!artworkImages || artworkImages.length === 0) {
  console.log('  ℹ️  Aucune œuvre trouvée');
} else {
  let nullCount = 0, supabaseCount = 0, cloudinaryCount = 0, vpsCount = 0, otherCount = 0;
  const brokenSamples = [];

  for (const a of artworkImages) {
    if (!a.image) { nullCount++; continue; }
    if (a.image.includes('.supabase.co/storage')) supabaseCount++;
    else if (a.image.includes('cloudinary.com'))   cloudinaryCount++;
    else if (a.image.includes('backend.kucibok'))  { vpsCount++; if (brokenSamples.length < 3) brokenSamples.push(a.image); }
    else { otherCount++; if (brokenSamples.length < 3) brokenSamples.push(a.image); }
  }

  const total = artworkImages.length;
  console.log(`  Total analysé  : ${total} œuvres`);
  console.log(`  ✅ Supabase    : ${supabaseCount} (URLs en ordre)`);
  console.log(`  🔶 Cloudinary  : ${cloudinaryCount} (à migrer → node scripts/migrate_cloudinary.js)`);
  console.log(`  ❌ VPS mort    : ${vpsCount} (backend.kucibok.com expiré — images perdues)`);
  console.log(`  ⬜ Null/vide   : ${nullCount}`);
  console.log(`  ℹ️  Autres     : ${otherCount}`);
  if (brokenSamples.length) {
    console.log(`\n  Exemples d'URLs non-Supabase :`);
    brokenSamples.forEach(u => console.log(`    ${u}`));
  }

  // Test de connectivité sur une URL Supabase Storage (si présente)
  const supabaseSample = artworkImages.find(a => a.image?.includes('.supabase.co/storage'));
  if (supabaseSample) {
    try {
      const r = await fetch(supabaseSample.image, { method: 'HEAD' });
      if (r.ok) console.log(`\n  ✅ Bucket public OK  — ${r.status} sur ${supabaseSample.image.slice(0, 80)}…`);
      else      console.log(`\n  ❌ Bucket inaccessible — ${r.status} sur ${supabaseSample.image.slice(0, 80)}…`);
    } catch (e) {
      console.log(`\n  ❌ Fetch échoué : ${e.message}`);
    }
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
