import { utils } from './useAPI'
const { api } = utils

export async function getMyCredits() {
  try {
    const res = await fetch(`${api}/rewards/credits`, { ...utils.options })
    const body = await res.json()
    return body?.data ?? { credits: { balance: 0, total_earned: 0, total_spent: 0 }, transactions: [] }
  } catch {
    return { credits: { balance: 0, total_earned: 0, total_spent: 0 }, transactions: [] }
  }
}

export async function getMyReferrals() {
  try {
    const res = await fetch(`${api}/rewards/referrals`, { ...utils.options })
    const body = await res.json()
    return body?.data ?? { referrals: [], code: null }
  } catch {
    return { referrals: [], code: null }
  }
}

export async function getRewardsProducts() {
  try {
    const res = await fetch(`${api}/rewards/products`, { ...utils.options })
    const body = await res.json()
    return Array.isArray(body?.data) ? body.data : []
  } catch {
    return []
  }
}

export async function getMyOrders() {
  try {
    const res = await fetch(`${api}/rewards/orders`, { ...utils.options })
    const body = await res.json()
    return Array.isArray(body?.data) ? body.data : []
  } catch {
    return []
  }
}

export async function placeOrder(productId) {
  try {
    const res = await fetch(`${api}/rewards/orders`, {
      ...utils.options,
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    })
    const body = await res.json()
    if (!res.ok) return { error: body?.error || 'Erreur commande' }
    return { data: body?.data }
  } catch (err) {
    return { error: err.message }
  }
}
