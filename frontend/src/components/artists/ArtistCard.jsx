import { Link } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { getArtistForSaleArtworks } from "../../api/useArtworks";


export const ArtistCard = memo(({ artist }) => {
    const { id, name, image, country, coverImage } = artist;
    const [artworks, setArtworks] = useState([]);

    useEffect(() => {
        let mounted = true;
        const fetchArtworks = async () => {
            const set = await getArtistForSaleArtworks(id);
            if (mounted) setArtworks(set);
        };
        fetchArtworks();
        return () => { mounted = false; };
    }, [id]);

    return (
        <Link
            to={`/artist/${id}`}
            className="group block rounded-xl bg-background border border-gray-800 hover:shadow-lg transition overflow-hidden"
        >
            {/* Cover or Artworks Preview */}
            <div className="h-32 bg-muted relative overflow-hidden">
                {coverImage ? (
                    <img
                        loading="lazy"
                        src={coverImage}
                        alt={name + ' cover'}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : artworks?.length > 0 ?
                (
                    <div className="grid grid-cols-3 h-full">
                        {artworks?.slice(0, 3)?.map((artwork) => (
                            <div key={artwork.id} className="overflow-hidden">
                                <img
                                    loading="lazy"
                                    src={artwork.image}
                                    alt={artwork.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                )
                :
                (<div className="w-full h-full ">
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="mb-2 opacity-60">
                            <rect x="3" y="3" width="18" height="18" rx="4" fill="#374151"/>
                            <path d="M8 14l2.5-3 3.5 4.5 2-2.5 3 4.5H5l3-3.5z" fill="#6B7280"/>
                            <circle cx="8" cy="8" r="2" fill="#6B7280"/>
                        </svg>
                        <span className="text-xs">Aucune œuvre à afficher</span>
                    </div>
                </div>)
                }
            </div>
            {/* Artist Info */}
            <div className="p-4 pt-6 md:pt-12 relative">
                {/* Profile Image */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 md:w-20 md:h-20 w-15 h-15 rounded-full border-4 border-background overflow-hidden shadow-md bg-gray-800">
                    <img
                        src={image || "/profile-placeholder.svg"}
                        alt={name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="text-center md:mt-2">
                    <h3 className="font-semibold text-lg text-white truncate">{name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{country}</p>
                    <div className="mt-2 inline-block bg-gray-800/70 px-3 py-1 rounded-full text-xs text-gray-200">
                        {artworks?.length || 0} {artworks.length === 1 ? 'œuvre' : 'œuvres'}
                    </div>
                </div>
            </div>
        </Link>
    );
});