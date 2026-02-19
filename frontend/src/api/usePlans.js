import { utils } from "./useAPI";
const {api, options} = utils
export async function getAllPlans(){
    try {
        const response = await fetch(`${api}/plan`, {...options});
        const plans = await response.json();
        if(plans?.length > 0){
            return plans
        }
        else{
            throw new Error(plans?.message || "No plans found")
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function getPlanById(id){
    try {
        const response = await fetch(`${api}/plan/${id}`, {...options})
        const plan = await response.json()
        if(plan?._id){
            return plan
        }
        return {
            error : plan?.error || plan?.message
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}


export async function createPlan(payload){
    try {
        const response = await fetch(`${api}/plan`, {
            ...options,
            method: "POST",
            body : JSON.stringify(payload)

        });
        const plan = await response.json();
        if(plan?._id){
            return plan
        }
        else{
            throw new Error(plan?.message || plan?.error || "Plan creation failed")
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function updatePlan(id, payload){
    try {
        const {api, options} = utils;
        const response = await fetch(`${api}/plan/${id}`, {
            ...options,
            method: "PUT",
            body : JSON.stringify(payload)

        });
        const plan = await response.json();
        if(plan?._id){
            return plan
        }
        else{
            throw new Error(plan?.message || plan?.error || "Plan update failed")
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}

export async function deletePlan(id){
    try {
        const {api, options} = utils;
        const response = await fetch(`${api}/plan/${id}`, {
            ...options,
            method: "DELETE"
        });
        const plan = await response.json();
        if(plan?._id){
            return plan
        }
        else{
            throw new Error(plan?.message || plan?.error || "Plan deletion failed")
        }
    } catch (error) {
        return {
            error : error.message
        }
    }
}