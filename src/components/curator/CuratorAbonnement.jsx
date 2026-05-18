import { useState } from 'react'
import {
  CreditCard,
  Check,
  X,
  Crown,
  Shield,
  Users,
  BarChart3,
  ArrowUp,
  AlertTriangle,
  Clock,
  Bell,
  Globe,
  Search,
  Truck,
  Star,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import { cancelMySubscription } from '../../api/useSubscriptions'

const PLANS = [
  {
    key: 'free',
    name: 'Découverte',
    price: 0,
    currency: '€',
    period: null,
    badge: null,
    color: 'text-kcb-pierre',
    borderColor: 'border-white/[0.06]',
    features: [
      { label: '5 artistes en shortlist', ok: true },
      { label: 'Annuaire artistes Kucibok', ok: true },
      { label: 'Fiche œuvre certifiée (vue)', ok: true },
      { label: 'Market Research Tools', ok: false },
      { label: 'Devis logistique Logidoo', ok: false },
      { label: 'Services Concierge', ok: false },
      { label: 'Suivi budget', ok: false },
      { label: 'Support prioritaire', ok: false },
    ],
  },
  {
    key: 'explorer',
    name: 'Explorer',
    price: 27,
    currency: '€',
    period: '/mois',
    badge: null,
    color: 'text-[#9B4D96]',
    borderColor: 'border-[#9B4D96]/30',
    features: [
      { label: 'Shortlist illimitée', ok: true },
      { label: 'Annuaire artistes complet + filtres', ok: true },
      { label: 'Fiche œuvre certifiée (complète)', ok: true },
      { label: 'Market Research Tools', ok: true },
      { label: 'Devis logistique Logidoo', ok: true },
      { label: 'Services Concierge', ok: false },
      { label: 'Suivi budget', ok: false },
      { label: 'Support prioritaire', ok: false },
    ],
  },
  {
    key: 'premium',
    name: 'Premium',
    price: 67,
    currency: '€',
    period: '/mois',
    badge: 'Recommandé',
    color: 'text-kcb-or',
    borderColor: 'border-kcb-or/40',
    features: [
      { label: 'Shortlist illimitée', ok: true },
      { label: 'Annuaire artistes complet + filtres', ok: true },
      { label: 'Fiche œuvre certifiée (complète)', ok: true },
      { label: 'Market Research Tools', ok: true },
      { label: 'Devis logistique Logidoo', ok: true },
      { label: 'Services Concierge (2/mois)', ok: true },
      { label: 'Suivi budget complet', ok: true },
      { label: 'Support prioritaire', ok: true },
    ],
  },
  {
    key: 'institutional',
    name: 'Institutionnel',
    price: 147,
    currency: '€',
    period: '/mois',
    badge: 'Tout inclus',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-400/30',
    features: [
      { label: 'Shortlist illimitée', ok: true },
      { label: 'Annuaire artistes complet + filtres', ok: true },
      { label: 'Fiche œuvre certifiée (complète)', ok: true },
      { label: 'Market Research Tools + export', ok: true },
      { label: 'Logistique Logidoo prioritaire', ok: true },
      { label: 'Services Concierge illimités', ok: true },
      { label: 'Suivi budget multi-projets', ok: true },
      { label: 'Accès API + support dédié', ok: true },
    ],
  },
]

function getPlanKey(planName) {
  if (!planName) return 'free'
  const n = planName.toLowerCase()
  if (n.includes('explorer') || n.includes('starter')) return 'explorer'
  if (n.includes('premium') || n.includes('pro')) return 'premium'
  if (n.includes('institutional') || n.includes('enterprise') || n.includes('business')) return 'institutional'
  if (n.includes('gratuit') || n === 'free') return 'free'
  return 'free'
}

export function CuratorAbonnement() {
  const { subscription, loadSubscription } = useAuth()
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelError, setCancelError] = useState('')

  const daysLeft = subscription?.end_date
    ? Math.ceil((new Date(subscription.end_date) - new Date()) / (1000 * 60 * 60 * 24))
    : null
  const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0

  const handleCancel = async () => {
    setCancelLoading(true)
    setCancelError('')
    const { error } = await cancelMySubscription()
    setCancelLoading(false)
    if (error) { setCancelError(error); return }
    setShowCancelConfirm(false)
    if (typeof loadSubscription === 'function') await loadSubscription()
  }

  const planKey = getPlanKey(subscription?.plan?.name ?? subscription?.plans?.name)
  const currentPlan = PLANS.find((p) => p.key === planKey) ?? PLANS[0]

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="font-playfair text-xl text-white">Mon Abonnement</h2>
        <p className="text-sm text-kcb-pierre mt-0.5">Gérez votre plan Curateur International</p>
      </div>

      {isExpiringSoon && (
        <div className="flex items-start gap-3 bg-amber-900/20 border border-amber-700/30 rounded-[4px] px-4 py-3 text-sm">
          <Bell className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-200">
            Votre abonnement expire dans{' '}
            <strong>{daysLeft} jour{daysLeft > 1 ? 's' : ''}</strong>.{' '}
            <Link to="/global#pricing" className="text-amber-300 underline hover:text-amber-200">
              Renouveler maintenant
            </Link>
          </p>
        </div>
      )}

      {/* Current plan summary */}
      <div className="bg-kcb-ardoise border border-[#9B4D96]/25 rounded-[4px] p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#9B4D96]/15 flex items-center justify-center">
            <Crown className="w-5 h-5 text-[#9B4D96]" />
          </div>
          <div>
            <p className="text-xs text-[#9B4D96] uppercase tracking-wider">Plan actif</p>
            <p className="text-lg font-semibold text-white">
              {currentPlan.name}
              {currentPlan.price > 0 && (
                <span className="ml-2 text-sm font-normal text-kcb-pierre">
                  {currentPlan.currency}{currentPlan.price}{currentPlan.period}
                </span>
              )}
            </p>
          </div>
          {subscription?.status === 'active' && (
            <span className="ml-auto text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Actif</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentPlan.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {f.ok
                ? <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                : <X className="w-3.5 h-3.5 text-kcb-pierre/40 flex-shrink-0" />}
              <span className={f.ok ? 'text-kcb-sable' : 'text-kcb-pierre/50'}>{f.label}</span>
            </div>
          ))}
        </div>

        {subscription?.end_date && (
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-kcb-pierre">
            <Clock className="w-3.5 h-3.5" />
            Renouvellement le {new Date(subscription.end_date).toLocaleDateString('fr-FR')}
          </div>
        )}
      </div>

      {/* Market Research Tools highlight */}
      <div className="bg-[#9B4D96]/5 border border-[#9B4D96]/20 rounded-[4px] p-4">
        <p className="text-xs text-[#9B4D96] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5" /> Market Research Tools
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Globe, label: 'Rapports marché', desc: 'Prix, tendances, volumes par pays' },
            { icon: BarChart3, label: 'Analyse prix', desc: 'Évolution de cote des artistes' },
            { icon: Users, label: 'Mapping acteurs', desc: 'Galeries, institutions, fondations' },
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              <t.icon className="w-4 h-4 text-[#9B4D96] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">{t.label}</p>
                <p className="text-xs text-kcb-pierre">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {planKey === 'free' && (
          <p className="mt-3 text-xs text-[#9B4D96]">Disponible à partir du plan Explorer (€27/mois)</p>
        )}
      </div>

      {/* Plans comparison */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-kcb-or" /> Comparer les plans
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {PLANS.map((plan) => {
            const isCurrent = plan.key === planKey
            return (
              <div
                key={plan.key}
                className={`bg-kcb-ardoise border rounded-[4px] p-4 relative ${isCurrent ? plan.borderColor : 'border-white/[0.06]'}`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-kcb-or text-kcb-noir whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-2.5 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#9B4D96] text-white whitespace-nowrap">
                    Actuel
                  </span>
                )}
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${plan.color}`}>{plan.name}</p>
                <p className="text-2xl font-bold text-white mb-3">
                  {plan.price === 0 ? 'Gratuit' : `${plan.currency}${plan.price}`}
                  {plan.period && <span className="text-sm font-normal text-kcb-pierre">{plan.period}</span>}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs">
                      {f.ok
                        ? <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        : <X className="w-3 h-3 text-kcb-pierre/30 flex-shrink-0" />}
                      <span className={f.ok ? 'text-kcb-sable' : 'text-kcb-pierre/40'}>{f.label}</span>
                    </li>
                  ))}
                </ul>
                {!isCurrent && plan.price > 0 && (
                  <Link
                    to="/global#pricing"
                    className="flex items-center justify-center gap-1 w-full py-2 text-xs font-semibold rounded-[4px] border transition text-[#9B4D96] border-[#9B4D96]/30 hover:bg-[#9B4D96]/10"
                  >
                    <ArrowUp className="w-3 h-3" /> Passer à {plan.name}
                  </Link>
                )}
                {!isCurrent && plan.price === 0 && (
                  <p className="text-center text-xs text-kcb-pierre py-2">Plan de base</p>
                )}
                {isCurrent && (
                  <p className="text-center text-xs text-[#9B4D96] py-2 font-medium">Plan actif</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Search, label: 'Market Research', desc: 'Rapports, tendances, analyse de cote par artiste', plan: 'Explorer' },
          { icon: Truck, label: 'Logidoo Logistique', desc: 'Devis & expéditions art Afrique ↔ Europe', plan: 'Explorer' },
          { icon: Star, label: 'Services Concierge', desc: 'Agents certifiés sur le terrain en Afrique', plan: 'Premium' },
        ].map((f, i) => (
          <div key={i} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <f.icon className="w-4 h-4 text-[#9B4D96]" />
              <p className="text-xs font-semibold text-white">{f.label}</p>
              <span className="ml-auto text-[10px] text-kcb-pierre">{f.plan}+</span>
            </div>
            <p className="text-xs text-kcb-pierre">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Billing details */}
      {subscription && (
        <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-kcb-or" /> Facturation
          </h3>
          <div className="space-y-0 divide-y divide-white/[0.06]">
            {[
              { label: 'Statut', value: subscription.status === 'active' ? 'Actif' : 'Inactif', badge: subscription.status === 'active' ? 'emerald' : 'red' },
              { label: 'Plan', value: subscription.plans?.name ?? subscription.plan?.name ?? '—' },
              { label: 'Montant', value: subscription.amount ? `${subscription.amount.toLocaleString('fr-FR')} ${subscription.currency}` : '—' },
              { label: 'Début', value: subscription.start_date ? new Date(subscription.start_date).toLocaleDateString('fr-FR') : '—' },
              { label: 'Renouvellement', value: subscription.end_date ? new Date(subscription.end_date).toLocaleDateString('fr-FR') : '—' },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center py-3">
                <span className="text-xs text-kcb-pierre">{row.label}</span>
                {row.badge ? (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.badge === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {row.value}
                  </span>
                ) : (
                  <span className="text-sm text-white font-medium">{row.value}</span>
                )}
              </div>
            ))}
          </div>

          {subscription.status === 'active' && (
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              {!showCancelConfirm ? (
                <button onClick={() => setShowCancelConfirm(true)} className="text-xs text-red-400 hover:text-red-300 transition">
                  Annuler l'abonnement
                </button>
              ) : (
                <div className="bg-red-900/20 border border-red-700/40 rounded-[4px] p-4 space-y-3">
                  <p className="text-sm text-red-200 font-medium">Confirmer l'annulation ?</p>
                  <p className="text-xs text-red-300/80">
                    Votre accès reste actif jusqu'au{' '}
                    {subscription.end_date ? new Date(subscription.end_date).toLocaleDateString('fr-FR') : '—'}. Irréversible.
                  </p>
                  {cancelError && <p className="text-xs text-red-400">{cancelError}</p>}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      disabled={cancelLoading}
                      className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white text-xs rounded-[4px] transition disabled:opacity-50"
                    >
                      {cancelLoading ? 'En cours…' : 'Confirmer'}
                    </button>
                    <button
                      onClick={() => { setShowCancelConfirm(false); setCancelError('') }}
                      className="px-4 py-1.5 border border-white/10 text-kcb-pierre hover:text-white text-xs rounded-[4px] transition"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!subscription && (
        <div className="bg-kcb-ardoise border border-[#9B4D96]/20 rounded-[4px] p-6 text-center">
          <Shield className="w-10 h-10 text-[#9B4D96] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Débloquez l'accès complet</h3>
          <p className="text-sm text-kcb-pierre mb-5 max-w-md mx-auto">
            Market Research Tools, logistique Logidoo, services Concierge et suivi budget — à partir de €27/mois.
          </p>
          <Link
            to="/global#pricing"
            className="inline-flex items-center gap-2 bg-[#9B4D96] hover:bg-[#8B3D86] text-white px-6 py-2.5 rounded-[4px] transition font-medium text-sm"
          >
            Voir les plans <ArrowUp className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default CuratorAbonnement
