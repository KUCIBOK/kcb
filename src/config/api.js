import axios from "axios";

/**
 * Client Axios minimal utilisé uniquement pour sendErrorReport (Error500).
 * L'endpoint /api/report-error ne requiert pas d'authentification utilisateur.
 */
const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
        "kcb-api-key": import.meta.env.VITE_API_KEY,
    },
    validateStatus: () => true,
});

export default apiClient;