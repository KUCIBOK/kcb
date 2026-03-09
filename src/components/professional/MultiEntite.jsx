import { useState, useEffect } from "react";
import {
  Plus,
  Building2,
  Edit,
  Trash2,
  Users,
  ChevronDown,
} from "lucide-react";
import {
  getEntities,
  createEntity,
  updateEntity,
  deleteEntity,
  addMember,
  removeMember,
} from "../../api/useEntity";
import { ConfirmDialog, toast, Modal, Input, Select, Button } from "../ui";

export function MultiEntite() {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteEntityConfirm, setShowDeleteEntityConfirm] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);
  const [showDeleteMemberConfirm, setShowDeleteMemberConfirm] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    setLoading(true);
    setError("");
    const data = await getEntities();
    if (!data.error) {
      setEntities(data);
      if (data.length > 0 && !selectedEntity) {
        setSelectedEntity(data[0]);
        setFormData(data[0]);
      }
    } else {
      setError(data.error);
    }
    setLoading(false);
  };

  const handleCreateEntity = async (e) => {
    e.preventDefault();
    const result = await createEntity(formData);
    if (!result.error) {
      toast.success('✓ Entité créée avec succès');
      await loadEntities();
      setShowCreateModal(false);
      setFormData({
        type: "gallery",
        address: {},
        socialMedia: {},
      });
    } else {
      toast.error('× ' + (result.error || 'Échec de la création'));
    }
  };

  const handleUpdateEntity = async () => {
    const result = await updateEntity(selectedEntity._id, formData);
    if (!result.error) {
      toast.success('✓ Entité mise à jour');
      await loadEntities();
      setShowEditModal(false);
      setEditing(false);
    } else {
      toast.error('× ' + (result.error || 'Échec de la mise à jour'));
    }
  };

  const handleDeleteEntity = async (id) => {
    setEntityToDelete(id);
    setShowDeleteEntityConfirm(true);
  };

  const confirmDeleteEntity = async () => {
    setError("");
    const result = await deleteEntity(entityToDelete);
    if (!result.error) {
      toast.success('✓ Entité supprimée');
      await loadEntities();
      setSelectedEntity(null);
      setView("list");
    } else {
      setError(result.error);
      toast.error('× Erreur lors de la suppression');
    }
    setShowDeleteEntityConfirm(false);
    setEntityToDelete(null);
  };

  const handleRemoveMember = async (memberId) => {
    setMemberToDelete(memberId);
    setShowDeleteMemberConfirm(true);
  };

  const confirmRemoveMember = async () => {
    setError("");
    const result = await removeMember(selectedEntity._id, memberToDelete);
    if (!result.error) {
      toast.success('✓ Membre retiré');
      await loadEntities();
    } else {
      setError(result.error);
      toast.error('× Erreur lors du retrait');
    }
    setShowDeleteMemberConfirm(false);
    setMemberToDelete(null);
  };

  const handleSelectEntity = (entity) => {
    setSelectedEntity(entity);
    setFormData(entity);
    setEditing(false);
    setShowDropdown(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading && entities.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-kcb"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Multi-Entité</h1>
          <p className="text-gray-400">
            Gérez plusieurs galeries et structures avec facilité
          </p>
        </div>
        {view === "list" && (
          <button
            onClick={() => {
              setView("create");
              setFormData({
                type: "gallery",
                address: {},
                socialMedia: {},
              });
            }}
            className="flex items-center gap-2 bg-indigo-kcb hover:bg-indigo-kcb/90 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Créer une entité
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}

      {/* Entity Selector */}
      {entities.length > 0 && view === "list" && (
        <div className="bg-card rounded-lg p-4">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 bg-background border border-gray-700 rounded-lg text-white hover:border-indigo-kcb transition"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{selectedEntity?.name || "Sélectionner une entité"}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-gray-700 rounded-lg overflow-hidden shadow-lg z-10">
                {entities.map((entity) => (
                  <button
                    key={entity._id}
                    onClick={() => handleSelectEntity(entity)}
                    className={`w-full text-left px-4 py-3 transition flex items-center gap-2 ${
                      selectedEntity?._id === entity._id
                        ? "bg-indigo-kcb text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <div>
                      <p className="font-medium">{entity.name}</p>
                      <p className="text-xs opacity-75">{entity.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* List View */}
      {view === "list" && selectedEntity && (
        <div className="space-y-6">
          {/* Entity Details */}
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-6 h-6" />
                {selectedEntity.name}
              </h2>
              {!editing && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(true);
                      setFormData(selectedEntity);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-kcb hover:bg-indigo-kcb/90 text-white rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                    Éditer
                  </button>
                  <button
                    onClick={() => handleDeleteEntity(selectedEntity._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/80 hover:bg-red-800 text-white rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            {editing ? (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg text-white focus:border-indigo-kcb focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg text-white focus:border-indigo-kcb focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg text-white focus:border-indigo-kcb focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg text-white focus:border-indigo-kcb focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg text-white focus:border-indigo-kcb focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={handleUpdateEntity}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg transition"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Type</p>
                  <p className="text-white font-medium">{selectedEntity.type}</p>
                </div>
                {selectedEntity.email && (
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="text-white font-medium">{selectedEntity.email}</p>
                  </div>
                )}
                {selectedEntity.phone && (
                  <div>
                    <p className="text-gray-400">Téléphone</p>
                    <p className="text-white font-medium">{selectedEntity.phone}</p>
                  </div>
                )}
                {selectedEntity.website && (
                  <div>
                    <p className="text-gray-400">Site web</p>
                    <p className="text-white font-medium">{selectedEntity.website}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Members */}
          <div className="bg-card rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Membres ({selectedEntity.members?.length || 0})
            </h3>

            <div className="space-y-3">
              {selectedEntity.members?.length > 0 ? (
                selectedEntity.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {member.userId?.name || "Utilisateur inconnu"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {member.userId?.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-indigo-kcb/50 text-indigo-300 rounded-full text-sm">
                        {member.role}
                      </span>
                      {member.role !== "owner" && (
                        <button
                          onClick={() => handleRemoveMember(member._id)}
                          className="p-1 hover:bg-red-900/50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Aucun membre</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create View */}
      {view === "create" && (
        <div className="max-w-2xl mx-auto bg-card rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Créer une nouvelle entité
          </h2>

          <form onSubmit={handleCreateEntity} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg text-white focus:border-indigo-kcb focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <select
                name="type"
                value={formData.type || "gallery"}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg text-white focus:border-indigo-kcb focus:outline-none"
              >
                <option value="gallery">Galerie</option>
                <option value="studio">Studio</option>
                <option value="collective">Collectif</option>
                <option value="marketplace">Marketplace</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleFormChange}
                rows={3}
                className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg text-white focus:border-indigo-kcb focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg text-white focus:border-indigo-kcb focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg text-white focus:border-indigo-kcb focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site web
              </label>
              <input
                type="url"
                name="website"
                value={formData.website || ""}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg text-white focus:border-indigo-kcb focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-kcb hover:bg-indigo-kcb/90 text-white rounded-lg transition font-medium"
              >
                Créer l'entité
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("list");
                  setFormData({});
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty State */}
      {entities.length === 0 && view === "list" && (
        <div className="bg-card rounded-lg p-8 text-center">
          <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Aucune entité créée</p>
          <p className="text-gray-500 text-sm mb-4">
            Créez votre première galerie ou structure
          </p>
          <button
            onClick={() => {
              setView("create");
              setFormData({
                type: "gallery",
                address: {},
                socialMedia: {},
              });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-kcb hover:bg-indigo-kcb/90 text-white rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Créer une entité
          </button>
        </div>
      )}

      {/* Delete Entity Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteEntityConfirm}
        onClose={() => setShowDeleteEntityConfirm(false)}
        onConfirm={confirmDeleteEntity}
        title="Supprimer l'entité"
        message="Êtes-vous sûr de vouloir supprimer cette entité? Tous les membres et données associées seront perdus."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />

      {/* Delete Member Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteMemberConfirm}
        onClose={() => setShowDeleteMemberConfirm(false)}
        onConfirm={confirmRemoveMember}
        title="Retirer le membre"
        message="Êtes-vous sûr de vouloir retirer ce membre de l'entité?"
        confirmText="Retirer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}

export default MultiEntite;
