import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Crown,
} from 'lucide-react'
import { deleteClient } from '../../api/useCrm'
import { ConfirmDialog, toast, SkeletonTable, EmptyState } from '../ui'

export function ClientsList({
  clients,
  loading,
  total,
  page,
  onPageChange,
  onViewClient,
  onClientsUpdated,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [clientToDelete, setClientToDelete] = useState(null)

  const handleDelete = async (clientId) => {
    setClientToDelete(clientId)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    const result = await deleteClient(clientToDelete)
    if (!result.error) {
      toast.success('✓ Client supprimé')
      await onClientsUpdated()
    } else {
      toast.error('× Erreur lors de la suppression')
    }
    setShowDeleteConfirm(false)
    setClientToDelete(null)
  }

  const pages = Math.ceil(total / 10)

  if (loading) {
    return <SkeletonTable rows={6} cols={6} />
  }

  if (clients.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Aucun client trouvé"
        description="Ajoutez votre premier client ou synchronisez vos transactions."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-kcb-ardoise rounded-[4px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-3 text-left text-sm font-semibold text-kcb-sable">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-kcb-sable">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-kcb-sable">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-kcb-sable">
                  Segment
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-kcb-sable">
                  Achats
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-kcb-sable">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {clients.map((client) => (
                <tr key={client._id} className="hover:bg-kcb-noir/50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{client.name}</p>
                      <p className="text-xs text-kcb-pierre">
                        {client.city && `${client.city}, `}
                        {client.country}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {client.email && (
                        <div className="flex items-center gap-2 text-sm text-kcb-sable">
                          <Mail className="w-4 h-4" />
                          <span>{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-kcb-sable">
                          <Phone className="w-4 h-4" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        client.status === 'vip'
                          ? 'bg-yellow-900/50 text-yellow-200'
                          : client.status === 'client'
                            ? 'bg-green-900/50 text-green-200'
                            : client.status === 'prospect'
                              ? 'bg-kcb-or/20 text-kcb-sable'
                              : 'bg-kcb-ardoise/50 text-kcb-sable'
                      }`}
                    >
                      {client.status === 'vip' && <Crown className="w-3 h-3" />}
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-kcb-sable">
                    {client.segment
                      ?.replace(/-/g, ' ')
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-white font-medium">{client.totalPurchases}</p>
                    <p className="text-xs text-kcb-pierre">
                      {client.totalSpent?.toLocaleString('fr-FR')} CFA
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onViewClient(client)}
                        className="p-2 hover:bg-kcb-noir rounded-[4px] transition"
                        title="Voir"
                      >
                        <Eye className="w-4 h-4 text-kcb-or" />
                      </button>
                      <button
                        onClick={() => handleDelete(client._id)}
                        className="p-2 hover:bg-kcb-noir rounded-[4px] transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-kcb-pierre">
            Page {page} sur {pages} ({total} clients)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 hover:bg-kcb-ardoise rounded-[4px] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(Math.min(pages, page + 1))}
              disabled={page === pages}
              className="p-2 hover:bg-kcb-ardoise rounded-[4px] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Supprimer le client"
        message="Êtes-vous sûr de vouloir supprimer ce client? Toutes ses données et historique d'achats seront perdus."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  )
}

export default ClientsList
