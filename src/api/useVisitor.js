import { utils } from './useAPI'
const { api } = utils
export async function createVisitor(payload) {
  try {
    const response = await fetch(`${api}/visitor`, {
      ...utils.options,
      method: 'POST',
      body: JSON.stringify(payload),
    })

    const body = await response.json()
    const visitor = body?.data ?? body
    if (visitor?.id || visitor?._id) {
      return visitor
    }

    return {
      error: body?.message || 'Failed to create visitor',
    }
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export async function getAllVisitors() {
  try {
    const response = await fetch(`${api}/visitor`, {
      ...utils.options,
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch visitors')
    }

    return await response.json()
  } catch (error) {
    return {
      error: error.message,
    }
  }
}
