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
import { randomBytes, createHash }  from 'crypto';
import { readFileSync } from 'fs';
import { join }         from 'path';

// ─── Validation des variables d'environnement ────────────────────────────────

const REQUIRED_ENV = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
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

// SEC-009 : whitelist multi-origines (CORS_ORIGIN peut être une liste séparée par virgules)
const _allowedOrigins = (process.env.CORS_ORIGIN || 'https://kucibok.com')
  .split(',').map(o => o.trim()).filter(Boolean);

// ─── Rate limiting (in-memory, par instance Vercel) ─────────────────────────
const _rlMap = new Map();
function rateLimit(ip, windowMs = 60_000, max = 5) {
  const now = Date.now();
  const hits = (_rlMap.get(ip) ?? []).filter(t => now - t < windowMs);
  hits.push(now);
  _rlMap.set(ip, hits);
  return hits.length <= max;
}

// ─── HTML Sanitizer (serveur) ────────────────────────────────────────────────
// Défense en profondeur : le frontend sanitise via DOMPurify, mais on filtre
// aussi côté serveur avant stockage en base pour les contenus HTML (blogs).
// Pas de dépendance externe — regex ciblée sur les vecteurs XSS classiques.
function stripDangerousHtml(html) {
  if (typeof html !== 'string') return html;
  return html
    // Supprime les balises dangereux (avec tout leur contenu pour <script>)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/<form[\s\S]*?<\/form>/gi, '')
    // Supprime les handlers d'événements inline (on*)
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '')
    // Neutralise les hrefs/src javascript:
    .replace(/href\s*=\s*["']\s*javascript:[^"']*/gi, 'href="#"')
    .replace(/src\s*=\s*["']\s*javascript:[^"']*/gi, 'src=""');
}

// SEC-008 : Content-Security-Policy
const CSP = [
  "default-src 'self'",
  // 'unsafe-eval' requis par GTM ; 'unsafe-inline' requis par GTM et scripts inline index.html
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  // data: requis pour les polices base64 (ex: icônes inline)
  "font-src 'self' data: https://fonts.gstatic.com",
  // Supabase, Sentry, Google (GA4 + Ads + GTM), PayDunya, Logidoo, HIBP, ipify
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sentry.io https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://app.paydunya.com https://logidoo.africa https://api.pwnedpasswords.com https://api.ipify.org",
  // GTM iframe (noscript)
  "frame-src https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ');

/**
 * Applique les headers CORS dynamiques sur la réponse (whitelist multi-origines).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
function setCors(req, res) {
  const origin = req.headers.origin ?? '';
  if (_allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin',      origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, kcb-api-key');
  res.setHeader('Content-Security-Policy',      CSP);
  res.setHeader('X-Content-Type-Options',       'nosniff');
  res.setHeader('X-Frame-Options',              'DENY');
}

/**
 * Gère les requêtes OPTIONS (preflight CORS).
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 * @returns {boolean} true si preflight (le handler doit return immédiatement)
 */
function handleCors(req, res) {
  setCors(req, res);
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
  // CORS déjà posé par handleCors() en début de requête
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
  // CORS déjà posé par handleCors() en début de requête
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

  if (error || !dbUser) {
    return { error: 'Impossible de vérifier le rôle', status: 403 };
  }
  const userRole = dbUser.role ?? 'buyer';
  if (!roles.includes(userRole)) {
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
 * Vérifie que l'utilisateur est curator ou admin.
 *
 * @param {object} user
 * @returns {{ ok: true } | { error: string, status: number }}
 */
const requireCurator = async (user) => requireRole(user, ['curator', 'admin']);

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
  return data?.role ?? 'buyer';
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
    if (s0 === 'health' && s1 === 'payment') return await routeHealthPayment(req, res);
    if (s0 === 'health') return await routeHealth(req, res);

    // ── /api/cron/expire-subscriptions — appelé par Vercel Cron uniquement ────
    if (s0 === 'cron' && s1 === 'expire-subscriptions') return await routeCronExpireSubscriptions(req, res);

    // QR code et tracking publics — accessibles sans authentification
    if (s0 === 'artworks' && s1 === 'verify' && s2) return await routeVerifyArtwork(req, res, s2);
    if (s0 === 'delivery' && s1 === 'track'  && s2) return await routeTrackDelivery(req, res, s2);

    // ── /api/contact ─────────────────────────────────────────────────────────
    // Clé API comme frein anti-spam basique (non authentifié mais semi-protégé)
    if (s0 === 'contact' && req.method === 'POST') {
      const apiKeyCheck = requireApiKey(req);
      if (!apiKeyCheck.ok) return fail(res, apiKeyCheck.error, apiKeyCheck.status);
      return await routeContact(req, res);
    }

    // ── /api/report-error ────────────────────────────────────────────────────
    if (s0 === 'report-error') {
      const apiKeyCheck = requireApiKey(req);
      if (!apiKeyCheck.ok) return fail(res, apiKeyCheck.error, apiKeyCheck.status);
      return await routeReportError(req, res);
    }

    // ── /api/auth/* ──────────────────────────────────────────────────────────
    if (s0 === 'auth' && s1 === 'status' && s2) return await authSetStatus(req, res, s2);
    if (s0 === 'auth') return await routeAuth(req, res, s1);

    // ── /api/artworks/:id ────────────────────────────────────────────────────
    if (s0 === 'artworks' && s1) return await routeArtworkById(req, res, s1);

    // ── /api/artworks ────────────────────────────────────────────────────────
    if (s0 === 'artworks') return await routeArtworks(req, res);

    // ── /api/artist/:id ──────────────────────────────────────────────────────
    if (s0 === 'artist' && s1) return await routeArtistById(req, res, s1);

    // ── /api/artist ──────────────────────────────────────────────────────────
    if (s0 === 'artist') return await routeArtists(req, res);

    // ── /api/blog/comment/:id/:commentId ──────────────────────────────────────
    if (s0 === 'blog' && s1 === 'comment' && s2) return await routeBlogComment(req, res, s2, segments[3]);

    // ── /api/blog/publish/:id ──────────────────────────────────────────────────
    if (s0 === 'blog' && s1 === 'publish' && s2) return await routeBlogPublish(req, res, s2);

    // ── /api/blog/archive/:id ──────────────────────────────────────────────────
    if (s0 === 'blog' && s1 === 'archive' && s2) return await routeBlogArchive(req, res, s2);

    // ── /api/blog/published/user:id ────────────────────────────────────────────
    if (s0 === 'blog' && s1 === 'published' && s2?.startsWith('user')) return await routeBlogByUser(req, res, s2.replace('user', ''), 'published');

    // ── /api/blog/draft/user:id ────────────────────────────────────────────────
    if (s0 === 'blog' && s1 === 'draft' && s2?.startsWith('user')) return await routeBlogByUser(req, res, s2.replace('user', ''), 'draft');

    // ── /api/blog/archived/user:id ─────────────────────────────────────────────
    if (s0 === 'blog' && s1 === 'archived' && s2?.startsWith('user')) return await routeBlogByUser(req, res, s2.replace('user', ''), 'archived');

    // ── /api/blog/published ────────────────────────────────────────────────────
    if (s0 === 'blog' && s1 === 'published') return await routeBlogFiltered(req, res, 'published');

    // ── /api/blog/archived ─────────────────────────────────────────────────────
    if (s0 === 'blog' && s1 === 'archived') return await routeBlogFiltered(req, res, 'archived');

    // ── /api/blog/:id ──────────────────────────────────────────────────────────
    if (s0 === 'blog' && s1) return await routeBlogById(req, res, s1);

    // ── /api/blog ────────────────────────────────────────────────────────────
    if (s0 === 'blog') return await routeBlog(req, res);

    // ── /api/categories/:id (+ alias /api/category/:id) ─────────────────────
    if ((s0 === 'categories' || s0 === 'category') && s1) return await routeCategoryById(req, res, s1);

    // ── /api/categories (+ alias /api/category) ──────────────────────────────
    if (s0 === 'categories' || s0 === 'category') return await routeCategories(req, res);

    // ── /api/plans (+ alias /api/plan) ───────────────────────────────────────
    if (s0 === 'plans' || s0 === 'plan') return await routePlans(req, res);

    // ── /api/visitor/visit-time ────────────────────────────────────────────────
    if (s0 === 'visitor' && s1 === 'visit-time') return await routeVisitorTime(req, res);

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

    // ── /api/transaction/fail/:id ──────────────────────────────────────────────
    if (s0 === 'transaction' && s1 === 'fail' && s2) return await routeTransactionStatus(req, res, s2, 'failed');

    // ── /api/transaction/ref/:ref ──────────────────────────────────────────────
    if (s0 === 'transaction' && s1 === 'ref' && s2) return await routeTransactionByRef(req, res, decodeURIComponent(s2));

    // ── /api/transaction/:id ───────────────────────────────────────────────────
    if (s0 === 'transaction' && s1) return await routeTransactionById(req, res, s1);

    // ── /api/transactions/* ──────────────────────────────────────────────────
    if (s0 === 'transactions') return await routeTransactions(req, res, s1);

    // ── /api/subscription/fail/:id ─────────────────────────────────────────────
    if (s0 === 'subscription' && s1 === 'fail' && s2) return await routeSubscriptionStatus(req, res, s2, 'failed');

    // ── /api/subscription/activate/:id ─────────────────────────────────────────
    if (s0 === 'subscription' && s1 === 'activate' && s2) return await routeSubscriptionStatus(req, res, s2, 'active');

    // ── /api/subscription/cancel ─────────────────────────────────────────────
    if (s0 === 'subscription' && s1 === 'cancel') return await routeSubscriptionCancel(req, res);

    // ── /api/subscription/:id ──────────────────────────────────────────────────
    if (s0 === 'subscription' && s1) return await routeSubscriptionById(req, res, s1);

    // ── /api/subscription ────────────────────────────────────────────────────
    if (s0 === 'subscription') return await routeSubscription(req, res);

    // ── /api/sourcing ────────────────────────────────────────────────────────
    if (s0 === 'sourcing') return await routeSourcing(req, res);

    // ── /api/review/artwork/:id ────────────────────────────────────────────────
    if (s0 === 'review' && s1 === 'artwork' && s2) return await routeReviewByArtwork(req, res, s2);

    // ── /api/review ────────────────────────────────────────────────────────────
    if (s0 === 'review') return await routeReview(req, res);

    // ── /api/crm/export/csv ────────────────────────────────────────────────────
    if (s0 === 'crm' && s1 === 'export' && s2 === 'csv') return await routeCrmExport(req, res);

    // ── /api/crm/stats ─────────────────────────────────────────────────────────
    if (s0 === 'crm' && s1 === 'stats') return await routeCrmStats(req, res);

    // ── /api/crm/sync-from-transactions ────────────────────────────────────────
    if (s0 === 'crm' && s1 === 'sync-from-transactions') return await routeCrmSync(req, res);

    // ── /api/crm/clients/:id/notes/:noteId ─────────────────────────────────────
    if (s0 === 'crm' && s1 === 'clients' && s2 && segments[3] === 'notes') return await routeCrmNotes(req, res, s2, segments[4]);

    // ── /api/crm/clients/:id/interactions/:interactionId ───────────────────────
    if (s0 === 'crm' && s1 === 'clients' && s2 && segments[3] === 'interactions') return await routeCrmInteractions(req, res, s2, segments[4]);

    // ── /api/crm/clients/:id ───────────────────────────────────────────────────
    if (s0 === 'crm' && s1 === 'clients' && s2) return await routeCrmClientById(req, res, s2);

    // ── /api/crm/clients ───────────────────────────────────────────────────────
    if (s0 === 'crm' && s1 === 'clients') return await routeCrmClients(req, res);

    // ── /api/contacts/sync/* ───────────────────────────────────────────────────
    if (s0 === 'contacts' && s1 === 'sync') return await routeContactSync(req, res, s2, segments[3]);

    // ── /api/contacts/contacts/stats ───────────────────────────────────────────
    if (s0 === 'contacts' && s1 === 'contacts' && s2 === 'stats') return await routeContactStats(req, res);

    // ── /api/contacts/contacts/import ──────────────────────────────────────────
    if (s0 === 'contacts' && s1 === 'contacts' && s2 === 'import') return await routeContactImport(req, res);

    // ── /api/contacts/contacts/:id/unsubscribe ─────────────────────────────────
    if (s0 === 'contacts' && s1 === 'contacts' && s2 && segments[3] === 'unsubscribe') return await routeContactUnsubscribe(req, res, s2);

    // ── /api/contacts/contacts/:id ─────────────────────────────────────────────
    if (s0 === 'contacts' && s1 === 'contacts' && s2) return await routeContactById(req, res, s2);

    // ── /api/contacts/contacts ─────────────────────────────────────────────────
    if (s0 === 'contacts' && s1 === 'contacts') return await routeContacts(req, res);

    // ── /api/contacts/lists/:listId/rsvp ───────────────────────────────────────
    if (s0 === 'contacts' && s1 === 'lists' && s2 && segments[3] === 'rsvp') return await routeContactListRsvp(req, res, s2);

    // ── /api/contacts/lists/:id ────────────────────────────────────────────────
    if (s0 === 'contacts' && s1 === 'lists' && s2) return await routeContactListById(req, res, s2);

    // ── /api/contacts/lists ────────────────────────────────────────────────────
    if (s0 === 'contacts' && s1 === 'lists') return await routeContactLists(req, res);

    // ── /api/entities/:entityId/members/:memberId ──────────────────────────────
    if (s0 === 'entities' && s1 && s2 === 'members') return await routeEntityMembers(req, res, s1, segments[3]);

    // ── /api/entities/:id/switch ───────────────────────────────────────────────
    if (s0 === 'entities' && s1 && s2 === 'switch') return await routeEntitySwitch(req, res, s1);

    // ── /api/entities/:id ──────────────────────────────────────────────────────
    if (s0 === 'entities' && s1) return await routeEntityById(req, res, s1);

    // ── /api/entities ──────────────────────────────────────────────────────────
    if (s0 === 'entities') return await routeEntities(req, res);

    // ── /api/integrations/stats ────────────────────────────────────────────────
    if (s0 === 'integrations' && s1 === 'stats') return await routeIntegrationStats(req, res);

    // ── /api/integrations/:id/sync ─────────────────────────────────────────────
    if (s0 === 'integrations' && s1 && s2 === 'sync') return await routeIntegrationSync(req, res, s1);

    // ── /api/integrations/:id ──────────────────────────────────────────────────
    if (s0 === 'integrations' && s1) return await routeIntegrationById(req, res, s1);

    // ── /api/integrations ──────────────────────────────────────────────────────
    if (s0 === 'integrations') return await routeIntegrations(req, res);

    // ── /api/professional-analytics/realtime ───────────────────────────────────
    if (s0 === 'professional-analytics' && s1 === 'realtime') return await routeProAnalyticsRealtime(req, res);

    // ── /api/professional-analytics ────────────────────────────────────────────
    if (s0 === 'professional-analytics') return await routeProAnalytics(req, res);

    // ── /api/campaigns/campaigns/:id/* ─────────────────────────────────────────
    if (s0 === 'campaigns' && s1 === 'campaigns') return await routeCampaignsCrud(req, res, s2, segments[3]);

    // ── /api/campaigns/send ──────────────────────────────────────────────────
    if (s0 === 'campaigns' && s1 === 'send') return await routeCampaignSend(req, res);

    // ── /api/certificates/generate ───────────────────────────────────────────
    if (s0 === 'certificates' && s1 === 'generate') return await routeCertificateGenerate(req, res);

    // ── /api/certificates/url/:artworkId ─────────────────────────────────────
    if (s0 === 'certificates' && s1 === 'url' && s2) return await routeCertificateUrl(req, res, s2);

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
/**
 * GET /api/health/payment — Diagnostic PayDunya (clés + connectivité).
 * Public, sans auth. Ne crée aucun paiement.
 */
async function routeHealthPayment(req, res) {
  const mode     = PAYDUNYA_MODE;
  const endpoint = PAYDUNYA_ENDPOINTS[mode];
  const keysPresent = {
    master:  !!PAYDUNYA_MASTER_KEY,
    private: !!PAYDUNYA_PRIVATE_KEY,
    token:   !!PAYDUNYA_TOKEN,
  };

  // Tester la connectivité PayDunya avec un ping minimal
  let pdReachable = false;
  let pdStatus    = null;
  let pdBody      = null;
  try {
    const testRes = await fetch(endpoint, {
      method:  'POST',
      headers: {
        'Content-Type':         'application/json',
        'PAYDUNYA-MASTER-KEY':  PAYDUNYA_MASTER_KEY  ?? '',
        'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY ?? '',
        'PAYDUNYA-TOKEN':       PAYDUNYA_TOKEN        ?? '',
      },
      body: JSON.stringify({ invoice: { total_amount: 1, description: 'test', currency: 'XOF' }, store: { name: 'test' } }),
    });
    pdStatus    = testRes.status;
    pdReachable = true;
    const raw   = await testRes.text();
    try { pdBody = JSON.parse(raw); } catch { pdBody = raw.slice(0, 200); }
  } catch (err) {
    pdBody = err.message;
  }

  return res.status(200).json({
    mode,
    endpoint:    endpoint ?? 'INVALIDE',
    keys:        keysPresent,
    pd_reachable: pdReachable,
    pd_status:   pdStatus,
    pd_response: pdBody,
    timestamp:   new Date().toISOString(),
  });
}

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
// CONTACT FORM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/contact — Public contact form submission.
 * Sends an email to the admin via Resend.
 */
async function routeContact(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ?? 'unknown';
  if (!rateLimit(ip, 60_000, 5)) return fail(res, 'Trop de requêtes. Réessayez dans une minute.', 429);

  const { name, email, subject, message } = req.body ?? {};
  if (!name || !email || !message) return fail(res, 'Nom, email et message requis');

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from:    `Kucibok Contact <${process.env.ADMIN_EMAIL ?? 'noreply@kucibok.com'}>`,
    to:      process.env.ADMIN_EMAIL,
    replyTo: email,
    subject: `[Contact] ${esc(subject || 'Message depuis kucibok.com')}`,
    html: `
      <h2>Nouveau message — Formulaire de contact</h2>
      <p><strong>Nom :</strong> ${esc(name)}</p>
      <p><strong>Email :</strong> ${esc(email)}</p>
      <p><strong>Sujet :</strong> ${esc(subject)}</p>
      <hr/>
      <p>${esc(message).replace(/\n/g, '<br/>')}</p>
      <p><em>${new Date().toISOString()}</em></p>
    `,
  });

  return ok(res, { sent: true });
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
  // GET /api/auth — liste tous les utilisateurs (admin uniquement)
  if (!action && req.method === 'GET') return await authListUsers(req, res);

  // GET|PUT|DELETE /api/auth/:uuid — lookup, mise à jour ou suppression par ID
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (action && UUID_RE.test(action)) {
    if (req.method === 'GET')    return await authGetById(req, res, action);
    if (req.method === 'PUT')    return await authUpdateById(req, res, action);
    if (req.method === 'DELETE') return await authDeleteById(req, res, action);
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ?? 'unknown';

  // Rate limiting par action sensible
  if (action === 'signup' && !rateLimit(`signup:${ip}`, 3_600_000, 5))
    return fail(res, 'Trop de tentatives d\'inscription. Réessayez dans une heure.', 429);
  if (action === 'signin' && !rateLimit(`signin:${ip}`, 60_000, 10))
    return fail(res, 'Trop de tentatives de connexion. Réessayez dans une minute.', 429);
  if (action === 'forgot-password' && !rateLimit(`forgot:${ip}`, 900_000, 3))
    return fail(res, 'Trop de demandes de réinitialisation. Réessayez dans 15 minutes.', 429);

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
    case 'create-buyer':    return await authCreateBuyer(req, res);
    case 'set-role':        return await authSetRole(req, res);
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
 * POST /api/auth/set-role — Attribution du rôle initial après inscription Google OAuth.
 * Sécurité : uniquement autorisé si le rôle actuel est 'buyer' (défaut post-inscription).
 * Rôles autorisés : 'artist', 'curator' uniquement.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function authSetRole(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const userId = authResult.user.id;

  const { role } = req.body ?? {};
  const ALLOWED_ROLES = ['artist', 'curator'];
  if (!role || !ALLOWED_ROLES.includes(role)) {
    return fail(res, `Rôle invalide. Valeurs acceptées : ${ALLOWED_ROLES.join(', ')}`, 400);
  }

  // Vérifier que le rôle actuel est 'buyer' (empêche l'escalade de privilèges)
  const { data: dbUser, error: dbErr } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (dbErr || !dbUser) return fail(res, 'Utilisateur introuvable', 404);
  if (dbUser.role !== 'buyer') {
    return fail(res, 'Le rôle ne peut être modifié qu\'à l\'inscription initiale', 403);
  }

  // Mettre à jour public.users
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();

  if (error) return fail(res, error.message);

  // Synchroniser user_metadata Supabase Auth
  await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { role },
  });

  // Créer le profil métier si inexistant (inscription OAuth)
  const profileName = data.name ?? null;
  if (role === 'artist') {
    const { data: existing } = await supabaseAdmin
      .from('artists').select('id').eq('user_id', userId).maybeSingle();
    if (!existing) {
      await supabaseAdmin.from('artists')
        .insert({ user_id: userId, name: profileName })
        .then(null, () => {});
    }
  } else if (role === 'curator') {
    const { data: existing } = await supabaseAdmin
      .from('profiles').select('id').eq('user_id', userId).maybeSingle();
    if (!existing) {
      await supabaseAdmin.from('profiles')
        .insert({ user_id: userId, name: profileName })
        .then(null, () => {});
    }
  }

  return ok(res, { _id: data.id, ...data });
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
 * GET /api/auth — Liste tous les utilisateurs (admin uniquement).
 */
async function authListUsers(req, res) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const adminCheck = await requireAdmin(authResult.user);
  if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

  const { data: profiles, error: profileError } = await supabaseAdmin
    .from('users')
    .select('id, name, username, role, country, telephone, is_active, created_at, auth_provider')
    .order('created_at', { ascending: false });

  if (profileError) return fail(res, profileError.message);

  const { data: authData } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const emailMap = {};
  if (authData?.users) {
    for (const u of authData.users) emailMap[u.id] = u.email;
  }

  const users = profiles.map(p => ({
    ...p,
    _id:       p.id,
    email:     emailMap[p.id] || null,
    isActive:  p.is_active,
    createdAt: p.created_at,
  }));
  return ok(res, users);
}

/**
 * DELETE /api/auth/:id — Supprime un utilisateur (admin uniquement).
 */
async function authDeleteById(req, res, id) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const adminCheck = await requireAdmin(authResult.user);
  if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

  if (authResult.user.id === id) return fail(res, 'Vous ne pouvez pas supprimer votre propre compte', 403);

  const { data: userToDelete } = await supabaseAdmin.from('users').select('id, name, role').eq('id', id).single();
  if (!userToDelete) return notFound(res, 'Utilisateur');

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) return fail(res, error.message);

  return ok(res, { ...userToDelete, _id: id });
}

/**
 * GET /api/auth/status/:id — Bascule is_active d'un utilisateur (admin uniquement).
 */
async function authSetStatus(req, res, id) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const adminCheck = await requireAdmin(authResult.user);
  if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

  const { data: current } = await supabaseAdmin.from('users').select('id, name, role, is_active').eq('id', id).single();
  if (!current) return notFound(res, 'Utilisateur');

  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ is_active: !current.is_active })
    .eq('id', id)
    .select()
    .single();

  if (error) return fail(res, error.message);
  return ok(res, { ...data, _id: data.id, isActive: data.is_active });
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
  if (password.length < 8) return fail(res, 'Mot de passe requis (min. 8 caractères)');
  if (!['artist', 'curator'].includes(role)) {
    return fail(res, 'Rôle invalide. Valeurs acceptées : artist, curator');
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm:  true, // auto-confirme pour éviter les erreurs SMTP Supabase — on gère l'email nous-mêmes
    user_metadata:  { role, name: name ?? null, country: country ?? null, username: username ?? null },
  });

  if (error) return fail(res, error.message);

  // Créer l'entrée dans public.users (complète le trigger auth si présent)
  await supabaseAdmin.from('users').insert({
    id:           data.user.id,
    name:         name ?? null,
    role:         role ?? 'buyer',
    country:      country ?? null,
    auth_provider: 'email',
    is_active:    true,
  }).then(null, () => {}); // ignorer si déjà créé par le trigger

  // Créer le profil métier selon le rôle
  if (role === 'artist') {
    await supabaseAdmin.from('artists').insert({
      user_id:  data.user.id,
      name:     name ?? null,
      country:  country ?? null,
      username: username ?? null,
    }).then(null, () => {});
  } else if (role === 'curator') {
    await supabaseAdmin.from('profiles').insert({
      user_id:  data.user.id,
      name:     name ?? null,
      country:  country ?? null,
      username: username ?? null,
    }).then(null, () => {});
  }

  // Envoyer un magic link de bienvenue via Resend (indépendant du SMTP Supabase)
  try {
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type:    'magiclink',
      email,
      options: { redirectTo: `${BASE_URL}/auth/callback` },
    });

    if (linkError) {
      console.error('[signup] generateLink error:', linkError.message);
    }

    if (!linkError && linkData?.properties?.action_link) {
      const { Resend } = await import('resend');
      const resend    = new Resend(process.env.RESEND_API_KEY);
      // Toujours envoyer depuis un domaine vérifié sur Resend (@kucibok.com)
      const fromEmail = 'Kucibok <noreply@kucibok.com>';
      const firstName = name ? name.split(' ')[0] : null;

      const { error: sendError } = await resend.emails.send({
        from:    fromEmail,
        to:      email,
        subject: 'Bienvenue sur Kucibok — Accédez à votre compte',
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <body style="margin:0;padding:0;background:#0f0f0f;font-family:'DM Sans',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 16px;">
              <tr><td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:4px;overflow:hidden;max-width:480px;width:100%;">
                  <tr><td style="height:4px;background:#c49b46;"></td></tr>
                  <tr><td style="padding:40px 40px 32px;">
                    <p style="margin:0 0 24px;font-size:13px;color:#888;letter-spacing:2px;text-transform:uppercase;">Kucibok Bridge</p>
                    <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#ffffff;font-family:Georgia,serif;">
                      ${firstName ? `Bienvenue, ${firstName} !` : 'Bienvenue sur Kucibok !'}
                    </h1>
                    <p style="margin:0 0 28px;font-size:15px;color:#aaa;line-height:1.6;">
                      Votre compte est créé. Cliquez sur le bouton ci-dessous pour accéder à votre espace.
                    </p>
                    <a href="${linkData.properties.action_link}"
                       style="display:inline-block;padding:14px 28px;background:#c49b46;color:#0f0f0f;text-decoration:none;font-weight:700;font-size:14px;border-radius:4px;letter-spacing:0.5px;">
                      Accéder à mon compte
                    </a>
                    <p style="margin:32px 0 0;font-size:12px;color:#555;line-height:1.6;">
                      Ce lien expire dans 24h. Si vous n'avez pas créé de compte sur kucibok.com, ignorez cet email.
                    </p>
                  </td></tr>
                  <tr><td style="padding:16px 40px;border-top:1px solid #2a2a2a;">
                    <p style="margin:0;font-size:11px;color:#444;">© Kucibok — Infrastructure de l'art africain</p>
                  </td></tr>
                </table>
              </td></tr>
            </table>
          </body>
          </html>
        `,
      });

      if (sendError) {
        console.error('[signup] Resend send error:', sendError.message ?? JSON.stringify(sendError));
      }
    }
  } catch (err) {
    console.error('[signup] Email flow exception:', err?.message ?? err);
    // Ne pas bloquer l'inscription si l'envoi échoue
  }

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

  const { oldPassword, password } = req.body ?? {};
  if (!oldPassword) return fail(res, "L'ancien mot de passe est requis");
  if (!password || password.length < 8) return fail(res, 'Nouveau mot de passe requis (min. 8 caractères)');

  // Vérifier l'ancien mot de passe via Supabase Auth (anon client)
  const { createClient: createAnonClient } = await import('@supabase/supabase-js');
  const supabaseAnon = createAnonClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const { error: signInError } = await supabaseAnon.auth.signInWithPassword({
    email: authResult.user.email,
    password: oldPassword,
  });
  if (signInError) return fail(res, 'Ancien mot de passe incorrect', 403);

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

  // Utilisateur existant avec rôle — retourner directement (tout rôle DB valide = pas de re-sélection)
  if (existingRole) {
    return ok(res, {
      needs_role_selection: false,
      user: { id: user.id, email: user.email, role: existingRole },
    });
  }

  // Nouvel utilisateur Google sans rôle — demander la sélection
  const { role } = req.body ?? {};
  if (!['artist', 'curator'].includes(role)) {
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
 * POST /api/auth/create-buyer — Crée un compte buyer léger pour le checkout guest.
 * Accepte { email, name, phone }. Retourne un session token pour usage immédiat.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function authCreateBuyer(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  const { email, name, phone } = req.body ?? {};
  if (!email) return fail(res, 'Email requis');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(res, 'Format email invalide');

  // Vérifier si l'email est déjà enregistré (query ciblée, pas listUsers)
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (existingUser) {
    return fail(res, 'Un compte avec cet email existe déjà. Veuillez vous connecter.', 409);
  }

  // Générer un mot de passe temporaire (le buyer devra le définir après achat)
  const tempPassword = randomBytes(16).toString('hex');

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password:       tempPassword,
    email_confirm:  true, // Auto-confirmer pour permettre le paiement immédiat
    user_metadata:  { role: 'buyer', name: name ?? null, phone: phone ?? null },
  });

  if (error) return fail(res, error.message);

  // Créer l'entrée dans public.users
  await supabaseAdmin.from('users').insert({
    id:            data.user.id,
    name:          name ?? null,
    role:          'buyer',
    telephone:     phone ?? null,
    auth_provider: 'email',
    is_active:     true,
  }).then(null, () => {});

  // Créer une session pour le buyer
  const supabaseAnon = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: signInData, error: signInError } = await supabaseAnon.auth.signInWithPassword({
    email,
    password: tempPassword,
  });

  if (signInError) return fail(res, 'Compte créé mais connexion échouée. Veuillez vous connecter manuellement.');

  return ok(res, {
    access_token:  signInData.session.access_token,
    refresh_token: signInData.session.refresh_token,
    expires_at:    signInData.session.expires_at,
    user: {
      id:    data.user.id,
      email: data.user.email,
      role:  'buyer',
      name:  name ?? null,
    },
  }, 201);
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
    users = [{ email, first_name: first_name ?? '', role: role ?? 'buyer' }];
  }
  if (!Array.isArray(users) || !users.length) return fail(res, 'users doit être un tableau non vide');

  const { Resend } = await import('resend');
  const resend    = new Resend(process.env.RESEND_API_KEY);
  const SITE_URL  = (process.env.CORS_ORIGIN ?? 'https://kucibok.com').replace(/\/$/, '');
  const results   = [];

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (const u of users) {
    const { email, first_name = '', role = 'buyer' } = u;

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
      const templateName = role === 'artist' ? 'welcome-artist' : 'welcome-buyer';
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

    // Sécurité : forcer status=approved pour les non-admins AVANT tout filtre
    const effectiveStatus = callerIsAdmin ? status : 'approved';
    if (effectiveStatus) query = query.eq('status', effectiveStatus);
    if (category)  query = query.eq('category', category);
    if (for_sale)  query = query.eq('for_sale', for_sale === 'true');
    if (featured)  query = query.eq('featured', featured === 'true');
    if (artist_id) query = query.eq('artist_id', artist_id);
    if (user_id)   query = query.eq('user_id', user_id);

    const { data, error, count } = await query;
    if (error) return fail(res, error.message);
    const normalized = (data ?? []).map(a => ({
      ...a,
      _id: a.id,
      artist: a.artists?.name ?? a.artist ?? null,
      image: a.image?.includes('backend.kucibok.com') ? null : (a.image ?? null),
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
      artistId, for_sale, availability_status, edition_number, edition_total,
    } = req.body ?? {};

    if (!title) return fail(res, 'Le titre est requis');
    if (!image) return fail(res, "L'image est requise");
    if (price == null) return fail(res, 'Le prix est requis');

    let resolvedArtistId = artistId ?? null;
    if (!resolvedArtistId && (await getDbRole(user.id)) === 'artist') {
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
        medium:         medium || null,
        condition:      condition || null,
        provenance:     provenance || null,
        height:         height ? Number(height) : null,
        width:          width  ? Number(width)  : null,
        weight:         weight ? Number(weight) : null,
        price:          Number(price),
        currency:       currency ?? 'XOF',
        category:       category ?? null,
        tags:           (() => { if (!tags) return []; if (Array.isArray(tags)) return tags; try { const p = JSON.parse(tags); return Array.isArray(p) ? p : [String(p)]; } catch { return String(tags).split(',').map(t => t.trim()).filter(Boolean); } })(),
        for_sale:            for_sale === true || for_sale === 'true',
        availability_status: availability_status ?? 'available',
        edition_number:      edition_number ? Number(edition_number) : 1,
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

    // Non-approved artworks are only visible to admin or the owner
    if (data.status !== 'approved') {
      const authResult = await requireAuth(req).catch(() => ({}));
      const callerId = authResult?.user?.id;
      const callerRole = callerId ? await getDbRole(callerId) : null;
      if (callerRole !== 'admin' && callerId !== data.user_id) {
        return notFound(res, 'Œuvre');
      }
    }

    // Incrémenter les visites en arrière-plan (non bloquant)
    (async () => { try { await supabaseAdmin.rpc('increment_artwork_visited', { artwork_id: id }); } catch {} })();
    const image = data.image?.includes('backend.kucibok.com') ? null : (data.image ?? null);
    return ok(res, { ...data, _id: data.id, artist: data.artists?.name ?? data.artist ?? null, image });
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

    // Valider la transition depuis le statut courant
    const { data: current } = await supabaseAdmin
      .from('artworks').select('status').eq('id', id).single();
    if (!current) return notFound(res, 'Œuvre');
    if (current.status === status) return fail(res, `L'œuvre est déjà en statut "${status}"`, 409);

    const VALID_TRANSITIONS = {
      pending:  ['approved', 'rejected'],
      approved: ['rejected'],
      rejected: ['approved', 'pending'],
    };
    if (!VALID_TRANSITIONS[current.status]?.includes(status)) {
      return fail(res, `Transition invalide : "${current.status}" → "${status}"`, 409);
    }

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
    // NOTE: race condition — concurrent reads can lose increments. Use Supabase RPC atomic increment when available.
    (async () => { try { await supabaseAdmin.rpc('increment_field', { table_name: 'artists', column_name: 'visited', row_id: data.id }).then(({ error }) => { if (error) { supabaseAdmin.from('artists').update({ visited: (data.visited ?? 0) + 1 }).eq('id', data.id); } }); } catch { try { await supabaseAdmin.from('artists').update({ visited: (data.visited ?? 0) + 1 }).eq('id', data.id); } catch {} } })();

    return ok(res, data);
  }

  if (req.method === 'PUT') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const { user } = authResult;

    const isAdmin = (await getDbRole(user.id)) === 'admin';

    // Le frontend envoie le user UUID (pas l'artist UUID) — chercher par user_id
    const { data: existing } = await supabaseAdmin
      .from('artists').select('id, user_id').eq('user_id', id).single();

    const ALLOWED = ['name', 'username', 'image', 'country', 'biography', 'portfolio',
                     'facebook', 'twitter', 'instagram'];
    const updates = {};
    for (const key of ALLOWED) {
      if (req.body?.[key] !== undefined) updates[key] = req.body[key];
    }

    if (!existing) {
      // Pas encore de profil artiste — créer à la volée (upsert)
      if (!isAdmin && user.id !== id) return fail(res, 'Accès refusé', 403);
      const { data, error } = await supabaseAdmin
        .from('artists').insert({ user_id: id, ...updates }).select().single();
      if (error) return fail(res, error.message);
      return ok(res, { ...data, userId: data.user_id, _id: data.id }, 201);
    }

    if (!isAdmin && existing.user_id !== user.id) return fail(res, 'Accès refusé', 403);
    if (Object.keys(updates).length === 0) return fail(res, 'Aucune modification fournie');

    const { data, error } = await supabaseAdmin
      .from('artists').update(updates).eq('user_id', id).select().single();
    if (error) return fail(res, error.message);
    return ok(res, { ...data, userId: data.user_id, _id: data.id });
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
    const curatorCheck = await requireCurator(authResult.user);
    if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);

    const { title, content, image, category, tags, published } = req.body ?? {};
    if (!title) return fail(res, 'Titre requis');

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert({
        user_id:   authResult.user.id,
        title, content: stripDangerousHtml(content), image,
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

/**
 * DELETE /api/categories/:id — Supprime une catégorie (admin).
 */
async function routeCategoryById(req, res, id) {
  if (req.method !== 'DELETE') return fail(res, 'Méthode non autorisée', 405);

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const adminCheck = await requireAdmin(authResult.user);
  if (!adminCheck.ok) return fail(res, adminCheck.error, adminCheck.status);

  const { data, error } = await supabaseAdmin
    .from('categories').delete().eq('id', id).select().single();
  if (error) return fail(res, error.message);
  return ok(res, data);
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
      const safeSearch = search.replace(/%/g, '\\%').replace(/_/g, '\\_');
      query = query.ilike('name', `%${safeSearch}%`);
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
      .insert({ name, email, description, location, website, image })
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

  const FIELD_MAX = { name: 255, description: 2000, location: 255, website: 500, image: 500 };
  const rows = galleries.map(g => ({
    name:        String(g.name ?? '').trim().slice(0, FIELD_MAX.name),
    description: g.description ? String(g.description).trim().slice(0, FIELD_MAX.description) : null,
    location:    g.location    ? String(g.location).trim().slice(0, FIELD_MAX.location)    : null,
    website:     g.website     ? String(g.website).trim().slice(0, FIELD_MAX.website)     : null,
    image:       g.image       ? String(g.image).trim().slice(0, FIELD_MAX.image)         : null,
  }));

  const invalid = rows.find(r => !r.name);
  if (invalid) return fail(res, 'Chaque galerie doit avoir un nom non vide');

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
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ?? 'unknown';
    if (!rateLimit(ip, 10_000, 10)) return ok(res, { throttled: true }, 200);
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
  const userId = authResult.user.id;
  const role = await getDbRole(userId);

  if (req.method === 'GET') {
    let query = supabaseAdmin.from('numerisation_requests').select('*').eq('id', id);
    if (role !== 'admin') query = query.eq('user_id', userId);
    const { data, error } = await query.single();
    if (error || !data) return fail(res, 'Demande introuvable', 404);
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'PUT') {
    const { notes } = req.body ?? {};
    let query = supabaseAdmin.from('numerisation_requests').update({ notes }).eq('id', id);
    if (role !== 'admin') query = query.eq('user_id', userId);
    const { data, error } = await query.select().single();
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
  const VALID_NR_STATUSES = ['pending', 'in_progress', 'completed', 'cancelled'];
  if (!status || !VALID_NR_STATUSES.includes(status)) return fail(res, 'statut invalide');

  const { data, error } = await supabaseAdmin
    .from('numerisation_requests').update({ status }).eq('id', id).select().single();
  if (error) return fail(res, error.message);
  return ok(res, { ...data, _id: data.id });
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENTS — PAYDUNYA
// ═══════════════════════════════════════════════════════════════════════════════

const PAYDUNYA_MODE        = (process.env.PAYDUNYA_MODE ?? 'test').toLowerCase();
const PAYDUNYA_MASTER_KEY  = process.env.PAYDUNYA_MASTER_KEY;
const PAYDUNYA_PRIVATE_KEY = process.env.PAYDUNYA_PRIVATE_KEY;
const PAYDUNYA_TOKEN       = process.env.PAYDUNYA_TOKEN;
const PAYMENT_BASE_URL     = process.env.CORS_ORIGIN ?? 'https://kucibok.com';

const PAYDUNYA_ENDPOINTS = {
  test: 'https://app.paydunya.com/sandbox-api/v1/checkout-invoice/create',
  live: 'https://app.paydunya.com/api/v1/checkout-invoice/create',
};

const PAYDUNYA_VERIFY_ENDPOINTS = {
  test: 'https://app.paydunya.com/sandbox-api/v1/checkout-invoice/confirm/',
  live: 'https://app.paydunya.com/api/v1/checkout-invoice/confirm/',
};

/**
 * POST /api/payments/paydunya-init — Initialise un paiement PayDunya.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function routePaydunyaInit(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  // Auth est OPTIONNEL pour les achats d'œuvre (checkout invité). Pour les
  // abonnements/plans, on impose toujours l'auth car l'abonnement est lié à
  // un user_id en base.
  let user = null;
  const authResult = await requireAuth(req);
  if (!authResult.error) user = authResult.user;

  const { type, artwork_id, plan_id, currency, guest } = req.body ?? {};

  if (!['artwork', 'subscription', 'plan'].includes(type)) {
    return fail(res, 'Type de paiement invalide');
  }

  if ((type === 'subscription' || type === 'plan') && !user) {
    return fail(res, 'Connexion requise pour souscrire à un abonnement', 401);
  }

  // Identité de l'acheteur (auth ou invité). Pour un invité on exige email +
  // nom afin de pouvoir livrer l'œuvre et envoyer le reçu.
  let buyerName, buyerEmail, buyerPhone;
  if (user) {
    buyerEmail = guest?.email ?? user.email ?? null;
    buyerName  = guest?.name  ?? user.user_metadata?.name ?? null;
    buyerPhone = guest?.phone ?? user.user_metadata?.telephone ?? null;
  } else {
    if (!guest?.email || !guest?.name) {
      return fail(res, 'Pour acheter sans compte, renseignez nom et email', 400);
    }
    buyerEmail = guest.email;
    buyerName  = guest.name;
    buyerPhone = guest.phone ?? null;
  }

  // Valider le mode PayDunya
  const pdEndpoint = PAYDUNYA_ENDPOINTS[PAYDUNYA_MODE];
  if (!pdEndpoint) return fail(res, `Mode PayDunya invalide : ${PAYDUNYA_MODE}`, 500);

  let amount, description, returnUrl, cancelUrl, ref, artworkCurrency, sellerId = null;

  if (type === 'artwork') {
    if (!artwork_id) return fail(res, 'artwork_id requis');

    const { data: artwork, error: artworkError } = await supabaseAdmin
      .from('artworks')
      .select('id, title, price, currency, status, sold, user_id')
      .eq('id', artwork_id)
      .single();

    if (artworkError || !artwork) return fail(res, 'Œuvre introuvable', 404);
    if (artwork.sold)             return fail(res, 'Œuvre déjà vendue', 409);
    if (artwork.status !== 'approved') return fail(res, 'Œuvre non disponible à la vente', 409);

    // NUMERIC PostgreSQL renvoie un string côté JS ; on force en number pour PayDunya.
    amount          = Number(artwork.price);
    artworkCurrency = artwork.currency ?? 'XOF';
    sellerId        = artwork.user_id;
    if (!amount || amount <= 0) return fail(res, 'Prix de l\'œuvre invalide');

    description = `Achat : ${artwork.title}`;
    ref         = `ART-${artwork_id}-${Date.now()}`;
    returnUrl   = `${PAYMENT_BASE_URL}/artwork-purchase-success?ref=${ref}`;
    cancelUrl   = `${PAYMENT_BASE_URL}/artwork-purchase-failed`;
  } else {
    if (!plan_id) return fail(res, 'plan_id requis');

    const { data: plan, error: planError } = await supabaseAdmin
      .from('plans')
      .select('id, name, price, currency')
      .eq('id', plan_id).eq('is_active', true).single();

    if (planError || !plan) return fail(res, 'Plan introuvable', 404);

    amount          = Number(plan.price);
    artworkCurrency = plan.currency ?? 'XOF';
    if (!amount || amount <= 0) return fail(res, 'Prix du plan invalide');

    description = `Abonnement : ${plan.name}`;
    ref         = `PLAN-${plan_id}-${Date.now()}`;
    returnUrl   = `${PAYMENT_BASE_URL}/subscription-success?plan_id=${plan_id}&ref=${ref}`;
    cancelUrl   = `${PAYMENT_BASE_URL}/subscription-failed`;
  }

  const payload = {
    invoice: {
      total_amount: amount,
      description,
      currency: currency ?? artworkCurrency ?? 'XOF',
      customer: {
        name:  buyerName  ?? '',
        email: buyerEmail ?? '',
        phone: buyerPhone ?? '',
      },
    },
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
      user_id:     user?.id ?? null,
      type,
      ref,
      artwork_id:  artwork_id ?? null,
      plan_id:     plan_id ?? null,
      buyer_email: buyerEmail,
      buyer_name:  buyerName,
      buyer_phone: buyerPhone,
    },
  };

  let pdResult;
  try {
    const pdRes = await fetch(pdEndpoint, {
      method:  'POST',
      headers: {
        'Content-Type':         'application/json',
        'PAYDUNYA-MASTER-KEY':  PAYDUNYA_MASTER_KEY,
        'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
        'PAYDUNYA-TOKEN':       PAYDUNYA_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const rawText = await pdRes.text();
    try {
      pdResult = JSON.parse(rawText);
    } catch {
      console.error('[PayDunya] Réponse non-JSON :', rawText.slice(0, 300));
      return fail(res, 'Réponse inattendue de PayDunya, vérifiez les clés API', 502);
    }
  } catch (fetchErr) {
    console.error('[PayDunya] Erreur réseau :', fetchErr?.message);
    return fail(res, 'Impossible de joindre PayDunya, réessayez', 502);
  }

  if (!pdResult || typeof pdResult !== 'object' || pdResult.response_code !== '00') {
    console.error('[PayDunya] Réponse invalide :', JSON.stringify(pdResult)?.slice(0, 200));
    return fail(res, pdResult?.response_text ?? 'Erreur PayDunya, paiement non initié');
  }

  // Tracer l'intention d'achat avant la redirection PayDunya. Sans cette
  // ligne, un paiement abandonné ou un webhook qui n'arrive pas ne laisse
  // aucune trace en base, et l'admin ne voit jamais qui a essayé d'acheter.
  // Le callback fera UPDATE sur cette ligne au moment de la confirmation.
  if (type === 'artwork') {
    const { error: txInsertErr } = await supabaseAdmin.from('transactions').insert({
      artwork_id,
      buyer_id:       user?.id ?? null,
      seller_id:      sellerId,
      amount,
      currency:       artworkCurrency,
      status:         'pending',
      payment_method: 'paydunya',
      payment_ref:    ref,
      buyer_email:    buyerEmail,
      buyer_phone:    buyerPhone,
      buyer_name:     buyerName,
    });
    if (txInsertErr) {
      // Non bloquant : le callback fera un INSERT en fallback si l'UPDATE
      // ne trouve aucune ligne pending pour ce ref.
      console.error('[PayDunya] Erreur INSERT pending transaction :', txInsertErr.message);
    }
  }

  return ok(res, { payment_url: pdResult.response_text, token: pdResult.token, ref });
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
    // Le webhook PayDunya arrive en application/x-www-form-urlencoded sous
    // la forme data[token]=..., data[hash]=..., data[status]=..., etc.
    // Le parseur de Vercel reconstruit l'objet imbriqué -> req.body.data.
    const paymentData = req.body?.data;
    if (!paymentData || typeof paymentData !== 'object') {
      return fail(res, 'Données PayDunya manquantes');
    }

    // Vérifier le hash PayDunya : SHA-512 de la MasterKey, fourni dans
    // data.hash (et NON dans un header). C'est ce que la doc API PAR
    // section IPN spécifie explicitement.
    const expectedHash = createHash('sha512')
      .update(PAYDUNYA_MASTER_KEY ?? '')
      .digest('hex');
    if (!paymentData.hash || paymentData.hash !== expectedHash) {
      console.error('[PAYDUNYA] Hash de webhook invalide');
      return fail(res, 'Signature webhook invalide', 403);
    }

    const token = paymentData.token ?? paymentData.invoice?.token;
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

    const {
      user_id, type, ref: customRef, artwork_id, plan_id,
      buyer_email, buyer_name, buyer_phone,
    } = verified.custom_data ?? {};

    // Si custom_data ne contient pas le contact (cas legacy), retomber sur
    // les infos saisies par le client sur la page PayDunya.
    const contactEmail = buyer_email ?? verified.customer?.email ?? null;
    const contactName  = buyer_name  ?? verified.customer?.name  ?? null;
    const contactPhone = buyer_phone ?? verified.customer?.phone ?? null;

    const paymentRef = customRef ?? token;

    // Idempotence : si déjà marqué completed, on ignore les doubles webhooks.
    const { data: existingTx } = await supabaseAdmin
      .from('transactions')
      .select('id, status')
      .eq('payment_ref', paymentRef)
      .maybeSingle();
    if (existingTx?.status === 'completed') return ok(res, { received: true });

    if (type === 'artwork' && artwork_id) {
      await supabaseAdmin
        .from('artworks')
        .update({ sold: true, sold_at: new Date().toISOString(), for_sale: false })
        .eq('id', artwork_id)
        .eq('sold', false);

      // UPDATE de la ligne pending insérée à l'init. Si elle n'existe pas
      // (cas où l'init n'a pas tracé, paiements legacy), on INSERT.
      if (existingTx) {
        const { error: updErr } = await supabaseAdmin
          .from('transactions')
          .update({
            status:         'completed',
            payment_method: 'paydunya',
            buyer_email:    contactEmail,
            buyer_name:     contactName,
            buyer_phone:    contactPhone,
          })
          .eq('id', existingTx.id);
        if (updErr) console.error('[PAYDUNYA] Erreur UPDATE transaction', updErr.message);
      } else {
        const { data: artwork } = await supabaseAdmin
          .from('artworks').select('price, currency, user_id').eq('id', artwork_id).single();
        if (artwork) {
          const { error: txError } = await supabaseAdmin.from('transactions').insert({
            artwork_id,
            buyer_id:       user_id ?? null,
            seller_id:      artwork.user_id,
            amount:         artwork.price,
            currency:       artwork.currency,
            status:         'completed',
            payment_method: 'paydunya',
            payment_ref:    paymentRef,
            buyer_email:    contactEmail,
            buyer_name:     contactName,
            buyer_phone:    contactPhone,
          });
          // Code 23505 = unique_violation, doublons silencieux acceptés.
          if (txError && txError.code !== '23505') {
            console.error('[PAYDUNYA] Erreur INSERT transaction', txError.message);
          }
        }
      }
    }

    if ((type === 'subscription' || type === 'plan') && plan_id) {
      // Un abonnement est obligatoirement lié à un user_id. Init l'a déjà
      // imposé, mais on garde ce filet de sécurité au cas où custom_data
      // serait corrompu côté PayDunya.
      if (!user_id) {
        console.error('[PAYDUNYA] subscription callback sans user_id', { token });
        return fail(res, 'user_id requis pour activer un abonnement', 400);
      }

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
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);

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

  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    try {
      await resend.emails.send({
        from:    FROM_EMAIL,
        to:      email,
        subject: campaign.subject,
        html:    campaign.content,
      });
      sent++;
    } catch (err) {
      console.error('[RESEND] Email failed:', err?.message);
      failed++;
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

  // Fallback artiste via user_id si la jointure ne retourne rien
  let artistName    = artwork.artists?.name    ?? '';
  let artistCountry = artwork.artists?.country ?? '';
  if (!artistName && artwork.user_id) {
    const { data: artist } = await supabaseAdmin
      .from('artists').select('name, country').eq('user_id', artwork.user_id).single();
    artistName    = artist?.name    ?? '';
    artistCountry = artist?.country ?? '';
  }

  // Télécharge l'image de l'œuvre pour l'embarquer dans le PDF
  let imageBuffer = null;
  if (artwork.image) {
    try {
      const imgRes = await fetch(artwork.image);
      if (imgRes.ok) imageBuffer = Buffer.from(await imgRes.arrayBuffer());
    } catch (_) {}
  }

  const PDFDocument = (await import('pdfkit')).default;

  const chunks = [];
  const doc = new PDFDocument({ margin: 0, size: 'A4', layout: 'landscape' });
  doc.on('data', chunk => chunks.push(chunk));

  const pdfBuffer = await new Promise((resolve, reject) => {
    doc.on('end',   () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width;
    const H = doc.page.height;

    const GOLD       = '#C9922A';
    const GOLD_LIGHT = '#E8C97A';
    const DARK       = '#2D1A0E';
    const CREAM      = '#F5F0E8';
    const GRAY       = '#8A7A6A';

    // Fond ivoire
    doc.rect(0, 0, W, H).fill(CREAM);

    // Double cadre doré
    const m = 20;
    doc.rect(m, m, W - 2*m, H - 2*m).lineWidth(2).stroke(GOLD);
    doc.rect(m+6, m+6, W - 2*(m+6), H - 2*(m+6)).lineWidth(0.5).stroke(GOLD_LIGHT);

    // Séparateur vertical
    const divX = W * 0.57;
    doc.moveTo(divX, m+18).lineTo(divX, H-m-18).lineWidth(0.8).stroke(GOLD_LIGHT);

    // ── COLONNE GAUCHE ──────────────────────────────────────────────────
    const lx = 48;
    let y = 52;

    // Logo texte
    doc.fontSize(11).font('Helvetica-Bold').fillColor(GOLD).text('✦', lx, y, { continued: true })
       .fillColor(DARK).text(' KUCIBOK');
    y += 28;

    // Titre
    doc.fontSize(24).font('Helvetica-Bold').fillColor(DARK).text('CERTIFICAT', lx, y);
    y += 30;
    doc.fontSize(24).font('Helvetica-Bold').fillColor(DARK).text("D'AUTHENTICITÉ", lx, y);
    y += 26;

    // Sous-titre
    doc.fontSize(10).font('Helvetica').fillColor(GRAY).text('Art Africain Authentique', lx, y);
    y += 24;

    // Badge certifié
    doc.roundedRect(lx, y, 165, 23, 11).fill(GOLD);
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#FFFFFF')
       .text('✓  ŒUVRE CERTIFIÉE', lx, y+7, { width: 165, align: 'center' });
    y += 44;

    // Tableau infos
    const tableW = divX - lx - 28;
    doc.rect(lx, y, 3, 155).fill(GOLD_LIGHT);

    const rows = [
      ["Titre de l'œuvre", artwork.title || 'N/A'],
      ['Artiste',          artistName    || 'N/A'],
      ['Catégorie',        artwork.category || 'N/A'],
      ['Dimensions',       (artwork.height && artwork.width) ? `${artwork.height} × ${artwork.width} cm` : 'N/A'],
      ["Date d'émission",  new Date(artwork.created_at).toLocaleDateString('fr-FR')],
    ];

    const rowH = 31;
    rows.forEach(([label, value], i) => {
      const ry = y + i * rowH;
      if (i > 0) doc.moveTo(lx+10, ry).lineTo(lx+tableW, ry).lineWidth(0.3).stroke('#D4B896');
      doc.fontSize(10).font('Helvetica').fillColor(GOLD).text(label, lx+10, ry+9, { width: 120 });
      doc.fontSize(10).font('Helvetica-Bold').fillColor(DARK).text(value, lx+140, ry+9, { width: tableW-148, align: 'right' });
    });

    // ── COLONNE DROITE ───────────────────────────────────────────────────
    const rx   = divX + 28;
    const rw   = W - divX - 28 - m - 8;
    let   ry2  = 48;

    // Image de l'œuvre
    const imgSz = Math.min(rw, 195);
    const imgX  = rx + (rw - imgSz) / 2;
    doc.rect(imgX-2, ry2-2, imgSz+4, imgSz+4).lineWidth(2).stroke(GOLD);
    if (imageBuffer) {
      try { doc.image(imageBuffer, imgX, ry2, { width: imgSz, height: imgSz, cover: [imgSz, imgSz] }); }
      catch (_) { doc.rect(imgX, ry2, imgSz, imgSz).fill('#E8E0D0'); }
    } else {
      doc.rect(imgX, ry2, imgSz, imgSz).fill('#E8E0D0');
    }
    ry2 += imgSz + 22;

    // Cachet circulaire
    const cx = rx + rw/2;
    const cr = 46;
    doc.circle(cx, ry2+cr, cr).lineWidth(1.5).stroke(GOLD);
    doc.circle(cx, ry2+cr, cr-5).lineWidth(0.4).stroke(GOLD_LIGHT);
    doc.fontSize(7).font('Helvetica-Bold').fillColor(DARK)
       .text('CERTIFICAT',   cx-22, ry2+cr-16)
       .text('AUTHENTICITÉ', cx-26, ry2+cr-5)
       .text('KUCIBOK',      cx-15, ry2+cr+6);
    ry2 += cr*2 + 18;

    // Code KCB
    doc.fontSize(9).font('Helvetica').fillColor(GRAY)
       .text('Code de vérification', rx, ry2, { width: rw, align: 'center' });
    ry2 += 15;
    const codeW = 165;
    const codeX = rx + (rw-codeW)/2;
    doc.rect(codeX, ry2, codeW, 23).lineWidth(1).stroke(GOLD);
    doc.fontSize(11).font('Helvetica-Bold').fillColor(DARK)
       .text(artwork.kucibok_id ?? 'KCB-XXXXXXXX', codeX, ry2+6, { width: codeW, align: 'center' });
    ry2 += 33;

    // Attestation
    doc.fontSize(8).font('Helvetica').fillColor(GRAY)
       .text(
         "Ce certificat atteste de l'authenticité\nde cette œuvre d'art africaine.",
         rx, ry2, { width: rw, align: 'center' },
       );

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

/**
 * GET /api/certificates/url/:artworkId — Retourne une signed URL (1h) pour le certificat PDF.
 * Nécessite que le certificat ait déjà été généré (certificate_path présent sur l'œuvre).
 */
async function routeCertificateUrl(req, res, artworkId) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);

  const { data: artwork, error } = await supabaseAdmin
    .from('artworks')
    .select('id, certificate_path, status')
    .eq('id', artworkId)
    .single();

  if (error || !artwork) return fail(res, 'Œuvre introuvable', 404);
  if (!artwork.certificate_path) return fail(res, 'Certificat non encore généré', 404);

  const { data: signedData, error: signErr } = await supabaseAdmin.storage
    .from('certificates')
    .createSignedUrl(artwork.certificate_path, 3600);

  if (signErr || !signedData?.signedUrl) return fail(res, 'Impossible de générer le lien de téléchargement');

  return ok(res, { certificate_url: signedData.signedUrl });
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
    const role = await getDbRole(user.id);

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
// TRANSACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const KCB_COMMISSION_RATE = 0.10; // 10 % de commission Kucibok

/**
 * GET /api/transactions/artist — Revenus de l'artiste connecté.
 *   Retourne les transactions où seller_id = user.id + solde à percevoir.
 *
 * GET /api/transactions/buyer — Achats du collectionneur connecté.
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 * @param {string} [sub] — 'artist' | 'buyer'
 */
async function routeTransactions(req, res, sub) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const userId = authResult.user.id;

  // ── /api/transactions/artist ────────────────────────────────────────────
  if (sub === 'artist') {
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select('*, artworks(title, image, kucibok_id), buyer:buyer_id(name, email)')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) return fail(res, error.message);

    const txs = (data ?? []).map((t) => {
      const commission = Math.round((t.amount ?? 0) * KCB_COMMISSION_RATE);
      return {
        ...t,
        _id: t.id,
        commission,
        net_amount: (t.amount ?? 0) - commission,
        payout_status: t.payout_status ?? 'pending',
      };
    });

    const completed = txs.filter((t) => t.status === 'completed');
    const totalRevenue    = completed.reduce((s, t) => s + (t.net_amount ?? 0), 0);
    const pendingRevenue  = txs.filter((t) => t.status === 'pending').reduce((s, t) => s + (t.net_amount ?? 0), 0);
    const totalCommission = completed.reduce((s, t) => s + (t.commission ?? 0), 0);

    return ok(res, {
      transactions: txs,
      stats: {
        totalRevenue,
        pendingRevenue,
        totalCommission,
        completedSales: completed.length,
        pendingSales:   txs.filter((t) => t.status === 'pending').length,
        currency: txs[0]?.currency ?? 'XOF',
      },
    });
  }

  // ── /api/transactions/buyer ─────────────────────────────────────────────
  if (sub === 'buyer') {
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select('*, artworks(title, image, kucibok_id), seller:seller_id(name)')
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });

    if (error) return fail(res, error.message);
    return ok(res, (data ?? []).map((t) => ({ ...t, _id: t.id })));
  }

  return fail(res, 'Sub-route invalide. Utilisez /transactions/artist ou /transactions/buyer', 400);
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

// ═══════════════════════════════════════════════════════════════════════════════
// BLOG — CRUD complet
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/blog/:id — Détail d'un article.
 * PUT /api/blog/:id — Met à jour un article (auteur ou admin).
 * DELETE /api/blog/:id — Supprime un article (auteur ou admin).
 */
async function routeBlogById(req, res, id) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('blog_posts').select('*').eq('id', id).single();
    if (error || !data) return notFound(res, 'Article');
    return ok(res, { ...data, _id: data.id });
  }

  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const role = await getDbRole(authResult.user.id);

  if (req.method === 'PUT') {
    const { title, content, image, category, tags, published } = req.body ?? {};
    const updates = {};
    if (title !== undefined)     updates.title = title;
    if (content !== undefined)   updates.content = stripDangerousHtml(content);
    if (image !== undefined)     updates.image = image;
    if (category !== undefined)  updates.category = category;
    if (tags !== undefined)      updates.tags = Array.isArray(tags) ? tags : [];
    if (published !== undefined) updates.published = !!published;

    let query = supabaseAdmin.from('blog_posts').update(updates).eq('id', id);
    if (role !== 'admin') query = query.eq('user_id', authResult.user.id);

    const { data, error } = await query.select().single();
    if (error || !data) return fail(res, error?.message ?? 'Article non trouvé ou accès refusé');
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'DELETE') {
    let query = supabaseAdmin.from('blog_posts').delete().eq('id', id);
    if (role !== 'admin') query = query.eq('user_id', authResult.user.id);

    const { error } = await query;
    if (error) return fail(res, error.message);
    return ok(res, { deleted: true });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * GET /api/blog/published — Articles publiés.
 * GET /api/blog/archived — Articles archivés.
 */
async function routeBlogFiltered(req, res, filter) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);
  const { from, to, page, limit } = parsePagination(req);

  let query = supabaseAdmin
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filter === 'published') query = query.eq('published', true);
  if (filter === 'archived')  query = query.eq('archived', true);

  const { data, error, count } = await query;
  if (error) return fail(res, error.message);
  return ok(res, (data ?? []).map(p => ({ ...p, _id: p.id })), 200, { page, limit, total: count });
}

