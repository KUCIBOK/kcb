import axios from "axios";
import { utils } from "./useAPI";

const INTEGRATION_API = `${utils.api}/integrations`;

export const getIntegrations = async () => {
  try {
    const response = await axios.get(INTEGRATION_API, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getIntegration = async (id) => {
  try {
    const response = await axios.get(`${INTEGRATION_API}/${id}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const connectIntegration = async (name, credentials, settings = {}) => {
  try {
    const response = await axios.post(
      INTEGRATION_API,
      { name, credentials, settings },
      { headers: utils.options.headers }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const updateIntegration = async (id, settings) => {
  try {
    const response = await axios.put(
      `${INTEGRATION_API}/${id}`,
      { settings },
      { headers: utils.options.headers }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const syncIntegration = async (id) => {
  try {
    const response = await axios.post(
      `${INTEGRATION_API}/${id}/sync`,
      {},
      { headers: utils.options.headers }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const disconnectIntegration = async (id) => {
  try {
    const response = await axios.delete(`${INTEGRATION_API}/${id}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getIntegrationStats = async () => {
  try {
    const response = await axios.get(`${INTEGRATION_API}/stats`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};
