import { useEffect, useState, useCallback } from 'react'
import {
  Gift,
  Star,
  Users,
  ShoppingBag,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownLeft,
  Package,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  getMyCredits,
  getMyReferrals,
  getRewardsProducts,
  getMyOrders,
  placeOrder,
} from '../../api/useRewards'

const TABS = [
  { label: 'Aperçu', icon: Star },
  { label: 'Parrainages', icon: Users },
  { label: 'Boutique', icon: ShoppingBag },
]

const TX_LABELS = {
  referral: 'Parrainage',
  artwork_sale: 'Vente œuvre',
  bonus: 'Bonus',
  purchase: 'Achat boutique',
  admin: 'Ajustement admin',
}

const ORDER_STATUS = {
  pending: { label: 'En attente', color: 'text-yellow-400' },
  confirmed: { label: 'Confirmée', color: 'text-blue-400' },
  shipped: { label: 'Expédiée', color: 'text-kcb-or' },
  delivered: { label: 'Livrée', color: 'text-green-400' },
  cancelled: { label: 'Annulée', color: 'text-red-400' },
}

export function RewardsHub() {
  const [tab, setTab] = useState(0)
  const [credits, setCredits] = useState({ balance: 0, total_earned: 0, total_spent: 0 })
  const [transactions, setTransactions] = useState([])
  const [referrals, setReferrals] = useState([])
  const [referralCode, setReferralCode] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState(null)
  const [copied, setCopied] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [credData, refData, prodData, ordData] = await Promise.all([
      getMyCredits(),
      getMyReferrals(),
      getRewardsProducts(),
      getMyOrders(),
    ])
    setCredits(credData.credits ?? { balance: 0, total_earned: 0, total_spent: 0 })
    setTransactions(credData.transactions ?? [])
    setReferrals(refData.referrals ?? [])
    setReferralCode(refData.code)
    setProducts(prodData)
    setOrders(ordData)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const copyCode = () => {
    if (!referralCode) return
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleOrder = async (product) => {
    if (credits.balance < product.credits_cost) {
      toast.error('Crédits insuffisants')
      return
    }
    setOrdering(product.id)
    const result = await placeOrder(product.id)
    setOrdering(null)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Commande passée : ${product.name}`)
      load()
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-[4px] bg-[#9B4D96]/20 flex items-center justify-center">
          <Gift className="w-5 h-5 text-[#9B4D96]" />
        </div>
        <div>
          <h2 className="text-white font-semibold text-lg">Rewards & Supplies</h2>
          <p className="text-xs text-kcb-pierre">Gagnez des crédits et accédez à la boutique artiste</p>
        </div>
      </div>

      {/* Credit balance card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Solde', value: credits.balance, color: 'text-[#9B4D96]' },
          { label: 'Total gagné', value: credits.total_earned, color: 'text-green-400' },
          { label: 'Total dépensé', value: credits.total_spent, color: 'text-kcb-or' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-[4px] bg-kcb-ardoise border border-white/[0.06] p-4 text-center"
          >
            <div className={`font-playfair font-bold text-3xl ${color}`}>
              {loading ? '—' : value}
            </div>
            <div className="text-xs text-kcb-pierre mt-1">{label} crédits KCB</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-white/[0.06]">
        {TABS.map(({ label, icon: Icon }, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition border-b-2 -mb-px ${
              tab === i
                ? 'border-[#9B4D96] text-[#9B4D96]'
                : 'border-transparent text-kcb-pierre hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Aperçu */}
      {tab === 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Comment gagner des crédits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Parrainer un artiste', value: '+50 crédits', desc: 'Partagez votre code de parrainage' },
              { label: 'Vendre une œuvre', value: '+20 crédits', desc: 'Par vente certifiée sur Kucibok' },
              { label: 'Bonus fidélité', value: 'Variable', desc: 'Attribués par l\'équipe Kucibok' },
            ].map(({ label, value, desc }) => (
              <div
                key={label}
                className="rounded-[4px] border border-white/[0.06] bg-kcb-ardoise p-4"
              >
                <div className="text-[#9B4D96] font-semibold text-sm mb-1">{value}</div>
                <div className="text-white text-xs font-medium mb-1">{label}</div>
                <div className="text-kcb-pierre text-xs">{desc}</div>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-white mt-4">Historique récent</h3>
          {loading ? (
            <div className="text-kcb-pierre text-xs">Chargement…</div>
          ) : transactions.length === 0 ? (
            <div className="rounded-[4px] border border-white/[0.06] p-6 text-center text-kcb-pierre text-xs">
              Aucune transaction pour l'instant
            </div>
          ) : (
            <div className="rounded-[4px] border border-white/[0.06] divide-y divide-white/[0.04]">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    {tx.amount > 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400 shrink-0" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 text-kcb-or shrink-0" />
                    )}
                    <div>
                      <div className="text-xs text-white font-medium">
                        {tx.description || TX_LABELS[tx.type] || tx.type}
                      </div>
                      <div className="text-[10px] text-kcb-pierre">
                        {new Date(tx.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-kcb-or'}`}
                  >
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Parrainages */}
      {tab === 1 && (
        <div className="space-y-4">
          <div className="rounded-[4px] border border-[#9B4D96]/30 bg-[#9B4D96]/10 p-4">
            <div className="text-xs text-kcb-pierre mb-2">Votre code de parrainage</div>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-[#9B4D96] font-mono font-bold text-lg tracking-widest">
                {loading ? '…' : referralCode ?? '—'}
              </code>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 text-xs text-kcb-pierre hover:text-white transition px-3 py-1.5 border border-white/[0.06] rounded-[4px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <div className="text-xs text-kcb-pierre mt-2">
              Partagez ce code à un artiste lors de son inscription → vous gagnez <strong className="text-[#9B4D96]">+50 crédits</strong> dès sa première vente.
            </div>
          </div>

          <h3 className="text-sm font-semibold text-white">Mes parrainages</h3>
          {loading ? (
            <div className="text-kcb-pierre text-xs">Chargement…</div>
          ) : referrals.filter((r) => r.referred_id).length === 0 ? (
            <div className="rounded-[4px] border border-white/[0.06] p-6 text-center text-kcb-pierre text-xs">
              Aucun filleul pour l'instant — partagez votre code !
            </div>
          ) : (
            <div className="rounded-[4px] border border-white/[0.06] divide-y divide-white/[0.04]">
              {referrals
                .filter((r) => r.referred_id)
                .map((r) => (
                  <div key={r.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-kcb-pierre shrink-0" />
                      <div>
                        <div className="text-xs text-white">Filleul inscrit</div>
                        <div className="text-[10px] text-kcb-pierre">
                          {new Date(r.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          r.status === 'rewarded'
                            ? 'bg-green-900/40 text-green-400'
                            : r.status === 'completed'
                            ? 'bg-blue-900/40 text-blue-400'
                            : 'bg-kcb-ardoise text-kcb-pierre'
                        }`}
                      >
                        {r.status === 'rewarded' ? 'Récompensé' : r.status === 'completed' ? 'Complété' : 'En attente'}
                      </span>
                      {r.credits_awarded > 0 && (
                        <span className="text-xs text-green-400 font-semibold">+{r.credits_awarded}</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Boutique */}
      {tab === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Catalogue</h3>
            <span className="text-xs text-kcb-pierre">
              Solde : <strong className="text-[#9B4D96]">{credits.balance}</strong> crédits
            </span>
          </div>

          {loading ? (
            <div className="text-kcb-pierre text-xs">Chargement…</div>
          ) : products.length === 0 ? (
            <div className="rounded-[4px] border border-white/[0.06] p-6 text-center text-kcb-pierre text-xs">
              Aucun produit disponible pour l'instant
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map((p) => {
                const canAfford = credits.balance >= p.credits_cost
                return (
                  <div
                    key={p.id}
                    className="rounded-[4px] border border-white/[0.06] bg-kcb-ardoise p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-8 h-8 rounded-[4px] bg-[#9B4D96]/20 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-[#9B4D96]" />
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          canAfford
                            ? 'bg-[#9B4D96]/20 text-[#9B4D96]'
                            : 'bg-kcb-noir text-kcb-pierre'
                        }`}
                      >
                        {p.credits_cost} crédits
                      </span>
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{p.name}</div>
                      {p.description && (
                        <div className="text-kcb-pierre text-xs mt-1">{p.description}</div>
                      )}
                    </div>
                    <button
                      disabled={!canAfford || ordering === p.id}
                      onClick={() => handleOrder(p)}
                      className="mt-auto w-full py-2 text-xs font-semibold rounded-[4px] transition disabled:opacity-40 disabled:cursor-not-allowed bg-[#9B4D96] text-white hover:bg-[#7d3d7b]"
                    >
                      {ordering === p.id ? 'Commande…' : canAfford ? 'Commander' : 'Crédits insuffisants'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          <h3 className="text-sm font-semibold text-white mt-4">Mes commandes</h3>
          {loading ? (
            <div className="text-kcb-pierre text-xs">Chargement…</div>
          ) : orders.length === 0 ? (
            <div className="rounded-[4px] border border-white/[0.06] p-6 text-center text-kcb-pierre text-xs">
              Aucune commande pour l'instant
            </div>
          ) : (
            <div className="rounded-[4px] border border-white/[0.06] divide-y divide-white/[0.04]">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-kcb-pierre shrink-0" />
                    <div>
                      <div className="text-xs text-white font-medium">
                        {o.artist_products?.name ?? 'Produit'}
                      </div>
                      <div className="text-[10px] text-kcb-pierre">
                        {new Date(o.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-kcb-or font-semibold">-{o.credits_spent}</span>
                    <span
                      className={`text-[10px] font-medium ${ORDER_STATUS[o.status]?.color ?? 'text-kcb-pierre'}`}
                    >
                      {ORDER_STATUS[o.status]?.label ?? o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
