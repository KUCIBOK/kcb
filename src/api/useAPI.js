/**
 * useAPI.js — Utilitaires communs pour les appels fetch vers le backend.
 *
 * Token Supabase :
 *   Le token est synchronisé depuis AuthContext via setSupabaseToken()
 *   à chaque changement de session (onAuthStateChange).
 *   Plus de lecture directe dans localStorage.
 *
 * @module useAPI
 */

/** Token Supabase courant, mis à jour par setSupabaseToken(). */
let _currentToken = '';

/**
 * fetch() avec timeout automatique.
 * Rejette avec une erreur lisible si le serveur ne répond pas dans le délai.
 *
 * @param {string} url
 * @param {RequestInit} options
 * @param {number} [timeoutMs=12000]
 * @returns {Promise<Response>}
 */
export function fetchWithTimeout(url, options = {}, timeoutMs = 12_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer))
    .catch((err) => {
      if (err.name === 'AbortError') throw new Error('Délai d\'attente dépassé — réessayez');
      throw err;
    });
}

/**
 * Met à jour le token Supabase utilisé par utils.options.
 * À appeler depuis AuthContext à chaque événement onAuthStateChange.
 *
 * @param {string | null} token - access_token Supabase ou null si déconnecté
 */
export function setSupabaseToken(token) {
  _currentToken = token ?? '';
}

/**
 * Utilitaires partagés pour tous les fichiers src/api/*.js.
 *
 * @type {{ api: string, options: object }}
 */
export const utils = {
  /** Base URL de l'API (Vercel Functions post-migration / VPS pré-migration). */
  api: import.meta.env.VITE_API_URL,

  /**
   * Getter ES6 — retourne un nouvel objet options à chaque accès.
   * Lit le token depuis le module-level variable, mis à jour par AuthContext.
   *
   * @returns {{ method: string, headers: Record<string, string> }}
   */
  get options() {
    return {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'kcb-api-key': import.meta.env.VITE_API_KEY,
        Authorization: `Bearer ${_currentToken}`,
      },
    };
  },
};
