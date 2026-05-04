import { Link } from 'react-router-dom'
import { Gavel, Palette, Ruler, User } from 'lucide-react'

export default function AuctionArtworkInfo({ artwork }) {
  return (
    <>
      {/* Image */}
      <div className="bg-kcb-ardoise/50 rounded-[4px] overflow-hidden mb-6">
        <div className="aspect-square bg-kcb-ardoise relative">
          <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
            <Gavel className="w-4 h-4 mr-1" />
            <span>Enchère en cours</span>
          </div>
        </div>
      </div>

      {/* Détails */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{artwork.title}</h1>
          <Link
            to={`/artist/${artwork?.artist?._id || '#'}`}
            className="flex items-center text-kcb-pierre hover:text-white transition"
          >
            <User className="w-4 h-4 mr-1" />
            {artwork?.artist?.name || 'Artiste inconnu'}
          </Link>
        </div>

        <div className="bg-white/[0.04] p-4 rounded-[4px]">
          <p className="text-kcb-sable">{artwork.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Palette className="w-5 h-5 mr-2 text-kcb-pierre" />
            <div>
              <p className="text-xs text-kcb-pierre">Catégorie</p>
              <p className="text-white">{artwork.category}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Ruler className="w-5 h-5 mr-2 text-kcb-pierre" />
            <div>
              <p className="text-xs text-kcb-pierre">Dimensions</p>
              <p className="text-white">{artwork.width}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
