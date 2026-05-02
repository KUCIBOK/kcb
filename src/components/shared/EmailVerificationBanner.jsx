import { useState } from 'react'
import { MailWarning, X } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'

export function EmailVerificationBanner() {
  const { user } = useAuth()
  const [dismissed, setDismissed] = useState(false)

  if (!user || user.isEmailVerified || dismissed) return null

  return (
    <div className="flex items-center gap-3 bg-amber-900/40 border border-amber-700/50 rounded-[4px] px-4 py-3 mb-6 text-sm">
      <MailWarning className="w-4 h-4 text-amber-400 flex-shrink-0" />
      <p className="text-amber-200 flex-1">
        Votre adresse email n'est pas encore vérifiée. Consultez votre boîte mail et cliquez sur le lien reçu pour activer votre compte.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-white flex-shrink-0"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
