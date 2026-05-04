import { useState, useMemo } from 'react'
import { ShieldCheck, Shield, ExternalLink, Info, FileQuestion } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useArtworks } from '../../store/ArtworkContext'
import { KPICard } from '../ui'

/** Badge de statut d'approbation de l'œuvre. */
function ArtworkStatusBadge({ status }) {
  const CONFIG = {
    approved: {
      label: 'Approuvée',
      className: 'bg-green-500/20 text-green-400 border-green-500/30',
    },
    pending: {
      label: 'En attente',
      className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    },
    rejected: { label: 'Refusée', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  }
  const cfg = CONFIG[status] ?? {
    label: status,
    className: 'bg-gray-500/20 text-kcb-pierre border-gray-500/30',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}
    >
      {cfg.label}
    </span>
  )
}

/** Filtre de sélection du statut KCB. */
const KCB_FILTERS = [
  { value: 'all', label: 'Toutes' },
  { value: 'certified', label: 'Certifiées' },
  { value: 'uncertified', label: 'Non certifiées' },
]

/**
 * Onglet suivi de certification Standard Kucibok (KCB) pour le dashboard Artiste.
 * Liste les œuvres avec leur identifiant KCB et leur statut de certification.
 *
 * @returns {JSX.Element}
 */
export function ArtistCertificationTab() {
  const { myArtworks } = useArtworks()

  const [filter, setFilter] = useState('all')

  const artworks = myArtworks ?? []

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const total = artworks.length
  const certified = useMemo(() => artworks.filter((a) => !!a.kucibok_id).length, [artworks])
  const pendingCert = useMemo(
    () => artworks.filter((a) => a.status === 'pending').length,
    [artworks]
  )
  const uncertified = useMemo(() => artworks.filter((a) => !a.kucibok_id).length, [artworks])

  // ── Filtrage ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (filter === 'certified') return artworks.filter((a) => !!a.kucibok_id)
    if (filter === 'uncertified') return artworks.filter((a) => !a.kucibok_id)
    return artworks
  }, [artworks, filter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-kcb-or/10 text-kcb-or p-2.5 rounded-[4px]">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Certification KCB</h2>
          <p className="text-sm text-kcb-pierre">Suivi du Standard Kucibok pour vos œuvres</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Shield}
          label="Total œuvres"
          value={total}
          iconColor="text-kcb-pierre"
          iconBgColor="bg-kcb-ardoise/40"
        />
        <KPICard
          icon={ShieldCheck}
          label="Certifiées KCB"
          value={certified}
          iconColor="text-green-400"
          iconBgColor="bg-green-900/20"
        />
        <KPICard
          icon={Shield}
          label="En attente"
          value={pendingCert}
          iconColor="text-yellow-400"
          iconBgColor="bg-yellow-900/20"
        />
        <KPICard
          icon={FileQuestion}
          label="Non certifiées"
          value={uncertified}
          iconColor="text-kcb-pierre"
          iconBgColor="bg-kcb-ardoise/40"
        />
      </div>

      {/* Section info Standard Kucibok */}
      <div className="bg-kcb-or/5 border border-kcb-or/20 rounded-[4px] p-5 flex items-start gap-3">
        <Info className="w-5 h-5 text-kcb-or shrink-0 mt-0.5" />
        <div>
          <h4 className="text-white font-semibold text-sm mb-1">
            Qu'est-ce que le Standard Kucibok ?
          </h4>
          <p className="text-kcb-pierre text-sm leading-relaxed">
            Le Standard Kucibok (KCB) est un identifiant unique et infalsifiable attribué à chaque
            œuvre d'art africaine certifiée sur la plateforme. Il garantit l'authenticité, la
            traçabilité de provenance et permet une vérification publique via QR code.
          </p>
          <Link
            to="/verify"
            className="inline-flex items-center gap-1.5 text-kcb-or hover:text-kcb-or/80 text-sm font-medium mt-2 transition-colors"
          >
            En savoir plus sur la vérification
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Liste des œuvres */}
      <div className="bg-[#13161e] border border-white/[0.06] rounded-[4px] overflow-hidden">
        {/* Filtres */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] flex-wrap gap-3">
          <h3 className="text-white font-semibold">Mes œuvres</h3>
          <div className="flex gap-1 bg-kcb-ardoise/60 rounded-[4px] p-1">
            {KCB_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filter === f.value
                    ? 'bg-kcb-or text-kcb-noir'
                    : 'text-kcb-pierre hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center px-6">
            <Shield className="w-10 h-10 text-kcb-pierre mb-3" />
            <p className="text-kcb-pierre font-medium">Aucune œuvre dans cette catégorie</p>
            {filter === 'certified' && (
              <p className="text-kcb-pierre text-sm mt-1">
                Vous n'avez pas encore d'œuvre certifiée KCB.
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {/* En-tête du tableau */}
            <div className="hidden sm:grid grid-cols-12 px-6 py-3 bg-white/[0.04]">
              <span className="col-span-5 text-xs font-medium text-kcb-pierre uppercase tracking-wide">
                Titre
              </span>
              <span className="col-span-3 text-xs font-medium text-kcb-pierre uppercase tracking-wide">
                Statut
              </span>
              <span className="col-span-4 text-xs font-medium text-kcb-pierre uppercase tracking-wide">
                Identifiant KCB
              </span>
            </div>

            {filtered.map((artwork) => (
              <div
                key={artwork._id}
                className="grid grid-cols-1 sm:grid-cols-12 px-6 py-4 gap-2 sm:gap-0 items-start sm:items-center hover:bg-white/[0.04] transition-colors"
              >
                {/* Titre */}
                <div className="sm:col-span-5">
                  <p className="text-white text-sm font-medium truncate">{artwork.title}</p>
                </div>

                {/* Statut artwork */}
                <div className="sm:col-span-3">
                  <ArtworkStatusBadge status={artwork.status} />
                </div>

                {/* KCB ID */}
                <div className="sm:col-span-4">
                  {artwork.kucibok_id ? (
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                      <Link
                        to={`/verify/${artwork.kucibok_id}`}
                        className="text-green-400 hover:text-green-300 text-xs font-mono font-medium flex items-center gap-1 transition-colors"
                      >
                        {artwork.kucibok_id}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-kcb-pierre shrink-0" />
                      <span className="text-kcb-pierre text-xs">Non certifiée</span>
                      {artwork.status === 'approved' && (
                        <Link
                          to="/dashboard/submit-artwork"
                          className="text-kcb-or hover:text-kcb-or/80 text-xs font-medium underline transition-colors"
                        >
                          Demander
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA pour les non-certifiées */}
      {uncertified > 0 && (
        <div className="bg-[#13161e] border border-white/[0.06] rounded-[4px] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h4 className="text-white font-semibold text-sm">
              {uncertified} œuvre{uncertified > 1 ? 's' : ''} non certifiée
              {uncertified > 1 ? 's' : ''}
            </h4>
            <p className="text-kcb-pierre text-sm mt-0.5">
              Soumettez vos œuvres pour obtenir un identifiant KCB et garantir leur authenticité sur
              la plateforme.
            </p>
          </div>
          <Link
            to="/dashboard/submit-artwork"
            className="inline-flex items-center gap-2 px-4 py-2 bg-kcb-or hover:bg-kcb-or/90 text-kcb-noir text-sm font-medium rounded-[4px] transition-colors shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            Soumettre une œuvre
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
