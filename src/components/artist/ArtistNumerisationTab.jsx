import { useState, useEffect, useCallback } from "react"
import { Scan, Plus, X, Loader2, CheckCircle, Clock, RefreshCw, Trash2, AlertCircle } from "lucide-react"
import { getMyNumerisationRequests, createNumerisation, deleteNumerisationRequest } from "../../api/useNumerisation"
import { useArtworks } from "../../store/ArtworkContext"
import { KPICard } from "../ui"

/** Badge de statut coloré pour une demande de numérisation. */
function StatusBadge({ status }) {
  const CONFIG = {
    pending: { label: "En attente", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    processing: { label: "En cours", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    delivered: { label: "Terminée", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  }
  const cfg = CONFIG[status] ?? { label: status, className: "bg-gray-500/20 text-gray-400 border-gray-500/30" }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

/**
 * Onglet de numérisation pour le dashboard Artiste.
 * Permet de consulter l'historique de ses demandes et d'en créer de nouvelles.
 *
 * @returns {JSX.Element}
 */
export function ArtistNumerisationTab() {
  const { myArtworks } = useArtworks()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [formError, setFormError] = useState(null)

  const [form, setForm] = useState({
    artworkId: "",
    artworkTitle: "",
    notes: "",
    priority: "normal",
  })

  /** Charge les demandes de numérisation de l'artiste connecté. */
  const fetchRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    const data = await getMyNumerisationRequests()
    if (data?.error) {
      setError(data.error)
    } else {
      setRequests(Array.isArray(data) ? data : [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  /** Met à jour artworkTitle en synchronisation avec artworkId sélectionné. */
  const handleArtworkChange = (e) => {
    const selectedId = e.target.value
    const artwork = myArtworks?.find((a) => a._id === selectedId)
    setForm((prev) => ({
      ...prev,
      artworkId: selectedId,
      artworkTitle: artwork?.title ?? "",
    }))
  }

  /** Soumet le formulaire de nouvelle demande. */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!form.artworkId) {
      setFormError("Veuillez sélectionner une œuvre.")
      return
    }

    setSubmitting(true)
    const result = await createNumerisation({
      artworkTitle: form.artworkTitle,
      artworkId: form.artworkId,
      notes: form.notes,
      priority: form.priority,
    })

    if (result?.error) {
      setFormError(result.error)
      setSubmitting(false)
      return
    }

    // Réinitialise et recharge
    setForm({ artworkId: "", artworkTitle: "", notes: "", priority: "normal" })
    setShowForm(false)
    setSubmitting(false)
    await fetchRequests()
  }

  /** Supprime une demande si elle est encore en attente. */
  const handleDelete = async (id) => {
    setDeletingId(id)
    const result = await deleteNumerisationRequest(id)
    if (!result?.error) {
      setRequests((prev) => prev.filter((r) => r._id !== id))
    }
    setDeletingId(null)
  }

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const total = requests.length
  const pending = requests.filter((r) => r.status === "pending").length
  const processing = requests.filter((r) => r.status === "processing").length
  const delivered = requests.filter((r) => r.status === "delivered").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-900/20 text-indigo-400 p-2.5 rounded-lg">
            <Scan className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Numérisation</h2>
            <p className="text-sm text-gray-400">Gérez vos demandes de numérisation d'œuvres</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRequests}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setShowForm(true); setFormError(null) }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-kcb hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle demande
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Scan}
          label="Total demandes"
          value={loading ? "—" : total}
          loading={loading}
          iconColor="text-indigo-400"
          iconBgColor="bg-indigo-900/20"
        />
        <KPICard
          icon={Clock}
          label="En attente"
          value={loading ? "—" : pending}
          loading={loading}
          iconColor="text-yellow-400"
          iconBgColor="bg-yellow-900/20"
        />
        <KPICard
          icon={RefreshCw}
          label="En cours"
          value={loading ? "—" : processing}
          loading={loading}
          iconColor="text-blue-400"
          iconBgColor="bg-blue-900/20"
        />
        <KPICard
          icon={CheckCircle}
          label="Terminées"
          value={loading ? "—" : delivered}
          loading={loading}
          iconColor="text-green-400"
          iconBgColor="bg-green-900/20"
        />
      </div>

      {/* Formulaire inline */}
      {showForm && (
        <div className="bg-[#13161e] border border-gray-700 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Nouvelle demande de numérisation</h3>
            <button
              onClick={() => { setShowForm(false); setFormError(null) }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sélection de l'œuvre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Œuvre <span className="text-red-400">*</span>
              </label>
              <select
                value={form.artworkId}
                onChange={handleArtworkChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="">Sélectionner une œuvre…</option>
                {myArtworks?.map((artwork) => (
                  <option key={artwork._id} value={artwork._id}>
                    {artwork.title}
                    {artwork.kuciobkId ? ` — ${artwork.kuciobkId}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Priorité
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="normal">Normale</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Notes (optionnel)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Instructions particulières, contexte de l'œuvre…"
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder-gray-500"
              />
            </div>

            {/* Erreur formulaire */}
            {formError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-kcb hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {submitting ? "Envoi…" : "Soumettre la demande"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(null) }}
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Erreur de chargement */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Liste des demandes */}
      <div className="bg-[#13161e] border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Scan className="w-4 h-4 text-gray-400" />
            Historique des demandes
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center px-6">
            <Scan className="w-10 h-10 text-gray-600 mb-3" />
            <p className="text-gray-400 font-medium">Aucune demande de numérisation</p>
            <p className="text-gray-500 text-sm mt-1">
              Cliquez sur «&nbsp;Nouvelle demande&nbsp;» pour commencer.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {requests.map((req) => (
              <div key={req._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-800/40 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{req.artworkTitle || "Œuvre sans titre"}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                    {req.priority === "urgent" && (
                      <span className="ml-2 text-orange-400 font-medium">· Urgent</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <StatusBadge status={req.status} />
                  {req.status === "pending" && (
                    <button
                      onClick={() => handleDelete(req._id)}
                      disabled={deletingId === req._id}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Supprimer la demande"
                    >
                      {deletingId === req._id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />
                      }
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
