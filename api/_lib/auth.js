/**
 * auth.js — Middleware d'authentification pour les Vercel Functions.
 *
 * Vérifie le token JWT Supabase présent dans le header Authorization.
 * Retourne l'utilisateur Supabase ou une erreur 401/403.
 *
 * @module api/_lib/auth
 */

import { supabaseAdmin } from './supabase.js';

/** Rôles valides de la plateforme. */
const VALID_ROLES = ['collector', 'artist', 'professional', 'admin'];

/**
 * Extrait et vérifie le Bearer token depuis le header Authorization.
 *
 * @param {import('@vercel/node').VercelRequest} req
 * @returns {Promise<{ user: object } | { error: string, status: number }>}
 */
export async function requireAuth(req) {
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return { error: 'Token manquant', status: 401 };
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return { error: 'Token invalide ou expiré', status: 401 };
  }

  return { user };
}

/**
 * Vérifie que l'utilisateur possède l'un des rôles requis.
 *
 * @param {object} user - Utilisateur Supabase
 * @param {string[]} roles - Rôles autorisés
 * @returns {{ ok: true } | { error: string, status: number }}
 */
export function requireRole(user, roles) {
  const userRole = user.user_metadata?.role ?? 'collector';
  if (!roles.includes(userRole)) {
    return { error: `Accès refusé. Rôle requis : ${roles.join(' ou ')}`, status: 403 };
  }
  return { ok: true };
}

/**
 * Vérifie que l'utilisateur est admin.
 *
 * @param {object} user - Utilisateur Supabase
 * @returns {{ ok: true } | { error: string, status: number }}
 */
export const requireAdmin = (user) => requireRole(user, ['admin']);

/**
 * Vérifie que l'utilisateur est professional ou admin.
 *
 * @param {object} user - Utilisateur Supabase
 * @returns {{ ok: true } | { error: string, status: number }}
 */
export const requirePro = (user) => requireRole(user, ['professional', 'admin']);

/**
 * Vérifie la clé API interne (kcb-api-key header).
 * Couche de sécurité supplémentaire pour les endpoints publics.
 *
 * @param {import('@vercel/node').VercelRequest} req
 * @returns {{ ok: true } | { error: string, status: number }}
 */
export function requireApiKey(req) {
  const apiKey = req.headers['kcb-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return { error: 'Clé API invalide', status: 401 };
  }
  return { ok: true };
}
