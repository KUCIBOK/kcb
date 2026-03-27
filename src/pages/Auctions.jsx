import { useEffect, useState } from 'react'
import { AlertCircle, Clock, Gavel, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CountdownTimer } from '../components/auction/CountdownTimer'
import { SkeletonCard, EmptyState } from '../components/ui'

export default function Auctions() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await fetch('/api/auction/ongoing')
        if (!res.ok) {
          throw new Error(`Erreur ${res.status}`)
        }
        const data = await res.json()
        setAuctions(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        setError('Impossible de charger les enchères. Veuillez réessayer plus tard.')
      } finally {
        setLoading(false)
      }
    }

    fetchAuctions()
    // Rafraîchir les enchères toutes les minutes
    const interval = setInterval(fetchAuctions, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="mx-auto px-4 md:px-6 flex-grow pb-16 mt-8">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl mb-2 text-white">Enchères en cours</h1>
          <p className="text-kcb-pierre text-lg mt-2">
            Découvrez des œuvres uniques et participez aux enchères
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} hasImage />
          ))}
        </div>
      </div>
    )
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming':
        return 'À venir'
      case 'ongoing':
        return 'Enchère en cours'
      case 'ended':
        return 'Terminée'
      case 'cancelled':
        return 'Annulée'
      default:
        return status
    }
  }

  return (
    <div className="mx-auto px-4 md:px-6 flex-grow pb-16 mt-8">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl md:text-5xl mb-2 text-white">Enchères en cours</h1>
        <p className="text-kcb-pierre text-lg mt-2">
          Découvrez des œuvres uniques et participez aux enchères
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-900/20 border border-red-800 text-red-300 rounded-[4px] px-4 py-3 mb-8 max-w-lg mx-auto text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {!error && auctions.length === 0 ? (
        <EmptyState
          icon={Gavel}
          title="Aucune enchère en cours"
          description="Il n'y a actuellement aucune enchère active. Revenez plus tard !"
          actionLabel="Explorer les œuvres"
          onAction={() => (window.location.href = '/africa/catalogue')}
        />
      ) : (
        !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {auctions.map((auction) => {
              const artworkTitle = auction.artwork?.title || 'Titre inconnu'
              const artworkImage = auction.artwork?.image || ''
              const sellerName = auction.seller?.name || 'Vendeur inconnu'

              return (
                <div
                  key={auction._id}
                  className="bg-kcb-ardoise/50 rounded-[4px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/[0.06]"
                >
                  <div className="aspect-square bg-kcb-noir relative">
                    {/* Placeholder pour l'image de l'œuvre - à remplacer par l'image réelle */}
                    <div className="w-full h-full flex items-center justify-center text-kcb-pierre">
                      {artworkImage ? (
                        <img
                          src={artworkImage}
                          alt={artworkTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-20 h-20"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
                      <Gavel className="w-4 h-4 mr-1" />
                      <span>{getStatusLabel(auction.status)}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-white mb-2 truncate">
                      {artworkTitle}
                    </h2>

                    <div className="flex justify-between items-center mb-3">
                      <div className="text-2xl font-bold text-white">
                        {auction.currentPrice?.toLocaleString('fr-FR')} FCFA
                      </div>
                      <div className="text-sm text-kcb-pierre flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <CountdownTimer endTime={auction.endTime} />
                      </div>
                    </div>

                    <div className="flex items-center text-kcb-pierre text-sm mb-4">
                      <User className="w-4 h-4 mr-1" />
                      <span>Vendeur: {sellerName}</span>
                    </div>

                    <Link
                      to={`/auction/${auction._id}`}
                      className="w-full block text-center bg-gradient hover:opacity-90 text-white py-2 px-4 rounded-[4px] transition"
                    >
                      Participer
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}
