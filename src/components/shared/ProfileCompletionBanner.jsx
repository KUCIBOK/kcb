import { UserCheck } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'

function isProfileComplete(profile, role) {
  if (!profile) return false
  if (role === 'artist') {
    return !!(profile.country && profile.biography && profile.image)
  }
  if (role === 'curator') {
    return !!(profile.country && profile.image)
  }
  if (role === 'buyer') {
    return !!(profile.country && profile.image)
  }
  return true
}

function profileTabIndex(role) {
  if (role === 'artist') return 8
  if (role === 'curator') return 12
  return 3
}

export function ProfileCompletionBanner({ setTab }) {
  const { user, artistProfile, buyerProfile, curatorProfile } = useAuth()
  if (!user) return null

  const profile =
    user.role === 'artist' ? artistProfile : user.role === 'curator' ? curatorProfile : buyerProfile

  if (isProfileComplete(profile, user.role)) return null

  return (
    <div className="flex items-center gap-3 bg-kcb-ardoise border border-kcb-or/20 rounded-[4px] px-4 py-3 mb-6 text-sm">
      <UserCheck className="w-4 h-4 text-kcb-or flex-shrink-0" />
      <p className="text-kcb-sable flex-1">
        Complétez votre profil pour être visible sur la plateforme.{' '}
        {setTab ? (
          <button
            onClick={() => setTab(profileTabIndex(user.role))}
            className="text-kcb-or underline hover:text-kcb-bronze"
          >
            Compléter maintenant
          </button>
        ) : null}
      </p>
    </div>
  )
}
