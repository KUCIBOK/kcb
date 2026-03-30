import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowUpRight } from "lucide-react";
import { getArtistById } from "../../api/useArtists";
import { LikeHeart } from "./LikeHeart";

/** @type {Map<string, object>} Cache artistes pour éviter N+1 fetches */
const artistCache = new Map();

export const ArtworkCard = memo(({ artwork, artist: artistProp }) => {
  const [artist, setArtist] = useState(artistProp ?? {});

  useEffect(() => {
    const artistId = artwork?.artistId || artwork?.artist_id;
    if (!artistId || artistProp?._id || artistProp?.id) return;

    if (artistCache.has(artistId)) {
      setArtist(artistCache.get(artistId));
      return;
    }

    const getArtist = async () => {
      const artistData = await getArtistById(artistId);
      if (artistData?._id || artistData?.id) {
        artistCache.set(artistId, artistData);
        setArtist(artistData);
      }
    };
    getArtist();
  }, [artwork?.artistId, artwork?.artist_id, artistProp]);

  const isCertified = !!artwork?.kucibok_id;
  const artworkId = artwork?._id || artwork?.id;

  return (
    <div className="group relative rounded-[4px] bg-kcb-ardoise border border-white/[0.06] hover:border-kcb-or/30 shadow-sm hover:shadow-[0_8px_30px_rgba(201,168,76,0.08)] transition-all duration-300 overflow-hidden">
      <Link
        to={`/artwork/${artworkId}`}
        className="block focus:outline-none focus:ring-2 focus:ring-kcb-or"
      >
        {/* Image container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-kcb-noir">
          <img
            src={artwork?.image}
            alt={artwork?.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            loading="lazy"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Certification badge */}
          {isCertified && (
            <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-kcb-noir/80 backdrop-blur-sm text-[10px] font-semibold tracking-[0.08em] uppercase text-kcb-or px-2.5 py-1 rounded-[2px] border border-kcb-or/20">
              <ShieldCheck className="w-3 h-3" />
              Certifié KCB
            </span>
          )}

          {/* Hover CTA */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span className="text-white text-xs font-semibold tracking-[0.04em] uppercase">
              Voir l'œuvre
            </span>
            <span className="w-7 h-7 rounded-full bg-kcb-or flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-kcb-noir" />
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2.5">
          {/* Title */}
          <h3
            className="font-playfair text-[15px] font-semibold text-white truncate leading-tight"
            title={artwork?.title}
          >
            {artwork?.title}
          </h3>

          {/* Artist */}
          {(artist?._id || artist?.id) && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full overflow-hidden border border-kcb-or/20 shrink-0">
                <img
                  loading="lazy"
                  src={
                    artist?.image ||
                    "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
                  }
                  alt={artist?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-kcb-pierre truncate">
                {artist?.name}
              </span>
            </div>
          )}

          {/* Price bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <span className="font-playfair text-base font-bold text-white">
              {artwork?.price?.toLocaleString("fr-FR").replace(/\s/g, "\u202F")}{" "}
              <span className="text-xs font-dm-sans font-normal text-kcb-pierre">{artwork?.currency}</span>
            </span>
            {artwork?.category && (
              <span className="text-[10px] tracking-[0.06em] uppercase text-kcb-pierre bg-white/[0.04] px-2 py-0.5 rounded-[2px]">
                {artwork.category}
              </span>
            )}
          </div>
        </div>
      </Link>
      <LikeHeart artwork={artwork} />
    </div>
  );
});
