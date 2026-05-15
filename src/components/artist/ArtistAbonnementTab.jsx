import { useState, useEffect } from 'react'
import { CreditCard, Check, Crown, Zap, ArrowRight, Loader2, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import { getAllPlans } from '../../api/usePlans'

/** Formate une date d'expiration en français. */
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

/** Badge de statut d'abonnement. */
function SubscriptionStatusBadge({ status }) {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
        Actif
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
      Expiré
    </span>
  )
}

/**
 * Onglet gestion d'abonnement pour le dashboard Artiste.
 * Affiche le plan actuel, les plans disponibles et les fonctionnalités incluses.
 *
 * @returns {JSX.Element}
 */
export function ArtistAbonnementTab() {
  const { subscription, plan: currentPlan } = useAuth()

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const fetchPlans = async () => {
      setLoading(true)
      const data = await getAllPlans()
      if (cancelled) return
      if (data?.error) {
        setError(data.error)
      } else {
        setPlans(Array.isArray(data) ? data : [])
      }
      setLoading(false)
    }
    fetchPlans()
    return () => {
      cancelled = true
    }
  }, [])

  /** Détermine si un plan est celui de l'utilisateur. */
  const isCurrentPlan = (planId) => {
    return (
      subscription?.planId === planId ||
      currentPlan?.id === planId ||
      subscription?.plan_id === planId
    )
  }

  /** Features à afficher pour l'abonnement actuel. */
  const currentPlanFeatures = currentPlan?.features ?? []
  const hasSubscription = !!subscription?.planId && subscription?.status === 'active'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-kcb-or/10 text-kcb-or p-2.5 rounded-[4px]">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Abonnement</h2>
          <p className="text-sm text-kcb-pierre">
            Gérez votre plan et accédez aux fonctionnalités premium
          </p>
        </div>
      </div>

      {/* Section : Abonnement actuel */}
      <div className="bg-[#13161e] border border-white/[0.06] rounded-[4px] p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Crown className="w-4 h-4 text-yellow-400" />
          Mon abonnement actuel
        </h3>

        {hasSubscription ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg font-bold text-white">
                {currentPlan?.name ?? 'Plan actif'}
              </span>
              <SubscriptionStatusBadge status={subscription.status} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-kcb-ardoise/50 rounded-[4px] px-4 py-3">
                <p className="text-xs text-kcb-pierre mb-1">Prix</p>
                <p className="text-white font-semibold">
                  {currentPlan?.price != null
                    ? `${currentPlan.price.toLocaleString('fr-FR')} ${currentPlan.currency ?? 'FCFA'} / mois`
                    : '—'}
                </p>
              </div>
              <div className="bg-kcb-ardoise/50 rounded-[4px] px-4 py-3">
                <p className="text-xs text-kcb-pierre mb-1">Expire le</p>
                <p className="text-white font-semibold">{formatDate(subscription.expiresAt)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <p className="text-white font-semibold text-lg">Plan Gratuit</p>
              <p className="text-kcb-pierre text-sm mt-0.5">
                Accès aux fonctionnalités de base de Kucibok
              </p>
            </div>
            <Link
              to="/africa"
              className="inline-flex items-center gap-2 px-4 py-2 bg-kcb-or hover:bg-kcb-or/90 text-kcb-noir text-sm font-medium rounded-[4px] transition-colors shrink-0"
            >
              <Zap className="w-4 h-4" />
              Passer à la version premium
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Section : Avantages du plan actuel */}
      {currentPlanFeatures.length > 0 && (
        <div className="bg-[#13161e] border border-white/[0.06] rounded-[4px] p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            Avantages de votre plan
          </h3>
          <ul className="space-y-2">
            {currentPlanFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-kcb-sable">
                <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section : Plans disponibles */}
      <div className="bg-[#13161e] border border-white/[0.06] rounded-[4px] p-6">
        <h3 className="text-white font-semibold mb-5">Plans disponibles</h3>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-kcb-or" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-[4px] px-4 py-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        ) : plans.length === 0 ? (
          <p className="text-kcb-pierre text-sm text-center py-6">
            Aucun plan disponible pour l'instant.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const active = isCurrentPlan(plan.id ?? plan._id)
              return (
                <div
                  key={plan.id ?? plan._id}
                  className={`relative flex flex-col rounded-[4px] border p-5 transition-all duration-200 ${
                    active
                      ? 'border-kcb-or bg-kcb-or/10 ring-1 ring-kcb-or/40'
                      : 'border-white/[0.06] bg-kcb-ardoise/30 hover:border-white/[0.08]'
                  }`}
                >
                  {/* Badge plan actuel */}
                  {active && (
                    <div className="absolute -top-3 left-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-kcb-or text-kcb-noir text-xs font-semibold rounded-full">
                        <Crown className="w-3 h-3" />
                        Plan actuel
                      </span>
                    </div>
                  )}

                  <div className="mb-3">
                    <h4 className="text-white font-semibold text-base">{plan.name}</h4>
                    <p className="text-kcb-or font-bold text-xl mt-1">
                      {plan.price != null
                        ? `${plan.price.toLocaleString('fr-FR')} ${plan.currency ?? 'FCFA'}`
                        : 'Gratuit'}
                      {plan.price > 0 && (
                        <span className="text-kcb-pierre text-sm font-normal"> / mois</span>
                      )}
                    </p>
                  </div>

                  {/* Features */}
                  {Array.isArray(plan.features) && plan.features.length > 0 && (
                    <ul className="space-y-1.5 mb-4 flex-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-kcb-pierre">
                          <Check className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  {!active && (
                    <Link
                      to={`/subscription-checkout/${plan.id ?? plan._id}`}
                      className="mt-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-kcb-or hover:bg-kcb-or/90 text-kcb-noir text-xs font-semibold rounded-[4px] transition-colors"
                    >
                      Choisir ce plan
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
