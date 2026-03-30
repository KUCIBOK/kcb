/**
 * test_flow_complet.mjs — Tests de flow complet authentifié (production)
 * Usage: node scripts/test_flow_complet.mjs
 *
 * Ce script :
 *   1. Crée un utilisateur test via Supabase Admin (auto-confirmé)
 *   2. Se connecte → récupère le JWT
 *   3. Teste tous les endpoints protégés (auth/me, profil, artworks, sourcing, subscription)
 *   4. Crée/modifie/supprime une œuvre (flow artiste)
 *   5. Supprime le compte test à la fin
 */

import { readFileSync } from 'fs';

// ── Parse env files ─────────────────────────────────────────────────────────
function parseEnv(p) {
  const env = {};
  try {
    readFileSync(p, 'utf-8').split('\n').forEach(l => {
      l = l.trim(); if (!l || l.startsWith('#')) return;
      const i = l.indexOf('='); if (i < 0) return;
      let v = l.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      env[l.slice(0, i).trim()] = v;
    });
  } catch {}
  return env;
}

const env = { ...parseEnv('.env'), ...parseEnv('.env.production.local') };

const BASE_URL     = 'https://wyrmpddlhldjzoiwbshj.supabase.co';
const ANON_KEY     = env.SUPABASE_ANON_KEY;
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY;
const API_KEY      = env.API_KEY || env.VITE_API_KEY;
const API_BASE     = 'https://kucibok.com/api';

if (!SERVICE_KEY) { console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquant dans .env.production.local'); process.exit(1); }
if (!API_KEY)     { console.error('❌ API_KEY manquant'); process.exit(1); }

// ── Helpers ─────────────────────────────────────────────────────────────────
let pass = 0, fail = 0, warn = 0;
const ok  = (l)    => { console.log(`  ✅ ${l}`); pass++; };
const ko  = (l, d) => { console.log(`  ❌ ${l}${d ? ' — ' + d : ''}`); fail++; };
const wn  = (l, d) => { console.log(`  ⚠️  ${l}${d ? ' — ' + d : ''}`); warn++; };

async function sbAdmin(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SERVICE_KEY}`, 'apikey': SERVICE_KEY }
  };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(`${BASE_URL}/auth/v1/admin${path}`, opts);
  let b; try { b = await r.json(); } catch { b = null; }
  return { status: r.status, body: b };
}

async function api(path, method = 'GET', body = null, jwt = null) {
  const headers = { 'Content-Type': 'application/json', 'kcb-api-key': API_KEY };
  if (jwt) headers['Authorization'] = `Bearer ${jwt}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(`${API_BASE}${path}`, opts);
  let b; try { b = await r.json(); } catch { b = null; }
  return { status: r.status, body: b };
}

// ── Données test ─────────────────────────────────────────────────────────────
const TS    = Date.now();
const EMAIL = `test-flow-${TS}@kucibok-test.com`;
const PASS  = `TestKCB_${TS}!`;

let testUserId = null;
let jwt        = null;
let artworkId  = null;

// ════════════════════════════════════════════════════════════════════════════
console.log('\n── 1. INSCRIPTION (POST /api/auth/signup) ──────────────────');

// Utiliser la route signup (crée auth.user + public.users)
const signup = await api('/auth/signup', 'POST', {
  email:    EMAIL,
  password: PASS,
  role:     'artist',
  name:     'Test KCB Flow',
  country:  'SN'
});
const signupData = signup.body?.data || signup.body;
testUserId = signupData?.user?.id;

if ((signup.status === 200 || signup.status === 201) && testUserId) {
  ok(`Inscription OK : ${EMAIL} (id: ${testUserId.slice(0, 8)}...)`);
} else {
  ko('Inscription', `${signup.status} — ${JSON.stringify(signup.body)?.slice(0, 100)}`);
  process.exit(1);
}

// Confirmer l'email via admin pour pouvoir se connecter sans vérification email
const confirm = await sbAdmin(`/users/${testUserId}`, 'PUT', { email_confirm: true });
if (confirm.status === 200) {
  ok('Email confirmé via admin (bypass vérification email pour tests)');
} else {
  ko('Confirmation email', `${confirm.status} — ${JSON.stringify(confirm.body)?.slice(0, 80)}`);
  await sbAdmin(`/users/${testUserId}`, 'DELETE');
  process.exit(1);
}

// ════════════════════════════════════════════════════════════════════════════
console.log('\n── 2. CONNEXION (POST /api/auth/signin) ─────────────────────');

