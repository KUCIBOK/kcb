// Service API universel pour Kucibok
// Gère les requêtes avec kcb-api-key, Authorization, erreurs et JSON

import { supabase } from '../lib/supabase'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'
const API_KEY = import.meta.env.VITE_API_KEY

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

function handleResponse(response) {
  return response.json().then((data) => {
    if (!response.ok) {
      throw new Error(data?.error || data?.message || 'Erreur serveur')
    }
    return data
  })
}

const apiService = {
  get: async (url, options = {}) => {
    const headers = await buildHeaders(options.headers)
    const response = await fetch(BASE_URL + url, {
      method: 'GET',
      credentials: 'include',
      ...options,
      headers,
    })
    return handleResponse(response)
  },
  post: async (url, body = {}, options = {}) => {
    const headers = await buildHeaders(options.headers)
    const response = await fetch(BASE_URL + url, {
      method: 'POST',
      credentials: 'include',
      ...options,
      headers,
      body: JSON.stringify(body),
    })
    return handleResponse(response)
  },
  put: async (url, body = {}, options = {}) => {
    const headers = await buildHeaders(options.headers)
    const response = await fetch(BASE_URL + url, {
      method: 'PUT',
      credentials: 'include',
      ...options,
      headers,
      body: JSON.stringify(body),
    })
    return handleResponse(response)
  },
  delete: async (url, options = {}) => {
    const headers = await buildHeaders(options.headers)
    const response = await fetch(BASE_URL + url, {
      method: 'DELETE',
      credentials: 'include',
      ...options,
      headers,
    })
    return handleResponse(response)
  },
}

export default apiService
