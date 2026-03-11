import { createContext, memo, useContext, useEffect, useState } from "react";
import { createArtist, getAllArtists, getArtistById, getFeaturedArtists, getManagedArtists, updateManagedArtist } from "../api/useArtists";
import { useToast } from "./ToastContext";
import { getArtistForSaleArtworks } from "../api/useArtworks";
import { useAuth } from "./AuthContext";

const initialState = {
    artists : [],
    myArtists : [],
    featured : []
}
const ArtistContext = createContext(initialState)

export const ArtistContextProvider = memo(({children}) => {
    const {user} = useAuth()
    const [state, setState] = useState(initialState)
    const {makeToast} = useToast()
    useEffect(() => {
        const fetchArtists = async () => {
            const artists = await getAllArtists()
            if(artists?.length >= 1){
                setState(prev => ({
                    ...prev,
                    artists : artists?.reverse()
                }))
                return
            }
            // makeToast('Erreur','warning',artists?.error)
        }
        fetchArtists()

        const getFeatured = async () => {
            try {
                const featured = await getFeaturedArtists()
                if(featured?.length >= 1){
                    setState(prev => ({
                        ...prev,
                        featured : featured
                    }))
                }
            } catch (error) {
                return {
                    error : error.message
                }
        }
        }
        getFeatured()
    }, [])
    useEffect(() => {
        if(user?.role == "professional" || user?.role == "collector"){
            const getMyArtists = async () => {
                try {
                    const artists = await getManagedArtists(user?._id)
                    if(artists?.length >= 1){
                        setState(prev => ({
                            ...prev,
                            myArtists : artists
                        }))
                    }
                    return {
                        error : artists?.error
                    }
                } catch (error) {
                    return {
                        error : error.message
                    }
                }
            }
            getMyArtists()
        }
    }, [user])
    return(<>
    <ArtistContext.Provider value={{
        artists : state?.artists,
        myArtists : state?.myArtists,
        featuredArtists : state?.featured,
        getArtistById : async (id) => {
            const artist = await getArtistById(id)
            if(artist){
                return artist
            }
            makeToast('Erreur', 'warning', "Serveur non disponible")
        },
        getArtistArtworks : async (id) => {
            const artworks = await getArtistForSaleArtworks(id)
            if(artworks?.length >= 1){
                return artworks
            }
            // makeToast('Erreur','warning', artworks?.error)
        },
        create : async (payload) => {
            try {
                const artist = await createArtist(payload)
                if(artist?._id){
                    setState(prev => ({
                        ...prev,
                        myArtists : [artist, ...prev.myArtists]
                    }))
                    makeToast('Succès', 'success', 'Artiste créé avec succès')
                    return artist
                }
                makeToast('Erreur', 'warning', artist?.error || 'Impossible de créer l\'artiste')
                return {
                    error : artist?.error
                }
            } catch (error) {
                return {error : error.message}
            }
        },
        update : async (id, payload) => {
            try {
                const artist = await updateManagedArtist(id, payload)
                if(artist?._id){
                    setState(prev => ({
                        ...prev,
                        myArtists : [artist, ...prev.myArtists.filter(item => item?._id != artist?._id)]
                    }))
                    makeToast('Succès', 'success', 'Artiste mis à jour avec succès')
                    return artist
                }
                makeToast('Erreur', 'warning', artist?.error || 'Impossible de mettre à jour l\'artiste')
                return {
                    error : artist?.error || 'Erreur mise à jour'
                }
            } catch (error) {
                return {
                    error : error.message
                }
            }
        }

    }}>
        {children}
    </ArtistContext.Provider>
    
    </>)
})

export function useArtist(){
    return useContext(ArtistContext)
}