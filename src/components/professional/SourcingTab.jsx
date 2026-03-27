import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Filter,
  MessageSquare,
  Loader2,
  ChevronDown,
  ChevronUp,
  Send,
  Inbox,
} from "lucide-react"
import { getMyInquiries } from "../../api/useSourcing"
import { KPICard } from "../ui"

/** @type {Record<string, {label: string, className: string}>} */
const PURPOSE_CONFIG = {
  purchase:   { label: "Achat",      className: "bg-green-900/40 text-green-300" },
  exhibition: { label: "Exposition", className: "bg-kcb-bronze/20 text-kcb-sable" },
  research:   { label: "Recherche",  className: "bg-kcb-or/20 text-kcb-sable" },
  loan:       { label: "Prêt",       className: "bg-amber-900/40 text-amber-300" },
}

/** @type {Record<string, {label: string, className: string}>} */
const STATUS_CONFIG = {
  pending:    { label: "En attente", className: "bg-yellow-900/40 text-yellow-300" },
  responded:  { label: "Répondue",   className: "bg-green-900/40 text-green-300" },
  closed:     { label: "Fermée",     className: "bg-kcb-ardoise text-kcb-pierre" },
}

/** Valeur sentinel pour "Tous" dans les filtres. */
const ALL = "all"

/**
 * Badge de purpose d'une demande de sourcing.
 *
 * @param {{ purpose: string }} props
 * @returns {JSX.Element}
 */
function PurposeBadge({ purpose }) {
  const cfg = PURPOSE_CONFIG[purpose] ?? { label: purpose, className: "bg-kcb-ardoise text-kcb-pierre" }
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

/**
 * Badge de statut d'une demande de sourcing.
 *
 * @param {{ status: string }} props
 * @returns {JSX.Element}
 */
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, className: "bg-kcb-ardoise text-kcb-pierre" }
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

/**
 * Formate une date ISO en date courte française.
 *
 * @param {string} isoDate
 * @returns {string}
 */
function formatDate(isoDate) {
  if (!isoDate) return "—"
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate))
}

/**
 * Carte individuelle d'une demande de sourcing.
 * Inclut un panneau d'expansion pour répondre (simulé côté UI).
 *
 * @param {{ inquiry: object }} props
 * @returns {JSX.Element}
 */
