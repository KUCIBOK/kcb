import { utils } from "./useAPI";
const {api} = utils


export async function createCollection(payload){
    try {
        const response = await fetch(`${api}/collection`, {
            ...utils.options,
            method : "POST",
            body : JSON.stringify(payload)
        })
        const collection = await response.json()
        if(collection?._id){
            return collection
        }
        return {
            error : collection?.error || collection?.message
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function getCollections(){
    try {
        const response = await fetch(`${api}/collection`, {...utils.options})
        const collections = await response.json()
        if(collections?.length > 0){
            return collections
        }
        return {
            error : collections.error || collections.message
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}