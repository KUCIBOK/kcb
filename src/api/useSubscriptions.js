import { utils } from './useAPI'
const { api } = utils

export async function createSubscription(payload) {
  try {
    const response = await fetch(`${api}/subscription`, {
      ...utils.options,
      method: 'POST',
      body: JSON.stringify(payload),
    })
    const sub = await response.json()
    if (sub?._id) {
      return sub
    }
    return {
      error: sub?.error || sub?.messsage,
    }
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export async function failSubscription(subId) {
  try {
    const response = await fetch(`${api}/subscription/fail/${subId}`, {
      ...utils.options,
      method: 'POST',
    })
    const { sub, plan, error, message } = await response.json()
    if (sub?._id && plan?._id) {
      return { sub, plan }
    }
    return {
      error: error || message,
    }
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export async function activateSubscription(subId) {
  try {
    const response = await fetch(`${api}/subscription/activate/${subId}`, {
      ...utils.options,
      method: 'POST',
    })
    const { sub, plan, error, message } = await response.json()
    if (sub?._id && plan?._id) {
      return { sub, plan }
    }
    return {
      error: error || message,
    }
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export async function getSubById(id) {
  try {
    const response = await fetch(`${api}/subscription/${id}`, { ...utils.options })
    const sub = await response.json()
    if (sub?._id) {
      return sub
    }
    return {
      error: sub?.error || sub?.messsage,
    }
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

// Alias pour compatibilité avec les imports
export const getSubscriptionById = getSubById

export async function getAllSubscriptions() {
  try {
    const response = await fetch(`${api}/subscription`, { ...utils.options })
    const subscriptions = await response.json()
    if (subscriptions?.length > 0) {
      return subscriptions
    }
    return {
      error: subscriptions?.message || subscriptions?.error,
    }
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

/**
 * Annule l'abonnement actif de l'utilisateur connecté.
 * @returns {Promise<{data?: object, error?: string}>}
 */
export async function cancelMySubscription() {
  try {
    const response = await fetch(`${api}/subscription/cancel`, {
      ...utils.options,
      method: 'POST',
    })
    const body = await response.json()
    if (!response.ok) return { error: body?.error || 'Erreur annulation' }
    return { data: body?.data }
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Récupère l'abonnement actif de l'utilisateur connecté.
 * Retourne null si aucun abonnement actif ou en cas d'erreur.
 *
 * @returns {Promise<object|null>}
 */
export async function getMySubscription() {
  try {
    const response = await fetch(`${api}/subscription`, { ...utils.options })
    const body = await response.json()
    const sub = body?.data
    if (!sub) return null
    // Normalise la jointure Supabase : plans -> plan
    if (sub.plans && !sub.plan) sub.plan = sub.plans
    return sub
  } catch {
    return null
  }
}
