/**
 * api/[...path].js — Catch-all Vercel Function
 *
 * Route toutes les requêtes /api/* depuis une seule fonction
 * (Vercel Hobby plan : limite de 12 fonctions — cette approche en utilise 1).
 *
 * Routing par segments d'URL :
 *   /api/<s0>/<s1>/<s2>
 *
 * Routes disponibles :
 *   GET  /api/health
 *   POST /api/report-error
 *   POST /api/auth/signup
 *   POST /api/auth/signin
 *   POST /api/auth/signout
 *   GET  /api/auth/me
 *   POST /api/auth/forgot-password
 *   POST /api/auth/reset-password
 *   POST /api/auth/change-password
 *   POST /api/auth/google-callback
 *   POST /api/auth/send-access
 *   GET  /api/artworks
 *   POST /api/artworks
 *   GET  /api/artworks/:id
 *   PUT  /api/artworks/:id
 *   PATCH /api/artworks/:id
 *   DELETE /api/artworks/:id
 *   GET  /api/artworks/verify/:kucibok_id
 *   GET  /api/artist
 *   POST /api/artist
 *   GET  /api/artist/:id
 *   PUT  /api/artist/:id
 *   GET  /api/blog
 *   POST /api/blog
 *   GET  /api/categories
 *   POST /api/categories
 *   GET  /api/plans
 *   POST /api/plans
 *   GET  /api/delivery
 *   POST /api/delivery
 *   GET  /api/delivery/track/:tracking_id
 *   GET  /api/log
 *   POST /api/log
 *   POST /api/payments/paydunya-init
 *   POST /api/payments/paydunya-callback
 *   GET  /api/subscription
 *   POST /api/subscription
 *   GET  /api/sourcing
 *   POST /api/sourcing
 *   POST /api/campaigns/send
 *   POST /api/certificates/generate
 *   GET  /api/profile/:id
 *   PUT  /api/profile/:id
 *
 * @module api/[...path]
 */

import { createClient } from '@supabase/supabase-js';
import { randomBytes }  from 'crypto';
import { readFileSync } from 'fs';
import { join }         from 'path';

// ─── Validation des variables d'environnement ────────────────────────────────

const REQUIRED_ENV = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'API_KEY',
  'CORS_ORIGIN',
  'RESEND_API_KEY',
  'ADMIN_EMAIL',
  'PAYDUNYA_MASTER_KEY',
  'PAYDUNYA_PRIVATE_KEY',
  'PAYDUNYA_TOKEN',
];

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    throw new Error(`[API] Variable d'environnement manquante : ${key}`);
  }
}

if (process.env.CORS_ORIGIN === '*') {
  throw new Error('[API] CORS_ORIGIN ne peut pas être un wildcard (*).');
}

// ─── Supabase Admin Client ────────────────────────────────────────────────────

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

// ─── Response Helpers ─────────────────────────────────────────────────────────

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://kucibok.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':      CORS_ORIGIN,
  'Access-Control-Allow-Methods':     'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':     'Content-Type, Authorization, kcb-api-key',
  'Access-Control-Allow-Credentials': 'true',
};

/**
 * Applique les headers CORS sur la réponse.
 *
 * @param {import('@vercel/node').VercelResponse} res
 */
function setCors(res) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
}

/**
 * Gère les requêtes OPTIONS (preflight CORS).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 * @returns {boolean} true si preflight (le handler doit return immédiatement)
 */
function handleCors(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return true; }
  return false;
}

/**
 * Réponse de succès.
 *
 * @param {import('@vercel/node').VercelResponse} res
 * @param {*}      data
 * @param {number} [status=200]
 * @param {{ page?: number, limit?: number, total?: number }} [pagination]
 */
function ok(res, data, status = 200, pagination) {
  setCors(res);
  const body = { data };
  if (pagination) body.pagination = pagination;
  return res.status(status).json(body);
}

/**
 * Réponse d'erreur.
 *
 * @param {import('@vercel/node').VercelResponse} res
 * @param {string} message
 * @param {number} [status=400]
 */
function fail(res, message, status = 400) {
  setCors(res);
  return res.status(status).json({ error: message });
}

/**
 * Réponse 404.
 *
 * @param {import('@vercel/node').VercelResponse} res
 * @param {string} [entity='Ressource']
 */
const notFound = (res, entity = 'Ressource') => fail(res, `${entity} introuvable`, 404);

/**
 * Réponse 500.
 *
 * @param {import('@vercel/node').VercelResponse} res
 * @param {Error} err
 */
const serverError = (res, err) => {
  console.error('[API ERROR]', err?.message ?? err);
  return fail(res, 'Erreur serveur interne', 500);
};

/**
 * Parse la pagination depuis les query params.
 *
 * @param {import('@vercel/node').VercelRequest} req
 * @returns {{ page: number, limit: number, from: number, to: number }}
 */
function parsePagination(req) {
  const page  = Math.max(1, parseInt(req.query.page  ?? '1',  10));
  const limit = Math.min(1000, Math.max(1, parseInt(req.query.limit ?? '20', 10)));
  const from  = (page - 1) * limit;
  const to    = from + limit - 1;
  return { page, limit, from, to };
}

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

/**
 * Extrait et vérifie le Bearer token depuis le header Authorization.
 *
 * @param {import('@vercel/node').VercelRequest} req
 * @returns {Promise<{ user: object } | { error: string, status: number }>}
 */
async function requireAuth(req) {
  const authHeader = req.headers.authorization ?? '';
  const token      = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return { error: 'Token manquant', status: 401 };

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return { error: 'Token invalide ou expiré', status: 401 };
  return { user };
}

/**
 * Vérifie que l'utilisateur possède l'un des rôles requis.
 * Lit le rôle depuis public.users (source de vérité DB) et non user_metadata (spoofable).
 *
 * @param {object}   user  - Utilisateur Supabase
 * @param {string[]} roles - Rôles autorisés
 * @returns {Promise<{ ok: true, role: string } | { error: string, status: number }>}
 */
async function requireRole(user, roles) {
  const { data: dbUser, error } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const userRole = dbUser?.role ?? user.user_metadata?.role ?? 'collector';
  if (error || !roles.includes(userRole)) {
    return { error: `Accès refusé. Rôle requis : ${roles.join(' ou ')}`, status: 403 };
  }
  return { ok: true, role: userRole };
}

/**
 * Vérifie que l'utilisateur est admin.
 *
 * @param {object} user
 * @returns {{ ok: true } | { error: string, status: number }}
 */
const requireAdmin = async (user) => requireRole(user, ['admin']);

/**
 * Vérifie que l'utilisateur est professional ou admin.
 *
 * @param {object} user
 * @returns {{ ok: true } | { error: string, status: number }}
 */
const requirePro = async (user) => requireRole(user, ['professional', 'admin']);

/**
 * Récupère le rôle d'un utilisateur depuis la DB (source de vérité).
 *
 * @param {string} userId
 * @returns {Promise<string>}
 */
async function getDbRole(userId) {
  const { data } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  return data?.role ?? 'collector';
}

/**
 * Vérifie la clé API interne (header kcb-api-key).
 *
 * @param {import('@vercel/node').VercelRequest} req
 * @returns {{ ok: true } | { error: string, status: number }}
 */
function requireApiKey(req) {
  const apiKey = req.headers['kcb-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return { error: 'Clé API invalide', status: 401 };
  }
  return { ok: true };
}

// ─── Main Router ──────────────────────────────────────────────────────────────

