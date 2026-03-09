import axios from 'axios';
import { utils } from './useAPI';

const CONTACT_API = `${utils.api}/contacts`;

// ===== CONTACTS =====

export const getContacts = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${CONTACT_API}/contacts?${params}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getContact = async (id) => {
  try {
    const response = await axios.get(`${CONTACT_API}/contacts/${id}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const createContact = async (data) => {
  try {
    const response = await axios.post(`${CONTACT_API}/contacts`, data, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const updateContact = async (id, data) => {
  try {
    const response = await axios.put(`${CONTACT_API}/contacts/${id}`, data, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const deleteContact = async (id) => {
  try {
    const response = await axios.delete(`${CONTACT_API}/contacts/${id}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const importContacts = async (contacts, listId) => {
  try {
    const response = await axios.post(`${CONTACT_API}/contacts/import`, { contacts, listId }, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const unsubscribeContact = async (id, reason) => {
  try {
    const response = await axios.post(`${CONTACT_API}/contacts/${id}/unsubscribe`, { reason }, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getContactStats = async () => {
  try {
    const response = await axios.get(`${CONTACT_API}/contacts/stats`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ===== LISTS =====

export const getLists = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${CONTACT_API}/lists?${params}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getList = async (id) => {
  try {
    const response = await axios.get(`${CONTACT_API}/lists/${id}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const createList = async (data) => {
  try {
    const response = await axios.post(`${CONTACT_API}/lists`, data, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const updateList = async (id, data) => {
  try {
    const response = await axios.put(`${CONTACT_API}/lists/${id}`, data, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const deleteList = async (id) => {
  try {
    const response = await axios.delete(`${CONTACT_API}/lists/${id}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const updateRSVP = async (listId, contactId, status, guestsCount, notes) => {
  try {
    const response = await axios.post(`${CONTACT_API}/lists/${listId}/rsvp`, {
      contactId,
      status,
      guestsCount,
      notes,
    }, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ===== CRM SYNC =====

export const syncFromCRM = async (crmContactId, listId, tags) => {
  try {
    const response = await axios.post(`${CONTACT_API}/sync/crm`, {
      crmContactId,
      listId,
      tags,
    }, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const bulkSyncFromCRM = async (crmContactIds, listId, tags) => {
  try {
    const response = await axios.post(`${CONTACT_API}/sync/crm/bulk`, {
      crmContactIds,
      listId,
      tags,
    }, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const checkCRMSync = async (crmContactId) => {
  try {
    const response = await axios.get(`${CONTACT_API}/sync/crm/${crmContactId}/check`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};
