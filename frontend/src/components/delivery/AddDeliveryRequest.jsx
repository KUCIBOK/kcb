import { useState } from "react"
import { useArtworks } from "../../store/ArtworkContext"
import { Truck } from "lucide-react"
import { useDelivery } from "../../store/DeliveryStore"
import { DataLoader } from "../loaders/PageLoader"


export function AddDeliveryRequest() {
    const {myArtworks} = useArtworks()
    const {create} = useDelivery()
    const [state, setState] = useState({
        artworksIds : [],
        deliveryAddress: "", //✅
        deliveryDate: "", //✅
        collectDate : "",
        recipientName: "",
        recipientPhone: "",
        specialInstructions : "",
        packageSize: "small",
        packageWeight: "",
        deliveryPriority: "standard",

        loading: false,
        error: null,
        myArtworks : myArtworks,
        artworksTitles : []
    })
    const handleSubmitDeliveryRequest = async (e) => {
        e.preventDefault();
        try {
            if(state?.artworksIds < 1) {setState({...state, error : "Vous devez choisir au moins une oeuvre"}); return;}
            if(new Date(state.collectDate) < new Date()) {setState({...state, error : "La date de collecte doit être dans le futur"}); return;}
            if(!state.collectDate) {setState({...state, error : "La date de collecte est obligatoire"}); return;}
            if(!state.deliveryDate) {setState({...state, error : "La date de livraison est obligatoire"}); return;}
            if(new Date(state.collectDate) > new Date(state.deliveryDate)) { setState({...state, error : "La date de collecte doit être antérieure à la date de livraison"}); return;}
            setState({...state, loading : true, error : ""})
            const charge = {...state}
            delete charge.loading
            delete charge.error
            delete charge.myArtworks
            delete charge.artworksTitles
            const del = await create(charge)
            if(del?._id){
                setState({myArtworks : myArtworks, loading : false, error : ''})
                setState({
                    artworksIds: [],
                    deliveryAddress: "",
                    deliveryDate: "",
                    collectDate: "",
                    recipientName: "",
                    recipientPhone: "",
                    specialInstructions: "",
                    packageSize: "small",
                    packageWeight: "",
                    deliveryPriority: "standard",
                    loading: false,
                    error: null,
                    myArtworks: myArtworks,
                    artworksTitles: []
                });
                return;
            }
            setState({...state, error : del?.error, loading : false})
        } catch (error) {
            setState({...state, error : error.message, loading : false})
        }
    }
    return (
      <section className="border rounded-2xl shadow-lg p-6">
        <header className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center justify-center bg-indigo-600/10 rounded-full p-2"><Truck className="w-5 h-5 text-indigo-600" /></span>
          <h2 className="text-lg font-semibold text-white">Nouvelle demande de transport</h2>
        </header>
        {state.error && (
          <div className="mb-4 text-red-400 text-center bg-red-900/10 rounded-lg py-2 text-xs">
            {state.error}
          </div>
        )}
        <form className="space-y-5" onSubmit={handleSubmitDeliveryRequest} autoComplete="off">
          <div>
            <label htmlFor="artworks" className="block text-xs text-gray-400 mb-1">Œuvres à transporter</label>
            <select
              id="artworks"
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
              onChange={e => setState({
                ...state,
                artworksIds: [...state.artworksIds, JSON.parse(e.target.value)?._id],
                artworksTitles: [...state.artworksTitles, JSON.parse(e.target.value)?.title],
                myArtworks: state.myArtworks?.filter(item => item?._id !== JSON.parse(e.target.value)?._id)
              })}
              required
            >
              <option value="" disabled selected>Sélectionnez une œuvre</option>
              {state.myArtworks?.filter(art => !art?.isDelivered || art?.isDelivered == "pending")?.map(artwork => (
                <option key={artwork?._id} value={JSON.stringify(artwork)}>{artwork.title}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2 mt-2">
              {state.artworksTitles?.map((item, idx) => (
                <span key={idx} className="inline-flex items-center bg-gray-800/80 text-white text-xs rounded-full px-3 py-1">
                  {item}
                  <button
                    type="button"
                    className="ml-2 text-red-400 hover:text-red-600"
                    onClick={() => setState({
                      ...state,
                      artworksTitles: state.artworksTitles.filter(title => item !== title),
                      artworksIds: state.artworksIds.filter(id => id !== state.myArtworks?.find(art => art.title === item)?._id),
                      myArtworks: [state.myArtworks?.find(art => art.title === item), ...state.myArtworks]
                    })}
                  >×</button>
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="deliveryAddress" className="block text-xs text-gray-400 mb-1">Adresse de livraison</label>
              <input
                type="text"
                id="deliveryAddress"
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
                placeholder="Adresse de livraison"
                value={state.deliveryAddress}
                onChange={e => setState({ ...state, deliveryAddress: e.target.value })}
                required
                minLength={5}
              />
            </div>
            <div>
              <label htmlFor="collectDate" className="block text-xs text-gray-400 mb-1">Date de collecte</label>
              <input
                type="date"
                id="collectDate"
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
                value={state.collectDate}
                onChange={e => setState({ ...state, collectDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="deliveryDate" className="block text-xs text-gray-400 mb-1">Date de livraison</label>
              <input
                type="date"
                id="deliveryDate"
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
                value={state.deliveryDate}
                onChange={e => setState({ ...state, deliveryDate: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="recipientName" className="block text-xs text-gray-400 mb-1">Nom du destinataire</label>
              <input
                type="text"
                id="recipientName"
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
                placeholder="Nom du destinataire"
                value={state.recipientName}
                onChange={e => setState({ ...state, recipientName: e.target.value })}
                required
                minLength={5}
              />
            </div>
            <div>
              <label htmlFor="recipientPhone" className="block text-xs text-gray-400 mb-1">Numéro du destinataire</label>
              <input
                type="tel"
                id="recipientPhone"
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
                placeholder="Numéro du destinataire"
                value={state.recipientPhone}
                onChange={e => setState({ ...state, recipientPhone: e.target.value })}
                required
                minLength={5}
              />
            </div>
          </div>
          <div>
            <label htmlFor="specialInstructions" className="block text-xs text-gray-400 mb-1">Instructions spéciales</label>
            <textarea
              id="specialInstructions"
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
              placeholder="Instructions spéciales (facultatif)"
              value={state.specialInstructions}
              onChange={e => setState({ ...state, specialInstructions: e.target.value })}
              rows={2}
            ></textarea>
          </div>
          <div>
              <label htmlFor="packageWeight" className="block text-xs text-gray-400 mb-1">Poids du colis</label>
              <input
                type="number"
                id="packageWeight"
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
                placeholder="Poids du colis"
                value={state.packageWeight}
                onChange={e => setState({ ...state, packageWeight: e.target.value })}
                required
                min={1}
              />
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="packageSize" className="block text-xs text-gray-400 mb-1">Taille du colis</label>
              <select
                name="packageSize"
                id="packageSize"
                value={state.packageSize}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
                onChange={e => setState({ ...state, packageSize: e.target.value })}
                required
              >
                <option value="">Sélectionnez la taille</option>
                <option value="small">Petit</option>
                <option value="medium">Moyen</option>
                <option value="large">Grand</option>
                <option value="extra_large">Très grand</option>
              </select>
            </div>
            <div>
              <label htmlFor="deliveryPriority" className="block text-xs text-gray-400 mb-1">Priorité de livraison</label>
              <select
                name="deliveryPriority"
                id="deliveryPriority"
                value={state.deliveryPriority}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
                onChange={e => setState({ ...state, deliveryPriority: e.target.value })}
                required
              >
                <option value="">Sélectionnez la priorité</option>
                <option value="standard">Basse</option>
                <option value="express">Moyenne</option>
                <option value="priority">Haute</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 transition-all text-sm shadow"
            disabled={state.loading}
          >
            {!state.loading ? (<><Truck className="w-4 h-4" /> Créer la demande</>) : <DataLoader />}
          </button>
        </form>
      </section>
    )
    
}