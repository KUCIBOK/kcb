import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { DataLoader } from "../components/loaders/PageLoader";
import AuctionArtworkInfo from "../components/auction/auctionDetails/AuctionArtworkInfo";
import AuctionBidInfo from "../components/auction/auctionDetails/AuctionBidInfo";
import AuctionBidForm from "../components/auction/auctionDetails/AuctionBidCount";
import AuctionBidHistory from "../components/auction/auctionDetails/AuctionBidHistory";

export default function AuctionDetails() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuctionDetails = async () => {
    try {
      const res = await axios.get(`/api/auction/${id}/details`);
      setAuction({
        ...res.data,
        bids: Array.isArray(res.data.bids) ? res.data.bids : [],
        bidCount: res.data.bidCount || res.data.bids?.length || 0,
      });
    } catch (err) {
      setError("Erreur lors du chargement de l'enchère");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionDetails();
  }, [id]);

  if (loading) return <DataLoader />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb title={auction.artwork.title} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Colonne gauche (70%) */}
        <div className="lg:w-[70%]">
          <AuctionArtworkInfo artwork={auction.artwork} />
          <AuctionBidHistory bids={auction.bids} />
        </div>

        {/* Colonne droite (30%) */}
        <div className="lg:w-[30%] space-y-6 sticky top-4 h-fit">
          <AuctionBidInfo
            currentPrice={auction.currentPrice}
            endTime={auction.endTime}
            winner={auction.winner || auction.bids[0]?.bidder}
            bidCount={auction.bidCount}
          />
          <AuctionBidForm
            currentPrice={auction.currentPrice}
            auctionId={id}
            onBidSuccess={() => fetchAuctionDetails()} // À implémenter
          />
        </div>
      </div>
    </div>
  );
}

function Breadcrumb({ title }) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 text-sm">
        <li>
          <Link to="/auction" className="text-gray-400 hover:text-white">
            Enchères
          </Link>
        </li>
        <li>
          <span className="mx-2 text-gray-500">/</span>
        </li>
        <li className="text-white" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}

function ErrorDisplay({ message }) {
  return (
    <div className="text-center py-12">
      <div className="bg-gray-800/50 rounded-xl p-8 max-w-md mx-auto">
        <h3 className="text-xl font-medium text-white mb-2">Erreur</h3>
        <p className="text-gray-400 mb-4">{message}</p>
        <Link
          to="/auction"
          className="inline-block px-4 py-2 bg-gradient rounded-md text-white hover:opacity-90 transition"
        >
          Retour aux enchères
        </Link>
      </div>
    </div>
  );
}
