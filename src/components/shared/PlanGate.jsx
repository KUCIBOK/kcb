import { Link } from 'react-router-dom'
import { Lock, ArrowUp } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { canAccess, getPlanLabel, getPlanPrice, getUpgradeTarget, getPlanLevel } from '../../utils/planUtils'

/**
 * PlanGate — affiche children si l'abonnement atteint minLevel,
 * sinon affiche un écran de verrouillage avec CTA upgrade.
 *
 * Props:
 *  minLevel   — niveau minimum requis (PLAN_STARTER | PLAN_PREMIUM | PLAN_INSTITUTIONAL)
 *  feature    — nom de la fonctionnalité verrouillée (ex: "Services Concierge")
 *  description — courte description de ce qui est disponible avec le plan supérieur
 */
export function PlanGate({ minLevel, feature, description, children }) {
  const { subscription, user } = useAuth()

  if (user?.role === 'admin') return <>{children}</>
  if (canAccess(subscription, minLevel)) return <>{children}</>

  const currentLevel = getPlanLevel(subscription)
  const targetLevel = getUpgradeTarget(currentLevel)
  const targetLabel = targetLevel != null ? getPlanLabel(targetLevel) : getPlanLabel(minLevel)
  const targetPrice = targetLevel != null ? getPlanPrice(targetLevel) : getPlanPrice(minLevel)

  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] py-16 px-6 border border-dashed border-white/[0.08] rounded-[4px] text-center bg-kcb-ardoise/30">
      <div className="w-12 h-12 rounded-full bg-kcb-or/10 flex items-center justify-center mb-4">
        <Lock className="w-5 h-5 text-kcb-or" />
      </div>
      <p className="text-xs text-[#9B4D96] uppercase tracking-wider mb-2">Fonctionnalité verrouillée</p>
      <h3 className="font-playfair text-lg text-white mb-2">{feature}</h3>
      {description && <p className="text-sm text-kcb-pierre max-w-xs mb-6">{description}</p>}
      <div className="flex flex-col items-center gap-3">
        <div className="text-xs text-kcb-pierre">
          Disponible à partir du plan{' '}
          <span className="text-kcb-or font-semibold">{getPlanLabel(minLevel)}</span>{' '}
          — {getPlanPrice(minLevel)}
        </div>
        <Link
          to="/global#pricing"
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-[4px] text-white transition"
          style={{ background: '#9B4D96' }}
        >
          <ArrowUp className="w-4 h-4" />
          Passer au plan {targetLabel} — {targetPrice}
        </Link>
      </div>
    </div>
  )
}

export default PlanGate
