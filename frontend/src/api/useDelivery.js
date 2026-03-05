import { utils } from "./useAPI";
const {api} = utils

export async function getDeliveryByTracking(trackingId) {
    try {
        const response = await fetch(`${api}/delivery/track/${trackingId}`, {
            headers: { "kcb-api-key": import.meta.env.VITE_API_KEY },
        });
        const data = await response.json();
        if (data?._id) return data;
        return { error: data?.message || data?.error || "Numéro de suivi introuvable" };
    } catch (error) {
        return { error: error.message };
    }
}

export async function createDelivery(payload) {
    try {
        const response = await fetch(`${api}/delivery`, {
            ...utils.options,
            method: "POST",
            body: JSON.stringify(payload)
        });
        const delivery = await response.json();
        if (delivery?._id) {
            return delivery;
        }
        return {
            error: delivery?.message || delivery?.error
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}

export async function getDeliveries() {
    try {
        const response = await fetch(`${api}/delivery`, {...utils.options});
        const deliveries = await response.json();
        if (Array.isArray(deliveries)) {
            return deliveries;
        }
        return {
            error: deliveries?.message || deliveries?.error
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}

export async function changeDeliveryStatus(id, payload){
    try {
        const response = await fetch(`${api}/delivery/${id}`, {
            ...utils.options,
            method : "PATCH",
            body : JSON.stringify(payload)
        })
        const dR = await response.json()
        if(dR?._id){
            return dR
        }
        return {
            error: dR?.message || dR?.error
        }
    } catch (error) {
        return {
            error: error.message
        }
    }
}

export async function getMyDeliveries() {
    try {
        const response = await fetch(`${api}/delivery/my`, {...utils.options});
        const deliveries = await response.json();
        if (Array.isArray(deliveries)) {
            return deliveries;
        }
        return {
            error: deliveries?.message || deliveries?.error
        };
    }   catch (error) {
        return {
            error: error.message
        };
    }
}

export async function getDelivery(id) {
    try {
        const response = await fetch(`${api}/delivery/${id}`, {...utils.options});
        const delivery = await response.json();
        if (delivery?._id) {
            return delivery;
        }
        return {
            error: delivery?.message || delivery?.error
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}

export async function updateDelivery(id, payload) {
    try {
        const response = await fetch(`${api}/delivery/${id}`, {
            ...utils.options,
            method: "PUT",
            body: JSON.stringify(payload)
        });
        const delivery = await response.json();
        if (delivery?._id) {
            return delivery;
        }
        return {
            error: delivery?.message || delivery?.error
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}

export async function deleteDelivery(id) {
    try {
        const response = await fetch(`${api}/delivery/${id}`, {
            ...utils.options,
            method: "DELETE"
        });
        const del = await response.json();
        if (del?._id) {
            return { success: true };
        }
        return {
            error: del?.message || del?.error
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
}

