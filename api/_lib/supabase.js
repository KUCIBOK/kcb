/**
 * supabase.js — Client Supabase server-side pour les Vercel Functions.
 *
 * Utilise la SERVICE_ROLE_KEY — accès complet, bypass RLS.
 * Ne jamais exposer côté client.
 *
 * @module api/_lib/supabase
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL          = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('[api/_lib/supabase] SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis');
}

/**
 * Client Supabase avec service role key — accès total, bypass RLS.
 * Pour les opérations serveur uniquement.
 *
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/**
 * Crée un client Supabase scoped au token JWT d'un utilisateur.
 * Respecte les RLS policies — à utiliser pour les opérations utilisateur.
 *
 * @param {string} accessToken - Token JWT Supabase de l'utilisateur
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function supabaseForUser(accessToken) {
  return createClient(SUPABASE_URL, process.env.SUPABASE_ANON_KEY ?? SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
