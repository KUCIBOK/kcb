import {utils} from './useAPI'
const {api, options} = utils

export const sendCampaign = async (payload) => {
    try {
        const response = await fetch(`${api}/campaign/dispatch`, {
            ...options,
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error dispatching campaign email:", error);
        throw error;
    }
};