/**
 * GET /api/blog/published/user:id — Articles publiés d'un auteur.
 * GET /api/blog/draft/user:id — Brouillons d'un auteur.
 * GET /api/blog/archived/user:id — Articles archivés d'un auteur.
 */
async function routeBlogByUser(req, res, userId, status) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);

  if (status === 'draft' || status === 'archived') {
    const authResult = await requireAuth(req);
    if (authResult.error) return fail(res, authResult.error, authResult.status);
    const requesterId = authResult.user.id;
    const requesterRole = await getDbRole(requesterId);
    if (requesterRole !== 'admin' && requesterId !== userId) return fail(res, 'Accès interdit', 403);
  }

  let query = supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (status === 'published') query = query.eq('published', true);
  if (status === 'draft')     query = query.eq('published', false).eq('archived', false);
  if (status === 'archived')  query = query.eq('archived', true);

  const { data, error } = await query;
  if (error) return fail(res, error.message);
  return ok(res, (data ?? []).map(p => ({ ...p, _id: p.id })));
}

/**
 * POST /api/blog/publish/:id — Publie un article.
 */
async function routeBlogPublish(req, res, id) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const userId = authResult.user.id;
  const role = await getDbRole(userId);

  const { data: existing } = await supabaseAdmin
    .from('blog_posts').select('user_id').eq('id', id).single();
  if (!existing) return notFound(res, 'Article');
  if (role !== 'admin' && existing.user_id !== userId) return fail(res, 'Accès refusé', 403);

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .update({ published: true, archived: false })
    .eq('id', id)
    .select().single();

  if (error || !data) return fail(res, error?.message ?? 'Article non trouvé');
  return ok(res, { ...data, _id: data.id });
}

