import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  Crown,
  Edit,
  Plus,
  X,
  Save,
  Trash2,
  MessageSquare,
  Clock,
} from "lucide-react";
import {
  updateClient,
  addNote,
  deleteNote,
  addInteraction,
  deleteInteraction,
} from "../../api/useCrm";

export function ClientDetail({ client, onClientUpdated }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [newNote, setNewNote] = useState("");
  const [newInteraction, setNewInteraction] = useState({
    type: "email",
    description: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      country: client.country,
      city: client.city,
      address: client.address,
      status: client.status,
      segment: client.segment,
      interests: client.interests?.join(", ") || "",
      nextFollowUp: client.nextFollowUp
        ? new Date(client.nextFollowUp).toISOString().slice(0, 16)
        : "",
    });
  }, [client]);

  const handleSave = async () => {
    setLoading(true);
    const updates = {
      ...formData,
      interests: formData.interests
        ? formData.interests.split(",").map((i) => i.trim())
        : [],
    };

    const result = await updateClient(client._id, updates);
    if (!result.error) {
      onClientUpdated();
    }
    setLoading(false);
    setEditing(false);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const result = await addNote(client._id, newNote);
    if (!result.error) {
      setNewNote("");
      onClientUpdated();
    }
  };

  const handleDeleteNote = async (noteId) => {
    const result = await deleteNote(client._id, noteId);
    if (!result.error) {
      onClientUpdated();
    }
  };

  const handleAddInteraction = async () => {
    if (!newInteraction.description.trim()) return;
    const result = await addInteraction(client._id, newInteraction);
    if (!result.error) {
      setNewInteraction({
        type: "email",
        description: "",
        notes: "",
      });
      onClientUpdated();
    }
  };

  const handleDeleteInteraction = async (interactionId) => {
    const result = await deleteInteraction(client._id, interactionId);
    if (!result.error) {
      onClientUpdated();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-2xl font-bold bg-background border border-gray-700 rounded-lg px-3 py-1 text-white w-full md:w-auto"
              />
            ) : (
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                {client.name}
                {client.status === "vip" && (
                  <Crown className="w-5 h-5 text-yellow-400" />
                )}
              </h1>
            )}

            <div className="flex flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-background border border-gray-700 rounded px-2 py-1 text-white text-sm"
                  />
                ) : (
                  <span>{client.email || "Non renseigné"}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background border border-gray-700 rounded px-2 py-1 text-white text-sm"
                  />
                ) : (
                  <span>{client.phone || "Non renseigné"}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                {editing ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="city"
                      placeholder="Ville"
                      value={formData.city}
                      onChange={handleChange}
                      className="bg-background border border-gray-700 rounded px-2 py-1 text-white text-sm w-24"
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Pays"
                      value={formData.country}
                      onChange={handleChange}
                      className="bg-background border border-gray-700 rounded px-2 py-1 text-white text-sm w-24"
                    />
                  </div>
                ) : (
                  <span>
                    {client.city && `${client.city}, `}
                    {client.country || "Non renseigné"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Sauvegarde..." : "Enregistrer"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-kcb-or hover:bg-kcb-bronze text-kcb-noir rounded-lg transition"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
            )}
          </div>
        </div>

        {/* Status & Segment */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-700">
          <div>
            <label className="text-xs text-gray-500">Statut</label>
            {editing ? (
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 bg-background border border-gray-700 rounded px-2 py-1 text-white text-sm"
              >
                <option value="prospect">Prospect</option>
                <option value="client">Client</option>
                <option value="vip">VIP</option>
                <option value="inactive">Inactif</option>
              </select>
            ) : (
              <p className="mt-1">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    client.status === "vip"
                      ? "bg-yellow-900/50 text-yellow-200"
                      : client.status === "client"
                      ? "bg-green-900/50 text-green-200"
                      : client.status === "prospect"
                      ? "bg-blue-900/50 text-blue-200"
                      : "bg-gray-700/50 text-gray-300"
                  }`}
                >
                  {client.status.charAt(0).toUpperCase() +
                    client.status.slice(1)}
                </span>
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500">Segment</label>
            {editing ? (
              <select
                name="segment"
                value={formData.segment}
                onChange={handleChange}
                className="mt-1 bg-background border border-gray-700 rounded px-2 py-1 text-white text-sm"
              >
                <option value="art-collector">Collectionneur</option>
                <option value="corporate">Corporate</option>
                <option value="museum">Musée</option>
                <option value="gallery">Galerie</option>
                <option value="investor">Investisseur</option>
                <option value="other">Autre</option>
              </select>
            ) : (
              <p className="mt-1 text-white">
                {client.segment
                  ?.replace(/-/g, " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500">Prochaine relance</label>
            {editing ? (
              <input
                type="datetime-local"
                name="nextFollowUp"
                value={formData.nextFollowUp}
                onChange={handleChange}
                className="mt-1 bg-background border border-gray-700 rounded px-2 py-1 text-white text-sm"
              />
            ) : (
              <p className="mt-1 text-white">
                {client.nextFollowUp
                  ? new Date(client.nextFollowUp).toLocaleDateString("fr-FR")
                  : "Non planifiée"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4">
          <h3 className="text-gray-400 text-sm font-medium">Total achats</h3>
          <p className="text-2xl font-bold text-white mt-1">
            {client.totalPurchases}
          </p>
        </div>
        <div className="bg-card rounded-lg p-4">
          <h3 className="text-gray-400 text-sm font-medium">Dépenses totales</h3>
          <p className="text-2xl font-bold text-white mt-1">
            {client.totalSpent?.toLocaleString("fr-FR")} CFA
          </p>
        </div>
        <div className="bg-card rounded-lg p-4">
          <h3 className="text-gray-400 text-sm font-medium">Dernière interaction</h3>
          <p className="text-white mt-1">
            {client.lastInteraction
              ? new Date(client.lastInteraction).toLocaleDateString("fr-FR")
              : "Jamais"}
          </p>
        </div>
      </div>

      {/* Purchase History */}
      {client.purchaseHistory?.length > 0 && (
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Historique d'achats
          </h2>
          <div className="space-y-3">
            {client.purchaseHistory.map((purchase, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{purchase.title}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(purchase.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <p className="text-green-400 font-semibold">
                  {purchase.amount?.toLocaleString("fr-FR")} CFA
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactions */}
      <div className="bg-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Interactions
          </h2>
          <button
            onClick={() => {
              document.getElementById("add-interaction-modal").showModal();
            }}
            className="flex items-center gap-2 px-3 py-2 bg-kcb-or hover:bg-kcb-bronze text-kcb-noir rounded-lg text-sm transition"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>

        <div className="space-y-3">
          {client.interactions?.length > 0 ? (
            client.interactions.map((interaction) => (
              <div
                key={interaction._id}
                className="p-4 bg-background/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-900/50 text-blue-200 rounded-full text-xs">
                        {interaction.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(interaction.date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <p className="text-white font-medium">
                      {interaction.description}
                    </p>
                    {interaction.notes && (
                      <p className="text-gray-400 text-sm mt-1">
                        {interaction.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteInteraction(interaction._id)}
                    className="p-1 hover:bg-red-900/50 rounded transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucune interaction enregistrée
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Notes
          </h2>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Ajouter une note..."
            className="flex-1 px-4 py-2 bg-background border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-kcb-or"
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="px-4 py-2 bg-kcb-or hover:bg-kcb-bronze disabled:opacity-50 text-kcb-noir rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {client.notes?.length > 0 ? (
            client.notes.map((note) => (
              <div
                key={note._id}
                className="p-4 bg-background/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Par {note.author?.name} •{" "}
                      {new Date(note.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="p-1 hover:bg-red-900/50 rounded transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucune note enregistrée
            </p>
          )}
        </div>
      </div>

      {/* Add Interaction Modal */}
      <dialog id="add-interaction-modal" className="modal">
        <div className="modal-box bg-card border border-gray-700">
          <h3 className="font-bold text-lg text-white mb-4">
            Ajouter une interaction
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Type</label>
              <select
                value={newInteraction.type}
                onChange={(e) =>
                  setNewInteraction((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white"
              >
                <option value="email">Email</option>
                <option value="call">Appel</option>
                <option value="meeting">Rendez-vous</option>
                <option value="purchase">Achat</option>
                <option value="note">Note</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={newInteraction.description}
                onChange={(e) =>
                  setNewInteraction((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white"
                placeholder="Ex: Appel de suivi"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Notes</label>
              <textarea
                value={newInteraction.notes}
                onChange={(e) =>
                  setNewInteraction((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg text-white"
                placeholder="Détails supplémentaires..."
                rows={3}
              />
            </div>
          </div>
          <div className="modal-action mt-6">
            <form method="dialog" className="flex gap-2">
              <button
                onClick={handleAddInteraction}
                disabled={!newInteraction.description.trim()}
                className="px-4 py-2 bg-kcb-or hover:bg-kcb-bronze disabled:opacity-50 text-kcb-noir rounded-lg transition"
              >
                Ajouter
              </button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">
                Annuler
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default ClientDetail;
