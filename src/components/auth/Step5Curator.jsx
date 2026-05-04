/**
 * Step5Curator — Enrichissement profil curateur (optionnel, skippable).
 */
import { Loader2, ArrowRight } from 'lucide-react'

const INPUT =
  'w-full border border-white/[0.08] bg-kcb-noir px-3 py-3 text-sm text-white placeholder-kcb-pierre/50 focus:outline-none focus:ring-1 focus:ring-kcb-or focus:border-kcb-or transition-all duration-200'
const LABEL = 'block text-xs font-medium text-kcb-sable mb-1.5'

const SPECIALTIES = [
  "Galerie d'art",
  'Curateur indépendant',
  'Art advisor',
  'Maison de vente',
  'Musée / Institution',
  'Art consulting',
  "Critique d'art",
  'Autre',
]

export const Step5Curator = ({ formState, setFormState, onEnrich, onSkip }) => {
  const set = (key, val) => setFormState((p) => ({ ...p, [key]: val }))
  const specialty = formState.qualifications?.length <= 30 ? formState.qualifications : ''
  const qualifText = formState.qualifications?.length > 30 ? formState.qualifications : ''

  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-kcb-or" />

      <div className="p-8 pb-6 border-b border-white/[0.04]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-white mb-1">Votre expertise</p>
            <p className="text-xs text-kcb-pierre">
              Détaillez votre activité pour accéder aux outils B2B adaptés. Modifiable depuis votre
              profil.
            </p>
          </div>
          <span className="shrink-0 text-[10px] border border-kcb-or/30 text-kcb-or px-2 py-1 font-medium tracking-wide uppercase">
            Optionnel
          </span>
        </div>
      </div>

      <div className="p-8 space-y-5">
        {/* Pseudo + Téléphone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="s5p-username" className={LABEL}>
              Pseudo
            </label>
            <input
              id="s5p-username"
              type="text"
              minLength={3}
              placeholder="@votre_pseudo"
              value={formState.username}
              onChange={(e) => set('username', e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="s5p-tel" className={LABEL}>
              Téléphone
            </label>
            <input
              id="s5p-tel"
              type="tel"
              placeholder="+33 6 00 00 00 00"
              value={formState.telephone}
              onChange={(e) => set('telephone', e.target.value)}
              className={INPUT}
            />
          </div>
        </div>

        {/* Spécialité (tags) */}
        <div>
          <label className={LABEL}>Spécialité</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {SPECIALTIES.map((spec) => {
              const active = specialty === spec
              return (
                <button
                  key={spec}
                  type="button"
                  onClick={() => set('qualifications', active ? '' : spec)}
                  className={`text-[11px] px-3 py-1.5 border transition-all duration-150 ${
                    active
                      ? 'border-kcb-or bg-kcb-or/10 text-kcb-or'
                      : 'border-white/[0.08] text-kcb-pierre hover:border-kcb-or/30 hover:text-white'
                  }`}
                >
                  {spec}
                </button>
              )
            })}
          </div>
        </div>

        {/* Qualifications */}
        <div>
          <label htmlFor="s5p-qualif" className={LABEL}>
            Expérience & qualifications
          </label>
          <textarea
            id="s5p-qualif"
            rows={3}
            placeholder="Diplômes, années d'expérience, spécialisations..."
            value={qualifText}
            onChange={(e) => set('qualifications', e.target.value)}
            className={`${INPUT} resize-none`}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            type="button"
            onClick={onEnrich}
            disabled={formState.loading}
            className="w-full py-3 flex items-center justify-center gap-2 bg-kcb-or hover:bg-kcb-bronze text-kcb-noir font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase transition-all hover:-translate-y-px disabled:opacity-40"
          >
            {formState.loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...
              </>
            ) : (
              <>
                <ArrowRight className="w-3.5 h-3.5" /> Sauvegarder et continuer
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="w-full py-2.5 text-xs text-kcb-pierre hover:text-white border border-white/[0.06] hover:border-white/[0.15] transition text-center"
          >
            Compléter plus tard → Accéder au dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
