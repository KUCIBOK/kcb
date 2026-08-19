import { ChevronLeft, ChevronRight, Image, Search } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DefineAuctionAction } from './DefineAuctionAction'

export const AuctionsList = ({ artworks, user }) => {
  const navigate = useNavigate()
  const filteredAuctions = Array.isArray(artworks)
    ? artworks.filter((artwork) => artwork.auctionStatus === 'auction_ongoing')
    : []

  const [state, setState] = useState({
    set: filteredAuctions.slice(0, 40),
    artworks: filteredAuctions,
  })

  useEffect(() => {
    const updateState = () => {
      setState({
        set: filteredAuctions.slice(0, 40),
        artworks: filteredAuctions,
      })
    }
    updateState()
  }, [artworks])

  const [search, setSearch] = useState('')

  useEffect(() => {
    const query = search.trim().toLowerCase()
    let filtered = filteredAuctions
    if (query !== '') {
      filtered = filteredAuctions.filter((artwork) => {
        const titleMatch = artwork.title?.toLowerCase().includes(query)
        const artistMatch = artwork.artist?.toLowerCase().includes(query)
        return titleMatch || artistMatch
      })
    }
    setState({
      set: filtered.slice(0, 40),
      artworks: filtered,
    })
  }, [search, artworks])

  return (
    <div>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          className="w-full max-w-9/10 rounded-s-md border-y border-s border-white/[0.06] bg-kcb-noir px-3 py-2 text-sm text-kcb-sable placeholder-kcb-pierre focus:outline-none"
          placeholder="Rechercher une œuvre ou un artiste..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="w-full max-w-1/10 rounded-e-md border-y border-e border-white/[0.06] bg-kcb-noir px-3 py-2.5 text-sm text-kcb-sable">
          <Search className="w-4 h-4" />
        </span>
      </div>

      <div className="overflow-x-auto bg-kcb-noir border border-white/[0.06] rounded-[4px] px-4 py-4 shadow-sm">
        {state?.set?.length >= 1 ? (
          <table className="w-full text-xs text-kcb-sable">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="font-semibold py-2 text-left">Aperçu</th>
                <th className="font-semibold py-2 text-left">Titre</th>
                <th className="font-semibold py-2 text-left">Artiste</th>
                <th className="font-semibold py-2 text-left">Créé</th>
                <th className="font-semibold py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {state?.set?.map((artwork, index) => (
                <Fragment key={index}>
                  <tr className="border-b border-white/[0.06] hover:bg-kcb-noir/60 transition">
                    <td className="py-2">
                      <div className="h-10 w-10 rounded-[4px] bg-kcb-ardoise flex items-center justify-center overflow-hidden">
                        <img
                          loading="lazy"
                          src={artwork.image}
                          alt={artwork.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-2 font-semibold text-white truncate max-w-[160px]">
                      {artwork.title}
                    </td>
                    <td className="py-2 text-kcb-sable truncate max-w-[120px]">{artwork.artist}</td>
                    <td className="py-2 text-kcb-pierre">
                      {new Date(artwork.created).toLocaleDateString()}
                    </td>
                    <td className="py-2">
                      <DefineAuctionAction artwork={artwork} />
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16 border border-white/[0.06] border-dashed rounded-[4px] w-full bg-kcb-noir/60">
            <Image className="h-10 w-10 mx-auto mb-4 text-kcb-pierre" />
            <h3 className="font-medium text-base text-kcb-pierre mb-1">
              Aucune œuvre en enchère trouvée
            </h3>
          </div>
        )}
      </div>

      {state.artworks.length > 5 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="rounded-[4px] border border-white/[0.06] px-4 py-2 text-sm text-kcb-sable bg-transparent hover:bg-kcb-ardoise transition"
            onClick={() => {
              if (state.set[0] !== state.artworks[0]) {
                const startIndex = state.artworks.indexOf(state.set[0]) - 40
                setState({
                  ...state,
                  set: state.artworks.slice(startIndex, startIndex + 40),
                })
              }
            }}
            disabled={state.set[0] === state.artworks[0]}
          >
            <ChevronLeft className="w-4 h-4 mr-1 inline-block" /> Précédent
          </button>
          <span className="text-xs text-kcb-pierre flex items-center px-2">
            Page {Math.floor(state.artworks.indexOf(state.set[0]) / 40) + 1} /{' '}
            {Math.ceil(state.artworks.length / 40)}
          </span>
          <button
            className="rounded-[4px] border border-white/[0.06] px-4 py-2 text-sm text-kcb-sable bg-transparent hover:bg-kcb-ardoise transition"
            onClick={() => {
              const lastIndex = state.artworks.indexOf(state.set[state.set.length - 1])
              if (lastIndex < state.artworks.length - 1) {
                setState({
                  ...state,
                  set: state.artworks.slice(lastIndex + 1, lastIndex + 41),
                })
              }
            }}
            disabled={state.set[state.set.length - 1] === state.artworks[state.artworks.length - 1]}
          >
            Suivant <ChevronRight className="w-4 h-4 ml-1 inline-block" />
          </button>
        </div>
      )}
    </div>
  )
}
