import { useEffect, useState } from 'react'
import { useAuth } from '../../store/AuthContext'
import { getMyShortlist, removeFromShortlist } from '../../api/useShortlist'
import { ShortlistIcon } from './ShortlistButton'

/**
 * MyShortlist — Dashboard component showing user's shortlisted artworks
 */
export function MyShortlist() {
  const { user } = useAuth()
  const [shortlist, setShortlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.id) return

    loadShortlist()
  }, [user?.id])

  const loadShortlist = async () => {
    setLoading(true)
    try {
      const result = await getMyShortlist(user.id)
      if (result.success) {
        setShortlist(result.data || [])
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (artworkId) => {
    try {
      const result = await removeFromShortlist(user.id, artworkId)
      if (result.success) {
        setShortlist((prev) => prev.filter((item) => item.artwork_id !== artworkId))
      }
    } catch (err) {
      console.error('Remove error:', err)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-900/50 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-400 text-sm">{error}</div>
  }

  if (shortlist.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No artworks saved yet</p>
        <p className="text-gray-500 text-sm mt-2">Explore the catalogue and save artworks to compare and track</p>
        <a href="/catalogue" className="mt-4 inline-block px-4 py-2 rounded bg-amber-900/20 border border-amber-700/30 text-amber-200 text-sm hover:bg-amber-900/40 transition-colors">
          Browse Catalogue
        </a>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">{shortlist.length} Artworks Saved</h2>
        <p className="text-sm text-gray-400 mt-1">Your curated selection for comparison and tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortlist.map((item) => {
          const artwork = item.artworks || item.artwork
          if (!artwork) return null

          return (
            <div key={item.id} className="group border border-gray-800 rounded overflow-hidden bg-gray-950/50 hover:border-gray-700 transition-colors">
              {/* Image */}
              {artwork.image_url && (
                <div className="aspect-square overflow-hidden bg-gray-900">
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">{artwork.title}</h3>
                    <p className="text-xs text-gray-400 truncate">{artwork.artist || 'Unknown artist'}</p>
                  </div>
                  <ShortlistIcon artworkId={artwork.id} size={18} />
                </div>

                {/* Details */}
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  {artwork.year && <p>Year: {artwork.year}</p>}
                  {artwork.medium && <p>Medium: {artwork.medium}</p>}
                  {artwork.price && <p className="text-amber-400">€{artwork.price}</p>}
                </div>

                {/* Notes */}
                {item.notes && (
                  <p className="text-xs text-gray-400 italic border-t border-gray-800 pt-2 mt-2">
                    {item.notes}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  <a
                    href={`/artwork/${artwork.id}`}
                    className="flex-1 text-xs px-2 py-1.5 rounded border border-gray-700 text-gray-300 hover:bg-gray-900/50 text-center transition-colors"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleRemove(item.artwork_id)}
                    className="flex-1 text-xs px-2 py-1.5 rounded bg-red-900/20 border border-red-700/30 text-red-300 hover:bg-red-900/40 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