/**
 * POST /api/blog/archive/:id — Archive un article.
 */
async function routeBlogArchive(req, res, id) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const userId = authResult.user.id;
  const role = await getDbRole(userId);

  const { data: existing } = await supabaseAdmin
    .from('blog_posts').select('user_id').eq('id', id).single();
  if (!existing) return notFound(res, 'Article');
  if (role !== 'admin' && existing.user_id !== userId) return fail(res, 'Accès refusé', 403);

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .update({ archived: true, published: false })
    .eq('id', id)
    .select().single();

  if (error || !data) return fail(res, error?.message ?? 'Article non trouvé');
  return ok(res, { ...data, _id: data.id });
}

/**
 * POST /api/blog/comment/:id — Ajoute un commentaire.
 * DELETE /api/blog/comment/:id/:commentId — Supprime un commentaire.
 */
async function routeBlogComment(req, res, postId, commentId) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const userId = authResult.user.id;

  if (req.method === 'POST') {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ?? 'unknown';
    if (!rateLimit(`comment:${ip}`, 60_000, 5))
      return fail(res, 'Trop de commentaires. Réessayez dans une minute.', 429);
    const { content } = req.body ?? {};
    if (!content) return fail(res, 'Contenu du commentaire requis');

    // Sanitize HTML to prevent stored XSS
    const safeContent = (content ?? '')
      .replace(/<script[\s>][\s\S]*?<\/script>/gi, '')
      .replace(/<iframe[\s>][\s\S]*?<\/iframe>/gi, '')
      .replace(/<object[\s>][\s\S]*?<\/object>/gi, '')
      .replace(/<embed[\s>][\s\S]*?>/gi, '')
      .replace(/<link[\s>][\s\S]*?>/gi, '')
      .replace(/\son\w+\s*=/gi, ' data-removed=');

    const { data, error } = await supabaseAdmin
      .from('blog_comments')
      .insert({ post_id: postId, user_id: userId, content: safeContent })
      .select('*, users(name, image)')
      .single();

    if (error) return fail(res, error.message);
    return ok(res, { ...data, _id: data.id }, 201);
  }

  if (req.method === 'DELETE' && commentId) {
    const role = await getDbRole(userId);
    let query = supabaseAdmin.from('blog_comments').delete().eq('id', commentId).eq('post_id', postId);
    if (role !== 'admin') query = query.eq('user_id', userId);

    const { error } = await query;
    if (error) return fail(res, error.message);
    return ok(res, { deleted: true });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSACTIONS — Confirmation / Échec
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/transaction/:id — Détail d'une transaction (acheteur ou vendeur).
 */
async function routeTransactionById(req, res, id) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const userId = authResult.user.id;
  const role = await getDbRole(userId);

  let query = supabaseAdmin
    .from('transactions')
    .select('*, artworks(title, image, kucibok_id, price, currency), buyer:buyer_id(name, email), seller:seller_id(name, email)')
    .eq('id', id);

  if (role !== 'admin') query = query.or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

  const { data, error } = await query.single();
  if (error || !data) return notFound(res, 'Transaction');
  return ok(res, { ...data, _id: data.id });
}

