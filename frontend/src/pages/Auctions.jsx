import { useEffect, useState } from "react";
import axios from "axios";
import { Clock, Gavel, User } from "lucide-react";
import { Link } from "react-router-dom";
import { DataLoader } from "../components/loaders/PageLoader";

// Composant pour le compte à rebours
const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const end = new Date(endTime);
    const difference = end - now;

    if (difference <= 0) return { expired: true };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(difference / (1000 * 60 * 60)) % 24,
      minutes: Math.floor(difference / 1000 / 60) % 60,
      seconds: Math.floor(difference / 1000) % 60,
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.expired) {
    return <span className="text-red-400">Terminé</span>;
  }

  return (
    <div className="flex items-center space-x-1">
      {timeLeft.days > 0 && (
        <span className="bg-gray-700/80 text-white text-xs px-1.5 py-0.5 rounded">
          {timeLeft.days}j
        </span>
      )}
      <span className="bg-gray-700/80 text-white text-xs px-1.5 py-0.5 rounded">
        {String(timeLeft.hours).padStart(2, "0")}h
      </span>
      <span className="bg-gray-700/80 text-white text-xs px-1.5 py-0.5 rounded">
        {String(timeLeft.minutes).padStart(2, "0")}m
      </span>
      <span className="bg-gray-700/80 text-white text-xs px-1.5 py-0.5 rounded">
        {String(timeLeft.seconds).padStart(2, "0")}s
      </span>
    </div>
  );
};

export default function Auctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get("/api/auction/ongoing");
        setAuctions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erreur lors du chargement des enchères :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
    // Rafraîchir les enchères toutes les minutes
    const interval = setInterval(fetchAuctions, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <DataLoader />
      </div>
    );
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "upcoming":
        return "À venir";
      case "ongoing":
        return "Enchère en cours";
      case "ended":
        return "Terminée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  return (
    <div className="mx-auto px-4 md:px-6 flex-grow pb-16 mt-8">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl md:text-5xl mb-2 text-white">
          Enchères en cours
        </h1>
        <p className="text-gray-400 text-lg mt-2">
          Découvrez des œuvres uniques et participez aux enchères
        </p>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-800/50 rounded-xl p-8 max-w-md mx-auto">
            <h3 className="text-xl font-medium text-white mb-2">
              Aucune enchère en cours
            </h3>
            <p className="text-gray-400 mb-4">
              Il n'y a actuellement aucune enchère active. Revenez plus tard !
            </p>
            <Link
              to="/explore"
              className="inline-block px-4 py-2 bg-gradient rounded-md text-white hover:opacity-90 transition"
            >
              Explorer les œuvres
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {auctions.map((auction) => {
            const artworkTitle = auction.artwork?.title || "Titre inconnu";
            const artworkImage = auction.artwork?.image || "";
            const sellerName = auction.seller?.name || "Vendeur inconnu";

            return (
              <div
                key={auction._id}
                className="bg-gray-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700/50"
              >
                <div className="aspect-square bg-gray-700 relative">
                  {/* Placeholder pour l'image de l'œuvre - à remplacer par l'image réelle */}
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    {artworkImage ? (
                      <img
                        src={artworkImage}
                        alt={artworkTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-20 h-20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
                    <Gavel className="w-4 h-4 mr-1" />
                    <span>{getStatusLabel(auction.status)}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-semibold text-white mb-2 truncate">
                    {artworkTitle}
                  </h2>

                  <div className="flex justify-between items-center mb-3">
                    <div className="text-2xl font-bold text-white">
                      {auction.currentPrice} FCFA
                    </div>
                    <div className="text-sm text-gray-400 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <CountdownTimer endTime={auction.endTime} />
                    </div>
                  </div>

                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <User className="w-4 h-4 mr-1" />
                    <span>Vendeur: {sellerName}</span>
                  </div>

                  <Link
                    to={`/auction/${auction._id}`}
                    className="w-full block text-center bg-gradient hover:opacity-90 text-white py-2 px-4 rounded-md transition"
                  >
                    Participer
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
