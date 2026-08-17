/**
 * api/_modules/index.js — Central router/dispatcher
 * Décortige les routes vers les modules appropriés
 */

import { handleAuth } from './auth.js'

/**
 * Route dispatcher — Délègue chaque route vers son module
 *
 * @param {string} s0 - Premier segment (auth, artworks, etc.)
 * @param {string} s1 - Deuxième segment (signup, signin, etc.)
 * @param {string} s2 - Troisième segment (ID, etc.)
 * @param {VercelRequest} req
 * @param {VercelResponse} res
 * @param {object} context - { supabaseAdmin, utils, helpers }
 * @returns {boolean} true si route traitée, false si non trouvée
 */
export async function routeRequest(s0, s1, s2, req, res, context) {
  try {
    // ── Auth routes ──
    if (s0 === 'auth') {
      await handleAuth(req, res, context.supabaseAdmin, context.utils, context.helpers, s1)
      return true
    }

    // TODO: Artworks, Payments, Delivery modules
    // (à créer progressivement)

    return false // Route non trouvée
  } catch (err) {
    console.error('[Router Error]', err)
    context.helpers.serverError(res, err)
    return true
  }
}