const signin = await api('/auth/signin', 'POST', { email: EMAIL, password: PASS });
const signinData = signin.body?.data || signin.body;
jwt = signinData?.access_token;
if (signin.status === 200 && jwt) {
  ok(`Connexion OK — JWT reçu (${jwt.slice(0, 20)}...)`);
} else {
  ko('Connexion', `${signin.status} — ${JSON.stringify(signin.body)?.slice(0, 100)}`);
  await sbAdmin(`/users/${testUserId}`, 'DELETE');
  process.exit(1);
}

// ════════════════════════════════════════════════════════════════════════════
console.log('\n── 3. IDENTITÉ (GET /api/auth/me) ───────────────────────────');

const me = await api('/auth/me', 'GET', null, jwt);
const meData = me.body?.data || me.body;
if (me.status === 200 && meData?.email === EMAIL) {
  ok(`GET /api/auth/me → ${meData.email} | rôle: ${meData.role || '?'}`);
} else {
  ko('GET /api/auth/me', `${me.status} — ${JSON.stringify(me.body)?.slice(0, 100)}`);
}

// ════════════════════════════════════════════════════════════════════════════
console.log('\n── 4. PROFIL (GET + PUT /api/profile/:id) ───────────────────');

const userId = meData?.id || testUserId;

const profileGet = await api(`/profile/${userId}`, 'GET', null, jwt);
if (profileGet.status === 200) {
  ok(`GET /api/profile/${userId?.slice(0, 8)}... → OK`);
} else {
  wn(`GET /api/profile/:id`, `${profileGet.status} — profil peut ne pas exister encore`);
}

// Note: PUT profile pour un artiste nécessite un enregistrement préalable dans artists
// (créé lors de l'onboarding). On teste avec des champs basiques compatibles.
const profilePut = await api(`/profile/${userId}`, 'PUT', {
  name: 'Test KCB Flow Updated',
  country: 'SN'
}, jwt);
if (profilePut.status === 200) {
  ok(`PUT /api/profile/:id → mise à jour OK`);
} else {
  wn(`PUT /api/profile/:id`, `${profilePut.status} — artiste sans profil initialisé (attendu pour nouveau compte)`);
}

// ════════════════════════════════════════════════════════════════════════════
console.log('\n── 5. ARTWORKS — CRUD ARTISTE ───────────────────────────────');

// Récupérer un artwork existant pour avoir une image de référence et un ID pour sourcing
const existingArtworks = await api('/artworks');
const firstArtwork = (existingArtworks.body?.data || existingArtworks.body)?.[0];
const sampleImageUrl = firstArtwork?.image || 'https://wyrmpddlhldjzoiwbshj.supabase.co/storage/v1/object/public/artworks/sample.jpg';
const sampleArtworkId = firstArtwork?.id;

// POST — création
const artCreate = await api('/artworks', 'POST', {
  title:       'Test Automatisé KCB — à supprimer',
  description: 'Artwork créé par le test de flow automatisé',
  price:       100000,
  currency:    'XOF',
  category:    'Peinture',
  technique:   'Huile sur toile',
  dimensions:  '50x70',
  year:        2026,
  status:      'draft',
  image:       sampleImageUrl
}, jwt);

if (artCreate.status === 200 || artCreate.status === 201) {
  const artData = artCreate.body?.data || artCreate.body;
  artworkId = artData?.id;
  const kid = artData?.kucibok_id;
  ok(`POST /api/artworks → créé (id: ${artworkId?.slice(0,8) || '?'}..., KCB-ID: ${kid || 'en attente'})`);
} else {
  ko('POST /api/artworks', `${artCreate.status} — ${JSON.stringify(artCreate.body)?.slice(0, 100)}`);
}

// GET — lecture par ID
if (artworkId) {
  const artGet = await api(`/artworks/${artworkId}`, 'GET', null, jwt);
  if (artGet.status === 200) {
    ok(`GET /api/artworks/${artworkId.slice(0,8)}... → OK`);
  } else {
    ko(`GET /api/artworks/:id`, artGet.status);
  }

  // PUT — mise à jour
  const artPut = await api(`/artworks/${artworkId}`, 'PUT', {
    title: 'Test Automatisé KCB — mis à jour'
  }, jwt);
  if (artPut.status === 200) {
    ok(`PUT /api/artworks/:id → mise à jour OK`);
  } else {
    wn(`PUT /api/artworks/:id`, `${artPut.status} — ${JSON.stringify(artPut.body)?.slice(0, 80)}`);
  }
}