/**
 * Point d'entrée unique — route toutes les requêtes /api/*.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  // Extraire les segments depuis req.url (ex: /api/artworks/verify/KCB-001?foo=bar)
  // req.query.path n'est pas toujours peuplé dans les Vercel Functions non-Next.js
  const rawPath = req.url?.split('?')[0] ?? '';
  // Supprimer le préfixe /api/ et découper en segments
  const segments = rawPath.replace(/^\/api\/?/, '').split('/').filter(Boolean);
  const [s0, s1, s2] = segments;

  try {
    // ── Routes entièrement publiques (pas de clé API requise) ─────────────────
    if (s0 === 'health') return await routeHealth(req, res);

    // QR code et tracking publics — accessibles sans authentification
    if (s0 === 'artworks' && s1 === 'verify' && s2) return await routeVerifyArtwork(req, res, s2);
    if (s0 === 'delivery' && s1 === 'track'  && s2) return await routeTrackDelivery(req, res, s2);

    // Clé API obligatoire pour toutes les routes suivantes
    const apiKeyCheck = requireApiKey(req);
    if (!apiKeyCheck.ok) return fail(res, apiKeyCheck.error, apiKeyCheck.status);

    // ── /api/report-error ────────────────────────────────────────────────────
    if (s0 === 'report-error') return await routeReportError(req, res);

    // ── /api/auth/* ──────────────────────────────────────────────────────────
    if (s0 === 'auth') return await routeAuth(req, res, s1);

    // ── /api/artworks/:id ────────────────────────────────────────────────────
    if (s0 === 'artworks' && s1) return await routeArtworkById(req, res, s1);

    // ── /api/artworks ────────────────────────────────────────────────────────
    if (s0 === 'artworks') return await routeArtworks(req, res);

    // ── /api/artist/:id ──────────────────────────────────────────────────────
    if (s0 === 'artist' && s1) return await routeArtistById(req, res, s1);

    // ── /api/artist ──────────────────────────────────────────────────────────
    if (s0 === 'artist') return await routeArtists(req, res);

    // ── /api/blog ────────────────────────────────────────────────────────────
    if (s0 === 'blog') return await routeBlog(req, res);

    // ── /api/categories (+ alias /api/category) ──────────────────────────────
    if (s0 === 'categories' || s0 === 'category') return await routeCategories(req, res);

    // ── /api/plans (+ alias /api/plan) ───────────────────────────────────────
    if (s0 === 'plans' || s0 === 'plan') return await routePlans(req, res);

    // ── /api/visitor/visit-time ───────────────────────────────────────────────
    if (s0 === 'visitor' && s1 === 'visit-time') return await routeVisitorVisitTime(req, res);

    // ── /api/visitor ──────────────────────────────────────────────────────────
    if (s0 === 'visitor') return await routeVisitor(req, res);

    // ── /api/numerisation/:id/status ─────────────────────────────────────────
    if (s0 === 'numerisation' && s1 && s2 === 'status') return await routeNumerisationStatus(req, res, s1);

    // ── /api/numerisation/my ─────────────────────────────────────────────────
    if (s0 === 'numerisation' && s1 === 'my') return await routeNumerisationMy(req, res);

    // ── /api/numerisation/:id ────────────────────────────────────────────────
    if (s0 === 'numerisation' && s1) return await routeNumerisationById(req, res, s1);

    // ── /api/numerisation ────────────────────────────────────────────────────
    if (s0 === 'numerisation') return await routeNumerisation(req, res);

    // ── /api/delivery/:id ────────────────────────────────────────────────────
    if (s0 === 'delivery' && s1) return await routeDeliveryById(req, res, s1);

    // ── /api/delivery ────────────────────────────────────────────────────────
    if (s0 === 'delivery') return await routeDelivery(req, res);

    // ── /api/log ─────────────────────────────────────────────────────────────
    if (s0 === 'log') return await routeLog(req, res);

    // ── /api/payments/paydunya-init ──────────────────────────────────────────
    if (s0 === 'payments' && s1 === 'paydunya-init') return await routePaydunyaInit(req, res);

    // ── /api/payments/paydunya-callback ──────────────────────────────────────
    if (s0 === 'payments' && s1 === 'paydunya-callback') return await routePaydunyaCallback(req, res);

    // ── /api/subscription ────────────────────────────────────────────────────
    if (s0 === 'subscription') return await routeSubscription(req, res);

    // ── /api/sourcing ────────────────────────────────────────────────────────
    if (s0 === 'sourcing') return await routeSourcing(req, res);

    // ── /api/campaigns/send ──────────────────────────────────────────────────
    if (s0 === 'campaigns' && s1 === 'send') return await routeCampaignSend(req, res);

    // ── /api/certificates/generate ───────────────────────────────────────────
    if (s0 === 'certificates' && s1 === 'generate') return await routeCertificateGenerate(req, res);

    // ── /api/profile/:id ─────────────────────────────────────────────────────
    if (s0 === 'profile' && s1) return await routeProfile(req, res, s1);

    // ── /api/galleries/import ────────────────────────────────────────────────
    if (s0 === 'galleries' && s1 === 'import') return await routeGalleriesImport(req, res);

    // ── /api/galleries ───────────────────────────────────────────────────────
    if (s0 === 'galleries') return await routeGalleries(req, res);

    // ── /api/clients/* ───────────────────────────────────────────────────────
    if (s0 === 'clients') return await routeClients(req, res, s1, s2);

    // ── /api/collection ──────────────────────────────────────────────────────
    if (s0 === 'collection') return await routeCollection(req, res);

    return fail(res, 'Route introuvable', 404);
  } catch (err) {
    return serverError(res, err);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/health — Healthcheck (teste la connexion Supabase).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routeHealth(req, res) {
  let dbOk = false;
  try {
    const { error } = await supabaseAdmin.from('categories').select('id').limit(1);
    dbOk = !error;
  } catch { dbOk = false; }

  const status = dbOk ? 200 : 503;
  return res.status(status).json({
    status:    dbOk ? 'ok' : 'degraded',
    supabase:  dbOk,
    database:  dbOk ? 'supabase_ok' : 'supabase_error',
    timestamp: new Date().toISOString(),
    version:   '2.0.0-supabase',
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// REPORT ERROR
// ═══════════════════════════════════════════════════════════════════════════════

const ALERT_EMAIL = process.env.ALERT_RECEIVER ?? process.env.ADMIN_EMAIL;

/**
 * POST /api/report-error — Envoie une alerte email admin en cas d'erreur critique.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routeReportError(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const { message, stack, url, userAgent } = req.body ?? {};
  if (!message) return fail(res, 'message requis');

  // Sanitize les inputs pour éviter les injections HTML
  const esc = (s) => String(s ?? 'N/A').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from:    ALERT_EMAIL,
    to:      ALERT_EMAIL,
    subject: '[Kucibok] Erreur critique signalée',
    html: `
      <h2>Erreur critique — Kucibok</h2>
      <p><strong>Message :</strong> ${esc(message)}</p>
      <p><strong>URL :</strong> ${esc(url)}</p>
      <p><strong>User Agent :</strong> ${esc(userAgent)}</p>
      <pre>${esc(stack)}</pre>
      <p><em>${new Date().toISOString()}</em></p>
    `,
  });

  return ok(res, { reported: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════════

const BASE_URL = process.env.CORS_ORIGIN ?? 'https://kucibok.com';

/**
 * Route les sous-chemins /api/auth/*.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 * @param {string} action - s1 (signup, signin, signout, me, …)
 */
async function routeAuth(req, res, action) {
  // GET|PUT /api/auth/:uuid — lookup ou mise à jour utilisateur par ID
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (action && UUID_RE.test(action)) {
    if (req.method === 'GET') return await authGetById(req, res, action);
    if (req.method === 'PUT') return await authUpdateById(req, res, action);
  }

  switch (action) {
    case 'signup':          return await authSignup(req, res);
    case 'signin':          return await authSignin(req, res);
    case 'signout':         return await authSignout(req, res);
    case 'me':              return await authMe(req, res);
    case 'forgot-password': return await authForgotPassword(req, res);
    case 'reset-password':  return await authResetPassword(req, res);
    case 'change-password': return await authChangePassword(req, res);
    case 'google-callback': return await authGoogleCallback(req, res);
    case 'send-access':     return await authSendAccess(req, res);
    default:                return fail(res, 'Action auth inconnue', 404);
  }
}

/**
 * GET /api/auth/:id — Retourne un utilisateur par UUID (admin uniquement).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 * @param {string} id - UUID utilisateur
 */
async function authGetById(req, res, id) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const adminCheck = await requireAdmin(authResult.user);
  if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);
  if (error || !data?.user) return notFound(res, 'Utilisateur');

  const u = data.user;
  return ok(res, {
    id:         u.id,
    email:      u.email,
    role:       u.user_metadata?.role,
    name:       u.user_metadata?.name,
    username:   u.user_metadata?.username,
    country:    u.user_metadata?.country,
    created_at: u.created_at,
    confirmed:  !!u.email_confirmed_at,
  });
}

/**
 * PUT /api/auth/:id — Met à jour les champs non-sensibles d'un utilisateur dans public.users.
 * L'utilisateur ne peut mettre à jour que son propre compte (sauf admin).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 * @param {string} id - UUID utilisateur
 */
async function authUpdateById(req, res, id) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const { user } = authResult;

  // Seul l'utilisateur lui-même ou un admin peut mettre à jour
  const { data: dbUser } = await supabaseAdmin.from('users').select('role').eq('id', user.id).single();
  const isAdmin = dbUser?.role === 'admin';
  if (user.id !== id && !isAdmin) return fail(res, 'Accès refusé', 403);

  // Whitelist stricte — le rôle ne peut jamais être modifié depuis cet endpoint
  const ALLOWED = ['name', 'username', 'country', 'image'];
  const updates = {};
  for (const key of ALLOWED) {
    if (req.body?.[key] !== undefined) updates[key] = req.body[key];
  }

  if (!Object.keys(updates).length) return fail(res, 'Aucun champ valide à mettre à jour');

  const { data, error } = await supabaseAdmin
    .from('users').update(updates).eq('id', id).select().single();

  if (error) return fail(res, error.message);

  return ok(res, { _id: data.id, ...data });
}

