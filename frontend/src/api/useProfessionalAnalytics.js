import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const ANALYTICS_API = `${API_URL}/api/professional-analytics`;

// ✅ Get analytics data
export const getProfessionalAnalytics = async (period = "month") => {
  try {
    const response = await axios.get(`${ANALYTICS_API}?period=${period}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Get real-time stats
export const getRealTimeStats = async () => {
  try {
    const response = await axios.get(`${ANALYTICS_API}/realtime`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};
