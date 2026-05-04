import { Eye, EyeOff } from 'lucide-react'
import { useState, useMemo } from 'react'
import { isPasswordLeaked } from '../../lib/hibp'

/** Calcule la force du mot de passe : 0-4 */
function passwordStrength(pwd) {
  if (!pwd) return 0
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return Math.min(score, 4)
}

const STRENGTH_CONFIG = [
  { label: 'Trop court', color: 'bg-red-500' },
  { label: 'Faible', color: 'bg-orange-500' },
  { label: 'Moyen', color: 'bg-yellow-400' },
  { label: 'Fort', color: 'bg-green-400' },
  { label: 'Très fort', color: 'bg-emerald-400' },
]

const INPUT =
  'w-full border border-white/[0.08] bg-kcb-noir px-3 py-3 pr-10 text-sm text-white placeholder-kcb-pierre/50 focus:outline-none focus:ring-1 focus:ring-kcb-or focus:border-kcb-or transition-all duration-200'

export const Step2 = ({ formState, setFormState }) => {
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [checking, setChecking] = useState(false)

  const strength = useMemo(() => passwordStrength(formState.password), [formState.password])
  const mismatch = formState.confirmPassword && formState.confirmPassword !== formState.password
  const canSubmit =
    formState.email && formState.password?.length >= 8 && formState.confirmPassword && !mismatch

  const handleNext = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setChecking(true)
    setFormState((p) => ({ ...p, error: null }))
    const leaked = await isPasswordLeaked(formState.password)
    setChecking(false)
    if (leaked) {
      setFormState((p) => ({
        ...p,
        error: 'Ce mot de passe a été compromis dans une fuite de données. Choisissez-en un autre.',
      }))
      return
    }
    setFormState((p) => ({ ...p, step: 2 }))
  }

  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-kcb-or" />

      {formState.error && (
        <div className="mb-6 text-red-300 bg-red-900/20 border border-red-900/40 p-3 text-xs text-center">
          {formState.error}
        </div>
      )}

      <p className="text-base font-semibold text-white mb-1">Créer votre compte</p>
      <p className="text-xs text-kcb-pierre mb-8">Email et mot de passe sécurisé</p>

      <form onSubmit={handleNext} className="space-y-5" method="post">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-kcb-sable mb-1.5">
            Adresse email <span className="text-kcb-or">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="vous@exemple.com"
            required
            minLength={6}
            value={formState.email}
            onChange={(e) => setFormState((p) => ({ ...p, email: e.target.value }))}
            className={INPUT}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-kcb-sable mb-1.5">
            Mot de passe <span className="text-kcb-or">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              placeholder="8 caractères minimum"
              required
              minLength={8}
              value={formState.password}
              onChange={(e) => setFormState((p) => ({ ...p, password: e.target.value }))}
              className={INPUT}
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-kcb-pierre hover:text-white transition"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password strength */}
          {formState.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-0.5 flex-1 transition-all duration-300 ${
                      strength >= i ? STRENGTH_CONFIG[strength].color : 'bg-white/[0.08]'
                    }`}
                  />
                ))}
              </div>
              <p
                className={`text-[10px] ${strength <= 1 ? 'text-red-400' : strength <= 2 ? 'text-yellow-400' : 'text-green-400'}`}
              >
                {STRENGTH_CONFIG[strength]?.label}
              </p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-medium text-kcb-sable mb-1.5"
          >
            Confirmer le mot de passe <span className="text-kcb-or">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Répétez le mot de passe"
              required
              minLength={8}
              value={formState.confirmPassword}
              onChange={(e) => setFormState((p) => ({ ...p, confirmPassword: e.target.value }))}
              className={`${INPUT} ${mismatch ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-kcb-pierre hover:text-white transition"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {mismatch && (
            <p className="text-[11px] text-red-400 mt-1.5">
              Les mots de passe ne correspondent pas
            </p>
          )}
          {formState.confirmPassword && !mismatch && (
            <p className="text-[11px] text-green-400 mt-1.5">Mots de passe identiques ✓</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || checking}
          className="w-full py-3 bg-kcb-or hover:bg-kcb-bronze text-kcb-noir font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase transition-all duration-200 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2"
        >
          {checking ? 'Vérification…' : 'Suivant'}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-white/[0.04]">
        <button
          onClick={() => setFormState((p) => ({ ...p, step: 0, loading: false }))}
          className="text-xs text-kcb-pierre hover:text-white transition w-full text-center"
        >
          ← Retour
        </button>
      </div>
    </div>
  )
}
