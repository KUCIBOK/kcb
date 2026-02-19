import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const CRM_API = `${API_URL}/api/crm`;

// ✅ Créer un client
export const createClient = async (clientData) => {
  try {
    const response = await axios.post(`${CRM_API}/clients`, clientData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Récupérer tous les clients
export const getClients = async (params = {}) => {
  try {
    const response = await axios.get(`${CRM_API}/clients`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Récupérer un client par ID
export const getClientById = async (id) => {
  try {
    const response = await axios.get(`${CRM_API}/clients/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Mettre à jour un client
export const updateClient = async (id, updates) => {
  try {
    const response = await axios.put(`${CRM_API}/clients/${id}`, updates, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Supprimer un client
export const deleteClient = async (id) => {
  try {
    const response = await axios.delete(`${CRM_API}/clients/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Ajouter une note
export const addNote = async (clientId, content) => {
  try {
    const response = await axios.post(
      `${CRM_API}/clients/${clientId}/notes`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Supprimer une note
export const deleteNote = async (clientId, noteId) => {
  try {
    const response = await axios.delete(
      `${CRM_API}/clients/${clientId}/notes/${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Ajouter une interaction
export const addInteraction = async (clientId, interactionData) => {
  try {
    const response = await axios.post(
      `${CRM_API}/clients/${clientId}/interactions`,
      interactionData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Supprimer une interaction
export const deleteInteraction = async (clientId, interactionId) => {
  try {
    const response = await axios.delete(
      `${CRM_API}/clients/${clientId}/interactions/${interactionId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Récupérer les statistiques CRM
export const getCrmStats = async () => {
  try {
    const response = await axios.get(`${CRM_API}/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Synchroniser depuis les transactions
export const syncClientsFromTransactions = async () => {
  try {
    const response = await axios.post(
      `${CRM_API}/sync-from-transactions`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Exporter les clients en CSV
export const exportClientsCSV = async () => {
  try {
    const response = await axios.get(`${CRM_API}/export/csv`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      responseType: "blob",
    });

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "clients.csv");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    return { success: true };
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};
