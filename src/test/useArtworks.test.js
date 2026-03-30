/**
 * useArtworks.test.js - Tests unitaires pour src/api/useArtworks.js
 *
 * Strategie de mock :
 *   - `useAPI` est mocke pour fournir une base URL fixe (/api) et des
 *     options statiques avec un token de test.
 *   - `global.fetch` est remplace par un vi.fn() avant chaque test et
 *     restaure apres.
 *
 * Les fonctions `submitArtwork` et `updateArtwork` utilisent des
 * imports dynamiques (supabase + storage) et sont exclues de cette suite.
 *
 * @module useArtworks.test
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
  verifyArtwork,
  getAllArtworks,
  getArtworkById,
  getForSaleArtworks,
  getArtistForSaleArtworks,
  getOwnerForSaleArtworks,
  getMyArtworks,
  getOwnerArtworks,
  getPendingArtworks,
  getApprovedArtworks,
  getRejectedArtworks,
  getRandomArtworks,
  getRandomArtworksByCategories,
  getManagedArtworks,
  setArtworkStatus,
  updateEtherscan,
  deleteArtwork,
  getLikedArtworks,
  likeArtwork,
  dislikeArtwork,
  purchaseArtwork,
} from '../api/useArtworks'

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
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
  }
}

beforeEach(() => {
  vi.restoreAllMocks()
  global.fetch = vi.fn()
})

// ─────────────────────────────────────────────────────────────────────────────
// verifyArtwork
// ─────────────────────────────────────────────────────────────────────────────

describe('verifyArtwork', () => {
  it("retourne les donnees de l'oeuvre en cas de succes", async () => {
    const artwork = { id: '1', title: 'Savane', kucibok_id: 'KCB-00000001' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: artwork }))

    const result = await verifyArtwork('KCB-00000001')

    expect(result).toEqual(artwork)
  })

  it('retourne {error} quand le serveur repond 404', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Oeuvre introuvable' }, 404))

    const result = await verifyArtwork('KCB-INCONNU')

    expect(result).toHaveProperty('error', 'Oeuvre introuvable')
  })

  it('retourne {error} sur erreur reseau (fetch rejete)', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network failure'))

    const result = await verifyArtwork('KCB-00000001')

    expect(result).toHaveProperty('error', 'Network failure')
  })

  it("n'envoie aucun header d'auth -- seulement Content-Type", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: { id: '1' } }))

    await verifyArtwork('KCB-00000001')

    const [, init] = global.fetch.mock.calls[0]
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(init.headers).not.toHaveProperty('Authorization')
    expect(init.headers).not.toHaveProperty('kcb-api-key')
  })

  it('appelle la bonne URL avec le kuciobkId fourni', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: {} }))

    await verifyArtwork('KCB-12345678')

    const [url] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/artworks/verify/KCB-12345678')
  })

  it('retourne body directement quand body.data est absent', async () => {
    const flat = { id: '2', title: 'Sans data wrapper' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse(flat))

    const result = await verifyArtwork('KCB-00000002')

    expect(result).toEqual(flat)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getAllArtworks
// ─────────────────────────────────────────────────────────────────────────────

describe('getAllArtworks', () => {
  it('construit une query string a partir des params fournis', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: [] }))

    await getAllArtworks({ status: 'approved', limit: 10 })

    const [url] = global.fetch.mock.calls[0]
    expect(url).toContain('status=approved')
    expect(url).toContain('limit=10')
  })

  it("n'ajoute pas de '?' quand params est vide", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: [] }))

    await getAllArtworks()

    const [url] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/artworks')
  })

  it('retourne {error} quand le serveur repond 500', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Erreur serveur' }, 500))

    const result = await getAllArtworks()

    expect(result).toHaveProperty('error', 'Erreur serveur')
  })

  it('retourne le corps directement quand body.data est absent', async () => {
    const list = [{ id: '1' }, { id: '2' }]
    global.fetch.mockResolvedValueOnce(makeFetchResponse(list))

    const result = await getAllArtworks()

    expect(result).toEqual(list)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getArtworkById
// ─────────────────────────────────────────────────────────────────────────────

describe('getArtworkById', () => {
  it("retourne l'oeuvre correspondant a l'id", async () => {
    const artwork = { id: 'uuid-123', title: 'Baobab' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: artwork }))

    const result = await getArtworkById('uuid-123')

    expect(result).toEqual(artwork)
    const [url] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/artworks/uuid-123')
  })

  it("retourne {error} quand l'oeuvre n'existe pas (404)", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Not found' }, 404))

    const result = await getArtworkById('absent')

    expect(result).toHaveProperty('error', 'Not found')
  })

  it('retourne {error: "Erreur serveur"} si le corps 4xx ne contient pas error', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({}, 400))

    const result = await getArtworkById('bad-id')

    expect(result).toHaveProperty('error', 'Erreur serveur')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getForSaleArtworks
// ─────────────────────────────────────────────────────────────────────────────

describe('getForSaleArtworks', () => {
  it('transmet for_sale=true, status=approved, limit=1000', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: [] }))

    await getForSaleArtworks()

    const [url] = global.fetch.mock.calls[0]
    expect(url).toContain('for_sale=true')
    expect(url).toContain('status=approved')
    expect(url).toContain('limit=1000')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getArtistForSaleArtworks
// ─────────────────────────────────────────────────────────────────────────────

describe('getArtistForSaleArtworks', () => {
  it('transmet artist_id et for_sale=true', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: [] }))

    await getArtistForSaleArtworks('artist-uuid')

    const [url] = global.fetch.mock.calls[0]
    expect(url).toContain('artist_id=artist-uuid')
    expect(url).toContain('for_sale=true')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getOwnerForSaleArtworks
// ─────────────────────────────────────────────────────────────────────────────

describe('getOwnerForSaleArtworks', () => {
  it('transmet user_id et for_sale=true', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: [] }))

    await getOwnerForSaleArtworks('user-uuid')

    const [url] = global.fetch.mock.calls[0]
    expect(url).toContain('user_id=user-uuid')
    expect(url).toContain('for_sale=true')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getMyArtworks / getOwnerArtworks
// ─────────────────────────────────────────────────────────────────────────────

describe('getMyArtworks', () => {
  it('transmet uniquement artist_id', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: [] }))

    await getMyArtworks('artist-uuid')

    const [url] = global.fetch.mock.calls[0]
    expect(url).toContain('artist_id=artist-uuid')
    expect(url).not.toContain('for_sale')
  })
})

describe('getOwnerArtworks', () => {
  it('transmet uniquement user_id', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: [] }))

    await getOwnerArtworks('user-uuid')

    const [url] = global.fetch.mock.calls[0]
    expect(url).toContain('user_id=user-uuid')
    expect(url).not.toContain('for_sale')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getPendingArtworks / getApprovedArtworks / getRejectedArtworks
// ─────────────────────────────────────────────────────────────────────────────

describe('getPendingArtworks', () => {
  it('transmet status=pending', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: [] }))

    await getPendingArtworks()

    const [url] = global.fetch.mock.calls[0]
    expect(url).toContain('status=pending')
  })
})

describe('getApprovedArtworks', () => {
  it('transmet status=approved', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: [] }))

    await getApprovedArtworks()

    const [url] = global.fetch.mock.calls[0]
    expect(url).toContain('status=approved')
  })
})

describe('getRejectedArtworks', () => {
  it('transmet status=rejected', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: [] }))

    await getRejectedArtworks()

    const [url] = global.fetch.mock.calls[0]
    expect(url).toContain('status=rejected')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getRandomArtworks
// ─────────────────────────────────────────────────────────────────────────────

describe('getRandomArtworks', () => {
  it('retourne au maximum 8 elements depuis un ensemble de 20', async () => {
    const twenty = Array.from({ length: 20 }, (_, i) => ({ id: String(i) }))
    global.fetch.mockResolvedValueOnce(makeFetchResponse(twenty))

    const result = await getRandomArtworks()

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeLessThanOrEqual(8)
  })

  it('retourne {error} si fetchArtworks echoue', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Erreur serveur' }, 500))

    const result = await getRandomArtworks()

    expect(result).toHaveProperty('error', 'Erreur serveur')
  })

  it('retourne un tableau vide si fetchArtworks retourne un objet non-array', async () => {
    // body.data est absent -> fetchArtworks retourne body (objet, pas tableau)
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ meta: 'empty' }))

    const result = await getRandomArtworks()

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(0)
  })

  it("transmet for_sale=true et limit=20 a l'API", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse([]))

    await getRandomArtworks()

    const [url] = global.fetch.mock.calls[0]
    expect(url).toContain('for_sale=true')
    expect(url).toContain('limit=20')
  })

  it('retourne exactement 8 elements quand la source en contient plus de 8', async () => {
    const fifteen = Array.from({ length: 15 }, (_, i) => ({ id: String(i) }))
    global.fetch.mockResolvedValueOnce(makeFetchResponse(fifteen))

    const result = await getRandomArtworks()

    expect(result).toHaveLength(8)
  })

  it('retourne tous les elements quand la source en contient moins de 8', async () => {
    const three = [{ id: '1' }, { id: '2' }, { id: '3' }]
    global.fetch.mockResolvedValueOnce(makeFetchResponse(three))

    const result = await getRandomArtworks()

    expect(result).toHaveLength(3)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getRandomArtworksByCategories
// ─────────────────────────────────────────────────────────────────────────────

describe('getRandomArtworksByCategories', () => {
  it('retourne au maximum 8 elements pour la categorie demandee', async () => {
    const twelve = Array.from({ length: 12 }, (_, i) => ({ id: String(i) }))
    global.fetch.mockResolvedValueOnce(makeFetchResponse(twelve))

    const result = await getRandomArtworksByCategories('peinture')

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeLessThanOrEqual(8)
  })

  it("transmet category, for_sale=true et limit=20 a l'API", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse([]))

    await getRandomArtworksByCategories('sculpture')

    const [url] = global.fetch.mock.calls[0]
    expect(url).toContain('category=sculpture')
    expect(url).toContain('for_sale=true')
    expect(url).toContain('limit=20')
  })

  it('retourne {error} si la requete echoue', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Timeout' }, 503))

    const result = await getRandomArtworksByCategories('art-numerique')

    expect(result).toHaveProperty('error', 'Timeout')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// setArtworkStatus
// ─────────────────────────────────────────────────────────────────────────────

describe('setArtworkStatus', () => {
  it('envoie une requete PATCH avec le status dans le corps', async () => {
    const updated = { id: 'uuid-1', status: 'approved' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: updated }))

    await setArtworkStatus('uuid-1', 'approved')

    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/artworks/uuid-1')
    expect(init.method).toBe('PATCH')
    expect(JSON.parse(init.body)).toEqual({ status: 'approved' })
  })

  it('retourne les donnees mises a jour en cas de succes', async () => {
    const updated = { id: 'uuid-1', status: 'rejected' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: updated }))

    const result = await setArtworkStatus('uuid-1', 'rejected')

    expect(result).toEqual(updated)
  })

  it("retourne {error} en cas d'echec serveur", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Acces refuse' }, 403))

    const result = await setArtworkStatus('uuid-1', 'approved')

    expect(result).toHaveProperty('error', 'Acces refuse')
  })

  it('retourne {error: "Erreur serveur"} quand le corps d\'erreur est vide', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({}, 500))

    const result = await setArtworkStatus('uuid-1', 'approved')

    expect(result).toHaveProperty('error', 'Erreur serveur')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// updateEtherscan
// ─────────────────────────────────────────────────────────────────────────────

describe('updateEtherscan', () => {
  it('envoie une requete PUT avec etherscan dans le corps', async () => {
    const updated = { id: 'uuid-2', etherscan: '0xABC' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: updated }))

    await updateEtherscan('uuid-2', '0xABC')

    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/artworks/uuid-2')
    expect(init.method).toBe('PUT')
    expect(JSON.parse(init.body)).toEqual({ etherscan: '0xABC' })
  })

  it('retourne les donnees mises a jour en cas de succes', async () => {
    const updated = { id: 'uuid-2', etherscan: '0xDEF' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: updated }))

    const result = await updateEtherscan('uuid-2', '0xDEF')

    expect(result).toEqual(updated)
  })

  it("retourne {error} en cas d'echec serveur", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Not found' }, 404))

    const result = await updateEtherscan('absent', '0x000')

    expect(result).toHaveProperty('error', 'Not found')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// deleteArtwork
// ─────────────────────────────────────────────────────────────────────────────

describe('deleteArtwork', () => {
  it('envoie une requete DELETE sur /api/artworks/:id', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: { deleted: true } }))

    await deleteArtwork('uuid-del')

    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/artworks/uuid-del')
    expect(init.method).toBe('DELETE')
  })

  it('retourne les donnees de confirmation en cas de succes', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ data: { deleted: true } }))

    const result = await deleteArtwork('uuid-del')

    expect(result).toEqual({ deleted: true })
  })

  it("retourne {error} en cas d'echec", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Suppression impossible' }, 422))

    const result = await deleteArtwork('uuid-del')

    expect(result).toHaveProperty('error', 'Suppression impossible')
  })

  it('retourne {error} sur erreur reseau', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Connection reset'))

    const result = await deleteArtwork('uuid-del')

    expect(result).toHaveProperty('error', 'Connection reset')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Stubs de compatibilite
// ─────────────────────────────────────────────────────────────────────────────

describe('getManagedArtworks -- stub', () => {
  it('retourne {data: []} sans appeler fetch', async () => {
    const result = await getManagedArtworks()

    expect(result).toEqual({ data: [] })
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

describe('getLikedArtworks -- stub', () => {
  it('retourne {data: []} sans appeler fetch', async () => {
    const result = await getLikedArtworks()

    expect(result).toEqual({ data: [] })
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

describe('likeArtwork -- stub', () => {
  it('retourne {ok: true} sans appeler fetch', async () => {
    const result = await likeArtwork()

    expect(result).toEqual({ ok: true })
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

describe('dislikeArtwork -- stub', () => {
  it('retourne {ok: true} sans appeler fetch', async () => {
    const result = await dislikeArtwork()

    expect(result).toEqual({ ok: true })
    expect(global.fetch).not.toHaveBeenCalled()
  })
})

describe('purchaseArtwork -- stub', () => {
  it('retourne un objet avec une propriete error', async () => {
    const result = await purchaseArtwork()

    expect(result).toHaveProperty('error')
    expect(typeof result.error).toBe('string')
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
