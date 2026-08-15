import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Award, Brush, ShoppingBag, TrendingUp } from 'lucide-react'
import { Helmet } from 'react-helmet'
import { useAuth } from '../../store/AuthContext'
import { setInitialRole } from '../../api/useAuth'
import { DataLoader } from '../../components/loaders/PageLoader'
import RevealOnScroll from '../../components/landing/RevealOnScroll'

const ROLE_DASHBOARDS = {
  artist: '/dashboard/artist',
  curator: '/dashboard/curator',
  advisor: '/dashboard/advisor',
  buyer: '/account',
  admin: '/dashboard/admin',
}

export default function GoogleRoleSelection() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!role) return
    setLoading(true)
    setError('')
    try {
      const updated = await setInitialRole(role)
      if (updated?.error) {
        setError(updated.error)
        setLoading(false)
        return
      }
      navigate(ROLE_DASHBOARDS[role] || '/')
    } catch (err) {
      setError(err?.message || 'Erreur lors de la mise à jour du rôle.')
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Choisir votre rôle | Kucibok</title>
        <meta name="description" content="Choisissez votre rôle sur Kucibok" />
      </Helmet>
      <div className="flex min-h-screen flex-col items-center justify-center bg-kcb-noir-deep px-4">
        <RevealOnScroll>
          <div className="w-full max-w-md mx-auto py-8">
            <div className="text-center mb-8">
              <Link to="/">
                <img
                  src="/images/kucibok-white-logo.svg"
                  alt="logo kucibok"
                  className="w-12 h-12 object-cover mx-auto"
                />
              </Link>
              <h2 className="font-playfair text-xl font-semibold text-kcb-sable mb-1">
                Bienvenue sur Kucibok
              </h2>
              <p className="text-xs text-kcb-pierre">
                Comment souhaitez-vous utiliser la plateforme ?
              </p>
            </div>
            <div className="bg-kcb-ardoise rounded-[4px] border border-white/[0.06] shadow-sm p-6">
              {error && (
                <div className="mb-4 text-red-300 text-center bg-red-900/20 border border-red-900 rounded-[4px] p-2 text-xs">
                  {error}
                </div>
              )}
              <p className="text-center text-xl font-bold text-white mb-2">Choisissez votre rôle</p>
              <p className="text-xs text-center text-kcb-pierre mb-6">
                Sélectionnez votre profil pour personnaliser votre expérience
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setRole('artist')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setRole('artist')
                    }
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-[4px] border cursor-pointer transition focus-visible:ring-2 focus-visible:ring-kcb-or focus-visible:ring-offset-0 ${
                    role === 'artist'
                      ? 'border-kcb-or bg-kcb-or/10'
                      : 'border-white/[0.06] hover:border-kcb-or/40'
                  }`}
                  aria-pressed={role === 'artist'}
                  type="button"
                >
                  <span className="rounded-full bg-kcb-or/10 p-2">
                    <Brush className="text-kcb-or/80" />
                  </span>
                  <span className="text-white text-base font-medium">Artiste</span>
                </button>
                <button
                  onClick={() => setRole('curator')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setRole('curator')
                    }
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-[4px] border cursor-pointer transition focus-visible:ring-2 focus-visible:ring-kcb-or focus-visible:ring-offset-0 ${
                    role === 'curator'
                      ? 'border-kcb-or bg-kcb-or/10'
                      : 'border-white/[0.06] hover:border-kcb-or/40'
                  }`}
                  aria-pressed={role === 'curator'}
                  type="button"
                >
                  <span className="rounded-full bg-kcb-or/10 p-2">
                    <Award className="text-kcb-or/80" />
                  </span>
                  <span className="text-white text-base font-medium">Curateur</span>
                </button>
                <button
                  onClick={() => setRole('advisor')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setRole('advisor')
                    }
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-[4px] border cursor-pointer transition focus-visible:ring-2 focus-visible:ring-kcb-or focus-visible:ring-offset-0 ${
                    role === 'advisor'
                      ? 'border-kcb-or bg-kcb-or/10'
                      : 'border-white/[0.06] hover:border-kcb-or/40'
                  }`}
                  aria-pressed={role === 'advisor'}
                  type="button"
                >
                  <span className="rounded-full bg-kcb-or/10 p-2">
                    <TrendingUp className="text-kcb-or/80" />
                  </span>
                  <span className="text-white text-base font-medium">Advisor</span>
                </button>
                <button
                  onClick={() => setRole('buyer')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setRole('buyer')
                    }
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-[4px] border cursor-pointer transition focus-visible:ring-2 focus-visible:ring-kcb-or focus-visible:ring-offset-0 ${
                    role === 'buyer'
                      ? 'border-kcb-or bg-kcb-or/10'
                      : 'border-white/[0.06] hover:border-kcb-or/40'
                  }`}
                  aria-pressed={role === 'buyer'}
                  type="button"
                >
                  <span className="rounded-full bg-kcb-or/10 p-2">
                    <ShoppingBag className="text-kcb-or/80" />
                  </span>
                  <span className="text-white text-base font-medium">Collectionneur</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!role || loading}
                  className="w-full py-2 rounded-[4px] bg-kcb-or text-kcb-noir font-semibold text-sm hover:bg-kcb-bronze transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.05em]"
                >
                  {loading ? <DataLoader /> : 'Continuer'}
                </button>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </>
  )
}
