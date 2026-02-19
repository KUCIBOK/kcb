import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { createUser, deleteUser, getAllUsers, setUserStatus, updateUser } from "../api/useUsers";
import { createLog } from "../api/useLog";
import { useToast } from "./ToastContext";

// États initial pour le contexte des utilisateurs
const initialState = {
    users : [],
    admins : [],
    artists : [],
    collectors : [],
    professionals : [],
}

// Création du contexte des utilisateurs
const UserContext = createContext(initialState)

// Fournisseur du contexte des utilisateurs
// Permet de gérer les utilisateurs, les rôles et les actions associées
export function UserProvider({children}){
    const {user} = useAuth()
    const admin = user
    const [state, setState] = useState(initialState)
    const { makeToast } = useToast()
    useEffect(() => {
        // Fonction pour récupérer tous les utilisateurs
        const getUsers = async function (){
            const users = await getAllUsers()
            if(users?.length > 0){
                setState(prev => ({
                    ...prev,
                    users : users.reverse(),
                    admins : users?.filter(item => item?.role == "admin").reverse() || [],
                    artists : users?.filter(item => item?.role == "artist").reverse() || [],
                    collectors : users?.filter(item => item?.role == "collector").reverse() || [],
                    professionals : users?.filter(item => item?.role == "professional").reverse() || []
                }))
                
            }
            return {
                error : users?.error || users?.message
            }
        }
        // Si l'utilisateur est un admin, on récupère les utilisateurs
        if(user?.role == "admin"){
            getUsers()
        }
    }, [user?._id])

    return (
        <UserContext.Provider value={{
            ...state,
          addUser : async (payload) => {
            try {
                const user = await createUser(payload)
                if(user?.error){
                    return {
                        error : user?.error
                    }
                }
                if(user?.role == 'admin') setState(prev => ({...prev, users : [user, ...prev.users], admins : [user, ...prev.admins]}))
                if(user?.role == 'artist') setState(prev => ({...prev, users : [user, ...prev.users], artists : [user, ...prev.artists]}))
                if(user?.role == 'collectors') setState(prev => ({...prev, users : [user, ...prev.users], collectors : [user, ...prev.collectors]}))
                if(user?.role == 'professional') setState(prev => ({...prev, users : [user, ...prev.users], professionals : [user, ...prev.professionals]}))
                makeToast('Succès', 'success', 'L\'utilisateur a été ajouté avec succès')
                await createLog({description : `L'utilisateur ${user?.name} a été ajouté`, userId : admin?._id})
                return user
            } catch (error) {
                return {
                    error : error.message
                }
            }
          },
          updateUser : async (id, payload) => {
            try {
                const user = await updateUser(id, payload)
                if(user?.error){
                    return {
                        error : user?.error || user?.message
                    }
                }
                if(user?.role == 'admin') setState(prev => ({...prev, users : [user, ...prev.users.filter(item => item?._id != user?._id)], admins : [user, ...prev.admins.filter(item => item?._id != user?._id)]}))
                if(user?.role == 'artist') setState(prev => ({...prev, users : [user, ...prev.users.filter(item => item?._id != user?._id)], artists : [user, ...prev.artists.filter(item => item?._id != user?._id)]}))
                if(user?.role == 'collectors') setState(prev => ({...prev, users : [user, ...prev.users.filter(item => item?._id != user?._id)], collectors : [user, ...prev.collectors.filter(item => item?._id != user?._id)]}))
                if(user?.role == 'professional') setState(prev => ({...prev, users : [user, ...prev.users.filter(item => item?._id != user?._id)], professionals : [user, ...prev.professionals.filter(item => item?._id != user?._id)]}))
                makeToast('Succès', 'success', 'L\'utilisateur a été mis à jour avec succès')
                await createLog({description : `L'utilisateur ${user?.name} a été mis à jour`, userId : admin?._id})
                return user
            } catch (error) {
                return {
                    error : error.message
                }
            }
          },
          deleteUser : async (id) => {
            try {
                const user = await deleteUser(id)
                if(!user?._id){
                    return {
                        error : user?.error || user?.message
                    }
                }
                if(user?.role == 'admin') setState({...state, users : [...state.users.filter(item => item?._id != user?._id)], admins : [...state.admins.filter(item => item?._id != user?._id)]})
                if(user?.role == 'artist') setState({...state, users : [...state.users.filter(item => item?._id != user?._id)], artists : [...state.artists.filter(item => item?._id != user?._id)]})
                if(user?.role == 'collector') setState({...state, users : [...state.users.filter(item => item?._id != user?._id)], collectors : [...state.collectors.filter(item => item?._id != user?._id)]})
                if(user?.role == 'professional') setState({...state, users : [...state.users.filter(item => item?._id != user?._id)], professionals : [...state.professionals.filter(item => item?._id != user?._id)]})
                makeToast('Succès', 'success', 'L\'utilisateur a été supprimé avec succès')
                await createLog({description : `L'utilisateur ${user?.name} a été supprimé`, userId : admin?._id})
                return user
            } catch (error) {
                return {
                    error : error.message
                }
            }

          },
          setStatus : async (id) => {
            try {
                const user = await setUserStatus(id)
                if(!user?._id){
                    return {
                        error : user?.error || user?.message
                    }
                }
                if(user?.role == 'admin') setState({...state, users : [user, ...state.users.filter(item => item?._id != user?._id)], admins : [user, ...state.admins.filter(item => item?._id != user?._id)]})
                if(user?.role == 'artist') setState({...state, users : [user, ...state.users.filter(item => item?._id != user?._id)], artists : [user, ...state.artists.filter(item => item?._id != user?._id)]})
                if(user?.role == 'collectors') setState({...state, users : [user, ...state.users.filter(item => item?._id != user?._id)], collectors : [user, ...state.collectors.filter(item => item?._id != user?._id)]})
                if(user?.role == 'professional') setState({...state, users : [user, ...state.users.filter(item => item?._id != user?._id)], professionals : [user, ...state.professionals.filter(item => item?._id != user?._id)]})
                makeToast('Succès', 'success', `L'utilisateur a été ${user?.isActive ? "activé" : "suspendu"}`)
                await createLog({description : `L'utilisateur ${user?.name} a été ${user?.isActive ? "activé" : "suspendu"}}`, userId : admin?._id})
                return user
            } catch (error) {
                return {
                    error : error.message
                }
            }
          }

        }}>
        {children}
        </UserContext.Provider>
    )
}


export function useUsersContext(){
    return useContext(UserContext)
}