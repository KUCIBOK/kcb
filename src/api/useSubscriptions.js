import { utils } from './useAPI'
const { api } = utils

export async function createSubscription(payload) {
  try {
    const response = await fetch(`${api}/subscription`, {
      ...utils.options,
      method: 'POST',
      body: JSON.stringify(payload),
    })
    const body = await response.json()
    const sub = body?.data ?? body
    if (sub?.id || sub?._id) {
      return sub
    }
    return { error: body?.error || body?.message }
  } catch (error) {
    return { error: error.message }
  }
}

export async function failSubscription(subId) {
  try {
    const response = await fetch(`${api}/subscription/fail/${subId}`, {
      ...utils.options,
      method: 'POST',
    })
    const body = await response.json()
    const sub = body?.data ?? body
    if (sub?.id || sub?._id) {
      return sub
    }
    return { error: body?.error || body?.message }
  } catch (error) {
    return { error: error.message }
  }
}

export async function activateSubscription(subId) {
  try {
    const response = await fetch(`${api}/subscription/activate/${subId}`, {
      ...utils.options,
      method: 'POST',
    })
    const body = await response.json()
    const sub = body?.data ?? body
    if (sub?.id || sub?._id) {
      return sub
    }
    return { error: body?.error || body?.message }
  } catch (error) {
    return { error: error.message }
  }
}

export async function getSubById(id) {
  try {
    const response = await fetch(`${api}/subscription/${id}`, { ...utils.options })
    const body = await response.json()
    const sub = body?.data ?? body
    if (sub?.id || sub?._id) {
      return sub
    }
    return { error: body?.error || body?.message }
  } catch (error) {
    return { error: error.message }
  }
}

export const getSubscriptionById = getSubById

export async function getAllSubscriptions() {
  try {
    const response = await fetch(`${api}/subscription`, { ...utils.options })
    const body = await response.json()
    const subscriptions = body?.data ?? body
    if (Array.isArray(subscriptions)) {
      return subscriptions
    }
    return { error: body?.message || body?.error || 'Format inattendu' }
  } catch (error) {
    return { error: error.message }
  }
}

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

export async function getMySubscription() {
  try {
    const response = await fetch(`${api}/subscription`, { ...utils.options })
    const body = await response.json()
    const sub = body?.data
    if (!sub) return null
    if (sub.plans && !sub.plan) sub.plan = sub.plans
    return sub
  } catch {
    return null
  }
}
