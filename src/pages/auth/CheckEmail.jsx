import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import RevealOnScroll from '../../components/landing/RevealOnScroll'

export default function CheckEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''
  const enrichFailed = location.state?.enrichFailed ?? false
  if (!email) {
    navigate('/sign-in')
    return null
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-kcb-noir-deep px-4">
      <RevealOnScroll>
        <div className="w-full max-w-md bg-kcb-noir-deep border border-white/[0.06] rounded-[4px] shadow-xl p-8 flex flex-col items-center">
          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-kcb-or/10 mb-4 animate-bounce-slow">
            <MailCheck className="w-9 h-9 text-kcb-or" />
          </span>
          <h1 className="font-playfair text-[clamp(20px,2.5vw,28px)] font-bold text-white mb-2 tracking-tight">
            Vérification de votre email
          </h1>
          <p className="text-kcb-pierre text-base mb-6">
            Nous avons envoyé un lien de vérification à{' '}
            <span className="font-semibold text-white">{email}</span>.<br />
            <span className="text-kcb-pierre">
              Consultez votre boîte de réception (ou les spams) et cliquez sur le lien pour activer
              votre compte.
            </span>
          </p>
          {enrichFailed && (
            <p className="text-xs text-amber-400 bg-amber-900/20 border border-amber-700/40 rounded-[4px] px-3 py-2 mb-4 text-center">
              Certaines informations de profil n’ont pas pu être enregistrées. Vous pourrez les
              compléter depuis votre espace après connexion.
            </p>
          )}
          <Link
            to="/sign-in"
            className="inline-block mt-2 px-5 py-2 rounded-[4px] bg-kcb-or text-white font-medium text-sm shadow hover:bg-kcb-bronze transition-all focus:outline-none focus:ring-2 focus:ring-kcb-or"
          >
            J’ai déjà vérifié mon email
          </Link>
        </div>
      </RevealOnScroll>
    </div>
  )
}
