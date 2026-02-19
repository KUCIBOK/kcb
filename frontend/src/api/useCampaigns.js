import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const CAMPAIGN_API = `${API_URL}/api/campaigns`;

export const getCampaigns = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${CAMPAIGN_API}/campaigns?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getCampaign = async (id) => {
  try {
    const response = await axios.get(`${CAMPAIGN_API}/campaigns/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const createCampaign = async (data) => {
  try {
    const response = await axios.post(`${CAMPAIGN_API}/campaigns`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const updateCampaign = async (id, data) => {
  try {
    const response = await axios.put(`${CAMPAIGN_API}/campaigns/${id}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const deleteCampaign = async (id) => {
  try {
    const response = await axios.delete(`${CAMPAIGN_API}/campaigns/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const sendTestCampaign = async (id, testEmails) => {
  try {
    const response = await axios.post(`${CAMPAIGN_API}/campaigns/${id}/send-test`, { testEmails }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const sendCampaign = async (id, scheduledAt = null) => {
  try {
    const response = await axios.post(`${CAMPAIGN_API}/campaigns/${id}/send`, { scheduledAt }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getCampaignAnalytics = async (id) => {
  try {
    const response = await axios.get(`${CAMPAIGN_API}/campaigns/${id}/analytics`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};
