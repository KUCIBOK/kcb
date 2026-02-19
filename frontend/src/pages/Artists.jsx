import { useEffect, useState } from "react";
import { useArtist } from "../store/ArtistContext";
import { Search } from "lucide-react";
import { DataLoader } from "../components/loaders/PageLoader";
import { ArtistList } from "../components/artists/ArtistsList";

export default function Artists() {
    const { artists } = useArtist();
    const artistsWithImage = artists?.filter(item => item?.image && item?.image != 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg')
    const artistWithPlus3Image = artistsWithImage?.filter(item => item?.artworkCount >= 3);
    const artistWithMinus3Image = artistsWithImage?.filter(item => item?.artworkCount < 3 && item?.artworkCount > 0);
    const artistsWithMinus3WithoutImage = artistsWithImage.filter(item => item?.artworkCount > 0 && (!item?.image || item?.image === 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'));
    const artistsWithoutImageWithoutArtworks = artists?.filter(item => item?.artworkCount == 0 || !item?.image || item?.image === 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg')
    const sortedArtists = [...artistWithPlus3Image, ...artistWithMinus3Image, ...artistsWithMinus3WithoutImage, ...artistsWithoutImageWithoutArtworks];
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
        <div className="mx-auto px-4 md:px-6 flex-grow pb-16 mt-8">
            <div className="text-center mb-10">
                <h1 className="font-serif text-4xl md:text-5xl mb-2 text-white">Découvrez les artistes africains</h1>
                <p className="text-gray-400 text-lg mt-2">Explorez les divers talents des artistes digitaux autour du continent</p>
            </div>
            <div className="flex justify-center items-center mb-10 border mx-auto w-full max-w-xl rounded-lg border-gray-800 bg-gray-900/70 px-4">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    type="text"
                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 px-2 py-3"
                    placeholder="Cherchez les artistes par nom ou par pays"
                />
            </div>
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
    );
}

