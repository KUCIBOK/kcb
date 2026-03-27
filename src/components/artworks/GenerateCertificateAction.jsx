import { Award, Download, Eye, Loader2 } from "lucide-react"
import { memo, useState } from "react"
import { utils } from "../../api/useAPI"
import { useToast } from "../../store/ToastContext"

/**
 * Colonne Certificat dans le tableau des œuvres.
 * - Œuvre non approuvée → "—"
 * - Approuvée + certificat existant → icônes Voir + Télécharger (selon rôle)
 * - Approuvée + pas de certificat + admin → bouton "Générer"
 * - Approuvée + pas de certificat + autre rôle → "En attente"
 */
export const GenerateCertificateAction = memo(({ artwork, user, onGenerated }) => {
  const { makeToast } = useToast()
  const [loading, setLoading] = useState(false)
  const certUrl = artwork?.certificatePath || artwork?.certificate_url

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${utils.api}/certificates/generate`, {
        ...utils.options,
        method: 'POST',
        body: JSON.stringify({ artwork_id: artwork?._id || artwork?.id }),
      })
      const data = await res.json()
      if (!res.ok) {
        makeToast('Erreur', 'danger', data?.error || 'Échec de la génération')
        return
      }
      makeToast('Certificat généré', 'success', artwork?.title)
      onGenerated?.(data)
    } catch (err) {
      makeToast('Erreur', 'danger', err.message)
    } finally {
      setLoading(false)
    }
  }

  if (artwork?.status !== 'approved') {
    return <span className="text-kcb-pierre text-xs">—</span>
  }

  if (certUrl) {
    return (
      <div className="flex items-center gap-1">
        <a
          href={certUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Voir le certificat"
          className="p-1 rounded text-kcb-or hover:text-kcb-bronze transition"
        >
          <Eye className="w-4 h-4" />
        </a>
        {(user?.role === 'admin' || user?.role === 'artist' || user?.role === 'curator') && (
          <a
            href={certUrl}
            download
            title="Télécharger le certificat PDF"
            className="p-1 rounded text-green-400 hover:text-green-300 transition"
          >
            <Download className="w-4 h-4" />
          </a>
        )}
      </div>
    )
  }

  if (user?.role === 'admin') {
    return (
      <button
        onClick={handleGenerate}
        disabled={loading}
        title="Générer le certificat PDF"
        className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-kcb-or/10 border border-kcb-or/30 text-kcb-or hover:bg-kcb-or/20 transition disabled:opacity-50 whitespace-nowrap"
      >
        {loading
          ? <Loader2 className="w-3 h-3 animate-spin" />
          : <Award className="w-3 h-3" />
        }
        {loading ? '...' : 'Générer'}
      </button>
    )
  }

  return <span className="text-kcb-pierre italic text-xs">En attente</span>
})
