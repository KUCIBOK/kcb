import { describe, it, expect, beforeEach } from 'vitest'
import { setSupabaseToken, utils } from '../api/useAPI'

describe('useAPI — utils', () => {
  beforeEach(() => {
    // Réinitialiser le token avant chaque test
    setSupabaseToken(null)
  })

  it("options contient le header Content-Type JSON", () => {
    const { headers } = utils.options
    expect(headers['Content-Type']).toBe('application/json')
  })

  it('options inclut Authorization avec Bearer vide par défaut', () => {
    const { headers } = utils.options
    expect(headers['Authorization']).toBe('Bearer ')
  })

  it('options inclut le token après setSupabaseToken', () => {
    setSupabaseToken('mon-token-secret')
    const { headers } = utils.options
    expect(headers['Authorization']).toBe('Bearer mon-token-secret')
  })

  it('options retourne un nouvel objet à chaque accès (getter)', () => {
    const o1 = utils.options
    const o2 = utils.options
    expect(o1).not.toBe(o2)
  })

  it('setSupabaseToken avec null remet le token à vide', () => {
    setSupabaseToken('token-123')
    setSupabaseToken(null)
    expect(utils.options.headers['Authorization']).toBe('Bearer ')
  })

  it('setSupabaseToken avec undefined remet le token à vide', () => {
    setSupabaseToken('token-456')
    setSupabaseToken(undefined)
    expect(utils.options.headers['Authorization']).toBe('Bearer ')
  })

  it('la méthode par défaut des options est GET', () => {
    expect(utils.options.method).toBe('GET')
  })
})
