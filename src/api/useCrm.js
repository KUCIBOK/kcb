import axios from "axios";
import { utils } from "./useAPI";

const CRM_API = `${utils.api}/crm`;

export const createClient = async (clientData) => {
  try {
    const response = await axios.post(`${CRM_API}/clients`, clientData, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getClients = async (params = {}) => {
  try {
    const response = await axios.get(`${CRM_API}/clients`, {
      headers: utils.options.headers,
      params,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getClientById = async (id) => {
  try {
    const response = await axios.get(`${CRM_API}/clients/${id}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const updateClient = async (id, updates) => {
  try {
    const response = await axios.put(`${CRM_API}/clients/${id}`, updates, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const deleteClient = async (id) => {
  try {
    const response = await axios.delete(`${CRM_API}/clients/${id}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const addNote = async (clientId, content) => {
  try {
    const response = await axios.post(
      `${CRM_API}/clients/${clientId}/notes`,
      { content },
      { headers: utils.options.headers }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const deleteNote = async (clientId, noteId) => {
  try {
    const response = await axios.delete(
      `${CRM_API}/clients/${clientId}/notes/${noteId}`,
      { headers: utils.options.headers }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const addInteraction = async (clientId, interactionData) => {
  try {
    const response = await axios.post(
      `${CRM_API}/clients/${clientId}/interactions`,
      interactionData,
      { headers: utils.options.headers }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const deleteInteraction = async (clientId, interactionId) => {
  try {
    const response = await axios.delete(
      `${CRM_API}/clients/${clientId}/interactions/${interactionId}`,
      { headers: utils.options.headers }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getCrmStats = async () => {
  try {
    const response = await axios.get(`${CRM_API}/stats`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const syncClientsFromTransactions = async () => {
  try {
    const response = await axios.post(
      `${CRM_API}/sync-from-transactions`,
      {},
      { headers: utils.options.headers }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const exportClientsCSV = async () => {
  try {
    const response = await axios.get(`${CRM_API}/export/csv`, {
      headers: utils.options.headers,
      responseType: "blob",
    });

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
