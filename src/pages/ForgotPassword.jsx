import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { DataLoader } from '../components/loaders/PageLoader'
import { supabase } from '../lib/supabase'
import RevealOnScroll from '../components/landing/RevealOnScroll'
import { isPasswordLeaked } from '../lib/hibp'
import { resetPassword } from '../api/useAuth'

// Parse le hash Supabase (#access_token=... ou #error=...)
function parseHash() {
  const params = new URLSearchParams(window.location.hash.slice(1))
  return {
    accessToken: params.get('access_token'),
    error: params.get('error_code') || params.get('error'),
  }
}

export default function ResetPasswordForm() {
  const { token } = useParams()
  const navigate = useNavigate()

  // Lire le hash immédiatement — avant le premier render
  const hash = parseHash()

  const [linkError, setLinkError] = useState(hash.error ?? null)
  // ready = true si : token dans l'URL (ancien flow) OU access_token dans le hash
  const [ready, setReady] = useState(!!token || (!!hash.accessToken && !hash.error))
  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
    error: '',
    success: false,
    loading: false,
  })

  useEffect(() => {
    // Déjà prêt ou erreur détectée — pas besoin d'écouter
    if (token || hash.error || hash.accessToken) return

    // Fallback : écouter PASSWORD_RECOVERY si hash pas encore dispo au mount
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
      if (event === 'SIGNED_OUT') setLinkError('access_denied')
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (state.password !== state.confirmPassword) {
      setState((s) => ({ ...s, error: 'Les mots de passe ne correspondent pas.' }))
      return
    }
    setState((s) => ({ ...s, error: '', loading: true }))
    try {
      const leaked = await isPasswordLeaked(state.password)
      if (leaked) {
        setState((s) => ({
          ...s,
          loading: false,
          error:
            'Ce mot de passe a été compromis dans une fuite de données. Choisissez-en un autre.',
        }))
        return
      }
      const result = await resetPassword({ password: state.password })
      if (result.error) {
        setState((s) => ({ ...s, error: result.error, loading: false }))
        return
      }
      setState((s) => ({ ...s, success: true, loading: false }))
      setTimeout(() => navigate('/sign-in'), 3000)
    } catch {
      setState((s) => ({ ...s, error: 'Erreur serveur. Veuillez réessayer.', loading: false }))
    }
  }

  return (
    <>
      <Helmet>
        <title>Réinitialiser le mot de passe | Kucibok</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-kcb-noir-deep px-2 py-10">
        <RevealOnScroll>
          <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-7">
              <Link to="/">
                <img
                  src="/images/kucibok-white-logo.svg"
                  alt="logo kucibok"
                  className="w-12 h-12 object-cover mx-auto"
                />
              </Link>
              <p className="font-playfair text-xl font-semibold text-white mb-1">
                Nouveau mot de passe
              </p>
              <p className="text-xs text-kcb-pierre">Entrez un nouveau mot de passe sécurisé</p>
            </div>

            {/* Lien expiré ou invalide */}
            {linkError && (
              <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5 text-center space-y-4">
                <p className="text-white text-sm font-semibold">Ce lien a expiré</p>
                <p className="text-kcb-pierre text-xs leading-relaxed">
                  Les liens d'accès sont valides 24h. Le vôtre n'est plus utilisable.
                </p>
                <Link
                  to="/forgot-password"
                  className="inline-block w-full py-2 bg-kcb-or text-kcb-noir-deep text-xs font-bold uppercase tracking-widest text-center"
                >
                  Demander un nouveau lien
                </Link>
                <Link to="/" className="block text-xs text-kcb-pierre hover:text-white transition">
                  ← Retour à l'accueil
                </Link>
              </div>
            )}

            {/* Vérification en cours */}
            {!linkError && !ready && (
              <div className="text-center py-10 text-kcb-pierre text-sm">
                Vérification du lien en cours…
              </div>
            )}

            {/* Formulaire */}
            {!linkError && ready && (
              <>
                {state.error && (
                  <div className="mb-3 border border-red-900 rounded-[4px] bg-red-950/90 text-white p-3 text-xs">
                    {state.error}
                  </div>
                )}
                {state.success && (
                  <div className="mb-3 border border-green-900 rounded-[4px] bg-green-950/90 text-green-200 p-3 text-xs">
                    Mot de passe défini ! Redirection vers la connexion…
                  </div>
                )}
                <form
                  onSubmit={handleSubmit}
                  className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] shadow-md p-5 space-y-4"
                  autoComplete="off"
                >
                  <input
                    type="password"
                    value={state.password}
                    onChange={(e) => setState((s) => ({ ...s, password: e.target.value }))}
                    required
                    minLength={8}
                    placeholder="Nouveau mot de passe"
                    className="w-full border border-white/[0.06] bg-kcb-noir-deep rounded-[4px] px-3 py-2 text-sm text-white placeholder:text-kcb-pierre focus:outline-none focus:ring-2 focus:ring-kcb-or transition"
                  />
                  <input
                    type="password"
                    value={state.confirmPassword}
                    onChange={(e) => setState((s) => ({ ...s, confirmPassword: e.target.value }))}
                    required
                    minLength={8}
                    placeholder="Répétez le mot de passe"
                    className="w-full border border-white/[0.06] bg-kcb-noir-deep rounded-[4px] px-3 py-2 text-sm text-white placeholder:text-kcb-pierre focus:outline-none focus:ring-2 focus:ring-kcb-or transition"
                  />
                  <button
                    type="submit"
                    disabled={state.loading}
                    className="w-full py-2 rounded-[4px] bg-kcb-or text-white font-semibold text-sm hover:bg-kcb-bronze transition flex items-center justify-center min-h-[40px]"
                  >
                    {state.loading ? <DataLoader /> : 'Définir mon mot de passe'}
                  </button>
                </form>
              </>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </>
  )
}
