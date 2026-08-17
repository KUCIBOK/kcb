import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext'
import {
  createNumerisation,
  getNumerisationRequests,
  getMyNumerisationRequests,
  updateNumerisationRequest,
  updateNumerisationRequestStatus,
  deleteNumerisationRequest,
} from '../api/useNumerisation'
import { useToast } from './ToastContext'

const initialState = {
  numerisations: [],
  myNumerisations: [],
  loading: true,
}

const NumerisationContext = createContext(initialState)

export const NumerisationProvider = ({ children }) => {
  const [state, setState] = useState(initialState)
  const { user } = useAuth()
  const { makeToast } = useToast()
  useEffect(() => {
    const fetchNumerisations = async () => {
      const numerisations =
        user?.role === 'admin' ? await getNumerisationRequests() : await getMyNumerisationRequests()
      if (Array.isArray(numerisations)) {
        setState((prev) => ({
          ...prev,
          numerisations: user?.role === 'admin' ? numerisations : [],
          myNumerisations: user?.role === 'admin' ? [] : numerisations,
        }))
      }
    }
    if (user?.role && user?.role != 'artist') {
      fetchNumerisations().finally(() => {
        setState((prev) => ({ ...prev, loading: false }))
      })
    } else {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [user?.role])

  const create = useCallback(async (payload) => {
          const result = await createNumerisation(payload)
          if (result?._id) {
            setState((prev) => ({
              ...prev,
              myNumerisations: [result, ...prev.myNumerisations],
            }))
            makeToast('Succès', 'success', 'Demande de numérisation créée avec succès')
          }
          if (result?.error) {
            makeToast('Erreur', 'error', result.error)
          }
          return result
        }
  }, [makeToast])

  const update = useCallback(async (id, payload) => {
          const result = await updateNumerisationRequest(id, payload)
          if (result?._id) {
            setState((prev) => ({
              ...prev,
              myNumerisations: prev.myNumerisations.map((req) => (req._id === id ? result : req)),
            }))
            makeToast('Succès', 'success', 'Demande de numérisation mise à jour avec succès')
          }
          if (result?.error) {
            makeToast('Erreur', 'error', result.error)
          }
          return result
        }
  }, [makeToast])

  const updateStatus = useCallback(async (id, payload) => {
          const result = await updateNumerisationRequestStatus(id, payload)
          if (result?._id) {
            setState((prev) => ({
              ...prev,
              numerisations: prev.numerisations.map((req) => (req._id === id ? result : req)),
            }))
            makeToast(
              'Succès',
              'success',
              'Statut de la demande de numérisation mis à jour avec succès'
            )
          }
          if (result?.error) {
            makeToast('Erreur', 'error', result.error)
          }
          return result
        }
  }, [makeToast])

  const deleteNumerisationCtx = useCallback(async (id) => {
          const result = await deleteNumerisationRequest(id)
          if (result?._id) {
            setState((prev) => ({
              ...prev,
              myNumerisations: prev.myNumerisations.filter((req) => req._id !== id),
            }))
            makeToast('Succès', 'success', 'Demande de numérisation supprimée avec succès')
          }
          if (result?.error) {
            makeToast('Erreur', 'error', result.error)
          }
          return result
        }
  }, [makeToast])

  const value = useMemo(() => ({
    numerisations: state.numerisations,
    myNumerisations: state.myNumerisations,
    loading: state.loading,
    create,
    update,
    updateStatus,
    delete: deleteNumerisationCtx,
  }), [state, create, update, updateStatus, deleteNumerisationCtx])

  return (
    <NumerisationContext.Provider value={value}>
      {children}
    </NumerisationContext.Provider>
  )
}

export const useNumerisation = () => {
  return useContext(NumerisationContext)
}
