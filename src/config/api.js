const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Client fetch minimal utilise uniquement pour sendErrorReport (Error500).
 * L'endpoint /api/report-error ne requiert pas d'authentification utilisateur.
 *
 * @param {string} path - Chemin relatif de l'endpoint (ex: "/report-error")
 * @param {object} options - Options fetch (method, body, headers, etc.)
 * @returns {Promise<Response>} La reponse fetch brute
 */
const apiClient = async (path, options = {}) => {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "kcb-api-key": API_KEY,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return response;
};

export default apiClient;
