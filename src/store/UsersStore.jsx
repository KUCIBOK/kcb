import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext'
import { createUser, deleteUser, getAllUsers, setUserStatus, updateUser } from '../api/useUsers'
import { createLog } from '../api/useLog'
import { useToast } from './ToastContext'

// États initial pour le contexte des utilisateurs
const initialState = {
  users: [],
  admins: [],
  artists: [],
  buyers: [],
  curators: [],
  loading: true,
}

// Création du contexte des utilisateurs
const UserContext = createContext(initialState)

// Fournisseur du contexte des utilisateurs
// Permet de gérer les utilisateurs, les rôles et les actions associées
export function UserProvider({ children }) {
  const { user } = useAuth()
  const admin = user
  const [state, setState] = useState(initialState)
  const { makeToast } = useToast()
  useEffect(() => {
    // Fonction pour récupérer tous les utilisateurs
    const getUsers = async function () {
      const users = await getAllUsers()
      if (users?.length > 0) {
        setState((prev) => ({
          ...prev,
          users: users.reverse(),
          admins: users?.filter((item) => item?.role == 'admin').reverse() || [],
          artists: users?.filter((item) => item?.role == 'artist').reverse() || [],
          buyers: users?.filter((item) => item?.role == 'buyer').reverse() || [],
          curators: users?.filter((item) => item?.role == 'curator').reverse() || [],
        }))
      }
      return {
        error: users?.error || users?.message,
      }
    }
    // Si l'utilisateur est un admin, on récupère les utilisateurs
    if (user?.role == 'admin') {
      getUsers().finally(() => {
        setState((prev) => ({ ...prev, loading: false }))
      })
    } else {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [user?.id])

  const addUserCtx = useCallback(async (payload) => {
          try {
            const user = await createUser(payload)
            if (user?.error) {
              return {
                error: user?.error,
              }
            }
            if (user?.role == 'admin')
              setState((prev) => ({
                ...prev,
                users: [user, ...prev.users],
                admins: [user, ...prev.admins],
              }))
            if (user?.role == 'artist')
              setState((prev) => ({
                ...prev,
                users: [user, ...prev.users],
                artists: [user, ...prev.artists],
              }))
            if (user?.role == 'buyer')
              setState((prev) => ({
                ...prev,
                users: [user, ...prev.users],
                buyers: [user, ...prev.buyers],
              }))
            if (user?.role == 'curator')
              setState((prev) => ({
                ...prev,
                users: [user, ...prev.users],
                curators: [user, ...prev.curators],
              }))
            makeToast('Succès', 'success', "L'utilisateur a été ajouté avec succès")
            await createLog({
              description: `L'utilisateur ${user?.name} a été ajouté`,
              userId: admin?.id,
            })
            return user
          } catch (error) {
            return {
              error: error.message,
            }
          }
  }, [admin?.id, makeToast])

  const updateUserCtx = useCallback(async (id, payload) => {
          try {
            const user = await updateUser(id, payload)
            if (user?.error) {
              return {
                error: user?.error || user?.message,
              }
            }
            if (user?.role == 'admin')
              setState((prev) => ({
                ...prev,
                users: [user, ...prev.users.filter((item) => item?.id != user?.id)],
                admins: [user, ...prev.admins.filter((item) => item?.id != user?.id)],
              }))
            if (user?.role == 'artist')
              setState((prev) => ({
                ...prev,
                users: [user, ...prev.users.filter((item) => item?.id != user?.id)],
                artists: [user, ...prev.artists.filter((item) => item?.id != user?.id)],
              }))
            if (user?.role == 'buyer')
              setState((prev) => ({
                ...prev,
                users: [user, ...prev.users.filter((item) => item?.id != user?.id)],
                buyers: [user, ...prev.buyers.filter((item) => item?.id != user?.id)],
              }))
            if (user?.role == 'curator')
              setState((prev) => ({
                ...prev,
                users: [user, ...prev.users.filter((item) => item?.id != user?.id)],
                curators: [user, ...prev.curators.filter((item) => item?.id != user?.id)],
              }))
            makeToast('Succès', 'success', "L'utilisateur a été mis à jour avec succès")
            await createLog({
              description: `L'utilisateur ${user?.name} a été mis à jour`,
              userId: admin?.id,
            })
            return user
          } catch (error) {
            return {
              error: error.message,
            }
          }
  }, [admin?.id, makeToast])

  const deleteUserCtx = useCallback(async (id) => {
          try {
            const user = await deleteUser(id)
            if (!user?.id) {
              return {
                error: user?.error || user?.message,
              }
            }
            if (user?.role == 'admin')
              setState((prev) => ({
                ...prev,
                users: [...prev.users.filter((item) => item?.id != user?.id)],
                admins: [...prev.admins.filter((item) => item?.id != user?.id)],
              }))
            if (user?.role == 'artist')
              setState((prev) => ({
                ...prev,
                users: [...prev.users.filter((item) => item?.id != user?.id)],
                artists: [...prev.artists.filter((item) => item?.id != user?.id)],
              }))
            if (user?.role == 'buyer')
              setState((prev) => ({
                ...prev,
                users: [...prev.users.filter((item) => item?.id != user?.id)],
                buyers: [...prev.buyers.filter((item) => item?.id != user?.id)],
              }))
            if (user?.role == 'curator')
              setState((prev) => ({
                ...prev,
                users: [...prev.users.filter((item) => item?.id != user?.id)],
                curators: [...prev.curators.filter((item) => item?.id != user?.id)],
              }))
            makeToast('Succès', 'success', "L'utilisateur a été supprimé avec succès")
            await createLog({
              description: `L'utilisateur ${user?.name} a été supprimé`,
              userId: admin?.id,
            })
            return user
          } catch (error) {
            return {
              error: error.message,
            }
          }
  }, [admin?.id, makeToast])

  const setStatus = useCallback(async (id) => {
          try {
            const user = await setUserStatus(id)
            if (!user?.id) {
              return {
                error: user?.error || user?.message,
              }
            }
            if (user?.role == 'admin')
              setState((prev) => ({
                ...prev,
                users: [user, ...prev.users.filter((item) => item?.id != user?.id)],
                admins: [user, ...prev.admins.filter((item) => item?.id != user?.id)],
              }))
            if (user?.role == 'artist')
              setState((prev) => ({
                ...prev,
                users: [user, ...prev.users.filter((item) => item?.id != user?.id)],
                artists: [user, ...prev.artists.filter((item) => item?.id != user?.id)],
              }))
            if (user?.role == 'buyer')
              setState((prev) => ({
                ...prev,
                users: [user, ...prev.users.filter((item) => item?.id != user?.id)],
                buyers: [user, ...prev.buyers.filter((item) => item?.id != user?.id)],
              }))
            if (user?.role == 'curator')
              setState((prev) => ({
                ...prev,
                users: [user, ...prev.users.filter((item) => item?.id != user?.id)],
                curators: [user, ...prev.curators.filter((item) => item?.id != user?.id)],
              }))
            makeToast(
              'Succès',
              'success',
              `L'utilisateur a été ${user?.isActive ? 'activé' : 'suspendu'}`
            )
            await createLog({
              description: `L'utilisateur ${user?.name} a été ${user?.isActive ? 'activé' : 'suspendu'}`,
              userId: admin?.id,
            })
            return user
          } catch (error) {
            return {
              error: error.message,
            }
          }
  }, [admin?.id, makeToast])

  const value = useMemo(() => ({
    ...state,
    addUser: addUserCtx,
    updateUser: updateUserCtx,
    deleteUser: deleteUserCtx,
    setStatus,
  }), [state, addUserCtx, updateUserCtx, deleteUserCtx, setStatus])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUsersContext() {
  return useContext(UserContext)
}
