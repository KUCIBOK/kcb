import { utils } from './useAPI';
const { api, options } = utils;

export async function createNumerisation(payload) {
    try {
        const response = await fetch(`${api}/numerisation`, {
            ...options,
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (data?._id) {
            return data;
        }
        return {
            error: data?.error || data?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function getNumerisationRequests() {
    try {
        const response = await fetch(`${api}/numerisation`, {...options});
        const data = await response.json();
        if (Array.isArray(data)) {
            return data;
        }
        return {
            error: data?.error || data?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function getMyNumerisationRequests() {
    try {
        const response = await fetch(`${api}/numerisation/my`, {...options});
        const data = await response.json();
        if (Array.isArray(data)) {
            return data;
        }
        return {
            error: data?.error || data?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function updateNumerisationRequestStatus(id, payload) {
    try {
        const response = await fetch(`${api}/numerisation/${id}/status`, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (data?._id) {
            return data;
        }
        return {
            error: data?.error || data?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function updateNumerisationRequest(id, payload) {
    try {
        const response = await fetch(`${api}/numerisation/${id}`, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (data?._id) {
            return data;
        }
        return {
            error: data?.error || data?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function deleteNumerisationRequest(id) {
    try {
        const response = await fetch(`${api}/numerisation/${id}`, {
            ...options,
            method: 'DELETE',
        });
        const data = await response.json();
        if (data?._id) {
            return data;
        }
        return {
            error: data?.error || data?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}