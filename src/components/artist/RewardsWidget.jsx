import { useEffect, useState } from 'react'
import { Gift, Star, ChevronRight } from 'lucide-react'
import { getMyCredits } from '../../api/useRewards'

export function RewardsWidget({ onNavigate }) {
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    getMyCredits().then((data) => setBalance(data?.credits?.balance ?? 0))
  }, [])

  return (
    <button
      onClick={onNavigate}
      className="w-full rounded-[4px] border border-[#9B4D96]/30 bg-[#9B4D96]/10 px-4 py-3 my-4 flex items-center gap-3 hover:bg-[#9B4D96]/20 transition text-left group"
    >
      <Gift className="w-4 h-4 text-[#9B4D96] shrink-0" />
      <div className="flex-1 flex items-center gap-2 flex-wrap min-w-0">
        <span className="text-sm font-semibold text-white">
          {balance === null ? '…' : balance} crédits KCB
        </span>
        <span className="text-kcb-pierre text-xs hidden sm:inline">·</span>
        <span className="text-kcb-pierre text-xs hidden sm:inline flex items-center gap-1">
          <Star className="w-3 h-3 inline text-[#9B4D96]" /> Parrainez un artiste → +50 crédits
        </span>
      </div>
      <span className="text-xs text-[#9B4D96] font-medium flex items-center gap-1 shrink-0 group-hover:underline">
        Rewards <ChevronRight className="w-3.5 h-3.5" />
      </span>
    </button>
  )
}
