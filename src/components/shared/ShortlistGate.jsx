/**
 * ShortlistGate — Paywall component pour le shortlisting
 * Affiche le contenu si l'utilisateur a Explorer/Pro+
 * Sinon affiche un écran de verrouillage avec CTA upgrade
 */

import { Link } from 'react-router-dom'
import { Lock, ArrowUp } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { canShortlist, getPlanLabel, getPlanPrice, PLAN_STARTER } from '../../utils/planUtils'

export function ShortlistGate({ children, minimal = false }) {
  const { subscription, user } = useAuth()

  // Admin can always shortlist
  if (user?.role === 'admin') return <>{children}</>

  // Check if user can shortlist
  if (canShortlist(subscription)) return <>{children}</>

  // Locked state
  if (minimal) {
    // Minimal version: just disable with tooltip
    return (
      <div className="relative group">
        <div className="opacity-40 pointer-events-none">{children}</div>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-kcb-noir border border-kcb-or/40 rounded text-xs text-kcb-or whitespace-nowrap opacity-0 group-hover:opacity-100 transition z-10">
          Upgrade to shortlist
        </div>
      </div>
    )
  }

  // Full paywall
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] py-16 px-6 border border-dashed border-white/[0.08] rounded-[4px] text-center bg-kcb-ardoise/30">
      <div className="w-12 h-12 rounded-full bg-kcb-or/10 flex items-center justify-center mb-4">
        <Lock className="w-5 h-5 text-kcb-or" />
      </div>
      <p className="text-xs text-kcb-or uppercase tracking-wider mb-2">Feature Locked</p>
      <h3 className="font-playfair text-lg text-white mb-2">Shortlist Artworks</h3>
      <p className="text-sm text-kcb-pierre max-w-xs mb-6">
        Save your favorite artworks to your personalized shortlist.
      </p>
      <div className="flex flex-col items-center gap-3">
        <div className="text-xs text-kcb-pierre">
          Available from{' '}
          <span className="text-kcb-or font-semibold">{getPlanLabel(PLAN_STARTER)}</span> plan —{' '}
          {getPlanPrice(PLAN_STARTER)}
        </div>
        <Link
          to="/global#pricing"
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-[4px] text-white transition bg-kcb-or hover:bg-kcb-or/90"
        >
          <ArrowUp className="w-4 h-4" />
          Upgrade Now
        </Link>
      </div>
    </div>
  )
}

export default ShortlistGate
