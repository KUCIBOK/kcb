import { utils } from './useAPI';

const CAMPAIGN_API = `${utils.api}/campaigns`;

/**
 * Recupere la liste des campagnes avec filtres optionnels.
 * @param {object} filters - Filtres de recherche (URLSearchParams-compatible)
 * @returns {Promise<object>} Donnees des campagnes ou objet erreur
 */
export const getCampaigns = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${CAMPAIGN_API}/campaigns?${params}`, {
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
 * Recupere une campagne par ID.
 * @param {string} id - Identifiant de la campagne
 * @returns {Promise<object>} Donnees de la campagne ou objet erreur
 */
export const getCampaign = async (id) => {
  try {
    const response = await fetch(`${CAMPAIGN_API}/campaigns/${id}`, {
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
 * Cree une nouvelle campagne.
 * @param {object} data - Donnees de la campagne
 * @returns {Promise<object>} Campagne creee ou objet erreur
 */
export const createCampaign = async (data) => {
  try {
    const response = await fetch(`${CAMPAIGN_API}/campaigns`, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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
 * Met a jour une campagne existante.
 * @param {string} id - Identifiant de la campagne
 * @param {object} data - Donnees a mettre a jour
 * @returns {Promise<object>} Campagne mise a jour ou objet erreur
 */
export const updateCampaign = async (id, data) => {
  try {
    const response = await fetch(`${CAMPAIGN_API}/campaigns/${id}`, {
      method: 'PUT',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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
 * Supprime une campagne.
 * @param {string} id - Identifiant de la campagne
 * @returns {Promise<object>} Confirmation ou objet erreur
 */
export const deleteCampaign = async (id) => {
  try {
    const response = await fetch(`${CAMPAIGN_API}/campaigns/${id}`, {
      method: 'DELETE',
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
 * Envoie un test de campagne a des emails specifiques.
 * @param {string} id - Identifiant de la campagne
 * @param {string[]} testEmails - Liste d'emails destinataires du test
 * @returns {Promise<object>} Resultat ou objet erreur
 */
export const sendTestCampaign = async (id, testEmails) => {
  try {
    const response = await fetch(`${CAMPAIGN_API}/campaigns/${id}/send-test`, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ testEmails }),
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
 * Lance l'envoi d'une campagne (immediat ou programme).
 * @param {string} id - Identifiant de la campagne
 * @param {string|null} scheduledAt - Date d'envoi programme (ISO 8601) ou null pour immediat
 * @returns {Promise<object>} Resultat ou objet erreur
 */
export const sendCampaign = async (id, scheduledAt = null) => {
  try {
    const response = await fetch(`${CAMPAIGN_API}/campaigns/${id}/send`, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduledAt }),
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
 * Recupere les analytics d'une campagne.
 * @param {string} id - Identifiant de la campagne
 * @returns {Promise<object>} Donnees analytics ou objet erreur
 */
export const getCampaignAnalytics = async (id) => {
  try {
    const response = await fetch(`${CAMPAIGN_API}/campaigns/${id}/analytics`, {
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
