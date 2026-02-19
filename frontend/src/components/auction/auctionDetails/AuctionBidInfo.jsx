import { Clock } from "lucide-react";
import { CountdownTimer } from "../CountdownTimer";

export default function AuctionBidInfo({
  currentPrice,
  endTime,
  winner,
  bidCount,
}) {
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
      <div className="mb-4">
        <p className="text-gray-400 text-sm">Prix actuel</p>
        <p className="text-2xl font-bold text-white">{currentPrice} FCFA</p>
      </div>

      <div className="mb-4">
        <p className="text-gray-400 text-sm">Temps restant</p>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1 text-gray-400" />
          <CountdownTimer endTime={endTime} />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-400 text-sm">Enchérisseur actuel</p>
        <p className="text-white">{winner?.name || "Aucun"}</p>
      </div>

      <div>
        <p className="text-gray-400 text-sm">Nombre d'enchères</p>
        <p className="text-white">{bidCount}</p>
      </div>
    </div>
  );
}
