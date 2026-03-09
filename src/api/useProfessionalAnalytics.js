import axios from "axios";
import { utils } from "./useAPI";

const ANALYTICS_API = `${utils.api}/professional-analytics`;

export const getProfessionalAnalytics = async (period = "month") => {
  try {
    const response = await axios.get(`${ANALYTICS_API}?period=${period}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getRealTimeStats = async () => {
  try {
    const response = await axios.get(`${ANALYTICS_API}/realtime`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};
