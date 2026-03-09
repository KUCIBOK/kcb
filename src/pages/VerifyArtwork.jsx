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
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {/* Header minimal */}
      <header className="bg-white border-b border-[#e8dcc6] px-6 py-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <img src="/images/kucibok-white-logo.svg" alt="Kucibok" className="w-7 invert" />
          <span className="font-bold text-[#8b4513] text-lg tracking-wide">KUCIBOK</span>
        </Link>
      </header>

      {/* Contenu */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Loading */}
          {state === "loading" && (
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-[#cd853f] animate-spin mx-auto mb-4" />
              <p className="text-[#a0522d] text-sm">Vérification en cours…</p>
            </div>
          )}

          {/* Certifiée */}
          {state === "verified" && artwork && (
            <div className="bg-white rounded-2xl border-2 border-[#cd853f]/40 shadow-lg overflow-hidden">
              {/* Bandeau vert */}
              <div className="bg-gradient-to-r from-[#8b4513] to-[#cd853f] px-6 py-5 text-white text-center">
                <ShieldCheck className="w-10 h-10 mx-auto mb-2" />
                <p className="font-bold text-lg tracking-wide">ŒUVRE CERTIFIÉE</p>
                <p className="text-sm opacity-85 mt-1">Standard Kucibok</p>
              </div>

              {/* Identifiant */}
              <div className="px-6 py-4 bg-[#fdf9f5] border-b border-[#e8dcc6] text-center">
                <span className="font-mono text-[#8b4513] font-bold text-lg tracking-widest">
                  {artwork.kuciobkId}
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
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#8b4513] text-white text-sm font-semibold hover:bg-[#a0522d] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir le certificat PDF
                  </a>
                </div>
              )}

              <div className="px-6 pb-5 text-center text-xs text-[#a0522d]/70">
                Ce document atteste de l'authenticité de l'œuvre selon le Standard Kucibok.
              </div>
            </div>
          )}

          {/* Non certifiée */}
          {state === "unverified" && (
            <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-lg overflow-hidden">
              <div className="bg-amber-50 px-6 py-5 text-center border-b border-amber-200">
                <ShieldX className="w-10 h-10 mx-auto mb-2 text-amber-500" />
                <p className="font-bold text-amber-700 text-lg">Non encore certifiée</p>
              </div>
              <div className="px-6 py-6 text-center">
                <p className="text-sm text-gray-600">{artwork?.message || "Cette œuvre n'a pas encore été validée par Kucibok."}</p>
                <p className="text-xs text-gray-400 mt-3 font-mono">{kuciobkId}</p>
              </div>
            </div>
          )}

          {/* Erreur / introuvable */}
          {state === "error" && (
            <div className="bg-white rounded-2xl border-2 border-red-200 shadow-lg overflow-hidden">
              <div className="bg-red-50 px-6 py-5 text-center border-b border-red-200">
                <ShieldX className="w-10 h-10 mx-auto mb-2 text-red-400" />
                <p className="font-bold text-red-600 text-lg">Identifiant introuvable</p>
              </div>
              <div className="px-6 py-6 text-center">
                <p className="text-sm text-gray-600">{errorMsg || "Cet identifiant ne correspond à aucune œuvre enregistrée."}</p>
                <p className="text-xs text-gray-400 mt-3 font-mono">{kuciobkId}</p>
              </div>
            </div>
          )}

          {/* Retour */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-[#a0522d] hover:underline">
              ← Retour à kucibok.com
            </Link>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="text-center py-4 text-xs text-[#a0522d]/60 border-t border-[#e8dcc6]">
        Kucibok — Standard de certification de l'art africain
      </footer>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-3 text-sm">
      <span className="text-[#a0522d] font-medium shrink-0">{label}</span>
      <span className="text-[#2c1810] font-semibold text-right">{value}</span>
    </div>
  )
}
