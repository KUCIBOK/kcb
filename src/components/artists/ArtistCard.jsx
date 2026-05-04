import { Link } from 'react-router-dom'
import { memo, useEffect, useState } from 'react'
import { getArtistForSaleArtworks } from '../../api/useArtworks'

export const ArtistCard = memo(({ artist }) => {
  const { id, name, image, country, coverImage } = artist
  const [artworks, setArtworks] = useState([])

  useEffect(() => {
    let mounted = true
    const fetchArtworks = async () => {
      const set = await getArtistForSaleArtworks(id)
      if (mounted) setArtworks(set)
    }
    fetchArtworks()
    return () => {
      mounted = false
    }
  }, [id])

  return (
    <Link
      to={`/artist/${id}`}
      className="group block rounded-[4px] bg-kcb-ardoise border border-white/[0.06] hover:shadow-lg transition overflow-hidden"
    >
      {/* Cover or Artworks Preview */}
      <div className="h-32 bg-kcb-noir relative overflow-hidden">
        {coverImage ? (
          <img
            loading="lazy"
            src={coverImage}
            alt={name + ' cover'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : artworks?.length > 0 ? (
          <div className="grid grid-cols-3 h-full">
            {artworks?.slice(0, 3)?.map((artwork) => (
              <div key={artwork.id} className="overflow-hidden">
                <img
                  loading="lazy"
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder-artwork.svg'
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full ">
            <div className="flex flex-col items-center justify-center h-full text-kcb-pierre">
              <svg
                width="36"
                height="36"
                fill="none"
                viewBox="0 0 24 24"
                className="mb-2 opacity-60"
              >
                <rect x="3" y="3" width="18" height="18" rx="4" fill="#2a2520" />
                <path d="M8 14l2.5-3 3.5 4.5 2-2.5 3 4.5H5l3-3.5z" fill="#6B7280" />
                <circle cx="8" cy="8" r="2" fill="#6B7280" />
              </svg>
              <span className="text-xs">Aucune œuvre à afficher</span>
            </div>
          </div>
        )}
      </div>
      {/* Artist Info */}
      <div className="p-4 pt-6 md:pt-12 relative">
        {/* Profile Image */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 md:w-20 md:h-20 w-15 h-15 rounded-full border-4 border-kcb-ardoise overflow-hidden shadow-md bg-kcb-noir">
          <img
            src={image || '/profile-placeholder.svg'}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="text-center md:mt-2">
          <h3 className="font-semibold text-lg text-white truncate">{name}</h3>
          <p className="text-xs text-kcb-pierre mt-1">{country}</p>
          <div className="mt-2 inline-block bg-kcb-noir/70 px-3 py-1 rounded-[2px] text-xs text-kcb-sable">
            {artworks?.length || 0} {artworks.length === 1 ? 'œuvre' : 'œuvres'}
          </div>
        </div>
      </div>
    </Link>
  )
})
