import { utils } from './useAPI'
const { api } = utils

export async function createTransaction(payload) {
  try {
    const response = await fetch(`${api}/transaction`, {
      ...utils.options,
      method: 'POST',
      body: JSON.stringify(payload),
    })
    const body = await response.json()
    const transaction = body?.data ?? body
    if (transaction?.id || transaction?._id) {
      return transaction
    }
    return { error: body?.error || body?.message }
  } catch (error) {
    return { error: error.message }
  }
}

export async function getTransactionById(id) {
  try {
    const response = await fetch(`${api}/transaction/${id}`, { ...utils.options })
    const body = await response.json()
    const transaction = body?.data ?? body
    if (transaction?.id || transaction?._id) {
      return transaction
    }
    return { error: body?.error || body?.message }
  } catch (error) {
    return { error: error.message }
  }
}

export async function getTransactionByRef(ref) {
  try {
    const response = await fetch(`${api}/transaction/ref/${encodeURIComponent(ref)}`, {
      ...utils.options,
    })
    const body = await response.json()
    const transaction = body?.data ?? body
    if (transaction?.id || transaction?._id) {
      return transaction
    }
    return { error: body?.error || body?.message }
  } catch (error) {
    return { error: error.message }
  }
}

export async function failTransaction(id) {
  try {
    const response = await fetch(`${api}/transaction/fail/${id}`, {
      ...utils.options,
      method: 'POST',
    })
    const body = await response.json()
    const transaction = body?.data ?? body
    if (transaction?.id || transaction?._id) {
      return transaction
    }
    return { error: body?.error || body?.message }
  } catch (error) {
    return { error: error.message }
  }
}
