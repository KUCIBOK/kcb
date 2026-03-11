import { utils } from "./useAPI";

const ANALYTICS_API = `${utils.api}/professional-analytics`;

/**
 * Recupere les analytics professionnelles pour une periode donnee.
 * @param {string} period - Periode d'analyse ("month", "week", "year", etc.)
 * @returns {Promise<object>} Donnees analytics ou objet erreur
 */
export const getProfessionalAnalytics = async (period = "month") => {
  try {
    const response = await fetch(`${ANALYTICS_API}?period=${period}`, {
      headers: utils.options.headers,
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return { error: errData.message || `Erreur ${response.status}` };
    }
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Recupere les statistiques en temps reel.
 * @returns {Promise<object>} Stats temps reel ou objet erreur
 */
export const getRealTimeStats = async () => {
  try {
    const response = await fetch(`${ANALYTICS_API}/realtime`, {
      headers: utils.options.headers,
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return { error: errData.message || `Erreur ${response.status}` };
    }
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};
