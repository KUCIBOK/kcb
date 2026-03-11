import { DataLoader } from "../loaders/PageLoader";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const Step4Collector = ({ formState, setFormState, handleSignUp }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-kcb-noir-deep px-4">
      <div className="w-full max-w-sm mx-auto">
        {formState?.error && (
          <div className="mb-4 text-red-300 text-center bg-red-900/20 border border-red-900 rounded-md p-2 text-xs">
            {formState.error}
          </div>
        )}
        <div className="bg-kcb-ardoise rounded-[4px] border border-white/[0.06] shadow-sm p-6">
          <p className="text-center text-xl font-bold text-white mb-2">Profil Collectionneur</p>
          <p className="text-xs text-center text-kcb-pierre mb-6">Parlez-nous un peu plus de vous</p>
          <form onSubmit={handleSignUp} className="space-y-4" method="post">
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
              <label htmlFor="interests" className="text-xs font-medium text-kcb-pierre">Intérêts artistiques</label>
              <ReactQuill
                theme="snow"
                value={formState.interests}
                onChange={value => setFormState({ ...formState, interests: value })}
                className="border bg-white text-black border-background rounded-md my-2"
                placeholder="Parlez-nous de vos préférences en matière d'art"
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
