import { Bookmark, Clock, CreditCard, Image, Package, TrendingUp, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useArtworks } from '../../store/ArtworkContext'
import { useAuth } from '../../store/AuthContext'
import { useDelivery } from '../../store/DeliveryStore'
import { AddArtistAction } from '../professional/AddArtistAction'
import { CreateCollection } from '../artworks/CreateCollection'
import { KPICard, SkeletonKPI, EmptyState } from '../ui'

/** Status considérés comme une livraison active (non finalisée). */
const ACTIVE_STATUSES = ['pending', 'in_transit', 'processing', 'shipped']

/**
 * Retourne un badge de statut de livraison localisé.
 *
 * @param {string} status - Statut brut de la livraison
 * @returns {JSX.Element}
 */
function DeliveryStatusBadge({ status }) {
  const CONFIG = {
    pending: { label: 'En attente', className: 'bg-yellow-900/40 text-yellow-300' },
    processing: { label: 'En cours', className: 'bg-kcb-or/20 text-kcb-sable' },
    shipped: { label: 'Expédiée', className: 'bg-kcb-or/20 text-kcb-sable' },
    in_transit: { label: 'En transit', className: 'bg-kcb-bronze/20 text-kcb-sable' },
    delivered: { label: 'Livrée', className: 'bg-green-900/40 text-green-300' },
  }
  const cfg = CONFIG[status] ?? { label: status, className: 'bg-kcb-ardoise text-kcb-pierre' }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-[2px] ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

/**
 * Vue synthèse du dashboard collecteur.
 *
 * Affiche 4 KPIs (œuvres, valeur, livraisons actives, plan),
 * des actions rapides, les 3 dernières acquisitions et les livraisons en cours.
 *
 * @returns {JSX.Element}
 */
export function Synthesis() {
  const { buyed, loading: artworksLoading } = useArtworks()
  const { subscription } = useAuth()
  const { deliveries } = useDelivery()

  const totalValue = buyed?.reduce((acc, artwork) => acc + (artwork.price || 0), 0) ?? 0

  const activeDeliveries = deliveries?.filter((d) => ACTIVE_STATUSES.includes(d.status)) ?? []

  const lastAcquisitions = [...(buyed ?? [])].slice(0, 3)

  const planName = subscription?.planName || 'Gratuit'

  return (
    <div className="space-y-6">
      {/* KPIs */}
      {artworksLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <SkeletonKPI />
          <SkeletonKPI />
          <SkeletonKPI />
          <SkeletonKPI />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            icon={Bookmark}
            label="Œuvres achetées"
            value={buyed?.length ?? 0}
            iconColor="text-kcb-bronze"
            iconBgColor="bg-kcb-bronze/10"
          />
          <KPICard
            icon={TrendingUp}
            label="Valeur totale collection"
            value={`${totalValue.toLocaleString('fr-FR')} CFA`}
            iconColor="text-green-400"
            iconBgColor="bg-green-900/20"
          />
          <KPICard
            icon={Truck}
            label="Livraisons actives"
            value={activeDeliveries.length}
            iconColor="text-kcb-or"
            iconBgColor="bg-kcb-or/10"
          />
          <KPICard
            icon={CreditCard}
            label="Plan actuel"
            value={planName}
            iconColor="text-amber-400"
            iconBgColor="bg-amber-900/20"
          />
        </div>
      )}

      {/* Actions rapides */}
      <div className="rounded-[4px] border border-white/[0.06] bg-kcb-ardoise p-4">
        <h3 className="flex items-center gap-2 text-white font-semibold mb-4">
          <Clock className="w-5 h-5 text-kcb-pierre" />
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/africa/catalogue"
            className="flex items-center justify-center gap-2 rounded-[4px] border border-white/[0.06] bg-kcb-ardoise/50 hover:bg-white/[0.08] text-kcb-sable text-sm font-medium py-3 px-4 transition-colors duration-200"
          >
            <Image className="w-4 h-4" />
            Explorer le marketplace
          </Link>
          <AddArtistAction />
          <CreateCollection />
        </div>
      </div>

      {/* Dernières acquisitions */}
      <div className="rounded-[4px] border border-white/[0.06] bg-kcb-ardoise p-4">
        <h3 className="flex items-center gap-2 text-white font-semibold mb-4">
          <Package className="w-5 h-5 text-kcb-pierre" />
          Dernières acquisitions
        </h3>
        {lastAcquisitions.length === 0 ? (
          <EmptyState
            icon={Image}
            title="Aucune acquisition"
            description="Vous n'avez pas encore acheté d'œuvre. Explorez le marketplace pour commencer votre collection."
            actionLabel="Explorer le marketplace"
            onAction={() => window.location.assign('/africa/catalogue')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {lastAcquisitions.map((artwork) => (
              <div
                key={artwork.id || artwork._id}
                className="flex items-center gap-3 rounded-[4px] border border-white/[0.06] bg-kcb-ardoise-cool p-3 hover:border-white/[0.06] transition-colors duration-200"
              >
                {/* Thumbnail */}
                {artwork.image ? (
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-14 h-14 rounded-md object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-md bg-kcb-ardoise flex items-center justify-center flex-shrink-0">
                    <Image className="w-6 h-6 text-kcb-pierre" />
                  </div>
                )}
                {/* Info */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {artwork.title || 'Sans titre'}
                  </p>
                  <p className="text-xs text-kcb-pierre truncate">
                    {artwork.artist?.name || artwork.artistName || '—'}
                  </p>
                  <p className="text-xs text-kcb-or font-semibold mt-0.5">
                    {artwork.price ? `${artwork.price.toLocaleString('fr-FR')} CFA` : '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Livraisons en cours */}
      <div className="rounded-[4px] border border-white/[0.06] bg-kcb-ardoise p-4">
        <h3 className="flex items-center gap-2 text-white font-semibold mb-4">
          <Truck className="w-5 h-5 text-kcb-pierre" />
          Livraisons en cours
        </h3>
        {activeDeliveries.length === 0 ? (
          <EmptyState
            icon={Truck}
            title="Aucune livraison active"
            description="Vous n'avez pas de livraison en cours pour le moment."
          />
        ) : (
          <ul className="space-y-2">
            {activeDeliveries.map((delivery) => (
              <li
                key={delivery._id}
                className="flex items-center justify-between rounded-[4px] border border-white/[0.06] bg-kcb-ardoise-cool px-4 py-3 hover:border-white/[0.06] transition-colors duration-200"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {delivery.artworkTitle ||
                      delivery.description ||
                      `Livraison #${delivery._id?.slice(-6)}`}
                  </p>
                  <p className="text-xs text-kcb-pierre mt-0.5">
                    {delivery.destination || 'Destination inconnue'}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <DeliveryStatusBadge status={delivery.status} />
                  <Link
                    to={`/tracking/${delivery._id}`}
                    className="text-xs text-kcb-or hover:text-kcb-or/80 transition-colors"
                  >
                    Suivre →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
