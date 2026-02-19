import { utils } from "./useAPI";
const {api, options} = utils

export async function createTransaction(payload) {
    try {
        const response = await fetch(`${api}/transaction`, {
            ...options,
            method : "POST",
            body : JSON.stringify(payload)
        })
        const transaction = await response.json()
        if(transaction?._id){
            return transaction
        }
        return {
            error : transaction?.message || transaction?.error
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function getTransactionById(id){
    try {
        const response = await fetch(`${api}/transaction/${id}`, {...options})
        const transaction = await response.json()
        if(transaction?._id){
            return transaction
        }
        return {
            error : transaction?.message || transaction?.error
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function failTransaction(id){
    try {
        const response = await fetch(`${api}/transaction/fail/${id}`, {...options})
        const data = await response.json()
        if(data?.transaction && data?.artwork){
            return data
        }
        return {
            error : data?.message || data?.error
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}