import { Loader2, Building2 } from "lucide-react";

const INPUT = "w-full border border-white/[0.08] bg-kcb-noir px-3 py-3 text-sm text-white placeholder-kcb-pierre/50 focus:outline-none focus:ring-1 focus:ring-kcb-or focus:border-kcb-or transition-all duration-200";
const LABEL = "block text-xs font-medium text-kcb-sable mb-1.5";

const SPECIALTIES = [
  "Galerie d'art", "Curateur indépendant", "Art advisor", "Maison de vente",
  "Musée / Institution", "Art consulting", "Critique d'art", "Autre",
];

export const Step4Professional = ({ formState, setFormState, handleSignUp }) => {
  const set = (key, val) => setFormState(p => ({ ...p, [key]: val }));
  const canSubmit = formState.acceptTerms && formState.acceptPrivacy && !formState.loading;

  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-kcb-or" />

      {formState.error && (
        <div className="mb-6 text-red-300 bg-red-900/20 border border-red-900/40 p-3 text-xs text-center">
          {formState.error}
        </div>
      )}

      <p className="text-base font-semibold text-white mb-1">Profil Professionnel</p>
      <p className="text-xs text-kcb-pierre mb-8">Votre accès aux outils B2B de la plateforme.</p>

      <form onSubmit={handleSignUp} className="space-y-5" method="post">

        {/* Nom + pseudo */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="name" className={LABEL}>Nom complet <span className="text-kcb-or">*</span></label>
            <input id="name" name="name" type="text" required minLength={2}
              placeholder="Votre nom" value={formState.name}
              onChange={e => set("name", e.target.value)} className={INPUT} />
          </div>
          <div>
            <label htmlFor="username" className={LABEL}>Pseudo <span className="text-kcb-or">*</span></label>
            <input id="username" name="username" type="text" required minLength={3}
              placeholder="@pseudo" value={formState.username}
              onChange={e => set("username", e.target.value)} className={INPUT} />
          </div>
        </div>

        {/* Téléphone + Pays */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="telephone" className={LABEL}>Téléphone <span className="text-kcb-or">*</span></label>
            <input id="telephone" name="telephone" type="tel" required
              placeholder="+33 6 00 00 00 00" value={formState.telephone}
              onChange={e => set("telephone", e.target.value)} className={INPUT} />
          </div>
          <div>
            <label htmlFor="country" className={LABEL}>Pays <span className="text-kcb-or">*</span></label>
            <select id="country" name="country" required value={formState.country}
              onChange={e => set("country", e.target.value)}
              className={`${INPUT} cursor-pointer`}>
              {formState.countries?.map((c, i) => (
                <option key={i} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Institution */}
        <div>
          <label htmlFor="institution" className={LABEL}>
            Galerie / Institution <span className="text-kcb-or">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre/40" />
            <input id="institution" name="institution" type="text" required minLength={2}
              placeholder="Galerie, musée, maison de vente..."
              value={formState.institution}
              onChange={e => set("institution", e.target.value)}
              className={`${INPUT} pl-9`} />
          </div>
        </div>

        {/* Spécialité */}
        <div>
          <label className={LABEL}>
            Spécialité <span className="text-kcb-pierre/50">(facultatif)</span>
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {SPECIALTIES.map(spec => {
              const active = formState.qualifications === spec;
              return (
                <button key={spec} type="button"
                  onClick={() => set("qualifications", active ? "" : spec)}
                  className={`text-[11px] px-3 py-1.5 border transition-all duration-150 ${
                    active
                      ? "border-kcb-or bg-kcb-or/10 text-kcb-or"
                      : "border-white/[0.08] text-kcb-pierre hover:border-kcb-or/30 hover:text-white"
                  }`}>
                  {spec}
                </button>
              );
            })}
          </div>
        </div>

        {/* Qualifications texte libre */}
        <div>
          <label htmlFor="qualifications-text" className={LABEL}>
            Expérience & qualifications <span className="text-kcb-pierre/50">(facultatif)</span>
          </label>
          <textarea id="qualifications-text" rows={3}
            placeholder="Décrivez votre expérience, vos diplômes, vos spécialisations..."
            value={formState.qualifications?.includes(",") ? formState.qualifications : ""}
            onChange={e => set("qualifications", e.target.value)}
            className={`${INPUT} resize-none`}
          />
        </div>

        {/* CGU */}
        <div className="space-y-2 pt-2">
          {[
            { key: "acceptTerms", label: "J'accepte les", link: "/terms-and-conditions", linkLabel: "Conditions d'utilisation" },
            { key: "acceptPrivacy", label: "J'accepte la", link: "/privacy-policy", linkLabel: "Politique de confidentialité" },
          ].map(({ key, label, link, linkLabel }) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" required
                checked={formState[key] || false}
                onChange={e => set(key, e.target.checked)}
                className="w-4 h-4 accent-kcb-or shrink-0" />
              <span className="text-xs text-kcb-pierre group-hover:text-kcb-sable transition">
                {label}{" "}
                <a href={link} target="_blank" rel="noopener noreferrer"
                  className="text-kcb-or underline">{linkLabel}</a>
              </span>
            </label>
          ))}
        </div>

        <button type="submit" disabled={!canSubmit}
          className="w-full py-3 flex items-center justify-center gap-2 bg-kcb-or hover:bg-kcb-bronze text-kcb-noir font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase transition-all duration-200 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2">
          {formState.loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Inscription...</> : "Créer mon compte"}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-white/[0.04]">
        <button onClick={() => setFormState(p => ({ ...p, step: 2 }))}
          className="text-xs text-kcb-pierre hover:text-white transition w-full text-center">
          ← Retour
        </button>
      </div>
    </div>
  );
};
