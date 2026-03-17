/**
 * Step5Collector — Enrichissement profil collectionneur (optionnel, skippable).
 */
import { Loader2, ArrowRight } from "lucide-react";

const INPUT = "w-full border border-white/[0.08] bg-kcb-noir px-3 py-3 text-sm text-white placeholder-kcb-pierre/50 focus:outline-none focus:ring-1 focus:ring-kcb-or focus:border-kcb-or transition-all duration-200";
const LABEL = "block text-xs font-medium text-kcb-sable mb-1.5";

const INTERESTS = [
  "Peinture", "Sculpture", "Photographie", "Art numérique",
  "Art textile", "Céramique", "Gravure", "Art contemporain",
  "Art traditionnel", "Art de rue",
];

export const Step5Collector = ({ formState, setFormState, onEnrich, onSkip }) => {
  const set = (key, val) => setFormState(p => ({ ...p, [key]: val }));

  const toggleInterest = (interest) => {
    const current = formState.interests ? formState.interests.split(",").map(s => s.trim()).filter(Boolean) : [];
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    set("interests", updated.join(", "));
  };

  const selected = formState.interests
    ? formState.interests.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-kcb-or" />

      <div className="p-8 pb-6 border-b border-white/[0.04]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-white mb-1">Personnalisez votre expérience</p>
            <p className="text-xs text-kcb-pierre">
              Aidez-nous à vous recommander les œuvres qui correspondent à vos goûts. Modifiable depuis votre profil.
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
            <label htmlFor="s5c-username" className={LABEL}>Pseudo</label>
            <input id="s5c-username" type="text" minLength={3}
              placeholder="@votre_pseudo"
              value={formState.username}
              onChange={e => set("username", e.target.value)}
              className={INPUT} />
          </div>
          <div>
            <label htmlFor="s5c-tel" className={LABEL}>Téléphone</label>
            <input id="s5c-tel" type="tel"
              placeholder="+221 70 000 00 00"
              value={formState.telephone}
              onChange={e => set("telephone", e.target.value)}
              className={INPUT} />
          </div>
        </div>

        {/* Intérêts */}
        <div>
          <label className={LABEL}>
            Intérêts artistiques
            {selected.length > 0 && (
              <span className="ml-2 text-kcb-or font-normal">— {selected.length} sélectionné{selected.length > 1 ? "s" : ""}</span>
            )}
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {INTERESTS.map(interest => {
              const active = selected.includes(interest);
              return (
                <button key={interest} type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`text-[11px] px-3 py-1.5 border transition-all duration-150 ${
                    active
                      ? "border-kcb-or bg-kcb-or/10 text-kcb-or"
                      : "border-white/[0.08] text-kcb-pierre hover:border-kcb-or/30 hover:text-white"
                  }`}>
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <button type="button" onClick={onEnrich} disabled={formState.loading}
            className="w-full py-3 flex items-center justify-center gap-2 bg-kcb-or hover:bg-kcb-bronze text-kcb-noir font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase transition-all hover:-translate-y-px disabled:opacity-40">
            {formState.loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...</>
              : <><ArrowRight className="w-3.5 h-3.5" /> Sauvegarder et continuer</>}
          </button>
          <button type="button" onClick={onSkip}
            className="w-full py-2.5 text-xs text-kcb-pierre hover:text-white border border-white/[0.06] hover:border-white/[0.15] transition text-center">
            Compléter plus tard → Accéder au dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
