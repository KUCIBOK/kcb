import { Link } from "react-router-dom";

export default function BuyArt() {
  return (
    <div className="px-1 md:px-10 lg:px-20 bg-gradient-to-b from-[#11162B] to-[#1A1F2C] py-[5rem]">
      <div className="flex w-full flex-col md:flex-row justify-center items-center gap-10">
        <div className="flex-1">
          <div className="flex items-center justify-center rounded-lg p-[5px] bg-gradient-to-r from-[#7170c4] to-[#b033a8]">
            <img
              src="/images/homepage/artist-hero.jpeg"
              alt="artwork"
              className=" h-[200px] md:h-[400px] lg:h-[500px] w-full object-cover rounded-lg shadow-lg transition-transform duration-500 ease-in-out transform hover:scale-105 hover:shadow-xl"
            />
          </div>
        </div>
        <div className="flex-1 flex justify-center flex-col h-[200px] items-center text-center md:text-left gap-4 md:pl-[5rem]">
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-semibold text-white">
            La Marketplace pour les amateurs d'
            <span className="text-transparent bg-gradient-to-r from-[#7170c4] to-[#b033a8] bg-clip-text">
              Art africain
            </span>{" "}
          </h2>
          <div className="flex w-full justify-center md:justify-start">
            <p className="text-white text-lg md:text-xl lg:text-2xl font-light w-full md:w-[70%] lg:w-[80%]">
              Découvrez et collectionnez des œuvres d'art uniques d'artistes
              indépendants partout en afrique
            </p>
          </div>
          <div className="flex w-full justify-center md:justify-start">
            <Link to="/explore">
              <button className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#7170c4] to-[#b033a8] ">
                Explorez les œuvres
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
