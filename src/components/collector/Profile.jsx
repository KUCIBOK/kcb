import { memo, useEffect, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import { Camera, Eye, EyeOff } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ChangePassword } from "../auth/ChangePassword";
import { Tabs, Input, Select, Button, toast } from "../ui";

export const Profile = () => {
  const { user, collectorProfile, updateUser, updateProfile } = useAuth();
  const [state, setState] = useState({
    name: user?.name,
    email: user?.email,
    telephone: user?.telephone,

    //profile
    username: collectorProfile?.username,
    country: collectorProfile?.country,
    interests: collectorProfile?.interests,
    image: collectorProfile?.image,

    countries: [],
    loading: false,
    error: "",
    show: collectorProfile?.image,
    addresskeyShow: false,
  });
  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch("/data/countries.json");
      const data = await response.json();
      setState({ ...state, countries: data });
    };
    fetchCountries();
  }, []);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState({ ...state, show: reader.result, image: file });
      };
      reader.readAsDataURL(file);
    }
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
      if (state.interests.length > 20) {
        const updatedUser = await updateUser(userPayload);
        const updatedProfile = await updateProfile(formData);
        if (updatedUser?._id && updatedProfile?._id) {
          setState({ ...state, loading: false, error: "" });
          toast.success("Profil mis à jour !");
        }
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
            placeholder={collectorProfile?.username}
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
      value: 'interests',
      label: 'Préférences',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Intérêts artistiques</label>
            <ReactQuill
              theme="snow"
              value={state.interests || ''}
              onChange={(value) => setState({ ...state, interests: value })}
              className="border border-gray-800 rounded-lg bg-white text-black"
              placeholder="Parlez-nous de vos préférences"
            />
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
                    type={state?.addresskeyShow ? "text" : "password"}
                    value={user?.wallet?.privateKey || ''}
                    className="flex-1 px-4 py-2 bg-background border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => setState({ ...state, addresskeyShow: !state?.addresskeyShow })}
                    className="px-4 py-2 border border-gray-700 bg-background rounded-lg hover:bg-gray-800 transition"
                  >
                    {state?.addresskeyShow ? <Eye className="w-4 h-4 text-gray-400" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
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
              <div className="w-full pt-4 border-t border-gray-800">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Compte créé</span>
                  <span>{new Date(user?.createdAt)?.toLocaleDateString()}</span>
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
