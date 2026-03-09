import { utils } from "./useAPI";
const {api} = utils

export async function createSubscription(payload){
    try {
        const response = await fetch(`${api}/subscription`, {
            ...utils.options, 
            method : "POST",
            body : JSON.stringify(payload)
        })
        const sub = await response.json()
        if(sub?._id){
            return sub
        }
        return {
            error : sub?.error || sub?.messsage
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function failSubscription(subId){
    try {
        const response = await fetch(`${api}/subscription/fail/${subId}`, {...utils.options})
        const {sub, plan, error, message} = await response.json()
        if(sub?._id && plan?._id){
            return {sub, plan}
        }
        return {
            error : error || message
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function activateSubscription(subId){
    try {
        const response = await fetch(`${api}/subscription/activate/${subId}`, {...utils.options})
        const {sub, plan, error, message} = await response.json()
        if(sub?._id && plan?._id){
            return {sub, plan}
        }
        return {
            error : error || message
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function getSubById(id){
    try {
        const response = await fetch(`${api}/subscription/${id}`, {...utils.options})
        const sub = await response.json()
        if(sub?._id){
            return sub
        }
        return {
            error : sub?.error || sub?.messsage
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

// Alias pour compatibilité avec les imports
export const getSubscriptionById = getSubById;


export async function getAllSubscriptions(){
    try {
        const response = await fetch(`${api}/subscription`, {...utils.options})
        const subscriptions = await response.json()
        if(subscriptions?.length > 0){
            return subscriptions
        }
        return {
            error : subscriptions?.message || subscriptions?.error
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}