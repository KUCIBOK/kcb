import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const INTEGRATION_API = `${API_URL}/api/integrations`;

// ✅ Get all integrations
export const getIntegrations = async () => {
  try {
    const response = await axios.get(INTEGRATION_API, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Get single integration
export const getIntegration = async (id) => {
  try {
    const response = await axios.get(`${INTEGRATION_API}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Connect integration
export const connectIntegration = async (name, credentials, settings = {}) => {
  try {
    const response = await axios.post(
      INTEGRATION_API,
      { name, credentials, settings },
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

// ✅ Update integration settings
export const updateIntegration = async (id, settings) => {
  try {
    const response = await axios.put(
      `${INTEGRATION_API}/${id}`,
      { settings },
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

// ✅ Sync integration
export const syncIntegration = async (id) => {
  try {
    const response = await axios.post(
      `${INTEGRATION_API}/${id}/sync`,
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

// ✅ Disconnect integration
export const disconnectIntegration = async (id) => {
  try {
    const response = await axios.delete(`${INTEGRATION_API}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Get integration stats
export const getIntegrationStats = async () => {
  try {
    const response = await axios.get(`${INTEGRATION_API}/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};
