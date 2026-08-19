export const PLAN_FREE = 0
export const PLAN_STARTER = 1
export const PLAN_PREMIUM = 2
export const PLAN_INSTITUTIONAL = 3

const PLAN_LABELS = {
  [PLAN_FREE]: 'Découverte',
  [PLAN_STARTER]: 'Starter',
  [PLAN_PREMIUM]: 'Premium',
  [PLAN_INSTITUTIONAL]: 'Institutionnel',
}

const PLAN_PRICES = {
  [PLAN_FREE]: 'Gratuit',
  [PLAN_STARTER]: '€27/mois',
  [PLAN_PREMIUM]: '€67/mois',
  [PLAN_INSTITUTIONAL]: '€147/mois',
}

export function getPlanLevel(subscription) {
  if (!subscription || subscription.status !== 'active') return PLAN_FREE
  const name = (subscription.plan?.name ?? subscription.plans?.name ?? '').toLowerCase()
  if (name.includes('institutional') || name.includes('institution') || name.includes('enterprise') || name.includes('business')) return PLAN_INSTITUTIONAL
  if (name.includes('premium') || name.includes('elite') || name.includes('élite')) return PLAN_PREMIUM
  if (name.includes('starter') || name.includes('explorer') || name.includes('collector') || name.includes('pro')) return PLAN_STARTER
  return PLAN_FREE
}

export function canAccess(subscription, minLevel) {
  return getPlanLevel(subscription) >= minLevel
}

export function getPlanLabel(level) {
  return PLAN_LABELS[level] ?? 'Découverte'
}

export function getPlanPrice(level) {
  return PLAN_PRICES[level] ?? 'Gratuit'
}

export function getUpgradeTarget(currentLevel) {
  if (currentLevel < PLAN_INSTITUTIONAL) return currentLevel + 1
  return null
}

/**
 * Feature access helpers
 * Check if user can access specific features based on their plan
 */

export function canShortlist(subscription) {
  // Shortlisting requires: Explorer/Pro (27€+) = PLAN_STARTER minimum
  return canAccess(subscription, PLAN_STARTER)
}

export function canUseMarketResearch(subscription) {
  // Market research requires: Explorer/Pro (27€+)
  return canAccess(subscription, PLAN_STARTER)
}

export function canTrackBudget(subscription) {
  // Budget tracking requires: Premium (67€+)
  return canAccess(subscription, PLAN_PREMIUM)
}

export function canUseConcierge(subscription) {
  // Concierge services require: Premium (67€+)
  return canAccess(subscription, PLAN_PREMIUM)
}

export function canExportReports(subscription) {
  // Report export requires: Premium (67€+)
  return canAccess(subscription, PLAN_PREMIUM)
}
