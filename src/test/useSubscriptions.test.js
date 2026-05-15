/**
 * useSubscriptions.test.js - Tests unitaires pour src/api/useSubscriptions.js
 *
 * Strategie de mock :
 *   - `useAPI` est mocke pour fournir une base URL fixe (/api) et des
 *     options statiques avec un token de test.
 *   - `global.fetch` est remplace par un vi.fn() avant chaque test.
 *
 * Notes sur le comportement teste :
 *   - `createSubscription` et `getSubById` lisent `sub?.messsage` (trois 's' —
 *     faute de frappe presente dans le code source) comme fallback d'erreur.
 *   - `getAllSubscriptions` retourne {error} quand le tableau est vide (length === 0).
 *   - `getSubscriptionById` est un alias strict de `getSubById` (meme reference).
 *
 * @module useSubscriptions.test
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

function makeFetchResponse(body, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: vi.fn().mockResolvedValue(body) }
}

beforeEach(() => {
  vi.clearAllMocks()
  global.fetch = vi.fn()
})

import {
  createSubscription,
  failSubscription,
  activateSubscription,
  getSubById,
  getSubscriptionById,
  getAllSubscriptions,
} from '../api/useSubscriptions'

// ─────────────────────────────────────────────────────────────────────────────
// createSubscription
// ─────────────────────────────────────────────────────────────────────────────

describe('createSubscription', () => {
  it('retourne la souscription cree quand le serveur repond avec _id', async () => {
    const sub = { _id: 'sub-001', plan: 'pro', status: 'active' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse(sub))

    const result = await createSubscription({ plan: 'pro', user: 'u-1' })

    expect(result).toEqual(sub)
  })

  it('envoie une requete POST vers /api/subscription', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ _id: 'sub-002' }))

    await createSubscription({ plan: 'basic' })

    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/subscription')
    expect(init.method).toBe('POST')
  })

  it('serialise le payload dans le corps de la requete', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ _id: 'sub-003' }))

    const payload = { plan: 'premium', userId: 'u-99', coupon: 'DISC20' }
    await createSubscription(payload)

    const [, init] = global.fetch.mock.calls[0]
    expect(JSON.parse(init.body)).toEqual(payload)
  })

  it('retourne {error} depuis le champ error quand _id est absent', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Plan introuvable' }, 404))

    const result = await createSubscription({ plan: 'ghost' })

    expect(result).toEqual({ error: 'Plan introuvable' })
  })

  it('retourne {error: undefined} quand seul un champ avec typo est present (messsage)', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ messsage: 'Paiement refuse' }, 402))

    const result = await createSubscription({ plan: 'pro' })

    expect(result).toEqual({ error: undefined })
  })

  it('retourne {error: undefined} quand ni _id, ni error, ni messsage ne sont presents', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({}))

    const result = await createSubscription({ plan: 'pro' })

    expect(result).toHaveProperty('error')
    expect(result.error).toBeUndefined()
  })

  it('retourne {error} avec le message reseau sur erreur fetch', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network timeout'))

    const result = await createSubscription({ plan: 'pro' })

    expect(result).toEqual({ error: 'Network timeout' })
  })

  it("transmet les headers d'authentification corrects", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ _id: 'sub-004' }))

    await createSubscription({ plan: 'basic' })

    const [, init] = global.fetch.mock.calls[0]
    expect(init.headers['kcb-api-key']).toBe('test-key')
    expect(init.headers['Authorization']).toBe('Bearer test-token')
    expect(init.headers['Content-Type']).toBe('application/json')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// failSubscription
// ─────────────────────────────────────────────────────────────────────────────

describe('failSubscription', () => {
  it('retourne {sub, plan} quand les deux ont un _id', async () => {
    const sub = { _id: 'sub-010', status: 'failed' }
    const plan = { _id: 'plan-1', name: 'pro' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ sub, plan }))

    const result = await failSubscription('sub-010')

    expect(result).toEqual({ sub, plan })
  })

  it('appelle POST /api/subscription/fail/:subId', async () => {
    global.fetch.mockResolvedValueOnce(
      makeFetchResponse({ sub: { _id: 's1' }, plan: { _id: 'p1' } })
    )

    await failSubscription('abc-123')

    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/subscription/fail/abc-123')
    expect(init.method).toBe('POST')
  })

  it('retourne {error} depuis le champ error quand sub ou plan manque _id', async () => {
    global.fetch.mockResolvedValueOnce(
      makeFetchResponse({ error: 'Souscription introuvable' }, 404)
    )

    const result = await failSubscription('inexistant')

    expect(result).toEqual({ error: 'Souscription introuvable' })
  })

  it('retourne {error} depuis le champ message quand error est absent', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ message: 'Deja echouee' }))

    const result = await failSubscription('sub-010')

    expect(result).toEqual({ error: 'Deja echouee' })
  })

  it('retourne {error} avec le message reseau sur erreur fetch', async () => {
    global.fetch.mockRejectedValueOnce(new Error('DNS failure'))

    const result = await failSubscription('sub-010')

    expect(result).toEqual({ error: 'DNS failure' })
  })

  it('retourne {error} quand plan._id est present mais sub._id est absent', async () => {
    global.fetch.mockResolvedValueOnce(
      makeFetchResponse({
        sub: { status: 'failed' },
        plan: { _id: 'plan-1' },
        error: 'sub sans _id',
      })
    )

    const result = await failSubscription('sub-010')

    expect(result).toHaveProperty('error')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// activateSubscription
// ─────────────────────────────────────────────────────────────────────────────

describe('activateSubscription', () => {
  it('retourne {sub, plan} quand les deux ont un _id', async () => {
    const sub = { _id: 'sub-020', status: 'active' }
    const plan = { _id: 'plan-2', name: 'premium' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ sub, plan }))

    const result = await activateSubscription('sub-020')

    expect(result).toEqual({ sub, plan })
  })

  it('appelle POST /api/subscription/activate/:subId', async () => {
    global.fetch.mockResolvedValueOnce(
      makeFetchResponse({ sub: { _id: 's2' }, plan: { _id: 'p2' } })
    )

    await activateSubscription('xyz-456')

    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/subscription/activate/xyz-456')
    expect(init.method).toBe('POST')
  })

  it('retourne {error} depuis le champ error quand la reponse indique un echec', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Paiement non confirme' }, 402))

    const result = await activateSubscription('sub-020')

    expect(result).toEqual({ error: 'Paiement non confirme' })
  })

  it('retourne {error} depuis le champ message quand error est absent', async () => {
    global.fetch.mockResolvedValueOnce(
      makeFetchResponse({ sub: { _id: 's3' }, plan: {}, message: 'plan sans _id' })
    )

    const result = await activateSubscription('sub-020')

    expect(result).toEqual({ error: 'plan sans _id' })
  })

  it('retourne {error} avec le message reseau sur erreur fetch', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Connection refused'))

    const result = await activateSubscription('sub-020')

    expect(result).toEqual({ error: 'Connection refused' })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getSubById
// ─────────────────────────────────────────────────────────────────────────────

describe('getSubById', () => {
  it('retourne la souscription quand le serveur repond avec _id', async () => {
    const sub = { _id: 'sub-030', plan: 'pro', status: 'active' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse(sub))

    const result = await getSubById('sub-030')

    expect(result).toEqual(sub)
  })

  it('appelle GET /api/subscription/:id', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ _id: 'sub-031' }))

    await getSubById('sub-031')

    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/subscription/sub-031')
    expect(init.method).toBe('GET')
  })

  it('retourne {error} depuis le champ error quand _id est absent', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Introuvable' }, 404))

    const result = await getSubById('fantome')

    expect(result).toEqual({ error: 'Introuvable' })
  })

  it('retourne {error: undefined} quand seul un champ avec typo est present (messsage)', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ messsage: 'Id invalide' }))

    const result = await getSubById('bad-id')

    expect(result).toEqual({ error: undefined })
  })

  it('retourne {error} avec le message reseau sur erreur fetch', async () => {
    global.fetch.mockRejectedValueOnce(new Error('SSL error'))

    const result = await getSubById('sub-030')

    expect(result).toEqual({ error: 'SSL error' })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getSubscriptionById (alias)
// ─────────────────────────────────────────────────────────────────────────────

describe('getSubscriptionById', () => {
  it('est la meme reference de fonction que getSubById', () => {
    expect(getSubscriptionById).toBe(getSubById)
  })

  it('se comporte comme getSubById en cas de succes', async () => {
    const sub = { _id: 'sub-040', plan: 'basic' }
    global.fetch.mockResolvedValueOnce(makeFetchResponse(sub))

    const result = await getSubscriptionById('sub-040')

    expect(result).toEqual(sub)
    const [url] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/subscription/sub-040')
  })

  it("se comporte comme getSubById en cas d'erreur reseau", async () => {
    global.fetch.mockRejectedValueOnce(new Error('Timeout'))

    const result = await getSubscriptionById('sub-040')

    expect(result).toEqual({ error: 'Timeout' })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getAllSubscriptions
// ─────────────────────────────────────────────────────────────────────────────

describe('getAllSubscriptions', () => {
  it('retourne le tableau de souscriptions quand length > 0', async () => {
    const subscriptions = [
      { _id: 'sub-050', plan: 'pro' },
      { _id: 'sub-051', plan: 'basic' },
    ]
    global.fetch.mockResolvedValueOnce(makeFetchResponse(subscriptions))

    const result = await getAllSubscriptions()

    expect(result).toEqual(subscriptions)
  })

  it('appelle GET /api/subscription sans corps', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse([{ _id: 'sub-052' }]))

    await getAllSubscriptions()

    const [url, init] = global.fetch.mock.calls[0]
    expect(url).toBe('/api/subscription')
    expect(init.method).toBe('GET')
    expect(init.body).toBeUndefined()
  })

  it('retourne un tableau vide quand la reponse est []', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse([]))

    const result = await getAllSubscriptions()

    expect(result).toEqual([])
  })

  it('retourne {error} depuis le champ message quand la reponse est un objet', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ message: 'Acces non autorise' }, 401))

    const result = await getAllSubscriptions()

    expect(result).toEqual({ error: 'Acces non autorise' })
  })

  it("retourne {error} depuis le champ error quand la reponse est un objet d'erreur", async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ error: 'Erreur interne' }, 500))

    const result = await getAllSubscriptions()

    expect(result).toEqual({ error: 'Erreur interne' })
  })

  it('retourne {error} avec le message reseau sur erreur fetch', async () => {
    global.fetch.mockRejectedValueOnce(new Error('ECONNRESET'))

    const result = await getAllSubscriptions()

    expect(result).toEqual({ error: 'ECONNRESET' })
  })

  it('retourne {error: "Format inattendu"} quand la reponse est un objet sans message ni error', async () => {
    global.fetch.mockResolvedValueOnce(makeFetchResponse({ meta: 'empty' }))

    const result = await getAllSubscriptions()

    expect(result).toEqual({ error: 'Format inattendu' })
  })
})