/**
 * POST /api/auth/signup — Inscription avec email/mot de passe.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function authSignup(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const { email, password, role, name, country, username } = req.body ?? {};

  if (!email || !password) return fail(res, 'Email et mot de passe requis');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(res, 'Format email invalide');
  if (!['collector', 'artist', 'professional'].includes(role)) {
    return fail(res, 'Rôle invalide. Valeurs acceptées : collector, artist, professional');
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm:  false,
    user_metadata:  { role, name: name ?? null, country: country ?? null, username: username ?? null },
  });

  if (error) return fail(res, error.message);

  // Créer l'entrée dans public.users (complète le trigger auth si présent)
  await supabaseAdmin.from('users').insert({
    id:           data.user.id,
    name:         name ?? null,
    role:         role ?? 'collector',
    country:      country ?? null,
    auth_provider: 'email',
    is_active:    true,
  }).then(null, () => {}); // ignorer si déjà créé par le trigger

  return ok(res, {
    user: {
      id:    data.user.id,
      email: data.user.email,
      role:  data.user.user_metadata?.role,
    },
  }, 201);
}

/**
 * POST /api/auth/signin — Connexion email/mot de passe.
 * Utilise le client Supabase avec la clé anon pour retourner un session token.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function authSignin(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const { email, password } = req.body ?? {};
  if (!email || !password) return fail(res, 'Email et mot de passe requis');

  // Client anon pour signIn (admin client n'a pas signInWithPassword)
  const supabaseAnon = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data, error } = await supabaseAnon.auth.signInWithPassword({ email, password });
  if (error) return fail(res, error.message, 401);

  return ok(res, {
    access_token:  data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at:    data.session.expires_at,
    user: {
      id:    data.user.id,
      email: data.user.email,
      role:  data.user.user_metadata?.role,
    },
  });
}

/**
 * POST /api/auth/signout — Déconnexion (révocation du token).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function authSignout(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);

  // Révoquer tous les tokens de refresh pour cet utilisateur
  await supabaseAdmin.auth.admin.signOut(authResult.user.id);

  return ok(res, { signedOut: true });
}

/**
 * GET /api/auth/me — Retourne l'utilisateur courant.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function authMe(req, res) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const { user } = authResult;
  const role = user.user_metadata?.role;

  // Récupérer le profil étendu selon le rôle (artiste → artists, autres → profiles)
  let profile = null;
  if (role === 'artist') {
    const { data } = await supabaseAdmin
      .from('artists')
      .select('id, name, username, image, country, biography, portfolio')
      .eq('user_id', user.id)
      .single();
    profile = data ?? null;
  } else {
    const { data } = await supabaseAdmin
      .from('profiles')
      .select('id, name, username, image, country, interests, institution')
      .eq('user_id', user.id)
      .single();
    profile = data ?? null;
  }

  return ok(res, {
    id:       user.id,
    email:    user.email,
    role,
    name:     profile?.name     ?? user.user_metadata?.name,
    username: profile?.username ?? user.user_metadata?.username,
    country:  profile?.country  ?? user.user_metadata?.country,
    profile,
  });
}

/**
 * POST /api/auth/forgot-password — Envoie un email de réinitialisation.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function authForgotPassword(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const { email } = req.body ?? {};
  if (!email) return fail(res, 'Email requis');

  const supabaseAnon = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { error } = await supabaseAnon.auth.resetPasswordForEmail(email, {
    redirectTo: `${BASE_URL}/reset-password`,
  });

  if (error) return fail(res, error.message);

  // Réponse toujours ok (ne pas révéler si l'email existe ou non)
  return ok(res, { sent: true });
}

/**
 * POST /api/auth/reset-password — Réinitialise le mot de passe (depuis le lien email).
 * Le frontend extrait l'access_token depuis l'URL et l'envoie en Authorization header.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function authResetPassword(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);

  const { password } = req.body ?? {};
  if (!password || password.length < 8) return fail(res, 'Mot de passe requis (min. 8 caractères)');

  const { error } = await supabaseAdmin.auth.admin.updateUserById(authResult.user.id, { password });
  if (error) return fail(res, error.message);

  return ok(res, { reset: true });
}

/**
 * POST /api/auth/change-password — Change le mot de passe (utilisateur connecté).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function authChangePassword(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);

  const { password } = req.body ?? {};
  if (!password || password.length < 8) return fail(res, 'Mot de passe requis (min. 8 caractères)');

  const { error } = await supabaseAdmin.auth.admin.updateUserById(authResult.user.id, { password });
  if (error) return fail(res, error.message);

  return ok(res, { changed: true });
}

/**
 * POST /api/auth/google-callback — Finalise la connexion Google OAuth.
 * Appelé après le premier login Google pour assigner un rôle.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function authGoogleCallback(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const { user } = authResult;

  // Vérifier le rôle depuis public.users (source de vérité DB)
  const { data: dbUser } = await supabaseAdmin
    .from('users').select('role').eq('id', user.id).single();

  const existingRole = dbUser?.role;

  // Utilisateur existant avec rôle — retourner directement
  if (existingRole && existingRole !== 'collector') {
    return ok(res, {
      needs_role_selection: false,
      user: { id: user.id, email: user.email, role: existingRole },
    });
  }

  // Nouvel utilisateur Google sans rôle — demander la sélection
  const { role } = req.body ?? {};
  if (!['collector', 'artist', 'professional'].includes(role)) {
    return ok(res, { needs_role_selection: true, user: { id: user.id, email: user.email } });
  }

  // Rôle fourni — assigner dans public.users ET user_metadata
  await supabaseAdmin.from('users').upsert({ id: user.id, role }, { onConflict: 'id' });

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, role },
  });

  if (error) return fail(res, error.message);

  return ok(res, {
    needs_role_selection: false,
    user: { id: data.user.id, email: data.user.email, role },
  });
}

/**
 * POST /api/auth/send-access — Envoie un email d'accès brandé Kucibok à un ou plusieurs
 * utilisateurs existants. Génère un recovery link Supabase (one-time, sécurisé) et
 * l'intègre dans le template welcome selon le rôle. Admin uniquement.
 *
 * Body (un seul) : { email, first_name, role }
 * Body (liste)   : { users: [{ email, first_name, role }] }
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function authSendAccess(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const adminCheck = await requireAdmin(authResult.user);
  if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

  // Normaliser en liste
  let users = req.body?.users;
  if (!users) {
    const { email, first_name, role } = req.body ?? {};
    if (!email) return fail(res, 'email requis');
    users = [{ email, first_name: first_name ?? '', role: role ?? 'collector' }];
  }
  if (!Array.isArray(users) || !users.length) return fail(res, 'users doit être un tableau non vide');

  const { Resend } = await import('resend');
  const resend    = new Resend(process.env.RESEND_API_KEY);
  const SITE_URL  = (process.env.CORS_ORIGIN ?? 'https://kucibok.com').replace(/\/$/, '');
  const results   = [];

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (const u of users) {
    const { email, first_name = '', role = 'collector' } = u;

    // Fix 4 — validation format email
    if (!email || !EMAIL_RE.test(email)) {
      results.push({ email: email ?? null, status: 'skipped', reason: 'email manquant ou invalide' });
      continue;
    }

    try {
      // 1. Générer le recovery link Supabase (one-time, expire 24h)
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type:    'recovery',
        email,
        options: { redirectTo: `${SITE_URL}/reset-password` },
      });
      if (linkError) { results.push({ email, status: 'error', reason: linkError.message }); continue; }

      // Fix 3 — guard si generateLink ne retourne pas de lien
      const recoveryLink = linkData?.properties?.action_link;
      if (!recoveryLink) { results.push({ email, status: 'error', reason: 'Impossible de générer le lien d\'accès (compte inexistant ?)' }); continue; }

      // 2. Sélectionner le template selon le rôle (professional → collector en fallback)
      const templateName = role === 'artist' ? 'welcome-artist' : 'welcome-collector';
      let html = readFileSync(join(process.cwd(), 'emails', `${templateName}.html`), 'utf8');

      // Fix 2 — fallback first_name si vide
      const displayName = first_name?.trim() || 'vous';

      // 3. Injecter les variables
      html = html
        .replace(/\{\{first_name\}\}/g,      displayName)
        .replace(/\{\{dashboard_url\}\}/g,   recoveryLink)
        .replace(/\{\{catalogue_url\}\}/g,   recoveryLink)
        .replace(/\{\{unsubscribe_url\}\}/g, `${SITE_URL}/unsubscribe`);

      // 4. Envoyer via Resend
      const subject = role === 'artist'
        ? 'Votre espace artiste Kucibok Bridge est prêt'
        : 'Votre accès Kucibok Bridge est prêt';

      await resend.emails.send({ from: FROM_EMAIL, to: email, subject, html });
      results.push({ email, status: 'sent' });
    } catch (err) {
      results.push({ email, status: 'error', reason: err?.message ?? 'Erreur inconnue' });
    }
  }

  return ok(res, { results, total: results.length, sent: results.filter(r => r.status === 'sent').length });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARTWORKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET  /api/artworks — Liste paginée des œuvres.
 * POST /api/artworks — Crée une nouvelle œuvre.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routeArtworks(req, res) {
  if (req.method === 'GET') {
    const { from, to, page, limit } = parsePagination(req);
    const { status, category, for_sale, featured, artist_id, user_id } = req.query;

    let query = supabaseAdmin
      .from('artworks')
      .select('*, artists!artist_id(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    // Vérifier si l'appelant est admin (nécessaire pour voir les non-approuvées)
    let callerIsAdmin = false;
    const authHeader = req.headers.authorization ?? '';
    const authToken = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (authToken) {
      const { data: { user: authUser } } = await supabaseAdmin.auth.getUser(authToken);
      if (authUser) callerIsAdmin = (await getDbRole(authUser.id)) === 'admin';
    }

    if (status)    query = query.eq('status', status);
    if (category)  query = query.eq('category', category);
    if (for_sale)  query = query.eq('for_sale', for_sale === 'true');
    if (featured)  query = query.eq('featured', featured === 'true');
    if (artist_id) query = query.eq('artist_id', artist_id);
    if (user_id)   query = query.eq('user_id', user_id);

    // Forcer status=approved pour les requêtes non-admin (sécurité)
    if (!callerIsAdmin && !status) query = query.eq('status', 'approved');

    const { data, error, count } = await query;
    if (error) return fail(res, error.message);
    const normalized = (data ?? []).map(a => ({
      ...a,
      _id: a.id,
      artist: a.artists?.name ?? a.artist ?? null,
    }));
    return ok(res, normalized, 200, { page, limit, total: count });
  }

  if (req.method === 'POST') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const { user } = authResult;

    const {
      title, description, image, medium, condition, provenance,
      height, width, weight, price, currency, category, tags,
      artistId, for_sale, edition_number, edition_total,
    } = req.body ?? {};

    if (!title) return fail(res, 'Le titre est requis');
    if (!image) return fail(res, "L'image est requise");
    if (price == null) return fail(res, 'Le prix est requis');

    let resolvedArtistId = artistId ?? null;
    if (!resolvedArtistId && user.user_metadata?.role === 'artist') {
      const { data: artistProfile } = await supabaseAdmin
        .from('artists').select('id').eq('user_id', user.id).single();
      resolvedArtistId = artistProfile?.id ?? null;
    }

    const { data, error } = await supabaseAdmin
      .from('artworks')
      .insert({
        user_id:        user.id,
        artist_id:      resolvedArtistId,
        owner_id:       user.id,
        title,
        description:    description ?? null,
        image,
        medium:         medium ?? null,
        condition:      condition ?? null,
        provenance:     provenance ?? null,
        height:         height ? Number(height) : null,
        width:          width  ? Number(width)  : null,
        weight:         weight ? Number(weight) : null,
        price:          Number(price),
        currency:       currency ?? 'XOF',
        category:       category ?? null,
        tags:           Array.isArray(tags) ? tags : (tags ? [tags] : []),
        for_sale:       !!for_sale,
        edition_number: edition_number ? Number(edition_number) : 1,
        edition_total:  edition_total  ? Number(edition_total)  : 1,
        status:         'pending',
      })
      .select()
      .single();

    if (error) return fail(res, error.message);
    return ok(res, data, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * GET    /api/artworks/:id — Détail d'une œuvre.
 * PUT    /api/artworks/:id — Mise à jour (owner ou admin).
 * PATCH  /api/artworks/:id — Changement de statut (admin).
 * DELETE /api/artworks/:id — Suppression (admin).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 * @param {string} id
 */
