import { useAuth } from '../../store/AuthContext'

/**
 * TrialBadge — Affiche le statut du trial (countdown ou expired)
 */
export function TrialBadge() {
  const { subscription, trialDaysLeft, isTrialExpired } = useAuth()

  if (!subscription?.is_trial) return null

  if (isTrialExpired) {
    return (
      <div className="bg-red-900/20 border border-red-700/30 px-3 py-1.5 rounded text-xs font-medium">
        <span className="text-red-200">Trial expired</span>
      </div>
    )
  }

  return (
    <div className="bg-amber-900/20 border border-amber-700/30 px-3 py-1.5 rounded text-xs font-medium">
      <span className="text-amber-200">
        {trialDaysLeft === 0
          ? 'Trial expires today'
          : trialDaysLeft === 1
            ? 'Trial expires tomorrow'
            : `Trial expires in ${trialDaysLeft} days`}
      </span>
    </div>
  )
}

/**
 * TrialBanner — Full-width banner para trial warnings
 */
export function TrialBanner() {
  const { subscription, trialDaysLeft, isTrialExpired, isTrialExpiringSoon } = useAuth()

  if (!subscription?.is_trial) return null

  if (isTrialExpired) {
    return (
      <div className="bg-red-900/10 border-b border-red-700/20 px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-100">Your trial has expired</p>
            <p className="text-xs text-red-200/80 mt-1">Upgrade to a plan to continue using Kucibok</p>
          </div>
          <a
            href="/pricing"
            className="text-sm font-medium px-4 py-2 rounded bg-red-700/20 hover:bg-red-700/40 border border-red-700/30 text-red-100 transition-colors"
          >
            Upgrade
          </a>
        </div>
      </div>
    )
  }

  if (isTrialExpiringSoon) {
    return (
      <div className="bg-amber-900/10 border-b border-amber-700/20 px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-100">
              {trialDaysLeft === 0
                ? 'Your trial ends today'
                : `Your trial ends in ${trialDaysLeft} day${trialDaysLeft === 1 ? '' : 's'}`}
            </p>
            <p className="text-xs text-amber-200/80 mt-1">Upgrade before your trial ends to keep your access</p>
          </div>
          <a
            href="/pricing"
            className="text-sm font-medium px-4 py-2 rounded bg-amber-700/20 hover:bg-amber-700/40 border border-amber-700/30 text-amber-100 transition-colors"
          >
            Upgrade
          </a>
        </div>
      </div>
    )
  }

  return null
}
