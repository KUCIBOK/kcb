import { useEffect, useState } from 'react'
import { useAuth } from '../../store/AuthContext'
import { addToShortlist, removeFromShortlist, checkIsShortlisted } from '../../api/useShortlist'

/**
 * ShortlistButton — Button to add/remove artwork from shortlist
 * Handles feature gating for non-paid users
 */
export function ShortlistButton({ artworkId, className = '' }) {
  const { user, subscription } = useAuth()
  const [isShortlisted, setIsShortlisted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showGate, setShowGate] = useState(false)

  // Check if user has shortlist feature
  const canAccessShortlist = subscription?.plan_id && subscription.plan_id !== 'free'

  // Load shortlist status on mount
  useEffect(() => {
    if (!user?.id || !artworkId) return
    checkIsShortlisted(user.id, artworkId).then((result) => {
      if (result.success) setIsShortlisted(result.isShortlisted)
    })
  }, [user?.id, artworkId])

  const handleToggle = async () => {
    if (!user?.id) {
      // Redirect to login
      window.location.href = '/auth/signin'
      return
    }

    if (!canAccessShortlist) {
      setShowGate(true)
      return
    }

    setLoading(true)
    try {
      if (isShortlisted) {
        const result = await removeFromShortlist(user.id, artworkId)
        if (result.success) setIsShortlisted(false)
      } else {
        const result = await addToShortlist(user.id, artworkId)
        if (result.success) setIsShortlisted(true)
      }
    } catch (err) {
      console.error('Shortlist toggle error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`px-3 py-1.5 rounded border text-xs font-medium transition-colors ${
          isShortlisted
            ? 'bg-amber-900/20 border-amber-700/30 text-amber-200 hover:bg-amber-900/30'
            : 'bg-transparent border-gray-700/30 text-gray-300 hover:border-gray-600/50 hover:bg-gray-900/20'
        } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? 'Loading...' : isShortlisted ? '✓ Saved' : '+ Save'}
      </button>

      {/* Feature gate modal */}
      {showGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-950 border border-gray-800 rounded-lg max-w-sm w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Feature Not Available</h3>
            <p className="text-sm text-gray-400 mb-6">
              Shortlisting is only available on paid plans. Upgrade to Explorer (27€/month) or higher to save artworks.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGate(false)}
                className="flex-1 px-4 py-2 rounded border border-gray-700 text-sm text-gray-300 hover:bg-gray-900/50 transition-colors"
              >
                Cancel
              </button>
              <a
                href="/pricing"
                className="flex-1 px-4 py-2 rounded bg-amber-900/20 border border-amber-700/30 text-sm text-amber-200 hover:bg-amber-900/40 transition-colors text-center"
              >
                View Plans
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * ShortlistIcon — Inline icon button for shortlist
 */
export function ShortlistIcon({ artworkId, size = 24 }) {
  const { user, subscription } = useAuth()
  const [isShortlisted, setIsShortlisted] = useState(false)
  const [loading, setLoading] = useState(false)

  const canAccessShortlist = subscription?.plan_id && subscription.plan_id !== 'free'

  useEffect(() => {
    if (!user?.id || !artworkId) return
    checkIsShortlisted(user.id, artworkId).then((result) => {
      if (result.success) setIsShortlisted(result.isShortlisted)
    })
  }, [user?.id, artworkId])

  const handleClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user?.id) {
      window.location.href = '/auth/signin'
      return
    }

    if (!canAccessShortlist) {
      // Open gate or show notification
      alert('Shortlisting requires a paid plan. Upgrade to Explorer (27€/month) or higher.')
      return
    }

    setLoading(true)
    try {
      if (isShortlisted) {
        const result = await removeFromShortlist(user.id, artworkId)
        if (result.success) setIsShortlisted(false)
      } else {
        const result = await addToShortlist(user.id, artworkId)
        if (result.success) setIsShortlisted(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`p-1 rounded transition-colors ${
        isShortlisted
          ? 'text-amber-400 hover:text-amber-300'
          : 'text-gray-500 hover:text-gray-400'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
    >
      {loading ? (
        <svg width={size} height={size} className="animate-spin" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      ) : isShortlisted ? (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 17 8" />
        </svg>
      ) : (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 17 8" />
        </svg>
      )}
    </button>
  )
}