/**
 * GET /api/transaction/ref/:ref — Récupère une transaction par sa référence de paiement.
 */
async function routeTransactionByRef(req, res, ref) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const userId = authResult.user.id;
  const role = await getDbRole(userId);

  let query = supabaseAdmin
    .from('transactions')
    .select('*, artworks(title, image, kucibok_id, price, currency), buyer:buyer_id(name, email), seller:seller_id(name, email)')
    .eq('payment_ref', ref);

  if (role !== 'admin') query = query.or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

  const { data, error } = await query.single();
  if (error || !data) return notFound(res, 'Transaction');
  return ok(res, { ...data, _id: data.id });
}

/**
 * GET /api/transaction/fail/:id — Marque une transaction comme échouée et retourne les détails.
 */
async function routeTransactionStatus(req, res, id, status) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const userId = authResult.user.id;
  const role = await getDbRole(userId);

  let query = supabaseAdmin
    .from('transactions')
    .update({ status })
    .eq('id', id);

  if (role !== 'admin') query = query.or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

  const { data, error } = await query
    .select('*, artworks(title, image, kucibok_id)')
    .single();

  if (error || !data) return notFound(res, 'Transaction');
  return ok(res, { ...data, _id: data.id });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION — By ID / Status
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/subscription/:id — Détail d'un abonnement.
 */
