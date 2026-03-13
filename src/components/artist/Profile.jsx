import { useEffect, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import { Camera, Copy } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ChangePassword } from "../auth/ChangePassword";
import { Tabs, Input, Select, Button, toast } from "../ui";

export const Profile = () => {
  const { user, artistProfile, updateUser, updateArtist } = useAuth();
  const [state, setState] = useState({
    name: user?.name,
    email: user?.email,
    telephone: user?.telephone,
    username: artistProfile?.username,
    country: artistProfile?.country,
    biography: artistProfile?.biography,
    portfolio: artistProfile?.portfolio,
    image: artistProfile?.image,
    facebook: artistProfile?.socials?.facebook || "",
    twitter: artistProfile?.socials?.twitter || "",
    instagram: artistProfile?.socials?.instagram || "",

    countries: [],
    loading: false,
    error: "",
    show: artistProfile?.image,
  });

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch("/data/countries.json");
      const data = await response.json();
      setState((prev) => ({ ...prev, countries: data }));
    };
    fetchCountries();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setState(prev => ({ ...prev, error: "L'image ne doit pas dépasser 5 Mo." }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setState(prev => ({ ...prev, show: reader.result, image: file, error: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setState({ ...state, loading: true });
      const userPayload = {
        name: state?.name,
        email: state?.email,
        telephone: state?.telephone,
      };
      const charge = { ...state };
      delete charge.loading;
      delete charge.countries;
      delete charge.error;
      delete charge.show;
      delete charge.addresskeyShow;

      const formData = new FormData();
      Object.keys(charge).forEach((key) => {
        formData.append(key, charge[key]);
      });

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (state.email && !emailRegex.test(state.email)) {
        setState(prev => ({ ...prev, loading: false, error: "Adresse email invalide." }));
        return;
      }
      if (!state.biography || state.biography.length <= 20) {
        setState(prev => ({ ...prev, loading: false, error: "La biographie doit contenir au moins 20 caractères." }));
        return;
      }
      const updatedUser = await updateUser(userPayload);
      const updatedArtist = await updateArtist(formData);
      if (updatedUser?._id || updatedArtist?._id) {
        setState(prev => ({ ...prev, loading: false, error: "" }));
        toast.success("Profil mis à jour !");
      }
    } catch (error) {
      setState({ ...state, loading: false, error: error?.message || "Erreur lors de la sauvegarde." });
    }
  }

  const countryOptions = state.countries.map(c => ({ value: c.name, label: c.name }));

  const tabsData = [
    {
      value: 'personal',
      label: 'Informations personnelles',
      content: (
        <div className="space-y-4">
          <Input
            label="Nom complet"
            name="name"
            value={state?.name || ''}
            onChange={(e) => setState({ ...state, name: e.target.value })}
            required
            placeholder={user?.name}
          />
          <Input
            label="Pseudo"
            name="username"
            value={state?.username || ''}
            onChange={(e) => setState({ ...state, username: e.target.value })}
            required
            placeholder={artistProfile?.username}
          />
          <Input
            label="Téléphone"
            type="tel"
            name="telephone"
            value={state?.telephone || ''}
            onChange={(e) => setState({ ...state, telephone: e.target.value })}
            required
            minLength={13}
            maxLength={18}
            placeholder="Votre numéro de téléphone"
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={state?.email || ''}
            onChange={(e) => setState({ ...state, email: e.target.value })}
            required
            placeholder={user?.email}
          />
          <Select
            label="Pays"
            options={countryOptions}
            value={state.country}
            onChange={(value) => setState({ ...state, country: value })}
            required
          />
        </div>
      )
    },
    {
      value: 'biography',
      label: 'Biographie & Portfolio',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Biographie</label>
            <ReactQuill
              theme="snow"
              value={state.biography || ''}
              onChange={(value) => setState({ ...state, biography: value })}
              className="border border-gray-800 rounded-lg bg-white text-black"
              placeholder="Parlez-nous de vous"
            />
          </div>
          <Input
            label="Portfolio (URL)"
            type="url"
            name="portfolio"
            value={state?.portfolio || ''}
            onChange={(e) => setState({ ...state, portfolio: e.target.value })}
            placeholder="Lien de votre portfolio"
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Réseaux sociaux</label>
            <div className="space-y-3 mt-3">
              <Input
                label="Facebook"
                type="url"
                value={state?.facebook || ''}
                onChange={(e) => setState({ ...state, facebook: e.target.value })}
                placeholder="Lien de votre profil Facebook"
              />
              <Input
                label="Twitter"
                type="url"
                value={state?.twitter || ''}
                onChange={(e) => setState({ ...state, twitter: e.target.value })}
                placeholder="Lien de votre profil Twitter"
              />
              <Input
                label="Instagram"
                type="url"
                value={state?.instagram || ''}
                onChange={(e) => setState({ ...state, instagram: e.target.value })}
                placeholder="Lien de votre profil Instagram"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      value: 'security',
      label: 'Sécurité',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Changer le mot de passe</h3>
            <ChangePassword />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Portefeuille</h3>
            <div className="space-y-4">
              <Input
                label="Adresse wallet"
                name="wallet_address"
                value={user?.wallet?.address || ''}
                readOnly
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Clé privée</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={user?.wallet?.privateKey ? user.wallet.privateKey.slice(0, 6) + '••••••••••••••••••••' + user.wallet.privateKey.slice(-4) : ''}
                    className="flex-1 px-4 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:outline-none font-mono"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(user?.wallet?.privateKey || '')}
                    className="px-4 py-2 border border-gray-700 bg-background rounded-lg hover:bg-gray-800 transition"
                    title="Copier la clé privée"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <p className="text-xs text-yellow-600 mt-1">Ne partagez jamais votre clé privée.</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];
    return (
      <section className="bg-gray-900 rounded-2xl shadow-md border border-gray-800 px-4 py-6 md:px-8 md:py-8 w-full mx-auto">
        <form onSubmit={handleUpdate} method="post" className="space-y-6">
          {state.error && (
            <div className="text-red-300 text-center bg-red-900/20 border border-red-900 rounded-md p-2 text-xs">
              {state.error}
            </div>
          )}
          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar Section */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 flex flex-col items-center gap-4 h-fit lg:w-72">
              <div className="text-center">
                {state?.image ? (
                  <img src={state?.show} alt="Profile" className="w-28 h-28 object-cover rounded-full mb-4 mx-auto border-4 border-gray-800 shadow" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-800 mb-4 flex justify-center items-center mx-auto border-4 border-gray-800">
                    <Camera className="w-10 h-10 text-gray-500" />
                  </div>
                )}
                <p className="font-sans text-white font-medium text-base mb-3">{user?.name}</p>
                <button
                  type="button"
                  onClick={() => document.getElementById('profile-image').click()}
                  className="border border-gray-700 bg-gray-900 w-full rounded-md text-xs text-gray-200 font-medium px-3 py-2 hover:bg-gray-800 transition"
                >
                  Modifier la photo
                </button>
                <input
                  id="profile-image"
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="w-full pt-4 border-t border-gray-800 space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Compte créé</span>
                  <span>{new Date(user?.createdAt)?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Oeuvres publiées</span>
                  <span>{artistProfile?.artworkCount || 0}</span>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="flex-1">
              <Tabs tabs={tabsData} defaultValue="personal" variant="line" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-800">
            <Button
              type="submit"
              disabled={state?.loading}
              loading={state?.loading}
              size="lg"
            >
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </section>
    );
}
