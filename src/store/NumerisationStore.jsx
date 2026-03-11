import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {createNumerisation,
    getNumerisationRequests,
    getMyNumerisationRequests, 
    updateNumerisationRequest, 
    updateNumerisationRequestStatus,
    deleteNumerisationRequest
} from "../api/useNumerisation"
import {useToast} from "./ToastContext"

const initialState = {
    numerisations : [],
    myNumerisations: [],
}

const NumerisationContext = createContext(initialState);

export const NumerisationProvider = ({ children }) => {
    const [state, setState] = useState(initialState);
    const { user } = useAuth();
    const {makeToast} = useToast();
    useEffect(() => {
        const fetchNumerisations = async () => {
            const numerisations = user?.role === "admin" ? await getNumerisationRequests() : await getMyNumerisationRequests();
            if (Array.isArray(numerisations)) {
                setState(prev => ({
                    ...prev,
                    numerisations: user?.role === "admin" ? numerisations : [],
                    myNumerisations: user?.role === "admin" ? [] : numerisations,
                }));
            }
        };
        if(user?.role && user?.role != "artist") fetchNumerisations();
    }, [user?.role]);

    return (
        <NumerisationContext.Provider value={{ 
            numerisations: state.numerisations,
            myNumerisations: state.myNumerisations,
            create : async (payload) => {
                const result = await createNumerisation(payload);
                if (result?._id) {
                    setState(prev => ({
                        ...prev,
                        myNumerisations: [result, ...prev.myNumerisations],
                    }));
                    makeToast("Succès", 'success', "Demande de numérisation créée avec succès");
                }
                if(result?.error) {
                    makeToast("Erreur", 'error', result.error);
                }
                return result;
            },
            update: async (id, payload) => {
                const result = await updateNumerisationRequest(id, payload);
                if (result?._id) {
                    setState(prev => ({
                        ...prev,
                        myNumerisations: prev.myNumerisations.map(req => req._id === id ? result : req),
                    }));
                    makeToast("Succès", 'success', "Demande de numérisation mise à jour avec succès");
                } 
                if(result?.error) {
                    makeToast("Erreur", 'error', result.error);
                }
                return result;
            },
            updateStatus: async (id, payload) => {
                const result = await updateNumerisationRequestStatus(id, payload);
                if (result?._id) {
                    setState(prev => ({
                        ...prev,
                        numerisations: prev.numerisations.map(req => req._id === id ? result : req),
                    }));
                    makeToast("Succès", 'success', "Statut de la demande de numérisation mis à jour avec succès");
                }
                if(result?.error) {
                    makeToast("Erreur", 'error', result.error);
                }
                return result;
            },
            delete: async (id) => {
                const result = await deleteNumerisationRequest(id);
                if (result?._id) {
                    setState(prev => ({
                        ...prev,
                        myNumerisations: prev.myNumerisations.filter(req => req._id !== id),
                    }));
                    makeToast("Succès", 'success', "Demande de numérisation supprimée avec succès");
                } 
                if(result?.error) {
                    makeToast("Erreur", 'error', result.error);
                }
                return result;
            },
        }}>
            {children}
        </NumerisationContext.Provider>
    );
}



export const useNumerisation = () => {
    return useContext(NumerisationContext);
}
