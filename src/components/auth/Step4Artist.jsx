import { Camera } from "lucide-react";
import { DataLoader } from "../loaders/PageLoader";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const Step4Artist = ({ formState, setFormState, handleSignUp }) => {
  const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormState({ ...formState, show: reader.result, image : file });
            };
            reader.readAsDataURL(file);
        }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-kcb-noir-deep px-4">
      <div className="w-full max-w-sm mx-auto">
        {formState?.error && (
          <div className="mb-4 text-red-300 text-center bg-red-900/20 border border-red-900 rounded-md p-2 text-xs">
            {formState.error}
          </div>
        )}
        <div className="bg-kcb-ardoise rounded-[4px] border border-white/[0.06] shadow-sm p-6">
          <p className="text-center text-xl font-bold text-white mb-2">Profil Artiste</p>
          <p className="text-xs text-center text-kcb-pierre mb-6">Parlez-nous un peu plus de vous</p>

          <form onSubmit={handleSignUp} className="space-y-4" method="post" encType="multipart/form-data">
            {formState?.image ? (
                <img src={formState?.show} alt="Profile" className="w-28 h-28 object-cover rounded-full mb-4 mx-auto border-4 border-white/[0.06] shadow" />
            ) : (
                <div className="w-28 h-28 rounded-full bg-gray-800 mb-4 flex justify-center items-center mx-auto border-4 border-white/[0.06]">
                <Camera className="w-10 h-10 text-kcb-pierre" />
                </div>
            )}
            <div className="mx-auto text-center">
                <button type="button" onClick={() => document.getElementById('profile-image').click()} className="border border-white/[0.06] bg-kcb-noir w-full rounded-md text-xs text-white font-medium px-3 py-1 mb-2 hover:bg-white/[0.03] transition">
                {!formState?.image ? "Mettre une photo (obligatoire)" : "Modifier la photo"}
                </button>
                <input
                id="profile-image"
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                />
            </div>
            <div>
              <label htmlFor="name" className="text-xs font-medium text-kcb-pierre">Nom complet</label>
              <input
                onChange={e => setFormState({ ...formState, name: e.target.value })}
                value={formState?.name}
                type="text"
                name="name"
                id="name"
                required
                className="w-full border border-white/[0.06] bg-kcb-noir rounded-md px-3 py-2 mt-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or"
                minLength={6}
                placeholder="Entrez votre nom complet"
              />
            </div>
            <div>
              <label htmlFor="username" className="text-xs font-medium text-kcb-pierre">Pseudo</label>
              <input
                onChange={e => setFormState({ ...formState, username: e.target.value })}
                value={formState?.username}
                type="text"
                name="username"
                id="username"
                required
                className="w-full border border-white/[0.06] bg-kcb-noir rounded-md px-3 py-2 mt-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or"
                minLength={6}
                placeholder="Entrez votre pseudo"
              />
            </div>
            <div>
              <label htmlFor="telephone" className="text-xs font-medium text-kcb-pierre">Téléphone</label>
              <input
                onChange={e => setFormState({ ...formState, telephone: e.target.value })}
                value={formState?.telephone}
                type="tel"
                name="telephone"
                id="telephone"
                required
                className="w-full border border-white/[0.06] bg-kcb-noir rounded-md px-3 py-2 mt-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or"
                minLength={13}
                maxLength={18}
                placeholder="Votre numéro de téléphone"
              />
            </div>
            <div>
              <label htmlFor="country" className="text-xs font-medium text-kcb-pierre">Pays</label>
              <select
                name="country"
                onChange={e => setFormState({ ...formState, country: e.target.value })}
                value={formState.country}
                id="country"
                className="w-full border border-white/[0.06] bg-kcb-noir rounded-md px-3 py-2 mt-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or"
                required
              >
                {formState?.countries?.map((country, index) => (
                  <option key={index} value={country.name}>{country.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="biography" className="text-xs font-medium text-kcb-pierre">Biographie</label>
              <ReactQuill
                theme="snow"
                value={formState.biography}
                onChange={value => setFormState({ ...formState, biography: value })}
                className="border bg-white text-black border-background rounded-md my-2"
                placeholder="Parlez-nous de vous et de votre art"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-kcb-pierre">Liens vers vos réseaux sociaux (facultatif)</label>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  name="facebook"
                  id="facebook"
                  placeholder="Facebook"
                  value={formState.socials.facebook}
                  onChange={e => setFormState({ ...formState, socials: { ...formState.socials, facebook: e.target.value } })}
                  className="w-full border border-white/[0.06] bg-kcb-noir rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or"
                />
                <input
                  type="text"
                  name="twitter"
                  id="twitter"
                  placeholder="Twitter"
                  value={formState.socials.twitter}
                  onChange={e => setFormState({ ...formState, socials: { ...formState.socials, twitter: e.target.value } })}
                  className="w-full border border-white/[0.06] bg-kcb-noir rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or"
                />
                <input
                  type="text"
                  name="instagram"
                  id="instagram"
                  placeholder="Instagram"
                  value={formState.socials.instagram}
                  onChange={e => setFormState({ ...formState, socials: { ...formState.socials, instagram: e.target.value } })}
                  className="w-full border border-white/[0.06] bg-kcb-noir rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or"
                />
              </div>
            </div>
            <div>
              <label htmlFor="portfolio" className="text-xs font-medium text-kcb-pierre">Lien vers votre portfolio (facultatif)</label>
              <input
                onChange={e => setFormState({ ...formState, portfolio: e.target.value })}
                value={formState?.portfolio}
                type="url"
                name="portfolio"
                id="portfolio"
                className="w-full border border-white/[0.06] bg-kcb-noir rounded-md px-3 py-2 mt-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or"
                minLength={6}
                placeholder="https://votreportfolio.com"
              />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label className="flex items-center text-xs text-kcb-pierre">
                <input
                  type="checkbox"
                  checked={formState?.acceptTerms}
                  onChange={e => setFormState({ ...formState, acceptTerms: e.target.checked })}
                  required
                  className="mr-2 accent-kcb-or"
                />
                J'accepte les <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="underline text-kcb-or ml-1">Conditions d'utilisation</a>
              </label>
              <label className="flex items-center text-xs text-kcb-pierre">
                <input
                  type="checkbox"
                  checked={formState?.acceptPrivacy}
                  onChange={e => setFormState({ ...formState, acceptPrivacy: e.target.checked })}
                  required
                  className="mr-2 accent-kcb-or"
                />
                J'accepte la <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline text-kcb-or ml-1">Politique de confidentialité</a>
              </label>
            </div>
            <button
              disabled={!formState?.acceptTerms || !formState?.acceptPrivacy || formState?.loading}
              type="submit"
              className="w-full py-2 rounded-md bg-kcb-or text-white font-semibold text-sm hover:bg-kcb-bronze transition mt-2"
            >
              {formState?.loading ? <DataLoader /> : "Terminer"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() => setFormState({ ...formState, step: 2 })}
              className="text-xs text-kcb-pierre hover:underline w-full"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};