import { utils } from "./useAPI";
const { api, options } = utils;

export async function getAllArtists(){
    try {
        const response = await fetch(`${api}/artist`, {
            ...options
        })
        const data = await response.json()
        if(data?.length >= 1){
            return data
        }
        return {
            error : data?.error || data?.message
        }
    } catch (error) {
        return {
            error : error.message 
        }
    }
}

export async function getArtistAndUpdateVisited(id){
    try {
        const response = await fetch(`${api}/artist/visited/${id}`, {
            ...options
        })
        const data = await response.json()
        if(data?.id){
            return data
        }
        return {
            error : data?.error || data?.message
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function getArtistById(id){
    try {
        const response = await fetch(`${api}/artist/${id}`, {
            ...options
        })
        const data = await response.json()
        if(data?.id){
            return data
        }
        return {
            error : data?.error || data?.message
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function getManagedArtists(id){
    try {
        const response = await fetch(`${api}/artist/managed/${id}`, {...options})
        const artists = await response.json()
        if(artists?.length > 0){
            return artists
        }
        return {
            error : artists?.message || artists?.error
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function createArtist(payload){
    try {
        const {api} = utils
        const response = await fetch(`${api}/artist`,  {
            method : 'POST',
            headers : {
                "kcb-api-key": import.meta.env.VITE_API_KEY,
                "Accept": "*/*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Authorization" : `Bearer ${localStorage.getItem('token')}`,
            },
            body : payload
        })
        const artist = await response.json()
        if(artist?.userId){
            return artist
        }
        return {
            error : artist?.error || artist?.message 
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function updateArtist(id, payload){
    try {
        const { api } = utils
        const response = await fetch(`${api}/artist/${id}`, {
            method : 'PUT',
            headers : {
                "kcb-api-key": import.meta.env.VITE_API_KEY,
                "Accept": "*/*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Authorization" : `Bearer ${localStorage.getItem('token')}`,
            },
            body : payload
        })
        const artist = await response.json()
        if(artist?.userId){
            return artist
        }
        return {
            error : artist?.error || artist?.message 
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function updateManagedArtist(id, payload){
    try {
        const { api } = utils
        const response = await fetch(`${api}/artist/managed/${id}`, {
            method : 'PUT',
            headers : {
                "kcb-api-key": import.meta.env.VITE_API_KEY,
                "Accept": "*/*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Authorization" : `Bearer ${localStorage.getItem('token')}`,
            },
            body : payload
        })
        const artist = await response.json()
        if(artist?.userId){
            return artist
        }
        return {
            error : artist?.error || artist?.message 
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function getFeaturedArtists(){
    const {api, options} = utils
    try {
        const response = await fetch(`${api}/artist/random`, {...options})
        const featured = await response.json()
        if(featured?.length >= 1){
            return featured
        }
        return {
            error : featured?.error || featured?.message
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}