async function routeArtworkById(req, res, id) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('artworks')
      .select('*, artists(*), categories(*)')
      .eq('id', id)
      .single();

    if (error || !data) return notFound(res, 'Œuvre');

    // Incrémenter les visites en arrière-plan (non bloquant)
    (async () => { try { await supabaseAdmin.rpc('increment_artwork_visited', { artwork_id: id }); } catch {} })();
    return ok(res, { ...data, _id: data.id, artist: data.artists?.name ?? data.artist ?? null });
  }

  if (req.method === 'PUT') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const { user } = authResult;

    const { data: existing } = await supabaseAdmin
      .from('artworks').select('user_id').eq('id', id).single();
    if (!existing) return notFound(res, 'Œuvre');

    const isAdmin = (await getDbRole(user.id)) === 'admin';
    if (!isAdmin && existing.user_id !== user.id) return fail(res, 'Accès refusé', 403);

    // Champs admin-only : status et featured (empêcher le self-approve)
    const ADMIN_ONLY = ['status', 'featured'];
    const ALLOWED = [
      'title', 'description', 'image', 'medium', 'condition', 'provenance',
      'height', 'width', 'weight', 'price', 'currency', 'category', 'tags',
      'for_sale', 'availability_status',
      'edition_number', 'edition_total', 'etherscan',
      ...(isAdmin ? ADMIN_ONLY : []),
    ];
    const updates = {};
    for (const key of ALLOWED) {
      if (req.body?.[key] !== undefined) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length === 0) return fail(res, 'Aucune modification fournie');

    const { data, error } = await supabaseAdmin
      .from('artworks').update(updates).eq('id', id).select().single();
    if (error) return fail(res, error.message);
    return ok(res, data);
  }

  if (req.method === 'PATCH') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const adminCheck = await requireAdmin(authResult.user);
    if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

    const { status } = req.body ?? {};
    if (!['approved', 'rejected', 'pending'].includes(status)) return fail(res, 'Statut invalide');

    const { data, error } = await supabaseAdmin
      .from('artworks').update({ status }).eq('id', id).select().single();
    if (error) return fail(res, error.message);
    return ok(res, data);
  }

  if (req.method === 'DELETE') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const adminCheck = await requireAdmin(authResult.user);
    if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

    const { error } = await supabaseAdmin.from('artworks').delete().eq('id', id);
    if (error) return fail(res, error.message);
    return ok(res, { deleted: true });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * GET /api/artworks/verify/:kucibok_id — Vérification publique d'une œuvre (F1 — QR code).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 * @param {string} kucibok_id
 */
