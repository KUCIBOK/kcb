import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useClients } from "../../store/ClientContext";
import { Modal, Input, Button, toast, ConfirmDialog } from "../ui";

const ClientActions = ({ client, onClientUpdated, onClientDeleted }) => {
  const { updateClient, deleteClient } = useClients();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [editData, setEditData] = useState({
    nom: client.nom || "",
    prenom: client.prenom || "",
    email: client.email || "",
    telephone: client.telephone || "",
    ville: client.ville || "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (editData.telephone && editData.telephone.trim() !== "") {
      const phoneRegex = /^[\d\s+\-()]+$/;
      if (!phoneRegex.test(editData.telephone.trim())) {
        toast.error('× Numéro de téléphone invalide');
        setIsLoading(false);
        return;
      }
    }

    const result = await updateClient(client._id, editData);

    if (!result.error) {
      toast.success('✓ Client modifié');
      if (onClientUpdated) onClientUpdated(client._id, result);
      setShowEditModal(false);
    } else {
      toast.error('× ' + result.error);
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);

    const result = await deleteClient(client._id);

    if (!result.error) {
      toast.success('✓ Client supprimé');
      if (onClientDeleted) onClientDeleted(client._id);
      setShowDeleteModal(false);
    } else {
      toast.error('× ' + result.error);
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* Boutons d'action */}
      <div className="flex gap-1">
        <button
          onClick={() => setShowEditModal(true)}
          className="p-1 text-kcb-pierre hover:text-kcb-or hover:bg-blue-400/10 rounded transition"
          title="Modifier"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="p-1 text-kcb-pierre hover:text-red-400 hover:bg-red-400/10 rounded transition"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Modal de modification */}
      {showEditModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowEditModal(false)}
          title="Modifier le client"
          size="sm"
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nom"
                value={editData.nom}
                onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                required
              />
              <Input
                label="Prénom"
                value={editData.prenom}
                onChange={(e) => setEditData({ ...editData, prenom: e.target.value })}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              required
            />

            <Input
              label="Téléphone"
              type="tel"
              value={editData.telephone}
              onChange={(e) => setEditData({ ...editData, telephone: e.target.value })}
            />

            <Input
              label="Ville"
              value={editData.ville}
              onChange={(e) => setEditData({ ...editData, ville: e.target.value })}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                className="flex-1"
              >
                Modifier
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Supprimer le client"
          message={`Êtes-vous sûr de vouloir supprimer ${client.nom} ${client.prenom}? Cette action est irréversible.`}
          confirmText="Supprimer"
          loading={isLoading}
        />
      )}
    </>
  );
};

export default ClientActions;