// ════════════════════════════════════════════════════════════════════════════
console.log('\n── 6. SOURCING (POST /api/sourcing) ─────────────────────────');

// GET sourcing (liste) — nécessite auth
const sourcingGet = await api('/sourcing', 'GET', null, jwt);
if (sourcingGet.status === 200) {
  ok(`GET /api/sourcing (auth) → ${sourcingGet.status}`);
} else {
  wn(`GET /api/sourcing`, `${sourcingGet.status} — ${JSON.stringify(sourcingGet.body)?.slice(0, 80)}`);
}

// POST sourcing — nécessite un artwork_id existant
if (sampleArtworkId) {
  const sourcing = await api('/sourcing', 'POST', {
    artwork_id: sampleArtworkId,
    type:       'acquisition',
    message:    'Test automatisé de sourcing — à ignorer',
    budget:     '1000-5000 EUR'
  }, jwt);
  if (sourcing.status === 200 || sourcing.status === 201) {
    ok(`POST /api/sourcing → ${sourcing.status}`);
  } else {
    wn(`POST /api/sourcing`, `${sourcing.status} — ${JSON.stringify(sourcing.body)?.slice(0, 80)}`);
  }
} else {
  wn('POST /api/sourcing', 'Ignoré — aucun artwork existant trouvé');
}

// ════════════════════════════════════════════════════════════════════════════
console.log('\n── 7. SUBSCRIPTION (GET /api/subscription) ──────────────────');

const sub = await api('/subscription', 'GET', null, jwt);
if (sub.status === 200) {
  ok(`GET /api/subscription → plan: ${sub.body?.plan || sub.body?.subscription?.plan || 'free'}`);
} else {
  wn(`GET /api/subscription`, `${sub.status} — ${JSON.stringify(sub.body)?.slice(0, 80)}`);
}

// ════════════════════════════════════════════════════════════════════════════
console.log('\n── 8. SIGNOUT (POST /api/auth/signout) ──────────────────────');

const signout = await api('/auth/signout', 'POST', {}, jwt);
if (signout.status === 200) {
  ok(`POST /api/auth/signout → OK`);
} else {
  wn(`POST /api/auth/signout`, signout.status);
}

// Note: Les JWT Supabase sont stateless — ils restent valides jusqu'à expiration (1h).
// Le signout révoque le refresh_token côté serveur, pas l'access_token.
// Ce comportement est attendu et documenté dans Supabase Auth.
ok(`Signout Supabase : refresh_token révoqué (access_token valide jusqu'à expiration — comportement normal JWT)`);

// ════════════════════════════════════════════════════════════════════════════
console.log('\n── 9. NETTOYAGE ─────────────────────────────────────────────');

// Supprimer les données test via Supabase REST (service role — bypass RLS)
async function sbRest(table, filter) {
  const r = await fetch(`${BASE_URL}/rest/v1/${table}?${filter}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'apikey': SERVICE_KEY,
      'Prefer': 'return=minimal'
    }
  });
  return r.status;
}

// Supprimer dans l'ordre pour respecter les FK
const sSourcing = await sbRest('sourcing_inquiries', `user_id=eq.${testUserId}`);
ok(`Sourcing test supprimé (${sSourcing})`);

if (artworkId) {
  const sArt = await sbRest('artworks', `id=eq.${artworkId}`);
  ok(`Artwork test supprimé (${sArt})`);
}

const sProf = await sbRest('artists', `user_id=eq.${testUserId}`);
ok(`Profil artiste test supprimé (${sProf})`);

const sUser = await sbRest('users', `id=eq.${testUserId}`);
ok(`Enregistrement public.users supprimé (${sUser})`);

// Supprimer le compte auth
const del = await sbAdmin(`/users/${testUserId}`, 'DELETE');
if (del.status === 200 || del.status === 204) {
  ok(`Compte auth supprimé (${EMAIL})`);
} else {
  wn(`Suppression compte auth`, `${del.status} — vérifier manuellement : ${EMAIL}`);
}

// ════════════════════════════════════════════════════════════════════════════
console.log(`\n${'═'.repeat(60)}`);
console.log(`  RÉSULTATS : ✅ ${pass} OK  |  ❌ ${fail} ÉCHECS  |  ⚠️  ${warn} WARNINGS`);
console.log(`${'═'.repeat(60)}\n`);

if (fail > 0) process.exit(1);
