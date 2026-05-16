import { utils } from './useAPI'
const { api } = utils

/**
 * Crée une demande de mise en relation (sourcing) pour une œuvre.
 *
 * @param {object} payload - { artworkId, purpose, message, organization?, budget? }
 * @returns {Promise<object>} L'inquiry créée ou { error: string }
 */
export async function createInquiry(payload) {
  try {
    const response = await fetch(`${api}/sourcing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...utils.options.headers,
      },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (!response.ok) return { error: data?.message || data?.error || 'Erreur serveur' }
    return data
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Récupère les demandes de sourcing de l'utilisateur connecté.
 *
 * @returns {Promise<Array|object>} Liste des inquiries ou { error: string }
 */
export async function getMyInquiries() {
  try {
    const response = await fetch(`${api}/sourcing/mine`, {
      ...utils.options,
    })
    const data = await response.json()
    if (!response.ok) return { error: data?.message || data?.error || 'Erreur serveur' }
    return data
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Récupère le catalogue certifié (pro) avec filtres optionnels.
 *
 * @param {object} params - { page?, limit?, category?, availabilityStatus?, priceMin?, priceMax?, search? }
 * @returns {Promise<object>} { data, total, page, pages } ou { error: string }
 */
export async function getCataloguePro(params = {}) {
  try {
    const { page = 1, limit = 12, category, search, availabilityStatus, priceMin, priceMax } =
      params
    const apiParams = { status: 'approved', page: String(page), limit: String(limit) }
    if (category) apiParams.category = category
    const qs = new URLSearchParams(apiParams).toString()
    const response = await fetch(`${api}/artworks?${qs}`, { ...utils.options })
    const body = await response.json()
    if (!response.ok) return { error: body?.error || 'Erreur serveur' }
    let data = Array.isArray(body.data) ? body.data : Array.isArray(body) ? body : []
    const total = body.pagination?.total ?? data.length
    // Client-side filters not supported server-side
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (a) => a.title?.toLowerCase().includes(q) || a.artist?.toLowerCase().includes(q)
      )
    }
    if (availabilityStatus) {
      data = data.filter((a) => a.availability_status === availabilityStatus)
    }
    if (priceMin) data = data.filter((a) => Number(a.price) >= Number(priceMin))
    if (priceMax) data = data.filter((a) => Number(a.price) <= Number(priceMax))
    const pages = Math.max(1, Math.ceil(total / limit))
    return { data, total, pages }
  } catch (error) {
    return { error: error.message }
  }
}
