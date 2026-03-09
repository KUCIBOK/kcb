import { useEffect, useState } from "react";
import { useArtworks } from "../store/ArtworkContext";
import { Search } from "lucide-react";
import { Marketplace } from "../components/artworks/Marketplace";
import { Filters } from "../components/artworks/Filters";
import { DataLoader } from "../components/loaders/PageLoader";
import { useParams } from "react-router-dom";

export default function Explore() {
  const { forSale } = useArtworks();
  const { category } = useParams();
  const pageSize = 9;

  // Single state object for all filtering, search, and pagination
  const [state, setState] = useState({
    search: "",
    filters: {
      category: category || "all",
      minPrice: "",
      maxPrice: "",
      created: "all",
    },
    loading: true,
    artworks: [],
    set: [],
    page: 0,
  });

  // Filtering logic (search + filters)
  useEffect(() => {
    let filtered = forSale;
    // Category from URL param
    if (category && category !== "all") {
      filtered = filtered.filter((item) => item.category === category);
    }
    // Category from filter
    if (state.filters.category && state.filters.category !== "all") {
      filtered = filtered.filter(
        (item) => item.category === state.filters.category
      );
    }
    // Price
    if (state.filters.minPrice) {
      filtered = filtered.filter(
        (item) => item.price >= parseFloat(state.filters.minPrice)
      );
    }
    if (state.filters.maxPrice) {
      filtered = filtered.filter(
        (item) => item.price <= parseFloat(state.filters.maxPrice)
      );
    }
    // Created date
    if (state.filters.created && state.filters.created !== "all") {
      const now = new Date();
      let timeLimit;
      switch (state.filters.created) {
        case "last-24":
          timeLimit = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "last-7d":
          timeLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "last-30d":
          timeLimit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "last-90d":
          timeLimit = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          timeLimit = now;
      }
      filtered = filtered.filter((item) => new Date(item.created) >= timeLimit);
    }
    // Search
    if (state.search.trim() !== "") {
      const s = state.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(s) ||
          item.description?.toLowerCase().includes(s) ||
          item.tags?.toString().toLowerCase().includes(s)
      );
    }
    setState((prev) => ({
      ...prev,
      artworks: filtered,
      set: filtered.slice(
        state.page * pageSize,
        state.page * pageSize + pageSize
      ),
      loading: false,
    }));
  }, [forSale, state.search, state.filters, state.page, category]);

  // Reset page to 0 when filters/search change
  useEffect(() => {
    setState((prev) => ({ ...prev, page: 0 }));
  }, [state.search, state.filters, category]);

    // Update paged set when page changes
    useEffect(() => {
        setState(prev => ({
            ...prev,
            set: prev.artworks.slice(prev.page * pageSize, prev.page * pageSize + pageSize)
        }));
    }, [state.page, state.artworks]);
    const pageCount = Math.ceil(state.artworks.length / pageSize);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className="mx-auto px-4 md:px-6 flex-grow pb-16 mt-8">
            <div className="text-center mb-10">
                <h1 className="font-serif text-4xl md:text-5xl mb-2 text-white">Explorez les œuvres d'art</h1>
                <p className="text-gray-400 text-lg mt-2">Découvrez des œuvres uniques et soutenez les artistes</p>
            </div>
            <div className="flex justify-center items-center mb-10 mx-auto w-full max-w-xl">
                <div className="relative w-full">
                    <input
                        value={state.search}
                        onChange={e => setState(prev => ({ ...prev, search: e.target.value }))}
                        type="text"
                        className="w-full bg-gray-900/80 border border-gray-700 focus:border-blue-500 transition-colors duration-200 outline-none text-white placeholder-gray-500 rounded-xl py-3 pl-12 pr-4 shadow-sm focus:shadow-md"
                        placeholder="Cherchez par titre, artiste, ou mots-clés"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Search className="w-5 h-5" />
                    </span>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 w-full">
                    <Filters state={state} setState={setState} forSale={forSale} />
                </div>
                <div className="flex-1">
                    {state.loading ? (
                        <div className="flex items-center justify-center h-40">
                            <DataLoader />
                        </div>
                    ) : (
                        <Marketplace artworks={state.set} />
                    )}
                </div>
            </div>
            {state.artworks.length > pageSize && (
                <div className="flex justify-end gap-2 mt-8">
                    <button
                        className="px-4 py-2 rounded-md border border-gray-700 text-gray-300 bg-transparent hover:bg-gray-800 transition text-sm"
                        onClick={() => { setState(prev => ({ ...prev, page: Math.max(0, prev.page - 1) })); window.scrollTo({ top: 0 }); }}
                        disabled={state.page === 0}
                    >
                        Précédent
                    </button>
                    <span className="text-xs text-gray-400 flex items-center px-2">Page {state.page + 1} / {pageCount}</span>
                    <button
                        className="px-4 py-2 rounded-md border border-gray-700 text-gray-300 bg-transparent hover:bg-gray-800 transition text-sm"
                        onClick={() => { setState(prev => ({ ...prev, page: Math.min(pageCount - 1, prev.page + 1) })); window.scrollTo({ top: 0 }); }}
                        disabled={state.page >= pageCount - 1}
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
}
