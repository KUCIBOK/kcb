import { Search, RefreshCw, MapPin, Clock, Package, Truck, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLogistics } from '../../hooks/useLogistics'
import { SkeletonTable, EmptyState } from '../ui'

export function EnhancedDeliveryRequestList({ deliveries, loading: externalLoading = false }) {
  const [state, setState] = useState({
    set: deliveries,
    search: '',
    showLogidooData: false,
  })
  const { getTrackingInfo, syncWithLogidoo, loading } = useLogistics()
  const [trackingData, setTrackingData] = useState({})
  const [syncResult, setSyncResult] = useState(null)

  useEffect(() => {
    let filtered
    if (state?.search !== '') {
      filtered = deliveries?.filter((delivery) => {
        const query = state.search.toLowerCase()
        return (
          delivery.recipientName?.toLowerCase().includes(query) ||
          delivery.recipientPhone?.toLowerCase().includes(query) ||
          delivery.trackingId?.toLowerCase().includes(query) ||
          delivery.status?.toLowerCase().includes(query)
        )
      })
    } else {
      filtered = deliveries
    }
    setState((prev) => ({ ...prev, set: filtered }))  
  }, [state.search, deliveries])

  const handleSyncWithLogidoo = async () => {
    try {
      const result = await syncWithLogidoo()
      setSyncResult(result)
      // Refresh tracking data for all deliveries
      const newTrackingData = {}
      for (const delivery of deliveries) {
        if (delivery.trackingId) {
          try {
            const tracking = await getTrackingInfo(delivery.trackingId)
            newTrackingData[delivery.trackingId] = tracking
          } catch (error) {
            // Tracking fetch failed silently
          }
        }
      }
      setTrackingData(newTrackingData)
    } catch (error) {
      // Sync failed silently
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-400'
      case 'on_the_way':
        return 'text-kcb-or'
      case 'in_preparation':
        return 'text-yellow-400'
      case 'pending':
        return 'text-kcb-pierre'
      case 'rejected':
        return 'text-red-400'
      default:
        return 'text-white'
    }
  }

  const getLogidooStatusBadge = (logidooStatus) => {
    if (!logidooStatus) return null

    const statusColors = {
      delivered: 'bg-green-500/20 text-green-400',
      in_transit: 'bg-kcb-or/10 text-kcb-or',
      preparing: 'bg-yellow-500/20 text-yellow-400',
      pending: 'bg-gray-500/20 text-kcb-pierre',
      cancelled: 'bg-red-500/20 text-red-400',
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${statusColors[logidooStatus] || 'bg-kcb-bronze/20 text-kcb-bronze'}`}
      >
        Logidoo: {logidooStatus}
      </span>
    )
  }

  if (externalLoading) {
    return <SkeletonTable rows={5} cols={7} />
  }

  return (
    <>
      {/* Header with sync button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto max-w-xl">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-kcb-pierre">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            value={state?.search}
            onChange={(e) => setState({ ...state, search: e.target.value })}
            placeholder="Rechercher par destinataire, trackingId, statut..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-white/[0.06] bg-kcb-ardoise text-white focus:outline-none focus:ring-2 focus:ring-kcb-or"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSyncWithLogidoo}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-kcb-or hover:bg-kcb-or/90 disabled:bg-kcb-or/50 text-kcb-noir rounded-md transition font-semibold"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Synchronisation...' : 'Sync avec Logidoo'}
          </button>

          <button
            onClick={() =>
              setState((prev) => ({ ...prev, showLogidooData: !prev.showLogidooData }))
            }
            className="px-4 py-2 bg-kcb-bronze hover:bg-kcb-bronze/90 text-white rounded-md transition"
          >
            {state.showLogidooData ? 'Masquer Logidoo' : 'Afficher Logidoo'}
          </button>
        </div>
      </div>

      {/* Sync result notification */}
      {syncResult && (
        <div className="mb-4 p-4 bg-green-900/20 border border-green-800 rounded-md">
          <div className="flex items-center gap-2 text-green-400">
            <AlertCircle className="h-5 w-5" />
            <span>Synchronisation terminée: {syncResult.syncedCount} livraisons synchronisées</span>
          </div>
        </div>
      )}

      {/* Deliveries table */}
      <div className="overflow-auto rounded-md border border-white/[0.06] bg-kcb-ardoise">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-kcb-ardoise text-kcb-sable">
              <th className="font-semibold text-left p-3 text-xs">Tracking ID</th>
              <th className="font-semibold text-left p-3 text-xs">Destinataire</th>
              <th className="font-semibold text-left p-3 text-xs">Statut</th>
              <th className="font-semibold text-left p-3 text-xs">Priorité</th>
              <th className="font-semibold text-left p-3 text-xs">Destination</th>
              <th className="font-semibold text-left p-3 text-xs">Dates</th>
              {state.showLogidooData && (
                <>
                  <th className="font-semibold text-left p-3 text-xs">Logidoo Statut</th>
                  <th className="font-semibold text-left p-3 text-xs">Localisation</th>
                </>
              )}
              <th className="font-semibold text-left p-3 text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state?.set?.length > 0 ? (
              state?.set?.map((delivery) => {
                const logidooData = trackingData[delivery.trackingId]
                return (
                  <tr
                    key={delivery._id}
                    className="border-b border-white/[0.06] hover:bg-kcb-ardoise/50 transition"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-kcb-pierre" />
                        <div>
                          <div className="text-white font-medium">
                            {delivery.trackingId || 'À venir'}
                          </div>
                          {delivery.trackingId && (
                            <div className="text-xs text-kcb-pierre">
                              KCB-{delivery._id.slice(-6)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-white">{delivery.recipientName}</div>
                      <div className="text-xs text-kcb-pierre">{delivery.recipientPhone}</div>
                    </td>

                    <td className="p-3">
                      <div className={`flex items-center gap-2 ${getStatusColor(delivery.status)}`}>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            delivery.status === 'delivered'
                              ? 'bg-green-400'
                              : delivery.status === 'on_the_way'
                                ? 'bg-kcb-or'
                                : delivery.status === 'in_preparation'
                                  ? 'bg-yellow-400'
                                  : delivery.status === 'pending'
                                    ? 'bg-gray-400'
                                    : 'bg-red-400'
                          }`}
                        ></div>
                        <span className="capitalize">
                          {delivery.status === 'pending'
                            ? 'En attente'
                            : delivery.status === 'in_preparation'
                              ? 'En préparation'
                              : delivery.status === 'on_the_way'
                                ? 'En route'
                                : delivery.status === 'delivered'
                                  ? 'Livrée'
                                  : 'Rejetée'}
                        </span>
                      </div>
                      {state.showLogidooData && getLogidooStatusBadge(logidooData?.currentStatus)}
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-1 bg-kcb-or/10 text-kcb-or rounded-full text-xs capitalize">
                        {delivery.deliveryPriority}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex items-start gap-1">
                        <MapPin className="h-4 w-4 text-kcb-pierre mt-0.5" />
                        <div className="text-white text-sm">{delivery.deliveryAddress}</div>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="space-y-1">
                        {delivery.collectDate && (
                          <div className="flex items-center gap-1 text-xs text-kcb-sable">
                            <Clock className="h-3 w-3" />
                            Collecte: {new Date(delivery.collectDate).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                        {delivery.deliveryDate && (
                          <div className="flex items-center gap-1 text-xs text-kcb-sable">
                            <Truck className="h-3 w-3" />
                            Livraison: {new Date(delivery.deliveryDate).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </td>

                    {state.showLogidooData && (
                      <>
                        <td className="p-3">
                          {logidooData ? (
                            <div className="space-y-1">
                              <div className="text-xs text-kcb-sable">
                                Estimé:{' '}
                                {logidooData.estimatedDelivery
                                  ? new Date(logidooData.estimatedDelivery).toLocaleDateString(
                                      'fr-FR'
                                    )
                                  : 'N/A'}
                              </div>
                              {logidooData.provider && (
                                <div className="text-xs text-kcb-bronze">
                                  Via {logidooData.provider}
                                </div>
                              )}
                            </div>
                          ) : delivery.trackingId ? (
                            <div className="text-xs text-yellow-400">En attente de données...</div>
                          ) : (
                            <div className="text-xs text-kcb-pierre">Pas de tracking</div>
                          )}
                        </td>

                        <td className="p-3">
                          {logidooData?.location ? (
                            <div className="text-xs text-kcb-sable">
                              {logidooData.location.city}, {logidooData.location.country}
                            </div>
                          ) : (
                            <div className="text-xs text-kcb-pierre">-</div>
                          )}
                        </td>
                      </>
                    )}

                    <td className="p-3">
                      <div className="flex gap-2">
                        {delivery.trackingId && (
                          <button
                            onClick={() =>
                              window.open(`/tracking/${delivery.trackingId}`, '_blank')
                            }
                            className="px-3 py-1 bg-kcb-ardoise hover:bg-white/[0.08] text-white rounded text-xs transition"
                          >
                            Suivre
                          </button>
                        )}
                        {state.showLogidooData && delivery.trackingId && (
                          <button
                            onClick={async () => {
                              try {
                                const tracking = await getTrackingInfo(delivery.trackingId)
                                setTrackingData((prev) => ({
                                  ...prev,
                                  [delivery.trackingId]: tracking,
                                }))
                              } catch (error) {
                                // Refresh failed silently
                              }
                            }}
                            className="px-3 py-1 bg-kcb-or hover:bg-kcb-or/90 text-kcb-noir rounded text-xs transition font-semibold"
                          >
                            <RefreshCw className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={state.showLogidooData ? '9' : '7'}>
                  <EmptyState
                    icon={Truck}
                    title="Aucune livraison"
                    description="Vous n'avez pas encore de demandes de livraison."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
