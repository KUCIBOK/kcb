import { History } from 'lucide-react'

export default function AuctionBidHistory({ bids }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <History className="w-5 h-5 mr-2" />
        Historique des enchères
      </h2>

      {bids.length === 0 ? (
        <p className="text-kcb-pierre">Aucune enchère pour le moment</p>
      ) : (
        <div className="bg-kcb-ardoise/50 rounded-[4px] overflow-hidden">
          <table className="w-full">
            <thead className="bg-kcb-ardoise/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-kcb-pierre">Montant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-kcb-pierre">
                  Enchérisseur
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-kcb-pierre">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]/50">
              {bids.map((bid) => (
                <tr key={bid.id || bid._id}>
                  <td className="px-4 py-3 text-white">{bid.amount} FCFA</td>
                  <td className="px-4 py-3 text-white">
                    {bid.bidder?.name ||
                      (typeof bid.bidder === 'string'
                        ? `Utilisateur #${bid.bidder.slice(-4)}`
                        : 'Anonyme')}
                  </td>
                  <td className="px-4 py-3 text-kcb-pierre">
                    {new Date(bid.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
