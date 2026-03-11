import { ChevronLeft, ChevronRight, Image, Search } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DefineAuctionAction } from "./DefineAuctionAction";

export const AuctionsList = ({ artworks, user }) => {
  const navigate = useNavigate();
  const filteredAuctions = Array.isArray(artworks)
    ? artworks.filter((artwork) => artwork.auctionStatus === "auction_ongoing")
    : [];

  const [state, setState] = useState({
    set: filteredAuctions.slice(0, 40),
    artworks: filteredAuctions,
  });

  useEffect(() => {
    const updateState = () => {
      setState({
        set: filteredAuctions.slice(0, 40),
        artworks: filteredAuctions,
      });
    };
    updateState();
  }, [artworks]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const query = search.trim().toLowerCase();
    let filtered = filteredAuctions;
    if (query !== "") {
      filtered = filteredAuctions.filter((artwork) => {
        const titleMatch = artwork.title?.toLowerCase().includes(query);
        const artistMatch = artwork.artist?.toLowerCase().includes(query);
        return titleMatch || artistMatch;
      });
    }
    setState({
      set: filtered.slice(0, 40),
      artworks: filtered,
    });
  }, [search, artworks]);

  return (
    <div>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          className="w-full max-w-9/10 rounded-s-md border-y border-s border-gray-700 bg-background px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
          placeholder="Rechercher une œuvre ou un artiste..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="w-full max-w-1/10 rounded-e-md border-y border-e border-gray-700 bg-background px-3 py-2.5 text-sm text-gray-200">
          <Search className="w-4 h-4" />
        </span>
      </div>

      <div className="overflow-x-auto bg-background border border-gray-800 rounded-xl px-4 py-4 shadow-sm">
        {state?.set?.length >= 1 ? (
          <table className="w-full text-xs text-gray-200">
            <thead>
              <tr className="border-b border-gray-800">
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
                  <tr className="border-b border-gray-800 hover:bg-background/60 transition">
                    <td className="py-2">
                      <div className="h-10 w-10 rounded-md bg-gray-800 flex items-center justify-center overflow-hidden">
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
                    <td className="py-2 text-gray-300 truncate max-w-[120px]">
                      {artwork.artist}
                    </td>
                    <td className="py-2 text-gray-400">
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
          <div className="text-center py-16 border border-gray-800 border-dashed rounded-xl w-full bg-background/60">
            <Image className="h-10 w-10 mx-auto mb-4 text-gray-600" />
            <h3 className="font-medium text-base text-gray-400 mb-1">
              Aucune œuvre en enchère trouvée
            </h3>
          </div>
        )}
      </div>

      {state.artworks.length > 5 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 bg-transparent hover:bg-gray-800 transition"
            onClick={() => {
              if (state.set[0] !== state.artworks[0]) {
                const startIndex = state.artworks.indexOf(state.set[0]) - 40;
                setState({
                  ...state,
                  set: state.artworks.slice(startIndex, startIndex + 40),
                });
              }
            }}
            disabled={state.set[0] === state.artworks[0]}
          >
            <ChevronLeft className="w-4 h-4 mr-1 inline-block" /> Précédent
          </button>
          <span className="text-xs text-gray-400 flex items-center px-2">
            Page {Math.floor(state.artworks.indexOf(state.set[0]) / 40) + 1} /{" "}
            {Math.ceil(state.artworks.length / 40)}
          </span>
          <button
            className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 bg-transparent hover:bg-gray-800 transition"
            onClick={() => {
              const lastIndex = state.artworks.indexOf(
                state.set[state.set.length - 1]
              );
              if (lastIndex < state.artworks.length - 1) {
                setState({
                  ...state,
                  set: state.artworks.slice(lastIndex + 1, lastIndex + 41),
                });
              }
            }}
            disabled={
              state.set[state.set.length - 1] ===
              state.artworks[state.artworks.length - 1]
            }
          >
            Suivant <ChevronRight className="w-4 h-4 ml-1 inline-block" />
          </button>
        </div>
      )}
    </div>
  );
};
