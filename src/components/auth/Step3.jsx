import { Brush, Award, Check, Sparkles, TrendingUp } from 'lucide-react'

const ROLES = [
  {
    key: 'artist',
    icon: Brush,
    label: 'Artiste',
    description: 'Certifiez et vendez vos œuvres sur le marché africain et international.',
    badge: 'Créateur',
  },
  {
    key: 'curator',
    icon: Award,
    label: 'Curateur',
    description:
      'Galeries, curateurs indépendants — accédez aux outils B2B et gérez votre catalogue.',
    badge: 'Pro',
  },
  {
    key: 'advisor',
    icon: TrendingUp,
    label: 'Advisor',
    description:
      "Wealth managers de l'art — gérez des portefeuilles de collectionneurs et d'institutions.",
    badge: 'Expert',
  },
]

const PORTAL_HINT = {
  artist: { label: 'Portail Africa', desc: 'Rôle Artiste pré-sélectionné' },
  curator: { label: 'Portail Global', desc: 'Rôle Curateur pré-sélectionné' },
  advisor: { label: 'Portail Global', desc: 'Rôle Advisor pré-sélectionné' },
}

export function Step3({ formState, setFormState, roleFromUrl }) {
  const handleNext = () => {
    if (formState.role) setFormState((p) => ({ ...p, step: 3 }))
  }

  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-kcb-or" />

      {formState.error && (
        <div className="mb-6 text-red-300 bg-red-900/20 border border-red-900/40 p-3 text-xs text-center">
          {formState.error}
        </div>
      )}

      <p className="text-base font-semibold text-white mb-1">Quel est votre rôle ?</p>
      <p className="text-xs text-kcb-pierre mb-5">Votre profil sera adapté à votre activité.</p>

      {/* Badge contextuel si rôle pré-sélectionné depuis un portail */}
      {roleFromUrl && PORTAL_HINT[roleFromUrl] && (
        <div className="flex items-center gap-2 mb-6 px-3 py-2 border border-kcb-or/20 bg-kcb-or/[0.06]">
          <Sparkles className="w-3.5 h-3.5 text-kcb-or shrink-0" />
          <p className="text-[11px] text-kcb-or/80">
            <span className="font-semibold">{PORTAL_HINT[roleFromUrl].label}</span>
            {' — '}
            {PORTAL_HINT[roleFromUrl].desc}. Vous pouvez modifier votre choix.
          </p>
        </div>
      )}

      <div className="space-y-3 mb-6">
        {ROLES.map(({ key, icon: Icon, label, description, badge }) => {
          const selected = formState.role === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFormState((p) => ({ ...p, role: key }))}
              className={`w-full text-left flex items-start gap-4 px-4 py-4 border transition-all duration-200 relative group ${
                selected
                  ? 'border-kcb-or bg-kcb-or/[0.06]'
                  : 'border-white/[0.06] hover:border-kcb-or/40 hover:bg-white/[0.02]'
              }`}
            >
              {/* Icon */}
              <span
                className={`mt-0.5 p-2 transition-colors ${selected ? 'bg-kcb-or/20 text-kcb-or' : 'bg-white/[0.04] text-kcb-pierre'}`}
              >
                <Icon className="w-4 h-4" />
              </span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-sm font-semibold ${selected ? 'text-white' : 'text-kcb-sable'}`}
                  >
                    {label}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 font-medium tracking-wide ${
                      selected ? 'bg-kcb-or/20 text-kcb-or' : 'bg-white/[0.05] text-kcb-pierre'
                    }`}
                  >
                    {badge}
                  </span>
                </div>
                <p className="text-[12px] text-kcb-pierre leading-relaxed">{description}</p>
              </div>

              {/* Checkmark */}
              <span
                className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${
                  selected ? 'bg-kcb-or border-kcb-or' : 'border-white/[0.12]'
                }`}
              >
                {selected && <Check className="w-3 h-3 text-kcb-noir" strokeWidth={3} />}
              </span>
            </button>
          )
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={!formState.role}
        className="w-full py-3 bg-kcb-or hover:bg-kcb-bronze text-kcb-noir font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase transition-all duration-200 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        Continuer
      </button>

      <div className="mt-6 pt-5 border-t border-white/[0.04]">
        <button
          onClick={() => setFormState((p) => ({ ...p, error: '', step: 1, loading: false }))}
          className="text-xs text-kcb-pierre hover:text-white transition w-full text-center"
        >
          ← Retour
        </button>
      </div>
    </div>
  )
}
