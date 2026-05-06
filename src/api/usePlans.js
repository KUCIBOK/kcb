import { utils } from './useAPI'
const { api } = utils

export async function getAllPlans() {
  try {
    const response = await fetch(`${api}/plan`, { ...utils.options })
    const body = await response.json()
    const plans = body?.data ?? body
    if (Array.isArray(plans) && plans.length > 0) {
      return plans
    }
    if (Array.isArray(plans)) return plans // empty array is valid
    throw new Error(body?.message || body?.error || 'No plans found')
  } catch (error) {
    return { error: error.message }
  }
}

export async function getPlanById(id) {
  try {
    const response = await fetch(`${api}/plan/${id}`, { ...utils.options })
    const body = await response.json()
    const plan = body?.data ?? body
    if (plan?.id || plan?._id) {
      return plan
    }
    return { error: body?.error || body?.message }
  } catch (error) {
    return { error: error.message }
  }
}

export async function createPlan(payload) {
  try {
    const response = await fetch(`${api}/plan`, {
      ...utils.options,
      method: 'POST',
      body: JSON.stringify(payload),
    })
    const body = await response.json()
    const plan = body?.data ?? body
    if (plan?.id) {
      return plan
    }
    throw new Error(body?.message || body?.error || 'Plan creation failed')
  } catch (error) {
    return { error: error.message }
  }
}

export async function updatePlan(id, payload) {
  try {
    const response = await fetch(`${api}/plan/${id}`, {
      ...utils.options,
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    const body = await response.json()
    const plan = body?.data ?? body
    if (plan?.id) {
      return plan
    }
    throw new Error(body?.message || body?.error || 'Plan update failed')
  } catch (error) {
    return { error: error.message }
  }
}

export async function deletePlan(id) {
  try {
    const response = await fetch(`${api}/plan/${id}`, {
      ...utils.options,
      method: 'DELETE',
    })
    const body = await response.json()
    const plan = body?.data ?? body
    if (plan?.id) {
      return plan
    }
    throw new Error(body?.message || body?.error || 'Plan deletion failed')
  } catch (error) {
    return { error: error.message }
  }
}
