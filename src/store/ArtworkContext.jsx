import { createContext, useContext, useEffect, useState } from "react";
import { getAllArtworks, getApprovedArtworks, getForSaleArtworks, getManagedArtworks, getMyArtworks, getOwnerArtworks, getPendingArtworks, getRandomArtworks, getRandomArtworksByCategories, getRejectedArtworks, purchaseArtwork, setArtworkStatus, submitArtwork, updateArtwork, updateEtherscan } from "../api/useArtworks";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";
import { createLog } from "../api/useLog";

const initialState = {
    artworks : [],
    forSale : [],
    buyed : [],
    pending : [],
    approved : [],
    rejected : [],
    myArtworks : [],
    featured : [],
    categoryFeatured : []
}

const ArtworksContext = createContext(initialState)

export const ArtworksContextProvider = ({children}) => {
    const [state, setState] = useState(initialState)
    const {user, artistProfile, professionalProfile} = useAuth()
    const {makeToast} = useToast()
    useEffect(() => {
        const getforSaleArtworks = async () => {
            try {
                const forSale = await getForSaleArtworks()
                if(forSale?.length > 0){
                    forSale.sort(() => Math.random() - 0.5)
                    setState(prev => ({
                        ...prev,
                        forSale : forSale?.reverse().filter(item => item?.status == "approved" && item?.forSale && item?.sold == false),
                    }))
                }
            } catch (error) {
                makeToast('Erreur', 'danger', error.message)
            }
        }
        getforSaleArtworks()

        const getArtworks = async () => {
            try {
                const featured = await getRandomArtworks()
                if(featured?.length > 0){
                    setState(prev => ({
                        ...prev,
                        featured : featured || []
                    }))
                }
            } catch (error) {
                // makeToast('Erreur', 'danger', error.message)
            }
        }
        getArtworks()

        const getCategoryFeatured = async () => {
            try {
                const categoryFeatured = await getRandomArtworksByCategories('sculpture')
                if(categoryFeatured?.length > 0){
                    setState(prev => ({
                        ...prev,
                        categoryFeatured : categoryFeatured
                    }))
                }
            } catch (error) {
                
            }
        }
        getCategoryFeatured()

    }, [])

    useEffect(() => {
        if(user?._id){
            const getProfileArtworks = async () => {
                if(user?.role == 'admin'){
                    const artworks = await getAllArtworks()
                    setState(prev => ({
                        ...prev,
                        artworks : artworks,
                        pending : artworks?.length > 0 ? artworks.filter(item => item.status == "pending")?.reverse() : [],
                        approved : artworks?.length > 0 ? artworks.filter(item => item.status == "approved")?.reverse() : [],
                        rejected : artworks?.length > 0 ? artworks.filter(item => item.status == "rejected")?.reverse() : [],
                    }))
                }
                if(user?.role == 'artist' && artistProfile?._id){
                    const myArtworks = await getMyArtworks(artistProfile?._id)
                    setState(prev => ({
                        ...prev, 
                        myArtworks : myArtworks?.length > 0 ? myArtworks : [],
                    }))
                }

                if(user?.role == 'collector'){
                    const buyed = await getOwnerArtworks(user?._id)
                    const myArtworks = await getManagedArtworks()
                    setState(prev => ({
                        ...prev, 
                        buyed : buyed?.length > 0 ? buyed?.reverse() : [],
                        myArtworks : myArtworks?.length > 0 ? myArtworks?.reverse() : [],
                    }))
                }
                if(user?.role == 'professional'){
                    const myArtworks = await getManagedArtworks()
                    setState(prev => ({
                        ...prev, 
                        myArtworks : myArtworks?.length > 0 ? myArtworks?.reverse() : [],
                    }))
                }
            }
            getProfileArtworks()
        }
    }, [user?._id, artistProfile?._id, professionalProfile?._id])
    return (
        <ArtworksContext.Provider value={{
            artworks : state.artworks,
            forSale : state.forSale,
            buyed : state.buyed,
            pending : state.pending,
            approved : state.approved,
            rejected : state.rejected,
            myArtworks : state.myArtworks,
            featured : state?.featured,
            categoryFeatured : state?.categoryFeatured,
            setArtworkState : setState,
            artworkState : state,
            approveArtwork : async (id, status) => {
                try {
                    const artwork = await setArtworkStatus(id, status)
                    if(artwork?._id){
                        if(artwork?.status == "approved"){
                            setState(prev => ({
                                ...prev,
                                pending : prev.pending?.filter(d => d._id !== id),
                                rejected : prev.rejected?.filter(d => d._id !== id),
                                approved : [artwork, ...prev.approved],
                            }))
                        }
                        else{
                            setState(prev => ({
                                ...prev,
                                pending : prev.pending?.filter(item => item._id !== artwork._id),
                                approved : prev.approved?.filter(item => item._id !== artwork._id),
                                rejected : [artwork, ...prev.rejected],
                            }))
                        }

                        makeToast('Félicitations ', 'success', `L'oeuvre a été ${status == "approved" ? "approuvée" : "rejetée"} avec succès`)
                        await createLog({description : `L'oeuvre ${artwork?._id} a été approuvée`, userId : user?._id})
                        return artwork
                    }
                    makeToast('Erreur', 'warning', artwork?.error)
                } catch (error) {
                    makeToast('Erreur', 'warning', error.message)
                }
            },
            submitArtwork : async (artwork) => {
                try {
                    const data = await submitArtwork(artwork)
                    if(data?._id){
                        setState(prev => ({
                            ...prev,
                            myArtworks : [...prev.myArtworks, {...data, status : "pending"}],
                        }))
                        makeToast('Félicitations ', 'success', `L'oeuvre a été soumise avec succès`)
                        await createLog({description : `L'oeuvre ${data?._id} a été soumise`, userId : user?._id})
                        return data
                    }
                    makeToast('Erreur', 'warning', data?.error)
               } catch (error) {
                    makeToast('Erreur', 'warning', error.message)
                    return {
                        error : error.message
                    }
               }    
            },
            updateArtwork : async (id, payload) => {
                try {
                    const artwork = await updateArtwork(id, payload)
                    if(artwork?._id){
                        setState(prev => ({
                            ...prev,
                            // myArtworks : [artwork, ...prev.myArtworks.filter(item => item?._id != artwork?._id)]
                            myArtworks : prev.myArtworks?.map(d => d._id === id ? artwork : d)
                        }))
                        makeToast('Succès', 'success', 'Oeuvre mise à jour avec succès')
                        await createLog({description : `L'oeuvre ${artwork?._id} a été mise à jour`, userId : user?._id})
                        return artwork
                    }
                    makeToast('Erreur', 'warning', artwork?.error || 'Impossible de mettre à jour l\'oeuvre')
                    return {
                        error : artwork?.error || artwork?.message
                    }
                } catch (error) {
                    makeToast('Erreur', 'warning', error.message)
                    return {
                        error : error.message
                    }
                }
            },
            purchaseArtwork : async (artwork, payload) => {
                try {
                    const data = await purchaseArtwork(artwork, payload)
                    if(data?.id){
                        setState((prev) => ({
                            ...prev,
                            forSale : prev.forSale?.filter(item => item._id != artwork?.id && item.id != artwork?.id)
                        }))
                        makeToast('Félicitations ', 'success', `Vous avez acheté une oeuvre`)
                        await createLog({description : `L'oeuvre ${artwork?._id} a été achetée`, userId : user?._id})
                        return data
                    }
                    return {
                        error : data?.error || data?.message
                    }
                } catch (error) {
                    makeToast('Erreur', 'warning', error.message)
                    return {
                        error : error.message
                    }
                }
            },
            modifyEtherscan : async (id, etherscan) => {
                try {
                    const artwork = await updateEtherscan(id, etherscan)
                    if(!artwork?._id) return {error : artwork?.error}
                    if(artwork?.status == "pending") setState(prev => ({...prev, pending : prev.pending?.map(d => d._id === id ? artwork : d)}))
                    if(artwork?.status == "rejected") setState(prev => ({...prev, rejected : prev.rejected?.map(d => d._id === id ? artwork : d)}))
                    if(artwork?.status == "approved") setState(prev => ({...prev, approved : prev.approved?.map(d => d._id === id ? artwork : d)}))
                    makeToast('Succès', 'success', 'L\'adresse etherscan de l\'oeuvre a été modifiée avec succès')
                    await createLog({description : `L'adresse etherscan de l'oeuvre ${artwork?._id} a été modifiée`, userId : user?._id})
                    return artwork
                } catch (error) {
                    return {
                        error : error.message
                    }
                }
            }
        }}>
            {children}
        </ArtworksContext.Provider>
    )
}

export function useArtworks(){
    return useContext(ArtworksContext)
}
