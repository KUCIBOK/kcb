import { describe, it, expect } from 'vitest'
import { XOF_PER_EUR, USD_PER_EUR, CURRENCIES, convertFromXOF, fmtMoney } from '../lib/currency'

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

describe('Constantes exportées', () => {
  it('XOF_PER_EUR vaut exactement 655.957', () => {
    expect(XOF_PER_EUR).toBe(655.957)
  })

  it('USD_PER_EUR vaut exactement 1.09', () => {
    expect(USD_PER_EUR).toBe(1.09)
  })
})

// ---------------------------------------------------------------------------
// CURRENCIES
// ---------------------------------------------------------------------------

describe('CURRENCIES', () => {
  it('contient exactement 3 entrées', () => {
    expect(CURRENCIES).toHaveLength(3)
  })

  it('chaque entrée possède les propriétés code, label et symbol', () => {
    for (const c of CURRENCIES) {
      expect(c).toHaveProperty('code')
      expect(c).toHaveProperty('label')
      expect(c).toHaveProperty('symbol')
    }
  })

  it('contient EUR avec le symbole €', () => {
    const eur = CURRENCIES.find((c) => c.code === 'EUR')
    expect(eur).toBeDefined()
    expect(eur.symbol).toBe('€')
  })

  it('contient XOF avec le symbole CFA', () => {
    const xof = CURRENCIES.find((c) => c.code === 'XOF')
    expect(xof).toBeDefined()
    expect(xof.symbol).toBe('CFA')
  })

  it('contient USD avec le symbole $', () => {
    const usd = CURRENCIES.find((c) => c.code === 'USD')
    expect(usd).toBeDefined()
    expect(usd.symbol).toBe('$')
  })
})

// ---------------------------------------------------------------------------
// convertFromXOF
// ---------------------------------------------------------------------------

describe('convertFromXOF', () => {
  it('XOF → XOF retourne le même montant sans conversion', () => {
    expect(convertFromXOF(100_000, 'XOF')).toBe(100_000)
  })

  it('XOF → EUR divise par XOF_PER_EUR (655.957)', () => {
    const result = convertFromXOF(655_957, 'EUR')
    // 655_957 / 655.957 = 1000.000 (parité exacte UEMOA)
    expect(result).toBeCloseTo(1000, 5)
  })

  it('XOF → USD divise par XOF_PER_EUR puis multiplie par USD_PER_EUR', () => {
    const result = convertFromXOF(655_957, 'USD')
    // 1000 EUR * 1.09 = 1090 USD
    expect(result).toBeCloseTo(1090, 4)
  })

  it('XOF → EUR : résultat correct sur un montant courant (100 000 XOF)', () => {
    const result = convertFromXOF(100_000, 'EUR')
    expect(result).toBeCloseTo(100_000 / 655.957, 6)
  })

  it('XOF → USD : résultat correct sur un montant courant (100 000 XOF)', () => {
    const result = convertFromXOF(100_000, 'USD')
    expect(result).toBeCloseTo((100_000 / 655.957) * 1.09, 6)
  })

  it('devise inconnue retourne le montant XOF original', () => {
    expect(convertFromXOF(50_000, 'GBP')).toBe(50_000)
  })

  it('montant 0 retourne 0 pour EUR', () => {
    expect(convertFromXOF(0, 'EUR')).toBe(0)
  })

  it('montant 0 retourne 0 pour XOF', () => {
    expect(convertFromXOF(0, 'XOF')).toBe(0)
  })

  it('null retourne 0', () => {
    expect(convertFromXOF(null, 'EUR')).toBe(0)
  })

  it('undefined retourne 0', () => {
    expect(convertFromXOF(undefined, 'EUR')).toBe(0)
  })

  it('valeur négative XOF → EUR : résultat négatif correct', () => {
    const result = convertFromXOF(-655_957, 'EUR')
    expect(result).toBeCloseTo(-1000, 5)
  })

  it('valeur négative XOF → USD : résultat négatif correct', () => {
    const result = convertFromXOF(-655_957, 'USD')
    expect(result).toBeCloseTo(-1090, 4)
  })

  it('valeur négative XOF → XOF retourne la même valeur négative', () => {
    expect(convertFromXOF(-20_000, 'XOF')).toBe(-20_000)
  })
})

// ---------------------------------------------------------------------------
// fmtMoney
// ---------------------------------------------------------------------------

