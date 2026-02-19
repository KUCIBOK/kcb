import { Palette, ShieldCheck, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import BuyArt from "../components/landing/sections/BuyArt";
import FeaturedArtworks from "../components/landing/sections/FeaturedArtworks";
import Community from "../components/landing/sections/Community";
import FeaturedArtists from "../components/landing/sections/FeaturedArtists";
import StartCollection from "../components/landing/sections/StartCollection";
import { ChevronDown } from "lucide-react";
import AmbientAudio from "../components/decoratives/AmbientAudio";
import { Partners } from "../components/landing/sections/Partners";

function Index() {
  const buyArtRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToBuyArt = () => {
    buyArtRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-between bg-[linear-gradient(120deg,_#23243a_60%,_#b033a8_90%,_#ffbb00_100%)] bg-[length:200%_200%] bg-no-repeat landing-gradient opacity-95">
        <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 px-2 sm:px-4 md:px-10 lg:px-20 py-8 md:py-14 flex-grow w-full">
          {/* Left: Text & CTA */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full">
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-lg mb-4">
              Découvrez l’univers intemporel<br className="hidden md:block" />
              <span className="bg-gradient-to-tr from-indigo-kcb via-fuchsia-600 to-yellow-400 bg-clip-text text-transparent">de l’Art Africain</span>
            </h1>
            <p className="font-medium mt-4 sm:mt-6 text-base sm:text-lg md:text-2xl text-white/90">
              Vous êtes :
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-5 font-medium justify-center md:justify-start w-full">
              <Link
                to="/artist"
                className="bg-white/10 h-fit text-sm hover:bg-indigo-kcb/80 hover:text-white hover:scale-105 hover:shadow-lg transition duration-300 flex items-center rounded-lg px-5 py-2 text-white font-semibold shadow-md border border-white/20 w-full sm:w-auto justify-center"
              >
                <Palette className="w-5 h-5 mr-2" /> Artiste
              </Link>
              <Link
                to="/collector"
                className="bg-white/10 h-fit text-sm hover:bg-fuchsia-600/80 hover:text-white hover:scale-105 hover:shadow-lg transition duration-300 flex items-center rounded-lg px-5 py-2 text-white font-semibold shadow-md border border-white/20 w-full sm:w-auto justify-center"
              >
                <Users className="w-5 h-5 mr-2" /> Collectionneur
              </Link>
              <Link
                to="/professional"
                className="bg-white/10 h-fit text-sm hover:bg-yellow-400/80 hover:text-white hover:scale-105 hover:shadow-lg transition duration-300 flex items-center rounded-lg px-2 py-2 text-white font-semibold shadow-md border border-white/20 w-full sm:w-auto justify-center"
              >
                <ShieldCheck className="w-5 h-5 mr-2" /> Professionnel de l'art
              </Link>
            </div>
          </div>

          {/* Right: Visuals & Decorations */}
          <div className="flex-1 flex justify-center relative md:mt-[120px] max-h-[300px] sm:max-h-[350px] w-full">
            {/* Logo block */}
            <div className="absolute top-[-12%] left-[10%] w-16 h-16 sm:w-20 sm:h-20 bg-[rgba(255,255,255,0.10)] rounded-[10px] backdrop-blur-[5px] shadow-[0_25px_45px_rgba(0,0,0,0.10)] border border-[rgba(255,255,255,0.5)] border-r border-r-[rgba(255,255,255,0.2)] border-b border-b-[rgba(255,255,255,0.5)] flex items-center justify-center z-10">
              <img
                src="/images/kucibok-white-logo.svg"
                alt="logo"
                className="h-[70%]"
              />
            </div>
            {/* Decoration block 1 */}
            <div className="absolute hidden md:block bottom-[20%] right-[10%] w-12 h-12 sm:w-16 sm:h-16 bg-[rgba(255,255,255,0.10)] rounded-[10px] backdrop-blur-[5px] shadow-[0_25px_45px_rgba(0,0,0,0.10)] border border-[rgba(255,255,255,0.5)] border-r border-r-[rgba(255,255,255,0.2)] border-b border-b-[rgba(255,255,255,0.5)] z-0" />
            {/* Decoration block 2 */}
            <div className="absolute hidden md:block bottom-[5%] left-[9%] w-16 h-16 sm:w-24 sm:h-24 bg-[rgba(255,255,255,0.10)] rounded-[10px] backdrop-blur-[5px] shadow-[0_25px_45px_rgba(0,0,0,0.10)] border border-[rgba(255,255,255,0.5)] border-r border-r-[rgba(255,255,255,0.2)] border-b border-b-[rgba(255,255,255,0.5)] z-10" />
            {/* Decoration block 3 with coins */}
            <div className="absolute flex top-[-10%] md:top-[-30%] right-[20%] w-10 h-10 sm:w-12 sm:h-12 bg-[rgba(255,255,255,0.10)] rounded-[10px] backdrop-blur-[5px] shadow-[0_25px_45px_rgba(0,0,0,0.10)] border border-[rgba(255,255,255,0.5)] border-r border-r-[rgba(255,255,255,0.2)] border-b border-b-[rgba(255,255,255,0.5)] items-center justify-center z-10">
              <img
                src="/images/coins.png"
                alt="ethereum logo"
                className="w-[70%]"
              />
            </div>
            {/* Main Kuzi visual */}
            <div
              className="relative w-[180px] sm:w-[260px] md:w-[400px] aspect-square bg-[rgba(255,255,255,0.08)] rounded-[10px] flex justify-end items-end backdrop-blur-[5px] shadow-[0_25px_45px_rgba(0,0,0,0.10)] border border-[rgba(255,255,255,0.5)] border-r border-r-[rgba(255,255,255,0.2)] border-b border-b-[rgba(255,255,255,0.5)]">
              <img src="/images/Kuzi.gif" alt="Kuzi" className="w-full rounded-[10px]" />
            </div>
          </div>
        </section>

        <div className="flex flex-col w-full justify-center items-center gap-2 sm:gap-4 py-2">
          <button
            onClick={scrollToBuyArt}
            className="flex flex-col items-center group"
          >
            <span className="text-base sm:text-lg px-4 py-2 rounded-full text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2">
              Juste curieux ?
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </span>
            <span className="w-[1px] h-[40px] sm:h-[60px] bg-white/50 mt-2"></span>
          </button>
        </div>
      </div>

      <div ref={buyArtRef}>
        <BuyArt />
      </div>
      <FeaturedArtworks />
      <Community />
      <Partners />
      <FeaturedArtists />
      <StartCollection />
      <AmbientAudio />
    </>
  );
}

export default Index;
