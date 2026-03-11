import { Link } from "react-router-dom";
import RevealOnScroll from "../../decoratives/RevealOnScroll";

export default function HeroSection() {
  return (
    <RevealOnScroll>
      {/* Hero section */}
      <section className="w-full max-w-5xl mx-auto pt-16 pb-8 px-4 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-indigo-kcb">Kucibok</span> connecte votre art
            au <span className="text-purple-kcb">monde</span>
          </h1>
          <p className="text-base text-white/70 mb-6 max-w-lg mx-auto md:mx-0">
            Rejoignez la communauté d'artistes africains et accédez à des outils
            professionnels pour créer, certifier et vendre vos œuvres en toute
            autonomie.
          </p>
          <div className="flex gap-3 justify-center md:justify-start">
            <Link
              to="/sign-up"
              className="bg-indigo-kcb text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-indigo-kcb/80 transition"
            >
              Démarrez en tant qu'artiste
            </Link>
            <Link
              to="/explore"
              className="px-5 py-2 rounded-full border border-purple-kcb text-white hover:bg-purple-kcb/80 transition"
            >
              Explorer les œuvres
            </Link>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            loading="lazy"
            src="/images/homepage/artist-hero.jpeg"
            alt="African digital artist"
            className="w-full max-w-xs rounded-2xl shadow-lg object-cover"
          />
        </div>
      </section>
    </RevealOnScroll>
  );
}
