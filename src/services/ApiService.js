// Service API universel pour Kucibok
// Gère les requêtes avec kcb-api-key, Authorization, erreurs et JSON

import { supabase } from '../lib/supabase'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'
const API_KEY = import.meta.env.VITE_API_KEY

/**
 * ApiError: custom error class that preserves status and body
 * while maintaining Error instanceof checks and .message property.
 */
class ApiError extends Error {
  constructor(message, status, body) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
    // Maintain proper Error inheritance for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

/** Construit les headers avec l'API key et le token Supabase courant. */
async function buildHeaders(extra = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'kcb-api-key': API_KEY,
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    ...extra,
  }
}

function parseJsonSafe(response) {
  return response.text().then((text) => {
    try {
      return text ? JSON.parse(text) : {}
    } catch {
      return { _raw: text }
    }
  })
}

function handleResponse(response) {
  return parseJsonSafe(response).then((data) => {
    if (!response.ok) {
      // Construct a user-friendly error message from the response
      const message =
        data?.error ||
        data?.message ||
        `HTTP ${response.status}: ${response.statusText || 'Erreur serveur'}`
      throw new ApiError(message, response.status, data)
    }
    return data
  })
}

/**
 * Exécute une requête et, en cas de 401, force un rafraîchissement de session
 * via `supabase.auth.getSession()` puis retente la requête une fois.
 */
async function requestWithRetry(url, fetchOptions, retry = true) {
  const res = await fetch(url, fetchOptions)
  if (res.status !== 401) return handleResponse(res)

  // 401 détecté — tenter de rafraîchir la session côté client et retenter
  if (retry) {
    try {
      // Tenter un refresh explicite si possible
      const { data: { session } = {} } = await supabase.auth.getSession()
      if (session?.refresh_token) {
        try {
          await supabase.auth.refreshSession({ refresh_token: session.refresh_token })
        } catch {
          // ignore - si refresh échoue, on retentera getSession() ci-dessous
        }
      } else {
        // fallback: appeler getSession pour laisser le client tenter un refresh automatique
        await supabase.auth.getSession()
      }
      const headers = await buildHeaders(fetchOptions.headers)
      const retryRes = await fetch(url, { ...fetchOptions, headers })
      return handleResponse(retryRes)
    } catch (err) {
      // Propager l'erreur d'origine si le retry échoue
      throw err
    }
  }

  // Si pas de retry autorisé, remonter l'erreur 401
  return handleResponse(res)
}

const apiService = {
  get: async (url, options = {}) => {
    const headers = await buildHeaders(options.headers)
    return requestWithRetry(BASE_URL + url, {
      method: 'GET',
      credentials: 'include',
      ...options,
      headers,
    })
  },
  post: async (url, body = {}, options = {}) => {
    const headers = await buildHeaders(options.headers)
    return requestWithRetry(BASE_URL + url, {
      method: 'POST',
      credentials: 'include',
      ...options,
      headers,
      body: JSON.stringify(body),
    })
  },
  put: async (url, body = {}, options = {}) => {
    const headers = await buildHeaders(options.headers)
    return requestWithRetry(BASE_URL + url, {
      method: 'PUT',
      credentials: 'include',
      ...options,
      headers,
      body: JSON.stringify(body),
    })
  },
  delete: async (url, options = {}) => {
    const headers = await buildHeaders(options.headers)
    return requestWithRetry(BASE_URL + url, {
      method: 'DELETE',
      credentials: 'include',
      ...options,
      headers,
    })
  },
}

export default apiService
