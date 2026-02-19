import { Camera, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import { useArtist } from "../../store/ArtistContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Modal, Input, Button, toast } from "../ui";



export function AddArtistAction(){
    const [state, setState] = useState({
        addArtist : false
    })
    return (
        <>
        <button onClick={() => setState({...state, addArtist : true})} className="rounded-lg border p-4 grid place-items-center gap-2 hover:bg-gray-900 cursor-pointer">
            <Plus className="w-4 h-4 text-white font-bold mx-auto" />
            <p className="mx-auto text-sm">Ajouter un artiste</p>
        </button>
        {state?.addArtist && <AddArtistModal closeModal={() => setState({...state, addArtist : false})} />}
        </>
    )
}

function AddArtistModal({closeModal}){
    const {user} = useAuth()
    const {create} = useArtist()
    const [state, setState] = useState({
        name : "",
        username : "",
        country : "",
        biography : "",
        portfolio : "",
        image : "",
        socials : {
            facebook : "",
            twitter : "",
            instagram : "",
        },

        countries : [],
        loading : false,
        error : '',
        show : "",
    })
    useEffect(() => {
        const fetchCountries = async () => {
            const response = await fetch('/data/countries.json')
            const data = await response.json()
            setState({...state, countries : data})          
        }
        fetchCountries()
    }, [])
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setState({ ...state, show: reader.result, image : file });
            };
            reader.readAsDataURL(file);
        }
    }
    const handleAddArtist = async (e) => {
        e.preventDefault()
        if(state?.biography?.length < 20){
            toast.error('× Remplissez la biographie (min 20 caractères)');
            return
        }
        setState({...state, loading : true})
        try {
            const charge = {...state}
            delete charge.loading
            delete charge.countries
            delete charge.show
            const formData = new FormData();
            Object.keys(charge).forEach(key => {
                formData.append(key, charge[key])
            })
            formData.delete('socials')
            formData.append('facebook', charge.socials.facebook)
            formData.append('twitter', charge.socials.twitter)
            formData.append('instagram', charge.socials.instagram)
            const artist = await create(formData)
            if(artist?._id){
                toast.success('✓ Artiste ajouté avec succès');
                closeModal()
            } else {
                toast.error('× ' + (artist?.error || 'Échec de l\'ajout'));
            }
            setState({...state, loading : false})
        } catch (error) {
            toast.error('× Erreur serveur');
            setState({...state, loading : false})
        }
    }
  return (
    <Modal
      isOpen={true}
      onClose={closeModal}
      title="Ajouter un artiste"
      size="md"
    >
      <form onSubmit={handleAddArtist} method="post" className="space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-2">
          {state?.image ? 
            <img src={state?.show} alt="Profile" className="w-20 h-20 object-cover rounded-full border border-gray-700" />
            : 
            <div className="w-20 h-20 rounded-full bg-indigo-900/30 flex justify-center items-center border border-gray-700">
              <Camera className="w-8 h-8 text-indigo-400" />
            </div>
          }
          <button type="button" onClick={() => document.getElementById('profile-image').click()} className="text-xs font-medium px-3 py-2 border border-gray-700 bg-gray-800 hover:bg-gray-700 rounded transition">
            Modifier la photo
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

        <Input
          label="Nom complet"
          value={state?.name}
          onChange={(e) => setState({...state, name : e.target.value})}
          placeholder="Nom complet de l'artiste"
          minLength={5}
          required
        />

        <Input
          label="Nom d'utilisateur"
          value={state?.username}
          onChange={(e) => setState({...state, username : e.target.value})}
          placeholder="Pseudo"
          minLength={5}
          required
        />

        {/* Country Select */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Pays</label>
          <select 
            value={state.country} 
            onChange={(e) => setState({...state, country : e.target.value})}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            required
          >
            <option value="" disabled>Sélectionnez un pays</option>
            {state?.countries?.map((country, index) => (
              <option key={index} value={country.name}>{country.name}</option>
            ))}
          </select>
        </div>

        {/* Biography */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Biographie</label>
          <ReactQuill
            theme="snow"
            value={state.biography}
            onChange={(value) => setState({ ...state, biography: value })}
            className="border border-gray-800 rounded-lg bg-white text-black"
            placeholder="Parlez-nous de lui"
          />
        </div>

        {/* Social Media Links */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Réseaux sociaux (facultatif)</label>
          <Input
            type="text"
            placeholder="Facebook"
            value={state.socials.facebook}
            onChange={e => setState({ ...state, socials: { ...state.socials, facebook: e.target.value } })}
          />
          <Input
            type="text"
            placeholder="Twitter"
            value={state.socials.twitter}
            onChange={e => setState({ ...state, socials: { ...state.socials, twitter: e.target.value } })}
          />
          <Input
            type="text"
            placeholder="Instagram"
            value={state.socials.instagram}
            onChange={e => setState({ ...state, socials: { ...state.socials, instagram: e.target.value } })}
          />
        </div>

        <Input
          label="Portfolio (facultatif)"
          value={state?.portfolio}
          onChange={(e) => setState({...state, portfolio : e.target.value})}
          placeholder="Lien de votre portfolio"
        />

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={closeModal}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={state.loading}
            loading={state.loading}
          >
            Ajouter l'artiste
          </Button>
        </div>
      </form>
    </Modal>
  )
}