function InquiryCard({ inquiry }) {
  const [expanded, setExpanded] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [sent, setSent] = useState(false)

  const handleSend = useCallback(() => {
    if (!replyText.trim()) return
    // Simulation — pas d'API de réponse exposée pour l'instant
    setSent(true)
    setReplyText("")
  }, [replyText])

  return (
    <div className="rounded-[4px] border border-white/[0.06] bg-[#13161e] overflow-hidden transition-colors duration-200 hover:border-white/[0.06]">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4">
        {/* Artwork + requester */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {inquiry.artworkTitle || `Œuvre #${inquiry.artworkId?.slice(-6) ?? "—"}`}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            <span className="text-xs text-kcb-pierre">
              {inquiry.buyerName || "Acheteur inconnu"}
            </span>
            {inquiry.organization && (
              <span className="text-xs text-kcb-pierre">· {inquiry.organization}</span>
            )}
            {inquiry.budget != null && (
              <span className="text-xs text-kcb-or font-medium">
                Budget : {Number(inquiry.budget).toLocaleString("fr-FR")} CFA
              </span>
            )}
          </div>
          {/* Message preview */}
          {inquiry.message && (
            <p className="text-xs text-kcb-pierre mt-1.5 line-clamp-2 italic">
              "{inquiry.message}"
            </p>
          )}
        </div>

        {/* Badges + date + toggle */}
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <PurposeBadge purpose={inquiry.purpose} />
          <StatusBadge status={inquiry.status} />
          <span className="text-xs text-kcb-pierre">{formatDate(inquiry.createdAt)}</span>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs text-kcb-or hover:text-kcb-or/80 transition-colors ml-2"
            aria-label={expanded ? "Replier" : "Répondre"}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Répondre
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expansion — zone de réponse */}
      {expanded && (
        <div className="border-t border-white/[0.06] px-4 py-4 space-y-3">
          {sent ? (
            <p className="text-sm text-green-400 font-medium">
              Réponse envoyée.
            </p>
          ) : (
            <>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Répondre à ${inquiry.buyerName || "ce demandeur"}…`}
                rows={3}
                className="w-full rounded-[4px] border border-white/[0.06] bg-kcb-ardoise text-kcb-sable text-sm placeholder-kcb-pierre px-3 py-2 focus:outline-none focus:border-kcb-or resize-none transition-colors"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSend}
                  disabled={!replyText.trim()}
                  className="flex items-center gap-2 rounded-[4px] bg-kcb-or hover:bg-kcb-or/90 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 transition-colors duration-200"
                >
                  <Send className="w-3.5 h-3.5" />
                  Envoyer
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Onglet Sourcing du dashboard professionnel.
 *
 * Affiche les demandes de mise en relation reçues par le professionnel,
 * avec KPIs, filtres par statut et purpose, et possibilité de répondre.
 *
 * @returns {JSX.Element}
 */
export function SourcingTab() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState(ALL)
  const [filterPurpose, setFilterPurpose] = useState(ALL)

  useEffect(() => {
    let cancelled = false

    const fetchInquiries = async () => {
      setLoading(true)
      setError(null)
      const data = await getMyInquiries()
      if (cancelled) return
      if (data?.error) {
        setError(data.error)
      } else {
        setInquiries(Array.isArray(data) ? data : [])
      }
      setLoading(false)
    }

    fetchInquiries()
    return () => { cancelled = true }
  }, [])

  // KPIs
  const total     = inquiries.length
  const pending   = inquiries.filter((i) => i.status === "pending").length
  const responded = inquiries.filter((i) => i.status === "responded").length
  const closed    = inquiries.filter((i) => i.status === "closed").length

  // Filtres appliqués
  const filtered = inquiries.filter((inquiry) => {
    const matchStatus  = filterStatus  === ALL || inquiry.status  === filterStatus
    const matchPurpose = filterPurpose === ALL || inquiry.purpose === filterPurpose
    const matchSearch  = !search.trim() ||
      inquiry.artworkTitle?.toLowerCase().includes(search.toLowerCase()) ||
      inquiry.buyerName?.toLowerCase().includes(search.toLowerCase()) ||
      inquiry.organization?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchPurpose && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white">Demandes de sourcing</h2>
        <p className="text-sm text-kcb-pierre mt-1">
          Demandes de mise en relation reçues pour vos œuvres.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          icon={Inbox}
          label="Total demandes"
          value={total}
          iconColor="text-kcb-or"
          iconBgColor="bg-kcb-or/10"
          loading={loading}
        />
        <KPICard
          icon={MessageSquare}
          label="En attente"
          value={pending}
          iconColor="text-yellow-400"
          iconBgColor="bg-yellow-900/20"
          loading={loading}
        />
        <KPICard
          icon={MessageSquare}
          label="Répondues"
          value={responded}
          iconColor="text-green-400"
          iconBgColor="bg-green-900/20"
          loading={loading}
        />
        <KPICard
          icon={Filter}
          label="Fermées"
          value={closed}
          iconColor="text-kcb-pierre"
          iconBgColor="bg-kcb-ardoise"
          loading={loading}
        />
      </div>

      {/* Filtres + recherche */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kcb-pierre pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par œuvre, demandeur, organisation…"
            className="w-full rounded-[4px] border border-white/[0.06] bg-kcb-ardoise text-kcb-sable text-sm placeholder-kcb-pierre pl-9 pr-4 py-2 focus:outline-none focus:border-kcb-or transition-colors"
          />
        </div>

        {/* Filtre statut */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kcb-pierre pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none rounded-[4px] border border-white/[0.06] bg-kcb-ardoise text-kcb-sable text-sm pl-9 pr-8 py-2 focus:outline-none focus:border-kcb-or transition-colors cursor-pointer"
          >
            <option value={ALL}>Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="responded">Répondues</option>
            <option value="closed">Fermées</option>
          </select>
        </div>

        {/* Filtre purpose */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kcb-pierre pointer-events-none" />
          <select
            value={filterPurpose}
            onChange={(e) => setFilterPurpose(e.target.value)}
            className="appearance-none rounded-[4px] border border-white/[0.06] bg-kcb-ardoise text-kcb-sable text-sm pl-9 pr-8 py-2 focus:outline-none focus:border-kcb-or transition-colors cursor-pointer"
          >
            <option value={ALL}>Tous les types</option>
            <option value="purchase">Achat</option>
            <option value="exhibition">Exposition</option>
            <option value="research">Recherche</option>
            <option value="loan">Prêt</option>
          </select>
        </div>
      </div>

      {/* Contenu */}
      {loading && (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-kcb-or animate-spin" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-[4px] border border-red-800 bg-red-900/20 p-4 text-sm text-red-300">
          Impossible de charger les demandes : {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-kcb-pierre space-y-2">
          <Inbox className="w-10 h-10 opacity-40" />
          <p className="text-sm">
            {inquiries.length === 0
              ? "Aucune demande de sourcing reçue pour l'instant."
              : "Aucune demande ne correspond à vos filtres."}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((inquiry) => (
            <InquiryCard key={inquiry._id} inquiry={inquiry} />
          ))}
        </div>
      )}
    </div>
  )
}
