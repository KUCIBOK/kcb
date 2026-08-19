/**
 * useShortlist.js — Hooks pour gérer le shortlisting d'artworks
 */

import { useCallback, useState } from 'react'
import { utils } from './useAPI'
import { supabase } from '../lib/supabase'

/**
 * Hook pour ajouter une artwork à la shortlist
 * @param {string} artworkId — UUID de l'artwork
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function useAddToShortlist(artworkId) {
  try {
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.access_token) {
      return { success: false, error: 'Not authenticated' }
    }

    const res = await fetch(`${utils.api}/subscriptions/shortlist/${artworkId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.session.access_token}`,
      },
      body: JSON.stringify({ notes: null }),
    })

    const body = await res.json()
    if (!res.ok) {
      return { success: false, error: body?.error ?? 'Failed to add to shortlist' }
    }

    return { success: true, data: body.data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Hook pour retirer une artwork de la shortlist
 * @param {string} artworkId — UUID de l'artwork
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function useRemoveFromShortlist(artworkId) {
  try {
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.access_token) {
      return { success: false, error: 'Not authenticated' }
    }

    const res = await fetch(`${utils.api}/subscriptions/shortlist/${artworkId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.session.access_token}`,
      },
    })

    const body = await res.json()
    if (!res.ok) {
      return { success: false, error: body?.error ?? 'Failed to remove from shortlist' }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Hook pour récupérer la shortlist de l'utilisateur
 * @returns {Promise<{ success: boolean, data?: array, error?: string }>}
 */
export async function useGetMyShortlist() {
  try {
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.access_token) {
      return { success: false, error: 'Not authenticated' }
    }

    const res = await fetch(`${utils.api}/subscriptions/my-shortlist`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.session.access_token}`,
      },
    })

    const body = await res.json()
    if (!res.ok) {
      return { success: false, error: body?.error ?? 'Failed to fetch shortlist' }
    }

    return { success: true, data: body.data || [] }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Hook pour vérifier si une artwork est shortlistée
 * @param {string} artworkId — UUID de l'artwork
 * @returns {Promise<{ success: boolean, isShortlisted?: boolean, error?: string }>}
 */
export async function useCheckShortlisted(artworkId) {
  try {
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.access_token) {
      return { success: false, error: 'Not authenticated' }
    }

    const res = await fetch(
      `${utils.api}/subscriptions/shortlist/check/${artworkId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
        },
      }
    )

    const body = await res.json()
    if (!res.ok) {
      return { success: false, error: body?.error ?? 'Failed to check shortlist' }
    }

    return { success: true, isShortlisted: body.isShortlisted ?? false }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Hook pour mettre à jour les notes d'un shortlist item
 * @param {string} artworkId — UUID de l'artwork
 * @param {string} notes — Notes personnelles
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function useUpdateShortlistNotes(artworkId, notes) {
  try {
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.access_token) {
      return { success: false, error: 'Not authenticated' }
    }

    const res = await fetch(`${utils.api}/subscriptions/shortlist/${artworkId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.session.access_token}`,
      },
      body: JSON.stringify({ notes }),
    })

    const body = await res.json()
    if (!res.ok) {
      return { success: false, error: body?.error ?? 'Failed to update notes' }
    }

    return { success: true, data: body.data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Hook helper pour toggle shortlist status
 * Returns { isShortlisted, toggle, loading }
 */
export function useShortlistToggle(artworkId) {
  const [isShortlisted, setIsShortlisted] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggle = useCallback(async () => {
    setLoading(true)
    if (isShortlisted) {
      const result = await useRemoveFromShortlist(artworkId)
      if (result.success) {
        setIsShortlisted(false)
      }
    } else {
      const result = await useAddToShortlist(artworkId)
      if (result.success) {
        setIsShortlisted(true)
      }
    }
    setLoading(false)
  }, [artworkId, isShortlisted])

  const checkStatus = useCallback(async () => {
    const result = await useCheckShortlisted(artworkId)
    if (result.success) {
      setIsShortlisted(result.isShortlisted)
    }
  }, [artworkId])

  return { isShortlisted, toggle, loading, checkStatus }
}
