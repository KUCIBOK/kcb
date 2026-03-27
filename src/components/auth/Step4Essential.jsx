/**
 * Step4Essential — Minimum strict requis pour créer le compte.
 * Commun à tous les rôles + champs spécifiques (photo artiste, institution pro).
 * Appelle handleSignUp → le compte est créé ici.
 * Ensuite le flow propose Step5 (enrichissement optionnel).
 */
import { Camera, Building2, Loader2 } from "lucide-react";

const INPUT = "w-full border border-white/[0.08] bg-kcb-noir px-3 py-3 text-sm text-white placeholder-kcb-pierre/50 focus:outline-none focus:ring-1 focus:ring-kcb-or focus:border-kcb-or transition-all duration-200";
const LABEL = "block text-xs font-medium text-kcb-sable mb-1.5";

const CGU_LINKS = [
  { key: "acceptTerms",   label: "J'accepte les", link: "/terms-and-conditions", linkLabel: "Conditions d'utilisation" },
  { key: "acceptPrivacy", label: "J'accepte la",  link: "/privacy-policy",       linkLabel: "Politique de confidentialité" },
];

export const Step4Essential = ({ formState, setFormState, handleSignUp }) => {
  const set = (key, val) => setFormState(p => ({ ...p, [key]: val }));
  const isArtist = formState.role === "artist";
  const isPro    = formState.role === "curator";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormState(p => ({ ...p, show: reader.result, image: file }));
    reader.readAsDataURL(file);
  };

  const canSubmit =
    formState.acceptTerms &&
    formState.acceptPrivacy &&
    formState.name?.trim().length >= 2 &&
    formState.country &&
    (!isArtist || formState.image) &&
    (!isPro || formState.institution?.trim().length >= 2) &&
    !formState.loading;

  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-kcb-or" />

      {formState.error && (
        <div className="mb-6 text-red-300 bg-red-900/20 border border-red-900/40 p-3 text-xs text-center">
          {formState.error}
        </div>
      )}

      <p className="text-base font-semibold text-white mb-1">Identité</p>
      <p className="text-xs text-kcb-pierre mb-7">
        Le strict nécessaire pour créer votre compte. <span className="text-kcb-or">Rapide.</span>
      </p>

      <form onSubmit={handleSignUp} className="space-y-5" method="post" encType="multipart/form-data">

        {/* Photo — artiste uniquement */}
        {isArtist && (
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => document.getElementById('essential-photo').click()}
              className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-white/[0.08] hover:border-kcb-or/50 transition-all shrink-0"
            >
              {formState.show
                ? <img src={formState.show} alt="Profil" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-kcb-noir flex items-center justify-center">
                    <Camera className="w-6 h-6 text-kcb-pierre/40" />
                  </div>
              }
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </button>
            <div>
              <p className="text-xs font-medium text-kcb-sable mb-1">
                Photo de profil <span className="text-kcb-or">*</span>
              </p>
              <p className={`text-[11px] ${formState.image ? "text-green-400" : "text-kcb-pierre"}`}>
                {formState.image ? "Photo sélectionnée ✓" : "Obligatoire pour les artistes"}
              </p>
              <button type="button"
                onClick={() => document.getElementById('essential-photo').click()}
                className="mt-2 text-[11px] text-kcb-or hover:underline">
                {formState.image ? "Changer" : "Choisir une photo"}
              </button>
            </div>
            <input id="essential-photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        )}

        {/* Nom + Pays */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ess-name" className={LABEL}>
              Nom complet <span className="text-kcb-or">*</span>
            </label>
            <input id="ess-name" type="text" required minLength={2}
              placeholder="Votre nom"
              value={formState.name}
              onChange={e => set("name", e.target.value)}
              className={INPUT} />
          </div>
          <div>
            <label htmlFor="ess-country" className={LABEL}>
              Pays <span className="text-kcb-or">*</span>
            </label>
            <select id="ess-country" required
              value={formState.country}
              onChange={e => set("country", e.target.value)}
              className={`${INPUT} cursor-pointer`}>
              {formState.countries?.map((c, i) => (
                <option key={i} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Institution — professionnel uniquement */}
        {isPro && (
          <div>
            <label htmlFor="ess-institution" className={LABEL}>
              Galerie / Institution <span className="text-kcb-or">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre/40" />
              <input id="ess-institution" type="text" required minLength={2}
                placeholder="Galerie, musée, fondation..."
                value={formState.institution}
                onChange={e => set("institution", e.target.value)}
                className={`${INPUT} pl-9`} />
            </div>
          </div>
        )}

        {/* CGU */}
        <div className="space-y-2.5 pt-1">
          {CGU_LINKS.map(({ key, label, link, linkLabel }) => (
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
          className="w-full py-3 flex items-center justify-center gap-2 bg-kcb-or hover:bg-kcb-bronze text-kcb-noir font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase transition-all duration-200 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0">
          {formState.loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Création du compte...</>
            : "Créer mon compte →"}
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
