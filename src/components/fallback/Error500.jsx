import { ArrowLeft, Home, RefreshCw } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { sendErrorReport } from '../../api/error.js'

/**
 * Error 500 fallback page — KCB theme (noir/ivoire/or).
 *
 * Receives `{ error, resetErrorBoundary }` from react-error-boundary.
 *
 * @param {{ error?: Error, resetErrorBoundary?: () => void }} props
 * @returns {JSX.Element}
 */
export default function Error500({ error, resetErrorBoundary }) {
  const navigate = useNavigate()

  useEffect(() => {
    const sendReport = async () => {
      try {
        await sendErrorReport({
          message: error?.message || 'Erreur 500',
          stack: error?.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
        })
      } catch (err) {
        // Silently fail — Sentry will catch this if configured
      }
    }
    sendReport()
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-kcb-noir relative overflow-hidden px-4">
      {/* Background decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-kcb-or/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-kcb-bronze/5 rounded-full blur-3xl" />

      <div className="max-w-md w-full bg-kcb-ardoise/60 backdrop-blur-sm rounded-[4px] overflow-hidden shadow-2xl border border-white/[0.06]">
        <div className="p-6 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-8xl font-bold text-kcb-or mb-2 tracking-tighter">500</h1>
            <h2 className="text-2xl font-bold text-white mb-4">Erreur interne du serveur</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-kcb-or to-kcb-bronze mb-6" />

            <p className="text-kcb-pierre mb-8">
              Oups ! On dirait que quelque chose a mal tourné en coulisses. Veuillez réessayer ou
              contacter l'administrateur si le problème persiste. La galerie{' '}
              <span className="font-semibold text-kcb-ivoire">Kucibok</span> est toujours là pour
              vous.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {resetErrorBoundary ? (
                <button
                  className="w-full flex items-center justify-center py-2.5 px-4 text-white hover:bg-white/[0.08] group bg-kcb-ardoise border border-white/[0.06] rounded-[4px] transition-colors"
                  onClick={resetErrorBoundary}
                >
                  <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
                  Réessayer
                </button>
              ) : (
                <button
                  className="w-full flex items-center justify-center py-2.5 px-4 text-white hover:bg-white/[0.08] group bg-kcb-ardoise border border-white/[0.06] rounded-[4px] transition-colors"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Retour
                </button>
              )}

              <Link
                to="/"
                className="w-full flex items-center justify-center py-2.5 px-4 bg-kcb-or text-kcb-noir font-medium hover:bg-kcb-bronze rounded-[4px] transition-colors"
              >
                <Home className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-kcb-pierre">
        &copy; {new Date().getFullYear()} Kucibok. Tous droits réservés.
      </div>
    </div>
  )
}