async function routeSubscriptionById(req, res, id) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const userId = authResult.user.id;
  const role = await getDbRole(userId);

  let query = supabaseAdmin
    .from('subscriptions')
    .select('*, plans(*)')
    .eq('id', id);

  if (role !== 'admin') query = query.eq('user_id', userId);

  const { data, error } = await query.single();

  if (error || !data) return notFound(res, 'Abonnement');
  return ok(res, { ...data, _id: data.id });
}

/**
 * POST /api/subscription/fail/:id — Met à jour le statut d'un abonnement.
 * POST /api/subscription/activate/:id — Active un abonnement.
 */
async function routeSubscriptionStatus(req, res, id, status) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const userId = authResult.user.id;
  const role = await getDbRole(userId);

  let query = supabaseAdmin
    .from('subscriptions')
    .update({ status })
    .eq('id', id);

  if (role !== 'admin') query = query.eq('user_id', userId);

  const { data, error } = await query
    .select('*, plans(*)')
    .single();

  if (error || !data) return notFound(res, 'Abonnement');
  return ok(res, { ...data, _id: data.id });
}

/**
 * POST /api/subscription/cancel — Annule l'abonnement actif de l'utilisateur.
 */
async function routeSubscriptionCancel(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const { user } = authResult;

  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('user_id', user.id)
    .eq('status', 'active')
    .select('*, plans(*)')
    .single();

  if (error || !data) return notFound(res, 'Abonnement actif');
  return ok(res, { ...data, _id: data.id });
}

