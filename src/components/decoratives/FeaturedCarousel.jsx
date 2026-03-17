import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getArtistById } from "../../api/useArtists";
import { Link } from "react-router-dom";

 function FeaturedCarousel ({ artworks }){
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);
  const length = artworks?.length || 0;
  
  // Auto-slide logic
  useEffect(() => {
    if (length < 2) return;
    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % length);
      }, 3500);
    };
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [length]);

  // Pause on hover
  const handleMouseEnter = () => clearInterval(intervalRef.current);
  const handleMouseLeave = () => {
    if (length < 2) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 3500);
  };

  if (!artworks || artworks.length === 0) return null;

  return (
    <div
      className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden shadow-lg animate-fade-in-up pt-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {artworks.map((art, idx) => (
        <div
          key={art._id || idx}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={art.image}
            alt={art.title}
            className="object-cover w-full h-full"
            draggable={false}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h2 className="text-4xl font-bold text-white">{art.title}</h2>
            <p className="text-white/80">{art.artist?.name}</p>
            <ArtistInfo artwork={art}/>
          </div>
        </div>
      ))}
      <button
        className="absolute left-4 z-20 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 transition"
        onClick={() => setCurrent((prev) => (prev - 1 + length) % length)}
        aria-label="Précédent"
      >
        <ArrowRight className="rotate-180" />
      </button>
      <button
        className="absolute right-4 z-20 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 transition"
        onClick={() => setCurrent((prev) => (prev + 1) % length)}
        aria-label="Suivant"
      >
        <ArrowRight />
      </button>
      <div className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {artworks.map((_, idx) => (
          <span
            key={idx}
            className={`block w-3 h-3 rounded-full ${
              idx === current ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
      {/* <div className="absolute bottom-4 z-20 right-4 bg-black/50 text-white px-3 py-1 rounded">
        {current + 1} / {length}
      </div> */}
      <Link to="/explore" className="absolute z-20 bottom-25 md:bottom-8 right-50 hover:scale-110 transition duration-300 bg-gradient text-white px-4 py-2 rounded">
        Voir les oeuvres
      </Link>
      <Link to="/sign-up" className="absolute z-20 bottom-25 md:bottom-8 right-4 hover:scale-110 transition duration-300 bg-gray-700/80 text-white px-4 py-2 rounded">
        Créer un compte
      </Link>
    </div>
  );
};

function ArtistInfo({artwork}){
  const [artist, setArtist] = useState({})
  useEffect(() => {
    if(artwork?.artist_id){
      const getArtist = async () => {
        const artistData = await getArtistById(artwork?.artist_id);
        if(artistData?._id){
            setArtist(prev => ({...artistData}))
        }
      }
      getArtist()
    }
  }, [])
  return (
    <>
    {artist?._id && (
        <div className="flex items-center my-2">
            <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                <img 
                src={artist?.image || "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"} 
                alt={artist?.name} 
                className="w-full h-full object-cover"
                />
            </div>
            <span className="text-sm text-muted-foreground">by {artist?.name}</span>
        </div>
    )}
    </>
  )
}

export default FeaturedCarousel