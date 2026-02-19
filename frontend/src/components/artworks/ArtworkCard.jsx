import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArtistById } from "../../api/useArtists";
import { LikeHeart } from "./LikeHeart";

export const ArtworkCard = memo(({ artwork }) => {
  const [artist, setArtist] = useState({});

  useEffect(() => {
    if (artwork?.artistId) {
      const getArtist = async () => {
        const artistData = await getArtistById(artwork.artistId);
        if (artistData?._id) {
          setArtist({ ...artistData });
        }
      };
      getArtist();
    }
  }, [artwork?.artistId]);


  return (
    <div className="group relative rounded-xl bg-gray-900 border border-gray-800 shadow-sm hover:shadow-lg transition overflow-hidden">
      <Link
        to={`/artwork/${artwork?._id}`}
        className="block focus:outline-none focus:ring-2 focus:ring-indigo-kcb"
      >
        {/* Artwork Image */}
        <div className="aspect-square overflow-hidden rounded-t-xl bg-gray-800">
          <img
            src={artwork?.image}
            alt={artwork?.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Artwork Info */}
        <div className="p-4 flex flex-col gap-2">
          <div className="flex md:flex-row flex-col flex-wrap items-center justify-between gap-2 mb-1">
            <h3
              className="font-serif text-base font-semibold text-white truncate max-w-[70%]"
              title={artwork?.title}
            >
              {artwork?.title}
            </h3>
            <span className="bg-indigo-kcb/10 text-indigo-kcb px-2 py-1 rounded-full text-xs font-medium">
              {artwork?.price?.toLocaleString("fr-FR").replace(/\s/g, " ")}{" "}
              {artwork?.currency}
            </span>
          </div>

          {artist?._id && (
            <div className="flex items-center gap-2 mt-1">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-700">
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
              <span className="text-xs text-gray-400 truncate">
                {artist?.name}
              </span>
            </div>
          )}
        </div>
      </Link>
      <LikeHeart artwork={artwork} />

    </div>
  );
});
