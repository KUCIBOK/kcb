import { Camera, Instagram, Twitter, Facebook, Globe, Loader2 } from "lucide-react";

const INPUT = "w-full border border-white/[0.08] bg-kcb-noir px-3 py-3 text-sm text-white placeholder-kcb-pierre/50 focus:outline-none focus:ring-1 focus:ring-kcb-or focus:border-kcb-or transition-all duration-200";
const LABEL = "block text-xs font-medium text-kcb-sable mb-1.5";

export const Step4Artist = ({ formState, setFormState, handleSignUp }) => {
  const set = (key, val) => setFormState(p => ({ ...p, [key]: val }));
  const setSocial = (key, val) => setFormState(p => ({ ...p, socials: { ...p.socials, [key]: val } }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormState(p => ({ ...p, show: reader.result, image: file }));
    reader.readAsDataURL(file);
  };

  const canSubmit = formState.acceptTerms && formState.acceptPrivacy && !formState.loading;

  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-kcb-or" />

      {formState.error && (
        <div className="mb-6 text-red-300 bg-red-900/20 border border-red-900/40 p-3 text-xs text-center">
          {formState.error}
        </div>
      )}

      <p className="text-base font-semibold text-white mb-1">Profil Artiste</p>
      <p className="text-xs text-kcb-pierre mb-8">Votre identité sur Kucibok Bridge.</p>

      <form onSubmit={handleSignUp} className="space-y-5" method="post" encType="multipart/form-data">

        {/* Photo de profil */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => document.getElementById('artist-profile-img').click()}
            className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-white/[0.08] hover:border-kcb-or/50 transition-all duration-200"
          >
            {formState.show ? (
              <img src={formState.show} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-kcb-noir flex items-center justify-center">
                <Camera className="w-8 h-8 text-kcb-pierre/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </button>
          <p className="text-[11px] text-kcb-pierre">
            {formState.image ? "Photo sélectionnée ✓" : "Photo obligatoire — cliquez pour choisir"}
          </p>
          <input id="artist-profile-img" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

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
              placeholder="+221 70 000 00 00" value={formState.telephone}
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

        {/* Biographie */}
        <div>
          <label htmlFor="biography" className={LABEL}>
            Biographie <span className="text-kcb-pierre/50">(facultatif)</span>
          </label>
          <textarea id="biography" name="biography" rows={4}
            placeholder="Parlez de votre démarche artistique, vos influences, vos médiums..."
            value={formState.biography}
            onChange={e => set("biography", e.target.value)}
            className={`${INPUT} resize-none`}
          />
        </div>

        {/* Réseaux sociaux */}
        <div>
          <label className={LABEL}>Réseaux sociaux <span className="text-kcb-pierre/50">(facultatif)</span></label>
          <div className="space-y-2">
            {[
              { key: "instagram", Icon: Instagram, placeholder: "instagram.com/votre-compte" },
              { key: "twitter",   Icon: Twitter,   placeholder: "x.com/votre-compte" },
              { key: "facebook",  Icon: Facebook,  placeholder: "facebook.com/votre-page" },
            ].map(({ key, Icon, placeholder }) => (
              <div key={key} className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre/40" />
                <input type="url" placeholder={placeholder}
                  value={formState.socials[key]}
                  onChange={e => setSocial(key, e.target.value)}
                  className={`${INPUT} pl-9`} />
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        <div>
          <label htmlFor="portfolio" className={LABEL}>
            Portfolio <span className="text-kcb-pierre/50">(facultatif)</span>
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre/40" />
            <input id="portfolio" name="portfolio" type="url"
              placeholder="https://votreportfolio.com"
              value={formState.portfolio}
              onChange={e => set("portfolio", e.target.value)}
              className={`${INPUT} pl-9`} />
          </div>
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
