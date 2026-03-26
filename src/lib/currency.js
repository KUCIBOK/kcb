/**
 * currency.js — Utilitaire de conversion et formatage monétaire Kucibok.
 *
 * Taux de référence :
 *   XOF → EUR : parité fixe CEDEAO  (1 EUR = 655.957 XOF)
 *   EUR → USD : taux approximatif   (1 EUR ≈ 1.09 USD)
 *
 * Toutes les valeurs sont stockées en XOF dans la base.
 * Ce module convertit pour l'affichage uniquement.
 */

/** Parité fixe XOF/EUR (franc CFA zone UEMOA, arrimé depuis 1999). */
export const XOF_PER_EUR = 655.957;

/** Taux EUR/USD approximatif — à mettre à jour si nécessaire. */
export const USD_PER_EUR = 1.09;

export const CURRENCIES = [
  { code: 'EUR', label: 'EUR €',  symbol: '€'   },
  { code: 'XOF', label: 'XOF CFA', symbol: 'CFA' },
  { code: 'USD', label: 'USD $',  symbol: '$'   },
];

/**
 * Convertit un montant depuis XOF vers la devise cible.
 *
 * @param {number} xofAmount
 * @param {'EUR'|'XOF'|'USD'} targetCurrency
 * @returns {number}
 */
export function convertFromXOF(xofAmount, targetCurrency) {
  if (!xofAmount) return 0;
  if (targetCurrency === 'XOF') return xofAmount;
  const eur = xofAmount / XOF_PER_EUR;
  if (targetCurrency === 'EUR') return eur;
  if (targetCurrency === 'USD') return eur * USD_PER_EUR;
  return xofAmount;
}

/**
 * Formate un montant XOF dans la devise cible pour l'affichage.
 *
 * @param {number}  xofAmount
 * @param {'EUR'|'XOF'|'USD'} targetCurrency
 * @param {{ compact?: boolean }} options
 * @returns {string}  ex: "€ 19" | "12 500 XOF" | "$ 21"
 */
export function fmtMoney(xofAmount, targetCurrency = 'EUR', { compact = false } = {}) {
  const amount = convertFromXOF(xofAmount, targetCurrency);

  const localeMap = { EUR: 'fr-FR', XOF: 'fr-FR', USD: 'en-US' };
  const locale = localeMap[targetCurrency] ?? 'fr-FR';

  if (compact && Math.abs(amount) >= 1000) {
    const shortened = amount >= 1_000_000
      ? `${(amount / 1_000_000).toFixed(1)}M`
      : `${(amount / 1000).toFixed(amount >= 100_000 ? 0 : 1)}k`;
    const sym = CURRENCIES.find((c) => c.code === targetCurrency)?.symbol ?? targetCurrency;
    return targetCurrency === 'XOF'
      ? `${shortened} ${sym}`
      : targetCurrency === 'USD'
      ? `${sym} ${shortened}`
      : `${sym} ${shortened}`;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: targetCurrency,
    minimumFractionDigits: targetCurrency === 'XOF' ? 0 : 0,
    maximumFractionDigits: targetCurrency === 'XOF' ? 0 : 0,
  }).format(amount);
}
