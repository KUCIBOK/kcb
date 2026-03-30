/**
 * useDelivery.test.js - Tests unitaires pour src/api/useDelivery.js
 *
 * Strategie de mock :
 *   - `useAPI` est mocke pour fournir une base URL fixe (/api) et des
 *     options statiques avec un token de test.
 *   - `global.fetch` est remplace par un vi.fn() avant chaque test et
 *     reinitialise apres.
 *
 * Fonctions testees :
 *   - getDeliveryByTracking (GET /api/delivery/track/:id, sans auth)
 *   - getDeliveries         (GET /api/delivery, avec auth)
 *   - getMyDeliveries       (alias de getDeliveries)
 *   - getDelivery           (GET /api/delivery/:id, avec auth)
 *   - createDelivery        (POST /api/delivery, avec auth + corps JSON)
 *   - changeDeliveryStatus  (PATCH /api/delivery/:id, avec auth + corps JSON)
 *   - updateDelivery        (alias de changeDeliveryStatus)
 *   - deleteDelivery        (DELETE /api/delivery/:id, avec auth)
 *
 * @module useDelivery.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/useAPI', () => ({
  utils: {
    api: '/api',
    get options() {
      return {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'kcb-api-key': 'test-key',
          Authorization: 'Bearer test-token',
        },
      }
    },
  },
}))

import {
  getDeliveryByTracking,
  getDeliveries,
  getMyDeliveries,
  getDelivery,
  createDelivery,
  changeDeliveryStatus,
  updateDelivery,
  deleteDelivery,
} from '../api/useDelivery'

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cree un objet Response simule pour global.fetch.
 *
 * @param {object} body       - Corps JSON retourne par response.json()
 * @param {number} [status]   - Code HTTP (default 200)
 * @returns {object} mock Response
 */
function makeFetchResponse(body, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: vi.fn().mockResolvedValue(body) }
}

beforeEach(() => {
  vi.clearAllMocks()
  global.fetch = vi.fn()
})

// ─────────────────────────────────────────────────────────────────────────────
// getDeliveryByTracking
// ─────────────────────────────────────────────────────────────────────────────

