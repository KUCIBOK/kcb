import { createContext, useContext, useEffect, useState } from "react";
import { createCollection, getCollections } from "../api/useCollection";
import { useToast } from "./ToastContext";

//États initial pour le contexte des collections
const initialState = {
    myCollections : [],
    collections : []
}

// Création du contexte des collections
const CollectionContext = createContext(initialState)

// Fournisseur du contexte des collections
// Permet de gérer les collections de l'utilisateur et les collections globales
export function CollectionProvider({children}){
    const [state, setState] = useState(initialState)
    const {makeToast} = useToast()
    useEffect(() => {
        // Single API call — assign result to both myCollections and collections
        const fetchCollections = async function (){
            try {
                const collections = await getCollections()
                if(collections?.length > 0){
                    setState(prev => ({...prev, myCollections : collections, collections : collections}))
                }
            } catch (error) {
                return {
                    error : error.message
                }
            }
        }
        fetchCollections()
    }, [])
    return (
        <CollectionContext.Provider value={{
            // État des collections
            myCollections : state.myCollections,
            collections : state.collections,
            // Fonction pour ajouter une nouvelle collection
            addCollection : async function(payload){
                try {
                    const collection = await createCollection(payload)
                    if(collection?._id){
                        setState(prev => ({...prev, myCollections : [collection, ...prev.myCollections]}))
                        makeToast('Succès', 'success', 'La collection a été ajoutée avec succès')
                        return collection
                    }
                    return {
                        error : collection?.error || collection?.message
                    }
                } catch (error) {
                    return {error : error.message}
                }
            }
        }}>
            {children}
        </CollectionContext.Provider>
    )
}

export function useCollections(){
    return useContext(CollectionContext)
}