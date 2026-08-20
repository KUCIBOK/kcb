/**
 * Concierge Service API Hooks
 * Provides functions for managing bookings and service info
 */

import { utils } from './useAPI'

const CONCIERGE_API = `${utils.api}/concierge`

/**
 * Get all active concierge services
 * @returns {Promise<array>} Array of services
 */
export const useGetServices = async () => {
  try {
    const response = await fetch(`${CONCIERGE_API}/services`)
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
 * Get a single service by ID
 * @param {string} serviceId
 * @returns {Promise<object>} Service details
 */
export const useGetService = async (serviceId) => {
  if (!serviceId) return { error: 'serviceId required' }

  try {
    const response = await fetch(`${CONCIERGE_API}/services/${serviceId}`)
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
 * Create a new booking
 * @param {object} payload - { serviceId, requestedStartDate, requestedEndDate?, notes? }
 * @returns {Promise<object>} Created booking
 */
export const useCreateBooking = async (payload) => {
  try {
    const response = await fetch(`${CONCIERGE_API}/bookings`, {
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
 * Get all bookings for authenticated user
 * @param {object} options - { status, limit }
 * @returns {Promise<array>} Array of bookings
 */
export const useGetBookings = async (options = {}) => {
  try {
    const params = new URLSearchParams()
    if (options.status) params.append('status', options.status)
    if (options.limit) params.append('limit', options.limit)

    const response = await fetch(`${CONCIERGE_API}/bookings?${params}`, {
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
 * Get a single booking with full details
 * @param {string} bookingId
 * @returns {Promise<object>} Booking with history
 */
export const useGetBooking = async (bookingId) => {
  if (!bookingId) return { error: 'bookingId required' }

  try {
    const response = await fetch(`${CONCIERGE_API}/bookings/${bookingId}`, {
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
 * Update a booking
 * @param {string} bookingId
 * @param {object} updates - { status?, notes?, requestedStartDate? }
 * @returns {Promise<object>} Updated booking
 */
export const useUpdateBooking = async (bookingId, updates) => {
  if (!bookingId) return { error: 'bookingId required' }

  try {
    const response = await fetch(`${CONCIERGE_API}/bookings/${bookingId}`, {
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
 * Cancel a booking
 * @param {string} bookingId
 * @returns {Promise<object>} Cancelled booking
 */
export const useCancelBooking = async (bookingId) => {
  if (!bookingId) return { error: 'bookingId required' }

  try {
    const response = await fetch(`${CONCIERGE_API}/bookings/${bookingId}`, {
      method: 'DELETE',
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
 * Confirm payment for a booking
 * @param {string} bookingId
 * @returns {Promise<object>} Updated booking with payment_status: 'completed'
 */
export const useConfirmPayment = async (bookingId) => {
  if (!bookingId) return { error: 'bookingId required' }

  try {
    const response = await fetch(`${CONCIERGE_API}/bookings/${bookingId}/confirm-payment`, {
      method: 'POST',
      headers: utils.options.headers,
      body: JSON.stringify({}),
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
