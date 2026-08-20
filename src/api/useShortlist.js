/**
 * useShortlist.js — Hooks pour gérer le shortlisting d'artworks (Phase 2)
 */

import { useCallback, useState } from 'react'
import { utils } from './useAPI'
import { supabase } from '../lib/supabase'

const { api } = utils

/**
 * Get user's shortlist with artworks
 */
export async function getMyShortlist(userId) {
  if (!userId) return { success: false, error: 'userId required', data: [] }

  try {
    const res = await fetch(`${api}/shortlist?user_id=${userId}`)
    const body = await res.json()

    if (!res.ok) return { success: false, error: body?.error ?? 'Failed to fetch shortlist', data: [] }
    return { success: true, data: body.data || [], count: body.count || 0 }
  } catch (err) {
    return { success: false, error: err.message, data: [] }
  }
}

/**
 * Add artwork to shortlist
 */
export async function addToShortlist(userId, artworkId, notes = '') {
  if (!userId || !artworkId) return { success: false, error: 'userId and artworkId required' }

  try {
    const res = await fetch(`${api}/shortlist/${artworkId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, notes }),
    })

    const body = await res.json()

    if (!res.ok) {
      if (res.status === 409) return { success: false, error: 'Already shortlisted' }
      return { success: false, error: body?.error ?? 'Failed to add to shortlist' }
    }

    return { success: true, data: body.data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Remove artwork from shortlist
 */
export async function removeFromShortlist(userId, artworkId) {
  if (!userId || !artworkId) return { success: false, error: 'userId and artworkId required' }

  try {
    const res = await fetch(`${api}/shortlist/${artworkId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    })

    const body = await res.json()

    if (!res.ok) return { success: false, error: body?.error ?? 'Failed to remove from shortlist' }
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Check if artwork is shortlisted
 */
export async function checkIsShortlisted(userId, artworkId) {
  if (!userId || !artworkId) return { success: false, isShortlisted: false }

  try {
    const res = await fetch(`${api}/shortlist/check/${artworkId}?user_id=${userId}`)
    const body = await res.json()

    if (!res.ok) return { success: false, isShortlisted: false }
    return { success: true, isShortlisted: body.isShortlisted || false }
  } catch (err) {
    return { success: false, isShortlisted: false }
  }
}

/**
 * Update shortlist notes
 */
export async function updateShortlistNotes(userId, artworkId, notes) {
  if (!userId || !artworkId) return { success: false, error: 'userId and artworkId required' }

  try {
    const res = await fetch(`${api}/shortlist/${artworkId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, notes }),
    })

    const body = await res.json()

    if (!res.ok) return { success: false, error: body?.error ?? 'Failed to update notes' }
    return { success: true, data: body.data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Hook: Toggle shortlist status for an artwork
 * Returns { isShortlisted, toggle, loading, checkStatus }
 */
export function useShortlistToggle(artworkId) {
  const [isShortlisted, setIsShortlisted] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggle = useCallback(async () => {
    setLoading(true)
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.user?.id

    if (isShortlisted) {
      const result = await removeFromShortlist(userId, artworkId)
      if (result.success) setIsShortlisted(false)
    } else {
      const result = await addToShortlist(userId, artworkId)
      if (result.success) setIsShortlisted(true)
    }
    setLoading(false)
  }, [artworkId, isShortlisted])

  const checkStatus = useCallback(async () => {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.user?.id
    const result = await checkIsShortlisted(userId, artworkId)
    if (result.success) setIsShortlisted(result.isShortlisted)
  }, [artworkId])

  return { isShortlisted, toggle, loading, checkStatus }
}