// ═══════════════════════════════════════════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/review — Crée un avis sur une œuvre.
 */
async function routeReview(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);

  const { artwork_id, rating, comment } = req.body ?? {};
  if (!artwork_id) return fail(res, 'artwork_id requis');
  if (!rating || rating < 1 || rating > 5) return fail(res, 'rating requis (1-5)');

  const { data: existing } = await supabaseAdmin.from('reviews').select('id').eq('artwork_id', artwork_id).eq('user_id', authResult.user.id).maybeSingle();
  if (existing) return fail(res, 'Vous avez déjà noté cette œuvre', 409);

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .insert({ artwork_id, user_id: authResult.user.id, rating: Number(rating), comment: comment ?? null })
    .select('*, users(name, image)')
    .single();

  if (error) return fail(res, error.message);
  return ok(res, { ...data, _id: data.id }, 201);
}

/**
 * GET /api/review/artwork/:id — Avis sur une œuvre.
 */
async function routeReviewByArtwork(req, res, artworkId) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*, users(name, image)')
    .eq('artwork_id', artworkId)
    .order('created_at', { ascending: false });

  if (error) return fail(res, error.message);
  return ok(res, (data ?? []).map(r => ({ ...r, _id: r.id })));
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISITOR — Visit time
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PUT /api/visitor/visit-time — Met à jour le temps de visite.
 */
