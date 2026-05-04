/**
 * Step5Artist — Enrichissement profil artiste (optionnel, skippable).
 * Le compte est déjà créé. Ces données sont envoyées via onEnrich ou ignorées via onSkip.
 */
import { Instagram, Twitter, Facebook, Globe, Loader2, ArrowRight } from 'lucide-react'

const INPUT =
  'w-full border border-white/[0.08] bg-kcb-noir px-3 py-3 text-sm text-white placeholder-kcb-pierre/50 focus:outline-none focus:ring-1 focus:ring-kcb-or focus:border-kcb-or transition-all duration-200'
const LABEL = 'block text-xs font-medium text-kcb-sable mb-1.5'

export const Step5Artist = ({ formState, setFormState, onEnrich, onSkip }) => {
  const set = (key, val) => setFormState((p) => ({ ...p, [key]: val }))
  const setSocial = (key, val) =>
    setFormState((p) => ({ ...p, socials: { ...p.socials, [key]: val } }))

  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-kcb-or" />

      {/* Header avec badge "optionnel" */}
      <div className="p-8 pb-6 border-b border-white/[0.04]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-white mb-1">Enrichissez votre profil</p>
            <p className="text-xs text-kcb-pierre">
              Ces informations aident les collectionneurs à vous découvrir. Vous pouvez les ajouter
              maintenant ou plus tard depuis votre dashboard.
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
            <label htmlFor="s5-username" className={LABEL}>
              Pseudo
            </label>
            <input
              id="s5-username"
              type="text"
              minLength={3}
              placeholder="@votre_pseudo"
              value={formState.username}
              onChange={(e) => set('username', e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="s5-tel" className={LABEL}>
              Téléphone
            </label>
            <input
              id="s5-tel"
              type="tel"
              placeholder="+221 70 000 00 00"
              value={formState.telephone}
              onChange={(e) => set('telephone', e.target.value)}
              className={INPUT}
            />
          </div>
        </div>

        {/* Biographie */}
        <div>
          <label htmlFor="s5-bio" className={LABEL}>
            Biographie
          </label>
          <textarea
            id="s5-bio"
            rows={3}
            placeholder="Votre démarche artistique, vos influences, vos médiums..."
            value={formState.biography}
            onChange={(e) => set('biography', e.target.value)}
            className={`${INPUT} resize-none`}
          />
        </div>

        {/* Réseaux sociaux */}
        <div>
          <label className={LABEL}>Réseaux sociaux</label>
          <div className="space-y-2">
            {[
              { key: 'instagram', Icon: Instagram, placeholder: 'instagram.com/vous' },
              { key: 'twitter', Icon: Twitter, placeholder: 'x.com/vous' },
              { key: 'facebook', Icon: Facebook, placeholder: 'facebook.com/vous' },
            ].map(({ key, Icon, placeholder }) => (
              <div key={key} className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre/40" />
                <input
                  type="url"
                  placeholder={placeholder}
                  value={formState.socials[key]}
                  onChange={(e) => setSocial(key, e.target.value)}
                  className={`${INPUT} pl-9`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        <div>
          <label htmlFor="s5-portfolio" className={LABEL}>
            Portfolio
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre/40" />
            <input
              id="s5-portfolio"
              type="url"
              placeholder="https://votreportfolio.com"
              value={formState.portfolio}
              onChange={(e) => set('portfolio', e.target.value)}
              className={`${INPUT} pl-9`}
            />
          </div>
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
