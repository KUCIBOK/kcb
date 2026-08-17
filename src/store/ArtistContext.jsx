import { createContext, memo, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import {
  createArtist,
  getAllArtists,
  getArtistById,
  getFeaturedArtists,
  getManagedArtists,
  updateManagedArtist,
} from '../api/useArtists'
import { useToast } from './ToastContext'
import { getArtistForSaleArtworks } from '../api/useArtworks'
import { useAuth } from './AuthContext'

const initialState = {
  artists: [],
  myArtists: [],
  featured: [],
  loading: true,
}
const ArtistContext = createContext(initialState)

export const ArtistContextProvider = memo(function ArtistContextProvider({ children }) {
  const { user } = useAuth()
  const [state, setState] = useState(initialState)
  const { makeToast } = useToast()
  useEffect(() => {
    const fetchArtists = async () => {
      const artists = await getAllArtists({ limit: 1000 })
      if (artists?.length >= 1) {
        setState((prev) => ({
          ...prev,
          artists: artists?.reverse(),
        }))
        return
      }
      // makeToast('Erreur','warning',artists?.error)
    }

    const getFeatured = async () => {
      try {
        const featured = await getFeaturedArtists()
        if (featured?.length >= 1) {
          setState((prev) => ({
            ...prev,
            featured: featured,
          }))
        }
      } catch (error) {
        return {
          error: error.message,
        }
      }
    }
    Promise.allSettled([fetchArtists(), getFeatured()]).finally(() => {
      setState((prev) => ({ ...prev, loading: false }))
    })
  }, [])
  useEffect(() => {
    if (user?.role === 'curator' || user?.role === 'buyer') {
      getManagedArtists(user?._id)
        .then((artists) => {
          if (Array.isArray(artists) && artists.length >= 1) {
            setState((prev) => ({ ...prev, myArtists: artists }))
          }
        })
        .catch(() => {})
    }
  }, [user?._id, user?.role])

  const getArtistByIdCtx = useCallback(async (id) => {
    const artist = await getArtistById(id)
    if (artist) {
      return artist
    }
    makeToast('Erreur', 'warning', 'Serveur non disponible')
  }, [makeToast])

  const getArtistArtworks = useCallback(async (id) => {
    const artworks = await getArtistForSaleArtworks(id)
    if (artworks?.length >= 1) {
      return artworks
    }
  }, [])

  const create = useCallback(async (payload) => {
    try {
      const artist = await createArtist(payload)
      if (artist?._id) {
        setState((prev) => ({
          ...prev,
          myArtists: [artist, ...prev.myArtists],
        }))
        makeToast('Succès', 'success', 'Artiste créé avec succès')
        return artist
      }
      makeToast('Erreur', 'warning', artist?.error || "Impossible de créer l'artiste")
      return {
        error: artist?.error,
      }
    } catch (error) {
      return { error: error.message }
    }
  }, [makeToast])

  const update = useCallback(async (id, payload) => {
    try {
      const artist = await updateManagedArtist(id, payload)
      if (artist?._id) {
        setState((prev) => ({
          ...prev,
          myArtists: [artist, ...prev.myArtists.filter((item) => item?._id != artist?._id)],
        }))
        makeToast('Succès', 'success', 'Artiste mis à jour avec succès')
        return artist
      }
      makeToast(
        'Erreur',
        'warning',
        artist?.error || "Impossible de mettre à jour l'artiste"
      )
      return {
        error: artist?.error || 'Erreur mise à jour',
      }
    } catch (error) {
      return {
        error: error.message,
      }
    }
  }, [makeToast])

  const value = useMemo(() => ({
    artists: state?.artists,
    myArtists: state?.myArtists,
    featuredArtists: state?.featured,
    loading: state.loading,
    getArtistById: getArtistByIdCtx,
    getArtistArtworks,
    create,
    update,
  }), [state, getArtistByIdCtx, getArtistArtworks, create, update])

  return (
    <>
      <ArtistContext.Provider value={value}>
        {children}
      </ArtistContext.Provider>
    </>
  )
})

export function useArtist() {
  return useContext(ArtistContext)
}