async function routeVisitorTime(req, res) {
  if (req.method !== 'PUT') return fail(res, 'Méthode non autorisée', 405);

  const { visitor_id, duration } = req.body ?? {};
  if (!visitor_id) return fail(res, 'visitor_id requis');

  const { data, error } = await supabaseAdmin
    .from('visitors')
    .update({ visit_duration: duration ?? 0 })
    .eq('id', visitor_id)
    .select()
    .single();

  if (error) return fail(res, error.message);
  return ok(res, data);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRM (Professional)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET/POST /api/crm/clients — Liste et création de clients CRM.
 */
async function routeCrmClients(req, res) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);
  const userId = authResult.user.id;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('crm_clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return fail(res, error.message);
    return ok(res, (data ?? []).map(c => ({ ...c, _id: c.id })));
  }

  if (req.method === 'POST') {
    const { name, email, phone, company, type, source, notes, tags } = req.body ?? {};
    if (!name && !email) return fail(res, 'name ou email requis');

    const { data, error } = await supabaseAdmin
      .from('crm_clients')
      .insert({ user_id: userId, name, email, phone, company, type, source, notes, tags: tags ?? [] })
      .select().single();
    if (error) return fail(res, error.message);
    return ok(res, { ...data, _id: data.id }, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * GET/PUT/DELETE /api/crm/clients/:id
 */
async function routeCrmClientById(req, res, id) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);
  const userId = authResult.user.id;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('crm_clients').select('*').eq('id', id).eq('user_id', userId).single();
    if (error || !data) return notFound(res, 'Client CRM');
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'PUT') {
    const { name, email, phone, company, type, source, notes, tags } = req.body ?? {};
    const updates = {};
    if (name !== undefined)    updates.name = name;
    if (email !== undefined)   updates.email = email;
    if (phone !== undefined)   updates.phone = phone;
    if (company !== undefined) updates.company = company;
    if (type !== undefined)    updates.type = type;
    if (source !== undefined)  updates.source = source;
    if (notes !== undefined)   updates.notes = notes;
    if (tags !== undefined)    updates.tags = tags;

    const { data, error } = await supabaseAdmin
      .from('crm_clients').update(updates).eq('id', id).eq('user_id', userId).select().single();
    if (error || !data) return fail(res, error?.message ?? 'Non trouvé');
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin.from('crm_clients').delete().eq('id', id).eq('user_id', userId);
    if (error) return fail(res, error.message);
    return ok(res, { deleted: true });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * POST/DELETE /api/crm/clients/:clientId/notes/:noteId
 */
async function routeCrmNotes(req, res, clientId, noteId) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);

  if (req.method === 'POST') {
    const { content } = req.body ?? {};
    if (!content) return fail(res, 'content requis');
    const { data, error } = await supabaseAdmin
      .from('crm_notes')
      .insert({ client_id: clientId, user_id: authResult.user.id, content })
      .select().single();
    if (error) return fail(res, error.message);
    return ok(res, { ...data, _id: data.id }, 201);
  }

  if (req.method === 'DELETE' && noteId) {
    const { error } = await supabaseAdmin.from('crm_notes').delete().eq('id', noteId).eq('client_id', clientId);
    if (error) return fail(res, error.message);
    return ok(res, { deleted: true });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * POST/DELETE /api/crm/clients/:clientId/interactions/:interactionId
 */
async function routeCrmInteractions(req, res, clientId, interactionId) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);

  if (req.method === 'POST') {
    const { type, subject, notes, date } = req.body ?? {};
    const { data, error } = await supabaseAdmin
      .from('crm_interactions')
      .insert({ client_id: clientId, user_id: authResult.user.id, type: type ?? 'note', subject, notes, date: date ?? new Date().toISOString() })
      .select().single();
    if (error) return fail(res, error.message);
    return ok(res, { ...data, _id: data.id }, 201);
  }

  if (req.method === 'DELETE' && interactionId) {
    const { error } = await supabaseAdmin.from('crm_interactions').delete().eq('id', interactionId).eq('client_id', clientId);
    if (error) return fail(res, error.message);
    return ok(res, { deleted: true });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * GET /api/crm/stats
 */
async function routeCrmStats(req, res) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);

  const { data: clients } = await supabaseAdmin.from('crm_clients').select('id, type, created_at').eq('user_id', authResult.user.id);
  const total = clients?.length ?? 0;
  const byType = {};
  (clients ?? []).forEach(c => { byType[c.type ?? 'other'] = (byType[c.type ?? 'other'] || 0) + 1; });

  return ok(res, { total, byType });
}

/**
 * POST /api/crm/sync-from-transactions
 */
async function routeCrmSync(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);

  // Get transactions where user is seller, extract unique buyers
  const { data: txs } = await supabaseAdmin
    .from('transactions')
    .select('buyer_id, buyer:buyer_id(name, email)')
    .eq('seller_id', authResult.user.id)
    .eq('status', 'completed');

  const seen = new Set();
  let synced = 0;
  for (const tx of (txs ?? [])) {
    if (!tx.buyer_id || seen.has(tx.buyer_id)) continue;
    seen.add(tx.buyer_id);
    // Check if already exists
    const { data: existing } = await supabaseAdmin.from('crm_clients').select('id').eq('user_id', authResult.user.id).eq('email', tx.buyer?.email).maybeSingle();
    if (existing) continue;
    await supabaseAdmin.from('crm_clients').insert({
      user_id: authResult.user.id, name: tx.buyer?.name, email: tx.buyer?.email, source: 'transaction', type: 'buyer',
    });
    synced++;
  }

  return ok(res, { synced });
}

/**
 * GET /api/crm/export/csv
 */
async function routeCrmExport(req, res) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);

  const { data } = await supabaseAdmin.from('crm_clients').select('*').eq('user_id', authResult.user.id).order('name');
  const rows = (data ?? []).map(c => `"${c.name ?? ''}","${c.email ?? ''}","${c.phone ?? ''}","${c.company ?? ''}","${c.type ?? ''}"`);
  const csv = ['name,email,phone,company,type', ...rows].join('\n');

  // CORS déjà posé par handleCors() en début de requête
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=crm-clients.csv');
  return res.status(200).send(csv);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACTS (Professional — listes de contacts & emailing)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET/POST /api/contacts/contacts
 */
async function routeContacts(req, res) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);
  const userId = authResult.user.id;

  if (req.method === 'GET') {
    const { from, to, page, limit } = parsePagination(req);
    const { data, error, count } = await supabaseAdmin
      .from('contacts').select('*', { count: 'exact' }).eq('user_id', userId)
      .order('created_at', { ascending: false }).range(from, to);
    if (error) return fail(res, error.message);
    return ok(res, (data ?? []).map(c => ({ ...c, _id: c.id })), 200, { page, limit, total: count });
  }

  if (req.method === 'POST') {
    const { name, email, phone, tags, list_id } = req.body ?? {};
    if (!email) return fail(res, 'email requis');
    const { data, error } = await supabaseAdmin
      .from('contacts').insert({ user_id: userId, name, email, phone, tags: tags ?? [], list_id: list_id ?? null })
      .select().single();
    if (error) return fail(res, error.message);
    return ok(res, { ...data, _id: data.id }, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * GET/PUT/DELETE /api/contacts/contacts/:id
 */
async function routeContactById(req, res, id) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);
  const userId = authResult.user.id;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('contacts').select('*').eq('id', id).eq('user_id', userId).single();
    if (error || !data) return notFound(res, 'Contact');
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'PUT') {
    const { name, email, phone, tags, list_id } = req.body ?? {};
    const { data, error } = await supabaseAdmin.from('contacts').update({ name, email, phone, tags, list_id }).eq('id', id).eq('user_id', userId).select().single();
    if (error || !data) return fail(res, error?.message ?? 'Non trouvé');
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin.from('contacts').delete().eq('id', id).eq('user_id', userId);
    if (error) return fail(res, error.message);
    return ok(res, { deleted: true });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * POST /api/contacts/contacts/import — Import CSV de contacts.
 */
async function routeContactImport(req, res) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);

  const { contacts, list_id } = req.body ?? {};
  if (!Array.isArray(contacts) || contacts.length === 0) return fail(res, 'contacts[] requis');

  const rows = contacts.map(c => ({
    user_id: authResult.user.id, name: c.name, email: c.email, phone: c.phone, tags: c.tags ?? [], list_id: list_id ?? null,
  }));

  const { data, error } = await supabaseAdmin.from('contacts').insert(rows).select();
  if (error) return fail(res, error.message);
  return ok(res, { imported: data?.length ?? 0 }, 201);
}

/**
 * POST /api/contacts/contacts/:id/unsubscribe
 */
async function routeContactUnsubscribe(req, res, id) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);
  const { data, error } = await supabaseAdmin.from('contacts').update({ unsubscribed: true }).eq('id', id).select().single();
  if (error || !data) return notFound(res, 'Contact');
  return ok(res, { ...data, _id: data.id });
}

/**
 * GET /api/contacts/contacts/stats
 */
async function routeContactStats(req, res) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);

  const { data } = await supabaseAdmin.from('contacts').select('id, unsubscribed').eq('user_id', authResult.user.id);
  const total = data?.length ?? 0;
  const unsubscribed = (data ?? []).filter(c => c.unsubscribed).length;
  return ok(res, { total, active: total - unsubscribed, unsubscribed });
}

/**
 * GET/POST /api/contacts/lists
 */
async function routeContactLists(req, res) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);
  const userId = authResult.user.id;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('contact_lists').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) return fail(res, error.message);
    return ok(res, (data ?? []).map(l => ({ ...l, _id: l.id })));
  }

  if (req.method === 'POST') {
    const { name, description } = req.body ?? {};
    if (!name) return fail(res, 'name requis');
    const { data, error } = await supabaseAdmin.from('contact_lists').insert({ user_id: userId, name, description }).select().single();
    if (error) return fail(res, error.message);
    return ok(res, { ...data, _id: data.id }, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * GET/PUT/DELETE /api/contacts/lists/:id
 */
async function routeContactListById(req, res, id) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);
  const userId = authResult.user.id;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('contact_lists').select('*, contacts(*)').eq('id', id).eq('user_id', userId).single();
    if (error || !data) return notFound(res, 'Liste');
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'PUT') {
    const { name, description } = req.body ?? {};
    const { data, error } = await supabaseAdmin.from('contact_lists').update({ name, description }).eq('id', id).eq('user_id', userId).select().single();
    if (error || !data) return fail(res, error?.message ?? 'Non trouvé');
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin.from('contact_lists').delete().eq('id', id).eq('user_id', userId);
    if (error) return fail(res, error.message);
    return ok(res, { deleted: true });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * POST /api/contacts/lists/:listId/rsvp
 */
async function routeContactListRsvp(req, res, listId) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);

  const { contact_id, status } = req.body ?? {};
  if (!contact_id) return fail(res, 'contact_id requis');

  const { data, error } = await supabaseAdmin
    .from('contact_list_rsvp')
    .upsert({ list_id: listId, contact_id, status: status ?? 'pending' }, { onConflict: 'list_id,contact_id' })
    .select().single();

  if (error) return fail(res, error.message);
  return ok(res, data);
}

/**
 * POST /api/contacts/sync/crm — Sync contacts with CRM.
 */
async function routeContactSync(req, res, sub, extra) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);

  // GET /api/contacts/sync/crm/:crmContactId/check
  if (req.method === 'GET' && sub === 'crm' && extra === 'check') {
    // segments[4] would be the crmContactId — not yet parsed, use a simple approach
    return ok(res, { synced: false });
  }

  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);

  if (sub === 'crm' && extra === 'bulk') {
    // Bulk sync from CRM
    const { contact_ids } = req.body ?? {};
    return ok(res, { synced: Array.isArray(contact_ids) ? contact_ids.length : 0 });
  }

  // Single sync
  const { crm_client_id } = req.body ?? {};
  if (!crm_client_id) return fail(res, 'crm_client_id requis');

  const { data: client } = await supabaseAdmin.from('crm_clients').select('*').eq('id', crm_client_id).eq('user_id', authResult.user.id).single();
  if (!client) return notFound(res, 'Client CRM');

  const { data, error } = await supabaseAdmin.from('contacts').insert({
    user_id: authResult.user.id, name: client.name, email: client.email, phone: client.phone, tags: ['crm-sync'],
  }).select().single();

  if (error) return fail(res, error.message);
  return ok(res, { ...data, _id: data.id }, 201);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTITIES (Multi-entité professional)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET/POST /api/entities
 */
