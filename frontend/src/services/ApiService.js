// Service API universel pour Kucibok
// Gère les requêtes avec cookies, erreurs, et JSON

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

function handleResponse(response) {
  return response.json().then(data => {
    if (!response.ok) {
      throw new Error(data?.error || data?.message || 'Erreur serveur');
    }
    return data;
  });
}

const apiService = {
  get: async (url, options = {}) => {
    const response = await fetch(BASE_URL + url, {
      method: 'GET',
      credentials: 'include',
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    });
    return handleResponse(response);
  },
  post: async (url, body = {}, options = {}) => {
    const response = await fetch(BASE_URL + url, {
      method: 'POST',
      credentials: 'include',
      headers: { ...defaultHeaders, ...options.headers },
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(response);
  },
  put: async (url, body = {}, options = {}) => {
    const response = await fetch(BASE_URL + url, {
      method: 'PUT',
      credentials: 'include',
      headers: { ...defaultHeaders, ...options.headers },
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(response);
  },
  delete: async (url, options = {}) => {
    const response = await fetch(BASE_URL + url, {
      method: 'DELETE',
      credentials: 'include',
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    });
    return handleResponse(response);
  },
};

export default apiService;
