import { useState } from 'react'
import { useAuth } from '../../../store/AuthContext'
import { utils } from '../../../api/useAPI'

export default function AuctionBidForm({ currentPrice, auctionId, onBidSuccess }) {
  const { user } = useAuth()
  const [bidAmount, setBidAmount] = useState(currentPrice + 1000)
  const [bidError, setBidError] = useState('')
  const [bidSuccess, setBidSuccess] = useState('')

  const handlePlaceBid = async (e) => {
    e.preventDefault()
    setBidError('')
    setBidSuccess('')

    if (!user) return setBidError('Vous devez être connecté pour enchérir')
    if (bidAmount <= currentPrice) {
      return setBidError(`Le montant doit être supérieur à ${currentPrice} FCFA`)
    }

    try {
      const response = await fetch(`${utils.api}/bid`, {
        method: 'POST',
        headers: utils.options.headers,
        body: JSON.stringify({ auctionId, amount: bidAmount }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Erreur lors de l'enchère")

      setBidSuccess('Enchère placée avec succès !')
      setBidAmount(currentPrice + 1000)
      onBidSuccess()
    } catch (error) {
      setBidError(error.message || 'Erreur lors de la soumission')
    }
  }

  return (
    <div className="bg-kcb-ardoise/50 p-4 rounded-[4px] border border-white/[0.06]/50">
      <form onSubmit={handlePlaceBid} className="space-y-3">
        <div>
          <label htmlFor="bidAmount" className="block text-sm font-medium text-kcb-pierre mb-1">
            Votre enchère (min. {currentPrice + 1000} FCFA)
          </label>
          <input
            type="number"
            id="bidAmount"
            min={currentPrice + 1000}
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            className="w-full bg-kcb-ardoise border border-white/[0.08] rounded-[4px] px-3 py-2 text-white"
            required
          />
        </div>
        {bidError && <p className="text-red-400 text-sm">{bidError}</p>}
        {bidSuccess && <p className="text-green-400 text-sm">{bidSuccess}</p>}
        <button
          type="submit"
          className="w-full bg-gradient hover:opacity-90 text-white py-2 px-4 rounded-[4px] transition"
        >
          Placer une enchère
        </button>
      </form>
    </div>
  )
}
