import { supabase } from '../lib/supabase'
import { utils } from './useAPI'

const { api } = utils

/** Retourne les headers avec le token Supabase frais (jamais de cache). */
async function authHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    'kcb-api-key': import.meta.env.VITE_API_KEY,
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
  }
}

export async function createCollection(payload) {
  try {
    const response = await fetch(`${api}/collection`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    })
    const collection = await response.json()
    if (collection?._id) return collection
    return { error: collection?.error || collection?.message }
  } catch (error) {
    return { error: error.message }
  }
}

export async function getCollections() {
  try {
    const response = await fetch(`${api}/collection`, {
      method: 'GET',
      headers: await authHeaders(),
    })
    const collections = await response.json()
    if (collections?.length > 0) return collections
    return { error: collections?.error || collections?.message }
  } catch (error) {
    return { error: error.message }
  }
}
