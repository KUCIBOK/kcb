import { useState } from "react";
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
} from "lucide-react";
import { deleteClient } from "../../api/useCrm";
import { ConfirmDialog, toast } from "../ui";

export function ClientsList({
  clients,
  loading,
  total,
  page,
  onPageChange,
  onViewClient,
  onClientsUpdated,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const handleDelete = async (clientId) => {
    setClientToDelete(clientId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    const result = await deleteClient(clientToDelete);
    if (!result.error) {
      toast.success('✓ Client supprimé');
      await onClientsUpdated();
    } else {
      toast.error('× Erreur lors de la suppression');
    }
    setShowDeleteConfirm(false);
    setClientToDelete(null);
  };

  const pages = Math.ceil(total / 10);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-kcb"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="bg-card rounded-lg p-8 text-center">
        <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 mb-2">Aucun client trouvé</p>
        <p className="text-gray-500 text-sm">
          Ajoutez votre premier client ou synchronisez vos transactions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                  Segment
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">
                  Achats
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {clients.map((client) => (
                <tr
                  key={client._id}
                  className="hover:bg-background/50 transition"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{client.name}</p>
                      <p className="text-xs text-gray-500">
                        {client.city && `${client.city}, `}
                        {client.country}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {client.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Mail className="w-4 h-4" />
                          <span>{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Phone className="w-4 h-4" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        client.status === "vip"
                          ? "bg-yellow-900/50 text-yellow-200"
                          : client.status === "client"
                          ? "bg-green-900/50 text-green-200"
                          : client.status === "prospect"
                          ? "bg-blue-900/50 text-blue-200"
                          : "bg-gray-700/50 text-gray-300"
                      }`}
                    >
                      {client.status === "vip" && <Crown className="w-3 h-3" />}
                      {client.status.charAt(0).toUpperCase() +
                        client.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {client.segment
                      ?.replace(/-/g, " ")
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-white font-medium">
                      {client.totalPurchases}
                    </p>
                    <p className="text-xs text-gray-500">
                      {client.totalSpent?.toLocaleString("fr-FR")} CFA
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onViewClient(client)}
                        className="p-2 hover:bg-background rounded-lg transition"
                        title="Voir"
                      >
                        <Eye className="w-4 h-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(client._id)}
                        className="p-2 hover:bg-background rounded-lg transition"
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
          <p className="text-sm text-gray-400">
            Page {page} sur {pages} ({total} clients)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 hover:bg-card rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(Math.min(pages, page + 1))}
              disabled={page === pages}
              className="p-2 hover:bg-card rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}

export default ClientsList;
