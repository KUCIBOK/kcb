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
    if ((body?.sub?._id || body?.sub?.id) && (body?.plan?._id || body?.plan?.id)) {
      return { sub: body.sub, plan: body.plan }
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
    if ((body?.sub?._id || body?.sub?.id) && (body?.plan?._id || body?.plan?.id)) {
      return { sub: body.sub, plan: body.plan }
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

// ─────────────────────────────────────────────────────────────
// NEW: Trial & Subscription Management (Phase 2)
// ─────────────────────────────────────────────────────────────

/**
 * Get active subscription for a user
 * @param {string} userId
 * @returns {Promise<{data, error}>}
 */
export async function getActiveSubscription(userId) {
  if (!userId) return { error: 'userId required' }

  try {
    const res = await fetch(`${api}/subscriptions/active/${userId}`)
    const body = await res.json()

    if (!res.ok) return { error: body?.error ?? 'Failed to fetch subscription' }
    return { data: body.data }
  } catch (err) {
    return { error: err.message }
  }
}

/**
 * Create trial subscription for new user
 * @param {string} userId
 * @returns {Promise<{data, error}>}
 */
export async function createTrialSubscription(userId) {
  if (!userId) return { error: 'userId required' }

  try {
    const res = await fetch(`${api}/subscriptions/create-trial`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    })

    const body = await res.json()

    if (!res.ok) return { error: body?.error ?? 'Failed to create trial' }
    return { data: body.data }
  } catch (err) {
    return { error: err.message }
  }
}

/**
 * Calculate days remaining in trial
 * @param {Date|string} trialEndDate
 * @returns {number} days left (negative if expired)
 */
export function getTrialDaysLeft(trialEndDate) {
  if (!trialEndDate) return null

  const now = new Date()
  const end = new Date(trialEndDate)
  const diffMs = end - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * Check if trial is expired
 * @param {Date|string} trialEndDate
 * @returns {boolean}
 */
export function isTrialExpired(trialEndDate) {
  const daysLeft = getTrialDaysLeft(trialEndDate)
  return daysLeft !== null && daysLeft <= 0
}

/**
 * Get trial status badge text
 * @param {number} daysLeft
 * @returns {string}
 */
export function getTrialStatusText(daysLeft) {
  if (daysLeft === null) return null
  if (daysLeft < 0) return 'Trial expired'
  if (daysLeft === 0) return 'Trial expires today'
  if (daysLeft === 1) return 'Trial expires tomorrow'
  return `Trial expires in ${daysLeft} days`
}
