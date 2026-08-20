/**
 * Budget API Hooks
 * Provides functions for CRUD operations on budgets
 */

import { utils } from './useAPI'

const BUDGETS_API = `${utils.api}/budgets`

/**
 * Create a new budget
 * @param {object} payload - { totalAmount, currency, lines: [ { category, allocated, notes } ] }
 * @returns {Promise<object>} Created budget record
 */
export const useCreateBudget = async (payload) => {
  try {
    const response = await fetch(`${BUDGETS_API}/create`, {
      method: 'POST',
      headers: utils.options.headers,
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Error ${response.status}` }
    }
    const { data } = await response.json()
    return data
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Get all budgets for current user
 * @param {object} options - { status, limit }
 * @returns {Promise<array>} Array of budgets with lines
 */
export const useGetBudgets = async (options = {}) => {
  try {
    const params = new URLSearchParams()
    if (options.status) params.append('status', options.status)
    if (options.limit) params.append('limit', options.limit)

    const response = await fetch(`${BUDGETS_API}/list?${params}`, {
      headers: utils.options.headers,
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Error ${response.status}` }
    }
    const { data } = await response.json()
    return data || []
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Get a single budget with all details (lines + transactions)
 * @param {string} budgetId
 * @returns {Promise<object>} Budget with nested lines and transactions
 */
export const useGetBudget = async (budgetId) => {
  if (!budgetId) return { error: 'budgetId required' }

  try {
    const response = await fetch(`${BUDGETS_API}/${budgetId}`, {
      headers: utils.options.headers,
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Error ${response.status}` }
    }
    const { data } = await response.json()
    return data
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Update a budget record
 * @param {string} budgetId
 * @param {object} updates - { totalAmount?, currency?, status?, notes? }
 * @returns {Promise<object>} Updated budget
 */
export const useUpdateBudget = async (budgetId, updates) => {
  if (!budgetId) return { error: 'budgetId required' }

  try {
    const response = await fetch(`${BUDGETS_API}/${budgetId}`, {
      method: 'PUT',
      headers: utils.options.headers,
      body: JSON.stringify(updates),
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Error ${response.status}` }
    }
    const { data } = await response.json()
    return data
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Delete a budget (and all associated lines/transactions)
 * @param {string} budgetId
 * @returns {Promise<object>} Success or error
 */
export const useDeleteBudget = async (budgetId) => {
  if (!budgetId) return { error: 'budgetId required' }

  try {
    const response = await fetch(`${BUDGETS_API}/${budgetId}`, {
      method: 'DELETE',
      headers: utils.options.headers,
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Error ${response.status}` }
    }
    return await response.json()
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Add a budget line to an existing budget
 * @param {string} budgetId
 * @param {object} line - { category, allocated, notes? }
 * @returns {Promise<object>} Created line
 */
export const useAddBudgetLine = async (budgetId, line) => {
  if (!budgetId) return { error: 'budgetId required' }

  try {
    const response = await fetch(`${BUDGETS_API}/${budgetId}/lines`, {
      method: 'POST',
      headers: utils.options.headers,
      body: JSON.stringify(line),
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Error ${response.status}` }
    }
    const { data } = await response.json()
    return data
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Update a budget line
 * @param {string} budgetId
 * @param {string} lineId
 * @param {object} updates - { category?, allocated?, spent?, notes? }
 * @returns {Promise<object>} Updated line
 */
export const useUpdateBudgetLine = async (budgetId, lineId, updates) => {
  if (!budgetId || !lineId) return { error: 'budgetId and lineId required' }

  try {
    const response = await fetch(`${BUDGETS_API}/${budgetId}/lines/${lineId}`, {
      method: 'PUT',
      headers: utils.options.headers,
      body: JSON.stringify(updates),
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Error ${response.status}` }
    }
    const { data } = await response.json()
    return data
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Delete a budget line
 * @param {string} budgetId
 * @param {string} lineId
 * @returns {Promise<object>} Success or error
 */
export const useDeleteBudgetLine = async (budgetId, lineId) => {
  if (!budgetId || !lineId) return { error: 'budgetId and lineId required' }

  try {
    const response = await fetch(`${BUDGETS_API}/${budgetId}/lines/${lineId}`, {
      method: 'DELETE',
      headers: utils.options.headers,
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Error ${response.status}` }
    }
    return await response.json()
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Add a transaction to a budget
 * @param {string} budgetId
 * @param {object} transaction - { description, amount, transactionDate, category?, notes? }
 * @returns {Promise<object>} Created transaction
 */
export const useAddBudgetTransaction = async (budgetId, transaction) => {
  if (!budgetId) return { error: 'budgetId required' }

  try {
    const response = await fetch(`${BUDGETS_API}/${budgetId}/transactions`, {
      method: 'POST',
      headers: utils.options.headers,
      body: JSON.stringify(transaction),
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Error ${response.status}` }
    }
    const { data } = await response.json()
    return data
  } catch (error) {
    return { error: error.message }
  }
}
