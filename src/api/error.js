/**
 * error.js — Signalement d'erreurs critiques côté frontend.
 *
 * @module error
 */

import { utils } from './useAPI'

const { api } = utils

/**
 * Envoie un rapport d'erreur critique à l'admin via l'API.
 *
 * @param {{ message: string, stack?: string, url?: string, userAgent?: string }} payload
 * @returns {Promise<void>}
 */
export async function sendErrorReport(payload) {
  try {
    await fetch(`${api}/report-error`, {
      ...utils.options,
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch {
    // Silencieux — ne pas re-throw une erreur de signalement d'erreur
  }
}
