import { useState } from "react"
import { useNumerisation } from "../../store/NumerisationStore"
import { DataLoader } from "../loaders/PageLoader"
import { useCategoryStore } from "../../store/CategoryStore"
import { Scan } from "lucide-react"

export function AddNumerisation(){
    const {create} = useNumerisation()
    const {categories} = useCategoryStore()
    const [state, setState] = useState({
        artworkCount: 1,
        address: "",
        telephone: "",
        description: "",
        currency: "XOF",
        category: "",
        categoryId: "",

        loading: false,
        error: null,
    })
    const handleSubmit = async (e) => {
        e.preventDefault()
        setState(({ ...state, loading: true }))
        try {
            const payload = {...state}
            delete payload.loading
            delete payload.error
            const numReq = await create(payload)
            if(numReq.error) {
                setState({ ...state, error: numReq.error, loading: false })
            }
            if(numReq._id) {
                setState({ ...state, 
                    artworkCount: 1,
                    address: "",
                    telephone: "",
                    description: "",
                    currency: "XOF",
                    category: "",
                    categoryId: "",

                    loading: false,
                    error: null,
                })
            }
        } catch (error) {
            setState({ ...state, error, loading: false })
        }
    }
    return (
        <>
        <section className="border rounded-2xl shadow-lg p-6">
            <header className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center justify-center bg-indigo-600/10 rounded-full p-2"><Scan className="w-5 h-5 text-indigo-600" /></span>
            <h2 className="text-lg font-semibold text-white">Nouvelle demande de numérisation</h2>
            </header>
            {state.error && (
            <div className="mb-4 text-red-400 text-center bg-red-900/10 rounded-lg py-2 text-xs">
                {state.error}
            </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                    <label htmlFor="artworks" className="block text-xs text-gray-400 mb-1">Type d'oeuvres à numériser</label>
                    <select
                    id="category"
                    className="w-full bg-gray-900 text-white border border-gray-700 text-white rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
                    onChange={e => setState({
                        ...state,
                        category: e.target.value,
                        categoryId: categories.find(cat => cat.title === e.target.value)?._id || ""
                    })}
                    required
                    >
                    <option value="" disabled selected>Sélectionnez la catégorie</option>
                    {categories.map(category => (
                        <option key={category._id} value={category.title}>{category.title}</option>
                    ))}
                    </select>
                    
                </div>
                <div>
                    <label htmlFor="artworkCount" className="block text-xs text-gray-400 mb-1">Nombre d'œuvres</label>
                    <input
                        type="number"
                        id="artworkCount"
                        className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
                        placeholder="Nombre d'œuvres"
                        value={state.artworkCount}
                        onChange={e => setState({ ...state, artworkCount: e.target.value })}
                        required
                        min={1}
                    />
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="address" className="block text-xs text-gray-400 mb-1">Adresse</label>
                        <input
                            type="text"
                            id="address"
                            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
                            placeholder="Adresse"
                            value={state.address}
                            onChange={e => setState({ ...state, address: e.target.value })}
                            required
                            minLength={5}
                        />
                    </div>
                    <div>
                        <label htmlFor="telephone" className="block text-xs text-gray-400 mb-1">Numéro de téléphone</label>
                        <input
                            type="tel"
                            id="telephone"
                            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
                            placeholder="+221 77 123 45 67"
                            value={state.telephone}
                            onChange={e => setState({ ...state, telephone: e.target.value })}
                            required
                            pattern="\+?[0-9]{10,15}"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-xs text-gray-400 mb-1">Description</label>
                    <textarea
                        id="description"
                        className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-600"
                        placeholder="Description"
                        value={state.description}
                        onChange={e => setState({ ...state, description: e.target.value })}
                        required
                        minLength={5}
                    />
                </div>

                <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 transition-all text-sm shadow" disabled={state.loading}>
                    {!state.loading ? (<><Scan className="w-4 h-4" /> Créer la demande</>) : <DataLoader />}
                </button>
            </form>
        </section>
        
        </>
    )
}