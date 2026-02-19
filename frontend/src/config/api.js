import axios from "axios";

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "kcb-api-key": import.meta.env.VITE_API_KEY
    },
    // withCredentials: true,
    validateStatus: () => true,
});

// Intercepteur: injecte le token à chaque requête (si présent)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers = config.headers || {};
        config.headers["kcb-api-key"] = import.meta.env.VITE_API_KEY;
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;