import { utils } from './useAPI'
const { api } = utils
export async function createVisitor(payload) {
  try {
    const response = await fetch(`${api}/visitor`, {
      ...utils.options,
      method: 'POST',
      body: JSON.stringify(payload),
    })

    const visitor = await response.json()
    if (visitor?._id) {
      return visitor
    }

    return {
      error: visitor?.message || 'Failed to create visitor',
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