describe('fmtMoney', () => {
  it('formate 0 XOF en EUR et retourne une chaîne non vide', () => {
    const result = fmtMoney(0, 'EUR')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('formate 655 957 XOF en EUR (locale fr-FR, ≈ 1 000 €)', () => {
    const result = fmtMoney(655_957, 'EUR')
    // Intl.NumberFormat fr-FR avec style currency EUR doit contenir "€" et "1"
    expect(result).toContain('€')
    expect(result).toMatch(/1[\s\u202f\u00a0]?000|1000/)
  })

  it('formate 12 500 XOF en XOF (locale fr-FR, sans décimale)', () => {
    const result = fmtMoney(12_500, 'XOF')
    // Doit contenir "XOF" ou "F CFA" et "12 500" (espace fine fr-FR)
    expect(result).toMatch(/12[\s\u202f\u00a0]?500/)
  })

  it('formate 655 957 XOF en USD (locale en-US, ≈ $1,090)', () => {
    const result = fmtMoney(655_957, 'USD')
    expect(result).toContain('$')
    expect(result).toMatch(/1[,.]?090|1090/)
  })

  it('devise par défaut est EUR quand targetCurrency est omis', () => {
    const withDefault = fmtMoney(655_957)
    const withEur = fmtMoney(655_957, 'EUR')
    expect(withDefault).toBe(withEur)
  })

  it('retourne une string pour un montant nul (0)', () => {
    expect(typeof fmtMoney(0)).toBe('string')
  })

  // --- Mode compact ---

  it('compact : 655 957 XOF → EUR affiche le suffixe k (≈ 1.0k)', () => {
    const result = fmtMoney(655_957, 'EUR', { compact: true })
    // 655 957 / 655.957 = 1000, 1000 >= 1000 → compact "1.0k"
    expect(result).toMatch(/k/)
    expect(result).toContain('€')
  })

  it('compact : 655 957 000 XOF → EUR affiche le suffixe M (≈ 1.0M)', () => {
    const result = fmtMoney(655_957_000, 'EUR', { compact: true })
    // 655 957 000 / 655.957 = 1 000 000 → compact "1.0M"
    expect(result).toMatch(/M/)
    expect(result).toContain('€')
  })

  it('compact : 5 000 XOF → XOF affiche le suffixe k', () => {
    const result = fmtMoney(5_000, 'XOF', { compact: true })
    expect(result).toMatch(/k/)
    expect(result).toContain('CFA')
  })

  it('compact : 1 000 000 XOF → XOF affiche le suffixe M', () => {
    const result = fmtMoney(1_000_000, 'XOF', { compact: true })
    expect(result).toMatch(/M/)
    expect(result).toContain('CFA')
  })

  it('compact : 655 957 XOF → USD affiche le suffixe k (≈ 1.09k)', () => {
    const result = fmtMoney(655_957, 'USD', { compact: true })
    expect(result).toMatch(/k/)
    expect(result).toContain('$')
  })

  it('compact désactivé par défaut : 655 957 XOF → EUR utilise Intl.NumberFormat', () => {
    const normal = fmtMoney(655_957, 'EUR')
    const noCompact = fmtMoney(655_957, 'EUR', { compact: false })
    expect(normal).toBe(noCompact)
    // Ne doit pas contenir de suffixe k ou M
    expect(normal).not.toMatch(/[kM]/)
  })

  it('compact : montant inférieur à 1 000 XOF en EUR — pas de suffixe k', () => {
    // 500 XOF / 655.957 ≈ 0.76 EUR, < 1000 → pas de compact
    const result = fmtMoney(500, 'EUR', { compact: true })
    expect(result).not.toMatch(/[kM]/)
    expect(result).toContain('€')
  })

  it('compact : valeur négative ≥ 1 000 en valeur absolue affiche le suffixe k', () => {
    // -655 957 XOF → EUR = -1000 → abs >= 1000 → compact
    const result = fmtMoney(-655_957, 'EUR', { compact: true })
    expect(result).toMatch(/k/)
  })

  it('le symbole EUR précède la valeur en mode compact (format occidental)', () => {
    const result = fmtMoney(655_957, 'EUR', { compact: true })
    const symIndex = result.indexOf('€')
    const numIndex = result.search(/\d/)
    expect(symIndex).toBeLessThan(numIndex)
  })

  it('le symbole CFA suit la valeur en mode compact XOF (format africain)', () => {
    const result = fmtMoney(5_000, 'XOF', { compact: true })
    const symIndex = result.indexOf('CFA')
    const numIndex = result.search(/\d/)
    expect(symIndex).toBeGreaterThan(numIndex)
  })
})