describe('getDeliveryByTracking', () => {
  it('retourne les donnees de suivi en cas de succes (body.data present)', async () => {
    const delivery = { id: 'del-1', status: 'in_transit', tracking_id: 'TRK-001' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: delivery }))

    const result = await getDeliveryByTracking('TRK-001')

    expect(result).toEqual(delivery)
  })

  it('retourne body directement quand body.data est absent', async () => {
    const flat = { id: 'del-2', status: 'delivered' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse(flat))

    const result = await getDeliveryByTracking('TRK-002')

    expect(result).toEqual(flat)
  })

  it('appelle la bonne URL avec le trackingId fourni', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: {} }))

    await getDeliveryByTracking('TRK-ABC-123')

    const [url] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/delivery/track/TRK-ABC-123')
  })

  it("n'envoie aucun header d'auth -- seulement Content-Type", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: {} }))

    await getDeliveryByTracking('TRK-001')

    const [, init] = global.fetch.mock.calls[0]
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(init.headers).not.toHaveProperty('Authorization')
    expect(init.headers).not.toHaveProperty('kcb-api-key')
  })

  it('retourne {error} avec le message du serveur quand le statut est 404', async () => {
    global.fetch.mockResolvedValueOnce(
      makeFetchResponse({ error: 'Numero de suivi introuvable' }, 404)
    )

    const result = await getDeliveryByTracking('TRK-INEXISTANT')

    expect(result).toHaveProperty('error', 'Numero de suivi introuvable')
  })

  it('retourne le message par defaut quand le corps 4xx ne contient pas error', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({}, 404))

    const result = await getDeliveryByTracking('TRK-INEXISTANT')

    expect(result).toHaveProperty('error', 'Numéro de suivi introuvable')
  })

  it('retourne {error} sur erreur reseau (fetch rejete)', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network failure'))

    const result = await getDeliveryByTracking('TRK-001')

    expect(result).toHaveProperty('error', 'Network failure')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getDeliveries
// ─────────────────────────────────────────────────────────────────────────────

describe('getDeliveries', () => {
  it('retourne le corps complet de la reponse en cas de succes', async () => {
    const payload = { data: [{ id: 'del-1' }], pagination: { total: 1, page: 1 } }
    global.fetch.mockResolvedValueOnce(makeFetchResponse(payload))

    const result = await getDeliveries()

    expect(result).toEqual(payload)
  })

  it("appelle GET /api/delivery avec les headers d'auth", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: [] }))

    await getDeliveries()

    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/delivery')
    expect(init.method).toBe('GET')
    expect(init.headers).toHaveProperty('Authorization', 'Bearer test-token')
    expect(init.headers).toHaveProperty('kcb-api-key', 'test-key')
  })

  it('retourne {error} avec le message du serveur quand le statut est 500', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Erreur base de donnees' }, 500))

    const result = await getDeliveries()

    expect(result).toHaveProperty('error', 'Erreur base de donnees')
  })

  it('retourne {error: "Erreur serveur"} quand le corps d\'erreur est vide', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({}, 503))

    const result = await getDeliveries()

    expect(result).toHaveProperty('error', 'Erreur serveur')
  })

  it('retourne {error} sur erreur reseau', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Connection refused'))

    const result = await getDeliveries()

    expect(result).toHaveProperty('error', 'Connection refused')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getMyDeliveries -- alias de getDeliveries
// ─────────────────────────────────────────────────────────────────────────────

describe('getMyDeliveries', () => {
  it('appelle la meme URL que getDeliveries -- GET /api/delivery', async () => {
    const payload = { data: [{ id: 'del-5' }], pagination: { total: 1 } }
    global.fetch.mockResolvedValueOnce(makeFetchResponse(payload))

    const result = await getMyDeliveries()

    expect(result).toEqual(payload)
    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/delivery')
    expect(init.method).toBe('GET')
  })

  it('retourne {error} de la meme facon que getDeliveries sur erreur 401', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Non autorise' }, 401))

    const result = await getMyDeliveries()

    expect(result).toHaveProperty('error', 'Non autorise')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getDelivery
// ─────────────────────────────────────────────────────────────────────────────

describe('getDelivery', () => {
  it('retourne les donnees de la livraison quand body.data est present', async () => {
    const delivery = { id: 'del-10', status: 'pending' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: delivery }))

    const result = await getDelivery('del-10')

    expect(result).toEqual(delivery)
  })

  it("appelle GET /api/delivery/:id avec les headers d'auth", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: {} }))

    await getDelivery('del-10')

    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/delivery/del-10')
    expect(init.method).toBe('GET')
    expect(init.headers).toHaveProperty('Authorization', 'Bearer test-token')
  })

  it('retourne body directement quand body.data est absent', async () => {
    const flat = { id: 'del-11', status: 'delivered' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse(flat))

    const result = await getDelivery('del-11')

    expect(result).toEqual(flat)
  })

  it('retourne {error} avec le message du serveur quand le statut est 404', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Livraison introuvable' }, 404))

    const result = await getDelivery('absent')

    expect(result).toHaveProperty('error', 'Livraison introuvable')
  })

  it('retourne le message par defaut quand le corps 4xx ne contient pas error', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({}, 404))

    const result = await getDelivery('absent')

    expect(result).toHaveProperty('error', 'Livraison introuvable')
  })

  it('retourne {error} sur erreur reseau', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Timeout'))

    const result = await getDelivery('del-10')

    expect(result).toHaveProperty('error', 'Timeout')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// createDelivery
// ─────────────────────────────────────────────────────────────────────────────

describe('createDelivery', () => {
  it('envoie une requete POST sur /api/delivery avec le corps JSON', async () => {
    const newDelivery = { artwork_id: 'art-1', destination: 'Paris' }
    global.fetch.mockResolvedValueOnce(
      makeFetchResponse({ data: { id: 'del-new', ...newDelivery } })
    )

    await createDelivery(newDelivery)

    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/delivery')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual(newDelivery)
  })

  it("inclut les headers d'auth dans la requete POST", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: {} }))

    await createDelivery({ artwork_id: 'art-2' })

    const [, init] = global.fetch.mock.calls[0]
    expect(init.headers).toHaveProperty('Authorization', 'Bearer test-token')
    expect(init.headers).toHaveProperty('kcb-api-key', 'test-key')
    expect(init.headers).toHaveProperty('Content-Type', 'application/json')
  })

  it('retourne les donnees creees en cas de succes (body.data present)', async () => {
    const created = { id: 'del-new', status: 'pending' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: created }))

    const result = await createDelivery({ artwork_id: 'art-1' })

    expect(result).toEqual(created)
  })

  it('retourne body directement quand body.data est absent', async () => {
    const flat = { id: 'del-flat', status: 'pending' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse(flat))

    const result = await createDelivery({ artwork_id: 'art-3' })

    expect(result).toEqual(flat)
  })

  it('retourne {error} quand le serveur repond 422', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Payload invalide' }, 422))

    const result = await createDelivery({ artwork_id: '' })

    expect(result).toHaveProperty('error', 'Payload invalide')
  })

  it('retourne {error: "Erreur serveur"} quand le corps d\'erreur est vide', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({}, 500))

    const result = await createDelivery({ artwork_id: 'art-1' })

    expect(result).toHaveProperty('error', 'Erreur serveur')
  })

  it('retourne {error} sur erreur reseau', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    const result = await createDelivery({ artwork_id: 'art-1' })

    expect(result).toHaveProperty('error', 'Network error')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// changeDeliveryStatus
// ─────────────────────────────────────────────────────────────────────────────

describe('changeDeliveryStatus', () => {
  it('envoie une requete PATCH sur /api/delivery/:id avec le corps JSON', async () => {
    const updated = { id: 'del-20', status: 'shipped' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: updated }))

    await changeDeliveryStatus('del-20', { status: 'shipped' })

    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/delivery/del-20')
    expect(init.method).toBe('PATCH')
    expect(JSON.parse(init.body)).toEqual({ status: 'shipped' })
  })

  it("inclut les headers d'auth dans la requete PATCH", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: {} }))

    await changeDeliveryStatus('del-20', { status: 'delivered' })

    const [, init] = global.fetch.mock.calls[0]
    expect(init.headers).toHaveProperty('Authorization', 'Bearer test-token')
    expect(init.headers).toHaveProperty('kcb-api-key', 'test-key')
  })

  it('retourne les donnees mises a jour en cas de succes', async () => {
    const updated = { id: 'del-20', status: 'delivered', note: 'Livre' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: updated }))

    const result = await changeDeliveryStatus('del-20', { status: 'delivered', note: 'Livre' })

    expect(result).toEqual(updated)
  })

  it('retourne body directement quand body.data est absent', async () => {
    const flat = { id: 'del-21', status: 'in_transit' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse(flat))

    const result = await changeDeliveryStatus('del-21', { status: 'in_transit' })

    expect(result).toEqual(flat)
  })

  it('retourne {error} quand le serveur repond 403', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Acces refuse' }, 403))

    const result = await changeDeliveryStatus('del-20', { status: 'shipped' })

    expect(result).toHaveProperty('error', 'Acces refuse')
  })

  it('retourne {error: "Erreur serveur"} quand le corps d\'erreur est vide', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({}, 500))

    const result = await changeDeliveryStatus('del-20', { status: 'shipped' })

    expect(result).toHaveProperty('error', 'Erreur serveur')
  })

  it('retourne {error} sur erreur reseau', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Socket hang up'))

    const result = await changeDeliveryStatus('del-20', { status: 'shipped' })

    expect(result).toHaveProperty('error', 'Socket hang up')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// updateDelivery -- alias de changeDeliveryStatus
// ─────────────────────────────────────────────────────────────────────────────

describe('updateDelivery', () => {
  it('appelle PATCH /api/delivery/:id comme changeDeliveryStatus', async () => {
    const updated = { id: 'del-30', status: 'customs' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: updated }))

    const result = await updateDelivery('del-30', { status: 'customs' })

    expect(result).toEqual(updated)
    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/delivery/del-30')
    expect(init.method).toBe('PATCH')
    expect(JSON.parse(init.body)).toEqual({ status: 'customs' })
  })

  it('propage {error} de la meme facon que changeDeliveryStatus', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Non autorise' }, 401))

    const result = await updateDelivery('del-30', { status: 'shipped' })

    expect(result).toHaveProperty('error', 'Non autorise')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// deleteDelivery
// ─────────────────────────────────────────────────────────────────────────────

describe('deleteDelivery', () => {
  it('envoie une requete DELETE sur /api/delivery/:id', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: { deleted: true } }))

    await deleteDelivery('del-99')

    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/delivery/del-99')
    expect(init.method).toBe('DELETE')
  })

  it("inclut les headers d'auth dans la requete DELETE", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: { deleted: true } }))

    await deleteDelivery('del-99')

    const [, init] = global.fetch.mock.calls[0]
    expect(init.headers).toHaveProperty('Authorization', 'Bearer test-token')
    expect(init.headers).toHaveProperty('kcb-api-key', 'test-key')
  })

  it('retourne les donnees de confirmation en cas de succes (body.data present)', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: { deleted: true } }))

    const result = await deleteDelivery('del-99')

    expect(result).toEqual({ deleted: true })
  })

  it('retourne body directement quand body.data est absent', async () => {
    const flat = { deleted: true, id: 'del-100' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse(flat))

    const result = await deleteDelivery('del-100')

    expect(result).toEqual(flat)
  })

  it('retourne {error} quand le serveur repond 404', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Livraison introuvable' }, 404))

    const result = await deleteDelivery('absent')

    expect(result).toHaveProperty('error', 'Livraison introuvable')
  })

  it('retourne {error: "Erreur serveur"} quand le corps d\'erreur est vide', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({}, 500))

    const result = await deleteDelivery('del-99')

    expect(result).toHaveProperty('error', 'Erreur serveur')
  })

  it('retourne {error} sur erreur reseau', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Connection reset'))

    const result = await deleteDelivery('del-99')

    expect(result).toHaveProperty('error', 'Connection reset')
  })
})
