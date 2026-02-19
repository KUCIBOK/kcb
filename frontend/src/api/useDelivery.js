import { utils } from "./useAPI";
const {api, options} = utils

export async function createDelivery(payload) {
    try {
        const response = await fetch(`${api}/delivery`, {
            ...options,
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
        const response = await fetch(`${api}/delivery`, {...options});
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
            ...options,
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
        const response = await fetch(`${api}/delivery/my`, {...options});
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
        const response = await fetch(`${api}/delivery/${id}`, {...options});
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
            ...options,
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
            ...options,
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

