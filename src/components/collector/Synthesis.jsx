import { Bookmark, Clock, CreditCard, Image, Package, TrendingUp, Truck } from "lucide-react"
import { Link } from "react-router-dom"
import { useArtworks } from "../../store/ArtworkContext"
import { useAuth } from "../../store/AuthContext"
import { useDelivery } from "../../store/DeliveryStore"
import { AddArtistAction } from "../professional/AddArtistAction"
import { CreateCollection } from "../artworks/CreateCollection"
import { KPICard } from "../ui"

/** Status considérés comme une livraison active (non finalisée). */
const ACTIVE_STATUSES = ["pending", "in_transit", "processing", "shipped"]

/**
 * Retourne un badge de statut de livraison localisé.
 *
 * @param {string} status - Statut brut de la livraison
 * @returns {JSX.Element}
 */
function DeliveryStatusBadge({ status }) {
  const CONFIG = {
    pending:    { label: "En attente",  className: "bg-yellow-900/40 text-yellow-300" },
    processing: { label: "En cours",    className: "bg-blue-900/40 text-blue-300" },
    shipped:    { label: "Expédiée",    className: "bg-indigo-900/40 text-indigo-300" },
    in_transit: { label: "En transit",  className: "bg-purple-900/40 text-purple-300" },
    delivered:  { label: "Livrée",      className: "bg-green-900/40 text-green-300" },
  }
  const cfg = CONFIG[status] ?? { label: status, className: "bg-gray-800 text-gray-400" }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.className}`}>
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
  const { buyed } = useArtworks()
  const { subscription } = useAuth()
  const { deliveries } = useDelivery()

  const totalValue = buyed?.reduce((acc, artwork) => acc + (artwork.price || 0), 0) ?? 0

  const activeDeliveries = deliveries?.filter(
    (d) => ACTIVE_STATUSES.includes(d.status)
  ) ?? []

  const lastAcquisitions = [...(buyed ?? [])].slice(0, 3)

  const planName = subscription?.planName || "Gratuit"

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          icon={Bookmark}
          label="Œuvres achetées"
          value={buyed?.length ?? 0}
          iconColor="text-purple-400"
          iconBgColor="bg-purple-900/20"
        />
        <KPICard
          icon={TrendingUp}
          label="Valeur totale collection"
          value={`${totalValue.toLocaleString("fr-FR")} CFA`}
          iconColor="text-green-400"
          iconBgColor="bg-green-900/20"
        />
        <KPICard
          icon={Truck}
          label="Livraisons actives"
          value={activeDeliveries.length}
          iconColor="text-blue-400"
          iconBgColor="bg-blue-900/20"
        />
        <KPICard
          icon={CreditCard}
          label="Plan actuel"
          value={planName}
          iconColor="text-amber-400"
          iconBgColor="bg-amber-900/20"
        />
      </div>

      {/* Actions rapides */}
      <div className="rounded-xl border border-gray-800 bg-card p-4">
        <h3 className="flex items-center gap-2 text-white font-semibold mb-4">
          <Clock className="w-5 h-5 text-gray-400" />
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/explore"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-700/60 text-gray-200 text-sm font-medium py-3 px-4 transition-colors duration-200"
          >
            <Image className="w-4 h-4" />
            Explorer le marketplace
          </Link>
          <AddArtistAction />
          <CreateCollection />
        </div>
      </div>

      {/* Dernières acquisitions */}
      {lastAcquisitions.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-card p-4">
          <h3 className="flex items-center gap-2 text-white font-semibold mb-4">
            <Package className="w-5 h-5 text-gray-400" />
            Dernières acquisitions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {lastAcquisitions.map((artwork) => (
              <div
                key={artwork._id}
                className="flex items-center gap-3 rounded-lg border border-gray-800 bg-[#13161e] p-3 hover:border-gray-700 transition-colors duration-200"
              >
                {/* Thumbnail */}
                {artwork.image ? (
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-14 h-14 rounded-md object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-md bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Image className="w-6 h-6 text-gray-600" />
                  </div>
                )}
                {/* Info */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{artwork.title || "Sans titre"}</p>
                  <p className="text-xs text-gray-400 truncate">{artwork.artist?.name || artwork.artistName || "—"}</p>
                  <p className="text-xs text-indigo-400 font-semibold mt-0.5">
                    {artwork.price ? `${artwork.price.toLocaleString("fr-FR")} CFA` : "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Livraisons en cours */}
      {activeDeliveries.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-card p-4">
          <h3 className="flex items-center gap-2 text-white font-semibold mb-4">
            <Truck className="w-5 h-5 text-gray-400" />
            Livraisons en cours
          </h3>
          <ul className="space-y-2">
            {activeDeliveries.map((delivery) => (
              <li
                key={delivery._id}
                className="flex items-center justify-between rounded-lg border border-gray-800 bg-[#13161e] px-4 py-3 hover:border-gray-700 transition-colors duration-200"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {delivery.artworkTitle || delivery.description || `Livraison #${delivery._id?.slice(-6)}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {delivery.destination || "Destination inconnue"}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <DeliveryStatusBadge status={delivery.status} />
                  <Link
                    to={`/tracking/${delivery._id}`}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Suivre →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