async function routeVerifyArtwork(req, res, kucibok_id) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);

  const { data, error } = await supabaseAdmin
    .from('artworks')
    .select(`
      id, kucibok_id, title, description, image,
      medium, condition, provenance,
      height, width, weight,
      price, currency, category,
      status, created_at,
      artists ( name, username, country ),
      categories ( name )
    `)
    .eq('kucibok_id', kucibok_id)
    .eq('status', 'approved')
    .single();

  if (error || !data) return notFound(res, 'Œuvre');

  return ok(res, {
    kucibok_id:     data.kucibok_id,
    title:          data.title,
    description:    data.description,
    image:          data.image,
    medium:         data.medium,
    condition:      data.condition,
    provenance:     data.provenance,
    dimensions:     { height: data.height, width: data.width, weight: data.weight },
    price:          data.price,
    currency:       data.currency,
    category:       data.categories?.name ?? data.category,
    artist:         data.artists?.name,
    artist_country: data.artists?.country,
    certified_at:   data.created_at,
    status:         data.status,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARTIST
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET  /api/artist — Liste des artistes (public).
 * POST /api/artist — Crée un profil artiste.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routeArtists(req, res) {
  if (req.method === 'GET') {
    const { from, to, page, limit } = parsePagination(req);

    if (req.query.random === 'true') {
      const { data, error } = await supabaseAdmin
        .from('artists')
        .select('id, name, username, image, country, biography')
        .limit(8);
      if (error) return fail(res, error.message);
      return ok(res, data.sort(() => Math.random() - 0.5));
    }

    const { data, error, count } = await supabaseAdmin
      .from('artists')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) return fail(res, error.message);
    const normalizedArtists = (data ?? []).map(a => ({
      ...a,
      _id: a.id,
      artworkCount: a.artwork_count ?? 0,
    }));
    return ok(res, normalizedArtists, 200, { page, limit, total: count });
  }

  if (req.method === 'POST') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const { user } = authResult;

    const { name, username, image, country, biography, portfolio, facebook, twitter, instagram } = req.body ?? {};

    const { data: existing } = await supabaseAdmin
      .from('artists').select('id').eq('user_id', user.id).single();
    if (existing) return fail(res, 'Profil artiste déjà existant', 409);

    const { data, error } = await supabaseAdmin
      .from('artists')
      .insert({ user_id: user.id, name, username, image, country, biography, portfolio, facebook, twitter, instagram })
      .select()
      .single();

    if (error) return fail(res, error.message);
    return ok(res, data, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * GET /api/artist/:id — Profil artiste public.
 * PUT /api/artist/:id — Mise à jour (owner ou admin).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 * @param {string} id
 */
async function routeArtistById(req, res, id) {
  if (req.method === 'GET') {
    const byUserId = req.query.byUser === 'true';
    const column   = byUserId ? 'user_id' : 'id';

    const { data, error } = await supabaseAdmin
      .from('artists')
      .select('*, artworks(id, title, image, price, currency, status, for_sale)')
      .eq(column, id)
      .single();

    if (error || !data) return notFound(res, 'Artiste');

    // Incrémenter visites en arrière-plan
    (async () => { try { await supabaseAdmin.from('artists').update({ visited: (data.visited ?? 0) + 1 }).eq('id', data.id); } catch {} })();

    return ok(res, data);
  }

  if (req.method === 'PUT') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const { user } = authResult;

    const { data: existing } = await supabaseAdmin
      .from('artists').select('user_id').eq('id', id).single();
    if (!existing) return notFound(res, 'Artiste');

    const isAdmin = (await getDbRole(user.id)) === 'admin';
    if (!isAdmin && existing.user_id !== user.id) return fail(res, 'Accès refusé', 403);

    const ALLOWED = ['name', 'username', 'image', 'country', 'biography', 'portfolio',
                     'facebook', 'twitter', 'instagram'];
    const updates = {};
    for (const key of ALLOWED) {
      if (req.body?.[key] !== undefined) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length === 0) return fail(res, 'Aucune modification fournie');

    const { data, error } = await supabaseAdmin
      .from('artists').update(updates).eq('id', id).select().single();
    if (error) return fail(res, error.message);
    return ok(res, data);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOG
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET  /api/blog — Articles publiés (public).
 * POST /api/blog — Crée un article (admin ou pro).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routeBlog(req, res) {
  if (req.method === 'GET') {
    const { from, to, page, limit } = parsePagination(req);

    const { data, error, count } = await supabaseAdmin
      .from('blog_posts')
      .select('id, title, image, category, tags, views, created_at, published', { count: 'exact' })
      .eq('published', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) return fail(res, error.message);
    return ok(res, data, 200, { page, limit, total: count });
  }

  if (req.method === 'POST') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const proCheck = await requirePro(authResult.user);
    if (!proCheck.ok) return fail(res, proCheck.error, proCheck.status);

    const { title, content, image, category, tags, published } = req.body ?? {};
    if (!title) return fail(res, 'Titre requis');

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert({
        user_id:   authResult.user.id,
        title, content, image,
        category:  category ?? null,
        tags:      Array.isArray(tags) ? tags : [],
        published: !!published,
      })
      .select()
      .single();

    if (error) return fail(res, error.message);
    return ok(res, data, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET  /api/categories — Toutes les catégories (public).
 * POST /api/categories — Crée une catégorie (admin).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routeCategories(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('categories').select('*').order('name');
    if (error) return fail(res, error.message);
    return ok(res, data);
  }

  if (req.method === 'POST') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const adminCheck = await requireAdmin(authResult.user);
    if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

    const { name, image } = req.body ?? {};
    if (!name) return fail(res, 'Le nom est requis');

    const { data, error } = await supabaseAdmin
      .from('categories').insert({ name, image }).select().single();
    if (error) return fail(res, error.message);
    return ok(res, data, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLANS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET  /api/plans — Plans d'abonnement actifs (public).
 * POST /api/plans — Crée un plan (admin).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routePlans(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('plans').select('*').eq('is_active', true).order('price');
    if (error) return fail(res, error.message);
    return ok(res, data);
  }

  if (req.method === 'POST') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const adminCheck = await requireAdmin(authResult.user);
    if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

    const { name, price, currency, duration_days, features } = req.body ?? {};
    if (!name || price == null) return fail(res, 'name et price requis');

    const { data, error } = await supabaseAdmin
      .from('plans')
      .insert({
        name,
        price:         Number(price),
        currency:      currency ?? 'XOF',
        duration_days: duration_days ? Number(duration_days) : 30,
        features:      Array.isArray(features) ? features : [],
        is_active:     true,
      })
      .select()
      .single();

    if (error) return fail(res, error.message);
    return ok(res, data, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

// ═══════════════════════════════════════════════════════════════════════════════
// DELIVERY (F2)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET  /api/delivery — Liste des demandes de livraison.
 * POST /api/delivery — Crée une demande de livraison.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routeDelivery(req, res) {
  if (req.method === 'GET') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const { user } = authResult;

    const { from, to, page, limit } = parsePagination(req);
    const isAdmin = (await getDbRole(user.id)) === 'admin';

    let query = supabaseAdmin
      .from('delivery_requests')
      .select('*, delivery_events(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!isAdmin)          query = query.eq('user_id', user.id);
    if (req.query.status)  query = query.eq('status', req.query.status);

    const { data, error, count } = await query;
    if (error) return fail(res, error.message);
    return ok(res, data, 200, { page, limit, total: count });
  }

  if (req.method === 'POST') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const { user } = authResult;

    const {
      corridor, origin_country, delivery_address, recipient_name, recipient_phone,
      special_instructions, insurance_required, package_size, package_weight,
      delivery_priority, artwork_ids, museum_wrap, bubble_wrap, crate,
      fragile_label, humidity_control,
    } = req.body ?? {};

    if (!delivery_address) return fail(res, "L'adresse de livraison est requise");
    if (!recipient_name)   return fail(res, 'Le nom du destinataire est requis');

    const tracking_id = 'KCB-DEL-' + randomBytes(4).toString('hex').toUpperCase();

    const { data: delivery, error } = await supabaseAdmin
      .from('delivery_requests')
      .insert({
        user_id:              user.id,
        tracking_id,
        status:               'pending',
        corridor:             corridor ?? 'AF_TO_FR',
        origin_country:       origin_country ?? null,
        delivery_address,
        recipient_name,
        recipient_phone:      recipient_phone ?? null,
        special_instructions: special_instructions ?? null,
        insurance_required:   !!insurance_required,
        package_size:         package_size ?? null,
        package_weight:       package_weight ? Number(package_weight) : null,
        delivery_priority:    delivery_priority ?? 'standard',
        museum_wrap:          !!museum_wrap,
        bubble_wrap:          !!bubble_wrap,
        crate:                !!crate,
        fragile_label:        !!fragile_label,
        humidity_control:     !!humidity_control,
        payment_status:       'pending',
      })
      .select()
      .single();

    if (error) return fail(res, error.message);

    // Lier les artwork_ids si fournis
    if (Array.isArray(artwork_ids) && artwork_ids.length > 0) {
      const links = artwork_ids.map(artwork_id => ({ delivery_id: delivery.id, artwork_id }));
      try { await supabaseAdmin.from('delivery_artwork_ids').insert(links); } catch {}
    }

    // Premier événement de livraison
    try {
      await supabaseAdmin.from('delivery_events').insert({
        delivery_id: delivery.id,
        status:      'pending',
        note:        'Demande créée',
      });
    } catch {}

    return ok(res, delivery, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * GET /api/delivery/track/:tracking_id — Tracking public (F2).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 * @param {string} tracking_id
 */
async function routeTrackDelivery(req, res, tracking_id) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);

  const { data, error } = await supabaseAdmin
    .from('delivery_requests')
    .select(`
      id, tracking_id, status, corridor,
      origin_country, destination_country, destination_city,
      delivery_priority,
      insurance_required, created_at,
      delivery_events ( status, note, date )
    `)
    .eq('tracking_id', tracking_id)
    .single();

  if (error || !data) return notFound(res, 'Livraison');

  // RGPD : ne pas exposer l'adresse complète ni le nom du destinataire
  return ok(res, {
    tracking_id: data.tracking_id,
    status:      data.status,
    corridor:    data.corridor,
    origin:      data.origin_country,
    destination: data.destination_city ? `${data.destination_city}, ${data.destination_country}` : data.destination_country,
    priority:    data.delivery_priority,
    created_at:  data.created_at,
    events:      (data.delivery_events ?? []).sort((a, b) => new Date(b.date) - new Date(a.date)),
  });
}

/**
 * GET    /api/delivery/:id — Détail d'une demande de livraison (propriétaire ou admin).
 * PATCH  /api/delivery/:id — Mise à jour du statut (admin).
 * DELETE /api/delivery/:id — Suppression (admin).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 * @param {string} id
 */
async function routeDeliveryById(req, res, id) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const { user } = authResult;
  const isAdmin = (await getDbRole(user.id)) === 'admin';

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('delivery_requests')
      .select('*, delivery_events(*)')
      .eq('id', id)
      .single();

    if (error || !data) return notFound(res, 'Livraison');
    if (!isAdmin && data.user_id !== user.id) return fail(res, 'Accès refusé', 403);

    return ok(res, data);
  }

  if (req.method === 'PATCH') {
    if (!isAdmin) return fail(res, 'Accès refusé', 403);

    const { status, note } = req.body ?? {};
    const VALID_STATUSES = ['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'];
    if (status && !VALID_STATUSES.includes(status)) return fail(res, 'Statut invalide');

    const { data: delivery, error } = await supabaseAdmin
      .from('delivery_requests')
      .update({ ...(status ? { status } : {}) })
      .eq('id', id)
      .select()
      .single();

    if (error) return fail(res, error.message);

    // Ajouter un événement de suivi si un statut ou une note est fourni
    if (status || note) {
      try { await supabaseAdmin.from('delivery_events').insert({
        delivery_id: id,
        status:      status ?? delivery.status,
        note:        note ?? null,
      }); } catch {}
    }

    return ok(res, delivery);
  }

  if (req.method === 'DELETE') {
    if (!isAdmin) return fail(res, 'Accès refusé', 403);

    const { error } = await supabaseAdmin
      .from('delivery_requests')
      .delete()
      .eq('id', id);

    if (error) return fail(res, error.message);
    return ok(res, { deleted: true });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOG
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/log — Enregistre un log d'activité.
 * GET  /api/log — Liste les logs (admin).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routeLog(req, res) {
  if (req.method === 'POST') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);

    const { description, action, entity, entity_id } = req.body ?? {};
    const user_id = authResult.user.id;

    const { data, error } = await supabaseAdmin
      .from('logs')
      .insert({ user_id, description, action, entity, entity_id })
      .select()
      .single();

    if (error) return fail(res, error.message);
    return ok(res, data, 201);
  }

  if (req.method === 'GET') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const adminCheck = await requireAdmin(authResult.user);
    if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

    const { from, to, page, limit } = parsePagination(req);

    const { data, error, count } = await supabaseAdmin
      .from('logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) return fail(res, error.message);
    return ok(res, data, 200, { page, limit, total: count });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

// ═══════════════════════════════════════════════════════════════════════════════
// GALLERIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/galleries — Liste toutes les galeries (admin uniquement).
 * POST /api/galleries — Crée une galerie.
 */
async function routeGalleries(req, res) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const adminCheck = await requireAdmin(authResult.user);
  if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

  if (req.method === 'GET') {
    const { page, limit, from, to } = parsePagination(req);
    const search = req.query?.search ?? '';

    let query = supabaseAdmin
      .from('galleries')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) return fail(res, error.message);
    return ok(res, { galleries: data ?? [], total: count ?? 0, filtered: data?.length ?? 0 }, 200, { page, limit, total: count });
  }

  if (req.method === 'POST') {
    const { name, email, description, location, website, image } = req.body ?? {};
    if (!name) return fail(res, 'name requis');

    const { data, error } = await supabaseAdmin
      .from('galleries')
      .insert({ name, description, location, website, image })
      .select()
      .single();

    if (error) return fail(res, error.message);
    return ok(res, data, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * POST /api/galleries/import — Import CSV de galeries scrapées (admin uniquement).
 * Accepte un corps JSON { galleries: [{ name, email, ... }] } ou multipart (futur).
 */
async function routeGalleriesImport(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const adminCheck = await requireAdmin(authResult.user);
  if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

  const galleries = req.body?.galleries;
  if (!Array.isArray(galleries) || !galleries.length) return fail(res, 'galleries[] requis');

  const rows = galleries.map(g => ({
    name: g.name ?? '',
    description: g.description ?? null,
    location: g.location ?? null,
    website: g.website ?? null,
    image: g.image ?? null,
  }));

  const { data, error } = await supabaseAdmin.from('galleries').insert(rows).select();
  if (error) return fail(res, error.message);
  return ok(res, { imported: data?.length ?? 0, galleries: data }, 201);
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISITOR TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/visitor — Enregistre un visiteur.
 * GET  /api/visitor — Liste tous les visiteurs (admin).
 */
async function routeVisitor(req, res) {
  if (req.method === 'POST') {
    const { ipAddress, userAgent, pageVisited, sessionId } = req.body ?? {};
    const { data, error } = await supabaseAdmin
      .from('visitors')
      .insert({ ip: ipAddress ?? null, user_agent: userAgent ?? null, page: pageVisited ?? null })
      .select()
      .single();
    if (error) return fail(res, error.message);
    // Normalize id → _id for legacy frontend compatibility
    return ok(res, { ...data, _id: data.id, sessionId: sessionId ?? data.id }, 201);
  }

  if (req.method === 'GET') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const adminCheck = await requireAdmin(authResult.user);
    if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

    const { data, error } = await supabaseAdmin
      .from('visitors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5000);
    if (error) return fail(res, error.message);
    // Normalize for frontend
    return ok(res, (data ?? []).map(v => ({ ...v, _id: v.id, createdAt: v.created_at, visitTime: 0 })));
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * PUT /api/visitor/visit-time — Met à jour la durée de visite (no-op, table sans colonne dédiée).
 */
async function routeVisitorVisitTime(req, res) {
  if (req.method !== 'PUT') return fail(res, 'Méthode non autorisée', 405);
  return ok(res, { updated: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
// NUMERISATION REQUESTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/numerisation — Crée une demande de numérisation.
 * GET  /api/numerisation — Liste toutes les demandes (admin).
 */
async function routeNumerisation(req, res) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);

  if (req.method === 'POST') {
    const { artwork_id, notes } = req.body ?? {};
    const { data, error } = await supabaseAdmin
      .from('numerisation_requests')
      .insert({ user_id: authResult.user.id, artwork_id: artwork_id ?? null, notes: notes ?? null, status: 'pending' })
      .select()
      .single();
    if (error) return fail(res, error.message);
    return ok(res, { ...data, _id: data.id }, 201);
  }

  if (req.method === 'GET') {
    const adminCheck = await requireAdmin(authResult.user);
    if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);
    const { data, error } = await supabaseAdmin
      .from('numerisation_requests')
      .select('*, artworks(title, image), users(name)')
      .order('created_at', { ascending: false });
    if (error) return fail(res, error.message);
    return ok(res, (data ?? []).map(n => ({ ...n, _id: n.id })));
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/** GET /api/numerisation/my — Mes demandes de numérisation. */
async function routeNumerisationMy(req, res) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);

  const { data, error } = await supabaseAdmin
    .from('numerisation_requests')
    .select('*, artworks(title, image)')
    .eq('user_id', authResult.user.id)
    .order('created_at', { ascending: false });
  if (error) return fail(res, error.message);
  return ok(res, (data ?? []).map(n => ({ ...n, _id: n.id })));
}

/** GET/PUT/DELETE /api/numerisation/:id */
async function routeNumerisationById(req, res, id) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('numerisation_requests').select('*').eq('id', id).single();
    if (error || !data) return fail(res, 'Demande introuvable', 404);
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'PUT') {
    const { notes } = req.body ?? {};
    const { data, error } = await supabaseAdmin
      .from('numerisation_requests').update({ notes }).eq('id', id).select().single();
    if (error) return fail(res, error.message);
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'DELETE') {
    const adminCheck = await requireAdmin(authResult.user);
    if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);
    const { error } = await supabaseAdmin.from('numerisation_requests').delete().eq('id', id);
    if (error) return fail(res, error.message);
    return ok(res, { deleted: true });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/** PUT /api/numerisation/:id/status — Change le statut (admin). */
async function routeNumerisationStatus(req, res, id) {
  if (req.method !== 'PUT') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const adminCheck = await requireAdmin(authResult.user);
  if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

  const { status } = req.body ?? {};
  if (!status) return fail(res, 'status requis');

  const { data, error } = await supabaseAdmin
    .from('numerisation_requests').update({ status }).eq('id', id).select().single();
  if (error) return fail(res, error.message);
  return ok(res, { ...data, _id: data.id });
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENTS — PAYDUNYA
// ═══════════════════════════════════════════════════════════════════════════════

const PAYDUNYA_MODE        = process.env.PAYDUNYA_MODE ?? 'test';
const PAYDUNYA_MASTER_KEY  = process.env.PAYDUNYA_MASTER_KEY;
const PAYDUNYA_PRIVATE_KEY = process.env.PAYDUNYA_PRIVATE_KEY;
const PAYDUNYA_TOKEN       = process.env.PAYDUNYA_TOKEN;
const PAYMENT_BASE_URL     = process.env.CORS_ORIGIN ?? 'https://kucibok.com';

const PAYDUNYA_ENDPOINTS = {
  test: 'https://app.paydunya.com/sandbox-api/v1/softorder/create',
  live: 'https://app.paydunya.com/api/v1/softorder/create',
};

const PAYDUNYA_VERIFY_ENDPOINTS = {
  test: 'https://app.paydunya.com/sandbox-api/v1/payment/details',
  live: 'https://app.paydunya.com/api/v1/payment/details',
};

/**
 * POST /api/payments/paydunya-init — Initialise un paiement PayDunya.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routePaydunyaInit(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const { user } = authResult;

  const { type, artwork_id, plan_id, currency } = req.body ?? {};

  if (!['artwork', 'subscription', 'plan'].includes(type)) {
    return fail(res, 'Type de paiement invalide');
  }

  let amount, description, returnUrl, cancelUrl, ref;

  if (type === 'artwork') {
    if (!artwork_id) return fail(res, 'artwork_id requis');

    const { data: artwork } = await supabaseAdmin
      .from('artworks')
      .select('id, title, price, currency, status, sold')
      .eq('id', artwork_id)
      .single();

    if (!artwork)                    return fail(res, 'Œuvre introuvable', 404);
    if (artwork.sold)                return fail(res, 'Œuvre déjà vendue', 409);
    if (artwork.status !== 'approved') return fail(res, 'Œuvre non disponible', 409);

    amount      = artwork.price;
    description = `Achat : ${artwork.title}`;
    ref         = `ART-${artwork_id}-${Date.now()}`;
    returnUrl   = `${PAYMENT_BASE_URL}/artwork-purchase-success?ref=${ref}`;
    cancelUrl   = `${PAYMENT_BASE_URL}/artwork-purchase-failed`;
  } else {
    if (!plan_id) return fail(res, 'plan_id requis');

    const { data: plan } = await supabaseAdmin
      .from('plans')
      .select('id, name, price, currency')
      .eq('id', plan_id).eq('is_active', true).single();

    if (!plan) return fail(res, 'Plan introuvable', 404);

    amount      = plan.price;
    description = `Abonnement : ${plan.name}`;
    ref         = `PLAN-${plan_id}-${Date.now()}`;
    returnUrl   = `${PAYMENT_BASE_URL}/subscription-success?ref=${ref}`;
    cancelUrl   = `${PAYMENT_BASE_URL}/subscription-failed`;
  }

  const payload = {
    invoice: { total_amount: amount, description, currency: currency ?? 'XOF' },
    store: {
      name:     'Kucibok',
      tagline:  "La marketplace d'art africain",
      phone:    '+221000000000',
      website:  PAYMENT_BASE_URL,
      logo_url: `${PAYMENT_BASE_URL}/images/kucibok-black.png`,
    },
    actions: {
      cancel_url:   cancelUrl,
      return_url:   returnUrl,
      callback_url: `${PAYMENT_BASE_URL}/api/payments/paydunya-callback`,
    },
    custom_data: {
      user_id:    user.id,
      type,
      ref,
      artwork_id: artwork_id ?? null,
      plan_id:    plan_id ?? null,
    },
  };

  const pdRes  = await fetch(PAYDUNYA_ENDPOINTS[PAYDUNYA_MODE], {
    method:  'POST',
    headers: {
      'Content-Type':         'application/json',
      'PAYDUNYA-MASTER-KEY':  PAYDUNYA_MASTER_KEY,
      'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
      'PAYDUNYA-TOKEN':       PAYDUNYA_TOKEN,
    },
    body: JSON.stringify(payload),
  });

  const result = await pdRes.json();
  if (result.response_code !== '00') return fail(res, result.response_text ?? 'Erreur PayDunya');

  return ok(res, { payment_url: result.response_text, token: result.token, ref });
}

/**
 * POST /api/payments/paydunya-callback — Webhook PayDunya (paiement confirmé).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routePaydunyaCallback(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  try {
    // Vérifier le hash PayDunya pour authentifier le webhook
    const receivedHash = req.headers['paydunya-hash'];
    if (!receivedHash || receivedHash !== PAYDUNYA_MASTER_KEY) {
      console.error('[PAYDUNYA] Hash de webhook invalide');
      return fail(res, 'Signature webhook invalide', 403);
    }

    const { data: paymentData } = req.body ?? {};
    if (!paymentData) return fail(res, 'Données PayDunya manquantes');

    const { token } = paymentData;
    if (!token) return fail(res, 'Token manquant');

    const verifyRes = await fetch(`${PAYDUNYA_VERIFY_ENDPOINTS[PAYDUNYA_MODE]}/${token}`, {
      method:  'GET',
      headers: {
        'PAYDUNYA-MASTER-KEY':  PAYDUNYA_MASTER_KEY,
        'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
        'PAYDUNYA-TOKEN':       PAYDUNYA_TOKEN,
      },
    });

    const verified = await verifyRes.json();
    if (verified.status !== 'completed') return fail(res, 'Paiement non complété');

    // Idempotence — ignorer si le webhook a déjà été traité (double appel PayDunya)
    const { data: existingTx } = await supabaseAdmin
      .from('transactions').select('id').eq('payment_ref', token).maybeSingle();
    if (existingTx) return ok(res, { received: true });

    const { user_id, type, artwork_id, plan_id } = verified.custom_data ?? {};

    if (!user_id) {
      console.error('[PAYDUNYA] user_id manquant dans custom_data', { token });
      return fail(res, 'user_id manquant dans les données de paiement', 400);
    }

    if (type === 'artwork' && artwork_id) {
      await supabaseAdmin
        .from('artworks')
        .update({ sold: true, sold_at: new Date().toISOString(), for_sale: false })
        .eq('id', artwork_id);

      const { data: artwork } = await supabaseAdmin
        .from('artworks').select('price, currency, user_id').eq('id', artwork_id).single();

      if (artwork) {
        await supabaseAdmin.from('transactions').insert({
          artwork_id,
          buyer_id:       user_id,
          seller_id:      artwork.user_id,
          amount:         artwork.price,
          currency:       artwork.currency,
          status:         'completed',
          payment_method: 'paydunya',
          payment_ref:    token,
        });
      }
    }

    if ((type === 'subscription' || type === 'plan') && plan_id) {
      const { data: plan } = await supabaseAdmin
        .from('plans').select('duration_days, price, currency').eq('id', plan_id).single();

      if (plan) {
        const start_date = new Date();
        const end_date   = new Date(start_date);
        end_date.setDate(end_date.getDate() + (plan.duration_days ?? 30));

        await supabaseAdmin.from('subscriptions').upsert({
          user_id,
          plan_id,
          status:            'active',
          start_date:        start_date.toISOString(),
          end_date:          end_date.toISOString(),
          next_payment_date: end_date.toISOString(),
          amount:            plan.price,
          currency:          plan.currency,
          payment_ref:       token,
        }, { onConflict: 'user_id,plan_id' });
      }
    }

    return ok(res, { received: true });
  } catch (err) {
    console.error('[PAYDUNYA CALLBACK]', err?.message ?? err);
    return fail(res, 'Erreur traitement webhook', 500);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET  /api/subscription — Abonnement actif de l'utilisateur.
 * POST /api/subscription — Active un abonnement (post-paiement).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routeSubscription(req, res) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const { user } = authResult;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*, plans(*)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return ok(res, null); // Pas d'abonnement actif
    return ok(res, data);
  }

  if (req.method === 'POST') {
    const { plan_id, payment_ref } = req.body ?? {};
    if (!plan_id) return fail(res, 'plan_id requis');
    if (!payment_ref) return fail(res, 'payment_ref requis');

    // Vérifier que le paiement a bien été complété
    const { data: txRecord } = await supabaseAdmin
      .from('transactions')
      .select('id, status')
      .eq('payment_ref', payment_ref)
      .eq('status', 'completed')
      .maybeSingle();

    if (!txRecord) return fail(res, 'Paiement non vérifié. Effectuez le paiement avant d\'activer l\'abonnement.', 402);

    const { data: plan } = await supabaseAdmin
      .from('plans')
      .select('duration_days, price, currency')
      .eq('id', plan_id).eq('is_active', true).single();

    if (!plan) return fail(res, 'Plan introuvable', 404);

    const start_date = new Date();
    const end_date   = new Date(start_date);
    end_date.setDate(end_date.getDate() + (plan.duration_days ?? 30));

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id:           user.id,
        plan_id,
        status:            'active',
        start_date:        start_date.toISOString(),
        end_date:          end_date.toISOString(),
        next_payment_date: end_date.toISOString(),
        amount:            plan.price,
        currency:          plan.currency,
        payment_ref,
      })
      .select('*, plans(*)')
      .single();

    if (error) return fail(res, error.message);
    return ok(res, data, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOURCING (F3)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET  /api/sourcing — Liste des demandes de sourcing.
 * POST /api/sourcing — Crée une demande de sourcing.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routeSourcing(req, res) {
  if (req.method === 'GET') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const { user } = authResult;

    const { from, to, page, limit } = parsePagination(req);
    const isAdmin = (await getDbRole(user.id)) === 'admin';

    let query = supabaseAdmin
      .from('sourcing_inquiries')
      .select('*, artworks(id, title, image, kucibok_id)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!isAdmin) query = query.eq('requested_by', user.id);

    const { data, error, count } = await query;
    if (error) return fail(res, error.message);
    return ok(res, data, 200, { page, limit, total: count });
  }

  if (req.method === 'POST') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const { user } = authResult;

    const { artwork_id, organization, purpose, budget, message } = req.body ?? {};
    if (!artwork_id) return fail(res, "L'ID de l'œuvre est requis");
    if (!message)    return fail(res, 'Le message est requis');

    const { data, error } = await supabaseAdmin
      .from('sourcing_inquiries')
      .insert({
        artwork_id,
        requested_by: user.id,
        organization: organization ?? null,
        purpose:      purpose ?? null,
        budget:       budget ? Number(budget) : null,
        message,
        status:       'pending',
      })
      .select()
      .single();

    if (error) return fail(res, error.message);
    return ok(res, data, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMPAIGNS
// ═══════════════════════════════════════════════════════════════════════════════

const FROM_EMAIL = `Kucibok Bridge <${process.env.ADMIN_EMAIL ?? 'noreply@kucibok.com'}>`;

/**
 * POST /api/campaigns/send — Envoie une campagne email via Resend.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routeCampaignSend(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const proCheck = await requirePro(authResult.user);
  if (!proCheck.ok) return fail(res, proCheck.error, proCheck.status);

  const { campaign_id } = req.body ?? {};
  if (!campaign_id) return fail(res, 'campaign_id requis');

  const { data: campaign } = await supabaseAdmin
    .from('campaigns')
    .select('*')
    .eq('id', campaign_id)
    .eq('user_id', authResult.user.id)
    .single();

  if (!campaign)                    return fail(res, 'Campagne introuvable', 404);
  if (campaign.status === 'sent')   return fail(res, 'Campagne déjà envoyée', 409);

  const { data: contacts } = await supabaseAdmin
    .from('contacts')
    .select('email, name')
    .eq('user_id', authResult.user.id)
    .not('email', 'is', null);

  if (!contacts?.length) return fail(res, 'Aucun contact trouvé');

  const emails = contacts.map(c => c.email).filter(Boolean);

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const BATCH_SIZE = 50;
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    try {
      await resend.emails.send({
        from:    FROM_EMAIL,
        to:      batch,
        subject: campaign.subject,
        html:    campaign.content,
      });
      sent += batch.length;
    } catch (err) {
      console.error('[RESEND] Batch failed:', err?.message);
      failed += batch.length;
    }
  }

  await supabaseAdmin
    .from('campaigns')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', campaign_id);

  return ok(res, { sent, failed, campaign_id });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CERTIFICATES (F1)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/certificates/generate — Génère un certificat PDF d'authenticité.
 * Utilise pdfkit (pas de Chrome sur Vercel).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routeCertificateGenerate(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);

  const { artwork_id } = req.body ?? {};
  if (!artwork_id) return fail(res, 'artwork_id requis');

  const { data: artwork, error: artworkErr } = await supabaseAdmin
    .from('artworks')
    .select('*, artists(name, country)')
    .eq('id', artwork_id)
    .single();

  if (artworkErr || !artwork) return fail(res, 'Œuvre introuvable', 404);
  if (artwork.status !== 'approved') return fail(res, 'Œuvre non approuvée');

  const PDFDocument = (await import('pdfkit')).default;

  const chunks = [];
  const doc    = new PDFDocument({ margin: 50, size: 'A4' });
  doc.on('data', chunk => chunks.push(chunk));

  const pdfBuffer = await new Promise((resolve, reject) => {
    doc.on('end',   () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc
      .fontSize(24).font('Helvetica-Bold').text('KUCIBOK', { align: 'center' })
      .fontSize(12).font('Helvetica').text("Certificat d'Authenticité", { align: 'center' })
      .moveDown(2);

    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown();

    doc
      .fontSize(14).font('Helvetica-Bold').text("Informations sur l'œuvre")
      .moveDown(0.5)
      .fontSize(11).font('Helvetica')
      .text(`Titre :        ${artwork.title}`)
      .text(`ID Kucibok :   ${artwork.kucibok_id ?? 'N/A'}`)
      .text(`Artiste :      ${artwork.artists?.name ?? artwork.title}`)
      .text(`Pays :         ${artwork.artists?.country ?? 'N/A'}`)
      .text(`Catégorie :    ${artwork.category ?? 'N/A'}`)
      .text(`Medium :       ${artwork.medium ?? 'N/A'}`)
      .text(`État :         ${artwork.condition ?? 'N/A'}`)
      .text(`Provenance :   ${artwork.provenance ?? 'N/A'}`)
      .text(`Dimensions :   ${artwork.height ?? '?'} cm × ${artwork.width ?? '?'} cm`)
      .text(`Poids :        ${artwork.weight ?? '?'} kg`)
      .text(`Édition :      ${artwork.edition_number ?? 1} / ${artwork.edition_total ?? 1}`)
      .text(`Prix :         ${artwork.price?.toLocaleString('fr-FR') ?? 'N/A'} ${artwork.currency ?? 'XOF'}`)
      .moveDown(1.5);

    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown();

    doc
      .fontSize(10).font('Helvetica-Oblique')
      .text(
        "Ce certificat atteste de l'authenticité de l'œuvre décrite ci-dessus, "
        + 'enregistrée et certifiée sur la plateforme Kucibok. '
        + 'Toute reproduction ou falsification est passible de poursuites.',
        { align: 'justify' },
      )
      .moveDown()
      .fontSize(10).font('Helvetica')
      .text(`Date de certification : ${new Date(artwork.created_at).toLocaleDateString('fr-FR')}`)
      .text(`Certifié le : ${new Date().toLocaleDateString('fr-FR')}`);

    doc.end();
  });

  const filename = `${artwork.kucibok_id ?? artwork_id}.pdf`;

  const { error: uploadErr } = await supabaseAdmin.storage
    .from('certificates')
    .upload(`artworks/${filename}`, pdfBuffer, { contentType: 'application/pdf', upsert: true });

  if (uploadErr) return fail(res, uploadErr.message);

  await supabaseAdmin
    .from('artworks')
    .update({ certificate_path: `artworks/${filename}` })
    .eq('id', artwork_id);

  await supabaseAdmin.from('documents').upsert({
    artwork_id,
    user_id: artwork.user_id,
    type:    'certificate',
    url:     `artworks/${filename}`,
  }, { onConflict: 'artwork_id,type' }).then(null, () => {});

  const { data: signedData } = await supabaseAdmin.storage
    .from('certificates')
    .createSignedUrl(`artworks/${filename}`, 3600);

  return ok(res, {
    certificate_url: signedData?.signedUrl,
    filename,
    kucibok_id: artwork.kucibok_id,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/profile/:id — Profil étendu (collector / professional / admin).
 * PUT /api/profile/:id — Mise à jour profil.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 * @param {string} id - user UUID
 */
async function routeProfile(req, res, id) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const { user } = authResult;

  const isAdmin = (await getDbRole(user.id)) === 'admin';
  if (!isAdmin && user.id !== id) return fail(res, 'Accès refusé', 403);

  if (req.method === 'GET') {
    // Chercher d'abord dans artists (rôle artiste)
    const { data: artistProfile } = await supabaseAdmin
      .from('artists').select('*').eq('user_id', id).single();

    if (artistProfile) {
      return ok(res, { ...artistProfile, userId: artistProfile.user_id, _id: artistProfile.id });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles').select('*').eq('user_id', id).single();

    if (!profile) return ok(res, { userId: id, _id: null });

    return ok(res, { ...profile, userId: profile.user_id, _id: profile.id });
  }

  if (req.method === 'PUT') {
    const role = user.user_metadata?.role;

    // telephone vit dans public.users, pas dans artists/profiles
    if (req.body?.telephone !== undefined) {
      await supabaseAdmin
        .from('users').update({ telephone: req.body.telephone }).eq('id', id);
    }

    if (role === 'artist') {
      const ALLOWED = ['name', 'username', 'image', 'country', 'biography', 'portfolio',
                       'facebook', 'twitter', 'instagram'];
      const updates = {};
      for (const key of ALLOWED) {
        if (req.body?.[key] !== undefined) updates[key] = req.body[key];
      }

      const { data: existing } = await supabaseAdmin
        .from('artists').select('id').eq('user_id', id).single();

      if (existing) {
        const { data, error } = await supabaseAdmin
          .from('artists').update(updates).eq('user_id', id).select().single();
        if (error) return fail(res, error.message);
        return ok(res, { ...data, userId: data.user_id, _id: data.id });
      }

      const { data, error } = await supabaseAdmin
        .from('artists').insert({ user_id: id, ...updates }).select().single();
      if (error) return fail(res, error.message);
      return ok(res, { ...data, userId: data.user_id, _id: data.id });
    }

    // Collector / professional → profiles
    const ALLOWED = ['username', 'name', 'country', 'interests', 'institution', 'qualifications', 'image'];
    const updates = {};
    for (const key of ALLOWED) {
      if (req.body?.[key] !== undefined) updates[key] = req.body[key];
    }

    const { data: existing } = await supabaseAdmin
      .from('profiles').select('id').eq('user_id', id).single();

    if (existing) {
      const { data, error } = await supabaseAdmin
        .from('profiles').update(updates).eq('user_id', id).select().single();
      if (error) return fail(res, error.message);
      return ok(res, { ...data, userId: data.user_id, _id: data.id });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles').insert({ user_id: id, ...updates }).select().single();
    if (error) return fail(res, error.message);
    return ok(res, { ...data, userId: data.user_id, _id: data.id });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENTS (CRM artiste)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET  /api/clients/      — Tous les clients de l'utilisateur authentifié.
 * GET  /api/clients/all   — Idem (alias).
 * POST /api/clients/add   — Crée un client.
 * PUT  /api/clients/update/:id — Met à jour un client.
 * DELETE /api/clients/delete/:id — Supprime un client.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 * @param {string} [sub]  — s1 : add | all | update | delete
 * @param {string} [id]   — s2 : UUID du client (update / delete)
 */
async function routeClients(req, res, sub, id) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const userId = authResult.user.id;

  // POST /api/clients/add
  if (req.method === 'POST' && sub === 'add') {
    const { name, email, telephone, country, notes } = req.body ?? {};
    if (!name && !email) return fail(res, 'name ou email requis');

    const { data, error } = await supabaseAdmin
      .from('clients')
      .insert({ user_id: userId, name: name ?? null, email: email ?? null, telephone: telephone ?? null, country: country ?? null, notes: notes ?? null })
      .select()
      .single();

    if (error) return fail(res, error.message);
    return ok(res, { client: { ...data, _id: data.id } }, 201);
  }

  // PUT /api/clients/update/:id
  if (req.method === 'PUT' && sub === 'update' && id) {
    const { name, email, telephone, country, notes } = req.body ?? {};
    const updates = {};
    if (name      !== undefined) updates.name      = name;
    if (email     !== undefined) updates.email     = email;
    if (telephone !== undefined) updates.telephone = telephone;
    if (country   !== undefined) updates.country   = country;
    if (notes     !== undefined) updates.notes     = notes;

    const { data, error } = await supabaseAdmin
      .from('clients')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) return fail(res, error.message);
    if (!data)  return fail(res, 'Client introuvable', 404);
    return ok(res, { client: { ...data, _id: data.id } });
  }

  // DELETE /api/clients/delete/:id
  if (req.method === 'DELETE' && sub === 'delete' && id) {
    const { error } = await supabaseAdmin
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) return fail(res, error.message);
    return ok(res, { deleted: true });
  }

  // GET /api/clients/ ou /api/clients/all
  if (req.method === 'GET' && (!sub || sub === 'all')) {
    const { data, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return fail(res, error.message);
    return ok(res, { clients: (data ?? []).map(c => ({ ...c, _id: c.id })) });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

// ═══════════════════════════════════════════════════════════════════════════════
// COLLECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET  /api/collection — Collections de l'utilisateur authentifié.
 * POST /api/collection — Crée une collection.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routeCollection(req, res) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const userId = authResult.user.id;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('collections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return fail(res, error.message);
    return ok(res, (data ?? []).map(c => ({ ...c, _id: c.id })));
  }

  if (req.method === 'POST') {
    const { name, description, image } = req.body ?? {};
    if (!name) return fail(res, 'name requis');

    const { data, error } = await supabaseAdmin
      .from('collections')
      .insert({ user_id: userId, name, description: description ?? null, image: image ?? null })
      .select()
      .single();

    if (error) return fail(res, error.message);
    return ok(res, { ...data, _id: data.id }, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}
