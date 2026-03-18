import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { useArtist } from "../store/ArtistContext";
import { Search } from "lucide-react";
import { DataLoader } from "../components/loaders/PageLoader";
import { ArtistList } from "../components/artists/ArtistsList";
import RevealOnScroll from "../components/landing/RevealOnScroll";
import SectionLabel from "../components/landing/SectionLabel";

export default function Artists() {
    const { artists } = useArtist();
    // Deduplicate by _id then shuffle randomly (different order each refresh)
    const seen = new Set()
    const sortedArtists = [...(artists ?? [])]
      .filter(item => {
        const key = item._id ?? item.id
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .sort(() => Math.random() - 0.5)
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        let result = sortedArtists;
        if (search.trim() !== "") {
            const s = search.toLowerCase();
            result = sortedArtists.filter(item =>
                item.name.toLowerCase().includes(s) ||
                item.country?.toLowerCase().includes(s)
            );
        }
        setFiltered(result);
        setLoading(false);
    }, [artists, search]);

    return (
        <>
        <Helmet>
          <title>Artistes africains — Kucibok | Découvrez les créateurs certifiés</title>
          <meta name="description" content="Découvrez les artistes africains contemporains certifiés sur Kucibok Bridge. Peintures, sculptures, photographies — explorez leurs œuvres et leur univers." />
          <meta property="og:title" content="Artistes africains contemporains — Kucibok" />
          <meta property="og:description" content="192 artistes africains contemporains certifiés. Explorez leurs œuvres et collections sur Kucibok Bridge." />
          <meta property="og:url" content="https://kucibok.com/artists" />
          <link rel="canonical" href="https://kucibok.com/artists" />
        </Helmet>
        <div className="mx-auto px-4 md:px-6 flex-grow pb-16 mt-8">
            <div className="text-center mb-14">
                <RevealOnScroll>
                    <SectionLabel text="Artistes" />
                </RevealOnScroll>
                <RevealOnScroll delay={0.1}>
                    <h1 className="font-playfair font-bold text-[clamp(28px,3.5vw,48px)] text-white mt-4 mb-3">Découvrez les artistes africains</h1>
                </RevealOnScroll>
                <RevealOnScroll delay={0.2}>
                    <p className="text-kcb-pierre text-[15px]">Explorez les divers talents des artistes digitaux autour du continent</p>
                </RevealOnScroll>
            </div>
            <RevealOnScroll delay={0.25}>
                <div className="flex justify-center items-center mb-10 mx-auto w-full max-w-xl">
                    <div className="relative w-full">
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type="text"
                            className="w-full bg-kcb-noir border border-white/[0.08] focus:border-kcb-or transition-colors duration-200 outline-none text-white placeholder-kcb-pierre rounded-[4px] py-3 pl-12 pr-4 shadow-sm focus:shadow-md focus:ring-2 focus:ring-kcb-or"
                            placeholder="Cherchez les artistes par nom ou par pays"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-kcb-pierre pointer-events-none">
                            <Search className="w-5 h-5" />
                        </span>
                    </div>
                </div>
            </RevealOnScroll>
            <div className="flex flex-col gap-6">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <DataLoader />
                    </div>
                ) : (
                    <ArtistList artists={filtered} />
                )}
            </div>
        </div>
        </>
    );
}
