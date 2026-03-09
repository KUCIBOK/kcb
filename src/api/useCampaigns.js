import axios from 'axios';
import { utils } from './useAPI';

const CAMPAIGN_API = `${utils.api}/campaigns`;

export const getCampaigns = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${CAMPAIGN_API}/campaigns?${params}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getCampaign = async (id) => {
  try {
    const response = await axios.get(`${CAMPAIGN_API}/campaigns/${id}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const createCampaign = async (data) => {
  try {
    const response = await axios.post(`${CAMPAIGN_API}/campaigns`, data, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const updateCampaign = async (id, data) => {
  try {
    const response = await axios.put(`${CAMPAIGN_API}/campaigns/${id}`, data, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const deleteCampaign = async (id) => {
  try {
    const response = await axios.delete(`${CAMPAIGN_API}/campaigns/${id}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const sendTestCampaign = async (id, testEmails) => {
  try {
    const response = await axios.post(`${CAMPAIGN_API}/campaigns/${id}/send-test`, { testEmails }, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const sendCampaign = async (id, scheduledAt = null) => {
  try {
    const response = await axios.post(`${CAMPAIGN_API}/campaigns/${id}/send`, { scheduledAt }, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getCampaignAnalytics = async (id) => {
  try {
    const response = await axios.get(`${CAMPAIGN_API}/campaigns/${id}/analytics`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};
