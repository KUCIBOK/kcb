import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ShieldCheck, ShieldX, Loader2, ExternalLink } from "lucide-react"
import { verifyArtwork } from "../api/useArtworks"

export default function VerifyArtwork() {
  const { kuciobkId } = useParams()
  const [state, setState] = useState("loading") // "loading" | "verified" | "unverified" | "error"
  const [artwork, setArtwork] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!kuciobkId) {
      setState("error")
      setErrorMsg("Identifiant manquant.")
      return
    }

    verifyArtwork(kuciobkId).then((data) => {
      if (data?.error) {
        setState("error")
        setErrorMsg(data.error)
      } else if (data?.verified === true) {
        setState("verified")
        setArtwork(data)
      } else {
        setState("unverified")
        setArtwork(data)
      }
    })
  }, [kuciobkId])

  return (
    <div className="min-h-screen bg-kcb-noir-deep flex flex-col">
      {/* Header minimal */}
      <header className="bg-kcb-noir border-b border-white/[0.06] px-6 py-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <img src="/images/kucibok-white-logo.svg" alt="Kucibok" className="w-7" />
          <span className="font-bold text-kcb-or text-lg tracking-wide">KUCIBOK</span>
        </Link>
      </header>

      {/* Contenu */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Loading */}
          {state === "loading" && (
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-kcb-or animate-spin mx-auto mb-4" />
              <p className="text-kcb-pierre text-sm">Vérification en cours…</p>
            </div>
          )}

          {/* Certifiée */}
          {state === "verified" && artwork && (
            <div className="bg-kcb-ardoise rounded-[4px] border border-kcb-or/30 shadow-lg overflow-hidden">
              {/* Bandeau or */}
              <div className="bg-kcb-or px-6 py-5 text-kcb-noir text-center">
                <ShieldCheck className="w-10 h-10 mx-auto mb-2" />
                <p className="font-bold text-lg tracking-wide uppercase">Œuvre Certifiée</p>
                <p className="text-sm opacity-85 mt-1">Standard Kucibok</p>
              </div>

              {/* Identifiant */}
              <div className="px-6 py-4 bg-kcb-noir border-b border-white/[0.06] text-center">
                <span className="font-jetbrains text-kcb-or font-bold text-lg tracking-widest">
                  {artwork.kucibok_id}
                </span>
              </div>

              {/* Détails */}
              <div className="px-6 py-5 space-y-3">
                <Row label="Titre" value={artwork.title} />
                <Row label="Artiste" value={artwork.artist} />
                <Row label="Catégorie" value={artwork.category} />
                {artwork.medium && <Row label="Médium" value={artwork.medium} />}
                {artwork.dimensions && <Row label="Dimensions" value={artwork.dimensions} />}
                {artwork.certifiedAt && (
                  <Row
                    label="Certifié le"
                    value={new Date(artwork.certifiedAt).toLocaleDateString("fr-FR", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  />
                )}
              </div>

              {/* Lien certificat */}
              {artwork.certificateUrl && (
                <div className="px-6 pb-6">
                  <a
                    href={artwork.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-[4px] bg-kcb-or text-kcb-noir text-sm font-semibold hover:bg-kcb-bronze transition-colors uppercase tracking-[0.05em]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir le certificat PDF
                  </a>
                </div>
              )}

              <div className="px-6 pb-5 text-center text-xs text-kcb-pierre">
                Ce document atteste de l'authenticité de l'œuvre selon le Standard Kucibok.
              </div>
            </div>
          )}

          {/* Non certifiée */}
          {state === "unverified" && (
            <div className="bg-kcb-ardoise rounded-[4px] border border-amber-500/30 shadow-lg overflow-hidden">
              <div className="bg-amber-900/30 px-6 py-5 text-center border-b border-amber-500/20">
                <ShieldX className="w-10 h-10 mx-auto mb-2 text-amber-400" />
                <p className="font-bold text-amber-400 text-lg">Non encore certifiée</p>
              </div>
              <div className="px-6 py-6 text-center">
                <p className="text-sm text-kcb-sable">{artwork?.message || "Cette œuvre n'a pas encore été validée par Kucibok."}</p>
                <p className="text-xs text-kcb-pierre mt-3 font-jetbrains">{kuciobkId}</p>
              </div>
            </div>
          )}

          {/* Erreur / introuvable */}
          {state === "error" && (
            <div className="bg-kcb-ardoise rounded-[4px] border border-red-500/30 shadow-lg overflow-hidden">
              <div className="bg-red-900/30 px-6 py-5 text-center border-b border-red-500/20">
                <ShieldX className="w-10 h-10 mx-auto mb-2 text-red-400" />
                <p className="font-bold text-red-400 text-lg">Identifiant introuvable</p>
              </div>
              <div className="px-6 py-6 text-center">
                <p className="text-sm text-kcb-sable">{errorMsg || "Cet identifiant ne correspond à aucune œuvre enregistrée."}</p>
                <p className="text-xs text-kcb-pierre mt-3 font-jetbrains">{kuciobkId}</p>
              </div>
            </div>
          )}

          {/* Retour */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-kcb-or hover:text-kcb-bronze transition">
              ← Retour à kucibok.com
            </Link>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="text-center py-4 text-xs text-kcb-pierre/60 border-t border-white/[0.06]">
        Kucibok — Standard de certification de l'art africain
      </footer>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-3 text-sm">
      <span className="text-kcb-pierre font-medium shrink-0">{label}</span>
      <span className="text-white font-semibold text-right">{value}</span>
    </div>
  )
}
