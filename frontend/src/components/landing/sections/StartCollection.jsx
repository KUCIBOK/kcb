import { Link } from "react-router-dom";

export default function StartCollection() {
  return (
    <div className="min-h-screen flex flex-col w-full items-center justify-center bg-gradient-to-r from-[#15294f] to-[#153640]">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-4xl md:text-6xl lg:text-8xl text-white text-center ">
          Prêt à Commencer
          <br />
          <span className="text-transparent bg-gradient-to-r from-[#7170c4] to-[#b033a8] bg-clip-text">
            Votre collection ?
          </span>{" "}
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-lg md:text-xl lg:text-2xl text-white/80 text-center max-w-4xl">
          Rejoignez la communauté grandissante de collectionneurs et d'artistes
          célébrant la créativité numérique africaine.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center md:gap-4 mt-6">
          <Link
            to="/explore"
            className="mt-6 px-6 py-3 bg-gradient-to-r from-[#7170c4] to-[#b033a8] text-white rounded-lg hover:scale-105 transition-transform duration-300"
          >
            Explorer le marché
          </Link>
          <Link
            to="/login"
            className="mt-6 px-6 py-3 bg-gradient-to-r from-[#11162B] to-[#1A1F2C] text-white rounded-lg hover:scale-105 transition-transform duration-300"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
