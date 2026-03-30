import { Link } from "react-router-dom";
function FeaturedArtists({ artists }) {
  return (
    <section className="w-full max-w-5xl mx-auto py-8">
      <div className="mb-6 flex items-center justify-between px-2">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Artistes en vedette</h2>
        <span className="text-xs text-kcb-pierre">Sélection de la semaine</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {artists?.length > 0 ? artists.slice(0, 8).map((artist, index) => (
          <Link
            to={`/artist/${artist?._id}`}
            key={index}
            className="group relative flex flex-col items-center bg-kcb-ardoise rounded-[4px] border border-white/[0.06] shadow-md overflow-hidden hover:scale-[1.03] transition-transform duration-300"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="w-full aspect-square bg-kcb-noir flex items-center justify-center overflow-hidden">
              <img
                loading="lazy"
                src={artist?.image || 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'}
                alt={artist?.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col items-center justify-center w-full px-3 py-3 bg-kcb-ardoise">
              <span className="text-base font-semibold text-white truncate w-full text-center">
                {artist?.name}
              </span>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-kcb-pierre bg-kcb-noir rounded-full">
                Artiste en vedette
              </span>
            </div>
          </Link>
        )) : (
          <div className="col-span-4 text-center text-kcb-pierre py-12 text-sm">Aucun artiste à afficher.</div>
        )}
      </div>
    </section>
  );
}

export default FeaturedArtists