async function routeEntities(req, res) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);
  const userId = authResult.user.id;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('entities').select('*, entity_members(*)').or(`owner_id.eq.${userId},entity_members.user_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    if (error) return fail(res, error.message);
    return ok(res, (data ?? []).map(e => ({ ...e, _id: e.id })));
  }

  if (req.method === 'POST') {
    const { name, type, description, logo } = req.body ?? {};
    if (!name) return fail(res, 'name requis');
    const { data, error } = await supabaseAdmin
      .from('entities').insert({ owner_id: userId, name, type, description, logo })
      .select().single();
    if (error) return fail(res, error.message);
    // Also add owner as admin member
    await supabaseAdmin.from('entity_members').insert({ entity_id: data.id, user_id: userId, role: 'admin' });
    return ok(res, { ...data, _id: data.id }, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * GET/PUT/DELETE /api/entities/:id
 */
async function routeEntityById(req, res, id) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('entities').select('*, entity_members(*, users(name, email, image))').eq('id', id).single();
    if (error || !data) return notFound(res, 'Entité');
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'PUT') {
    const { name, type, description, logo } = req.body ?? {};
    const { data, error } = await supabaseAdmin.from('entities').update({ name, type, description, logo }).eq('id', id).eq('owner_id', authResult.user.id).select().single();
    if (error || !data) return fail(res, error?.message ?? 'Non trouvé');
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'DELETE') {
    await supabaseAdmin.from('entity_members').delete().eq('entity_id', id);
    const { error } = await supabaseAdmin.from('entities').delete().eq('id', id).eq('owner_id', authResult.user.id);
    if (error) return fail(res, error.message);
    return ok(res, { deleted: true });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * POST /api/entities/:id/switch — Switch to this entity context.
 */
async function routeEntitySwitch(req, res, id) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const userId = authResult.user.id;

  const { data: membership } = await supabaseAdmin.from('entity_members').select('id').eq('entity_id', id).eq('user_id', userId).single();
  if (!membership) return fail(res, 'Non membre de cette entité', 403);

  const { data, error } = await supabaseAdmin.from('entities').select('*').eq('id', id).single();
  if (error || !data) return notFound(res, 'Entité');
  return ok(res, { ...data, _id: data.id, switched: true });
}

/**
 * POST/PUT/DELETE /api/entities/:entityId/members/:memberId
 */
async function routeEntityMembers(req, res, entityId, memberId) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);

  if (req.method === 'POST') {
    const { user_id, role } = req.body ?? {};
    if (!user_id) return fail(res, 'user_id requis');
    const { data, error } = await supabaseAdmin.from('entity_members')
      .insert({ entity_id: entityId, user_id, role: role ?? 'member' }).select().single();
    if (error) return fail(res, error.message);
    return ok(res, { ...data, _id: data.id }, 201);
  }

  if (req.method === 'PUT' && memberId) {
    const { role } = req.body ?? {};
    const { data, error } = await supabaseAdmin.from('entity_members')
      .update({ role }).eq('id', memberId).eq('entity_id', entityId).select().single();
    if (error || !data) return fail(res, error?.message ?? 'Non trouvé');
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'DELETE' && memberId) {
    const { error } = await supabaseAdmin.from('entity_members').delete().eq('id', memberId).eq('entity_id', entityId);
    if (error) return fail(res, error.message);
    return ok(res, { deleted: true });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTEGRATIONS (Professional)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET/POST /api/integrations
 */
async function routeIntegrations(req, res) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);
  const userId = authResult.user.id;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('integrations').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) return fail(res, error.message);
    return ok(res, (data ?? []).map(i => ({ ...i, _id: i.id })));
  }

  if (req.method === 'POST') {
    const { name, type, config, enabled } = req.body ?? {};
    if (!name || !type) return fail(res, 'name et type requis');
    const { data, error } = await supabaseAdmin.from('integrations')
      .insert({ user_id: userId, name, type, config: config ?? {}, enabled: enabled ?? true }).select().single();
    if (error) return fail(res, error.message);
    return ok(res, { ...data, _id: data.id }, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * GET/PUT/DELETE /api/integrations/:id
 */
async function routeIntegrationById(req, res, id) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);
  const userId = authResult.user.id;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('integrations').select('*').eq('id', id).eq('user_id', userId).single();
    if (error || !data) return notFound(res, 'Intégration');
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'PUT') {
    const { name, config, enabled } = req.body ?? {};
    const { data, error } = await supabaseAdmin.from('integrations').update({ name, config, enabled }).eq('id', id).eq('user_id', userId).select().single();
    if (error || !data) return fail(res, error?.message ?? 'Non trouvé');
    return ok(res, { ...data, _id: data.id });
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin.from('integrations').delete().eq('id', id).eq('user_id', userId);
    if (error) return fail(res, error.message);
    return ok(res, { deleted: true });
  }

  return fail(res, 'Méthode non autorisée', 405);
}

/**
 * POST /api/integrations/:id/sync
 */
async function routeIntegrationSync(req, res, id) {
  if (req.method !== 'POST') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);

  const { data, error } = await supabaseAdmin.from('integrations')
    .update({ last_synced_at: new Date().toISOString() }).eq('id', id).eq('user_id', authResult.user.id).select().single();
  if (error || !data) return notFound(res, 'Intégration');
  return ok(res, { ...data, _id: data.id, synced: true });
}

/**
 * GET /api/integrations/stats
 */
async function routeIntegrationStats(req, res) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);

  const { data } = await supabaseAdmin.from('integrations').select('id, type, enabled').eq('user_id', authResult.user.id);
  const total = data?.length ?? 0;
  const active = (data ?? []).filter(i => i.enabled).length;
  return ok(res, { total, active, inactive: total - active });
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFESSIONAL ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/professional-analytics — KPIs du dashboard pro.
 */
async function routeProAnalytics(req, res) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);
  const userId = authResult.user.id;

  const [artworksRes, txRes, clientsRes, deliveryRes] = await Promise.all([
    supabaseAdmin.from('artworks').select('id, status, for_sale, sold, price, currency').eq('managed_by', userId),
    supabaseAdmin.from('transactions').select('id, amount, status, currency, created_at').eq('seller_id', userId),
    supabaseAdmin.from('crm_clients').select('id').eq('user_id', userId),
    supabaseAdmin.from('delivery_requests').select('id, status').eq('user_id', userId),
  ]);

  const artworks = artworksRes.data ?? [];
  const txs = txRes.data ?? [];
  const completedTxs = txs.filter(t => t.status === 'completed');
  const totalRevenue = completedTxs.reduce((s, t) => s + (t.amount ?? 0), 0);

  return ok(res, {
    artworks: { total: artworks.length, forSale: artworks.filter(a => a.for_sale && !a.sold).length, sold: artworks.filter(a => a.sold).length },
    revenue: { total: totalRevenue, currency: completedTxs[0]?.currency ?? 'XOF', transactions: txs.length, completed: completedTxs.length },
    clients: { total: clientsRes.data?.length ?? 0 },
    deliveries: { total: deliveryRes.data?.length ?? 0, pending: (deliveryRes.data ?? []).filter(d => d.status === 'pending').length },
  });
}

/**
 * GET /api/professional-analytics/realtime — Données temps réel.
 */
async function routeProAnalyticsRealtime(req, res) {
  if (req.method !== 'GET') return fail(res, 'Méthode non autorisée', 405);
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);

  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const [recentTxs, recentViews] = await Promise.all([
    supabaseAdmin.from('transactions').select('id, amount, status, created_at').eq('seller_id', authResult.user.id).gte('created_at', since),
    supabaseAdmin.from('visitors').select('id').gte('created_at', since),
  ]);

  return ok(res, {
    last24h: {
      transactions: recentTxs.data?.length ?? 0,
      revenue: (recentTxs.data ?? []).filter(t => t.status === 'completed').reduce((s, t) => s + (t.amount ?? 0), 0),
      visitors: recentViews.data?.length ?? 0,
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMPAIGNS CRUD (Professional)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * CRUD /api/campaigns/campaigns — Gestion des campagnes email.
 * GET    /api/campaigns/campaigns — Liste.
 * POST   /api/campaigns/campaigns — Créer.
 * GET    /api/campaigns/campaigns/:id — Détail.
 * PUT    /api/campaigns/campaigns/:id — Modifier.
 * DELETE /api/campaigns/campaigns/:id — Supprimer.
 * POST   /api/campaigns/campaigns/:id/send-test — Envoyer un test.
 * POST   /api/campaigns/campaigns/:id/send — Envoyer la campagne.
 * GET    /api/campaigns/campaigns/:id/analytics — Stats campagne.
 */
async function routeCampaignsCrud(req, res, id, action) {
  const authResult = await requireAuth(req);
  if (authResult.error) return fail(res, authResult.error, authResult.status);
  const curatorCheck = await requireCurator(authResult.user);
  if (!curatorCheck.ok) return fail(res, curatorCheck.error, curatorCheck.status);
  const userId = authResult.user.id;

  // POST /api/campaigns/campaigns/:id/send-test
  if (id && action === 'send-test' && req.method === 'POST') {
    const { data: campaign } = await supabaseAdmin.from('campaigns').select('*').eq('id', id).eq('user_id', userId).single();
    if (!campaign) return notFound(res, 'Campagne');
    const { test_email } = req.body ?? {};
    if (!test_email) return fail(res, 'test_email requis');
    // Send test via Resend
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({ from: `Kucibok <${process.env.ADMIN_EMAIL}>`, to: [test_email], subject: `[TEST] ${campaign.subject}`, html: campaign.html_content ?? campaign.content ?? '' }),
      });
    } catch (e) { return fail(res, 'Erreur envoi test: ' + e.message); }
    return ok(res, { sent: true, to: test_email });
  }

  // POST /api/campaigns/campaigns/:id/send
  if (id && action === 'send' && req.method === 'POST') {
    const { data: campaign } = await supabaseAdmin.from('campaigns').select('*').eq('id', id).eq('user_id', userId).single();
    if (!campaign) return notFound(res, 'Campagne');
    // Get recipients from list or all contacts
    const { data: contacts } = campaign.list_id
      ? await supabaseAdmin.from('contacts').select('email').eq('list_id', campaign.list_id).eq('unsubscribed', false)
      : await supabaseAdmin.from('contacts').select('email').eq('user_id', userId).eq('unsubscribed', false);

    const emails = (contacts ?? []).map(c => c.email).filter(Boolean);
    if (emails.length === 0) return fail(res, 'Aucun destinataire');

    // Send in batches of 50
    let sent = 0;
    for (let i = 0; i < emails.length; i += 50) {
      const batch = emails.slice(i, i + 50);
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
          body: JSON.stringify({ from: `Kucibok <${process.env.ADMIN_EMAIL}>`, bcc: batch, subject: campaign.subject, html: campaign.html_content ?? campaign.content ?? '' }),
        });
        sent += batch.length;
      } catch (e) { /* continue with next batch */ }
    }

    await supabaseAdmin.from('campaigns').update({ status: 'sent', sent_at: new Date().toISOString(), recipients_count: sent }).eq('id', id);
    return ok(res, { sent, total: emails.length });
  }

  // GET /api/campaigns/campaigns/:id/analytics
  if (id && action === 'analytics' && req.method === 'GET') {
    const { data: campaign } = await supabaseAdmin.from('campaigns').select('*').eq('id', id).eq('user_id', userId).single();
    if (!campaign) return notFound(res, 'Campagne');
    return ok(res, { recipients: campaign.recipients_count ?? 0, status: campaign.status, sent_at: campaign.sent_at });
  }

  // GET/PUT/DELETE /api/campaigns/campaigns/:id
  if (id) {
    if (req.method === 'GET') {
      const { data, error } = await supabaseAdmin.from('campaigns').select('*').eq('id', id).eq('user_id', userId).single();
      if (error || !data) return notFound(res, 'Campagne');
      return ok(res, { ...data, _id: data.id });
    }
    if (req.method === 'PUT') {
      const { name, subject, content, html_content, list_id } = req.body ?? {};
      const { data, error } = await supabaseAdmin.from('campaigns').update({ name, subject, content, html_content, list_id }).eq('id', id).eq('user_id', userId).select().single();
      if (error || !data) return fail(res, error?.message ?? 'Non trouvé');
      return ok(res, { ...data, _id: data.id });
    }
    if (req.method === 'DELETE') {
      const { error } = await supabaseAdmin.from('campaigns').delete().eq('id', id).eq('user_id', userId);
      if (error) return fail(res, error.message);
      return ok(res, { deleted: true });
    }
    return fail(res, 'Méthode non autorisée', 405);
  }

  // GET/POST /api/campaigns/campaigns
  if (req.method === 'GET') {
    const { from, to, page, limit } = parsePagination(req);
    const { data, error, count } = await supabaseAdmin.from('campaigns').select('*', { count: 'exact' })
      .eq('user_id', userId).order('created_at', { ascending: false }).range(from, to);
    if (error) return fail(res, error.message);
    return ok(res, (data ?? []).map(c => ({ ...c, _id: c.id })), 200, { page, limit, total: count });
  }

  if (req.method === 'POST') {
    const { name, subject, content, html_content, list_id } = req.body ?? {};
    if (!name || !subject) return fail(res, 'name et subject requis');
    const { data, error } = await supabaseAdmin.from('campaigns')
      .insert({ user_id: userId, name, subject, content, html_content, list_id, status: 'draft' }).select().single();
    if (error) return fail(res, error.message);
    return ok(res, { ...data, _id: data.id }, 201);
  }

  return fail(res, 'Méthode non autorisée', 405);
}

// ── Cron : expiration automatique des abonnements ────────────────────────────
async function routeCronExpireSubscriptions(req, res) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers['authorization'] ?? '';
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return fail(res, 'Non autorisé', 401);
  }

  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .update({ status: 'expired' })
    .eq('status', 'active')
    .lt('end_date', now)
    .select('id, user_id, end_date');

  if (error) return fail(res, error.message);
  return ok(res, { expired: data.length, ids: data.map(s => s.id) });
}
