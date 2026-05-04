import { utils } from './useAPI'

const INTEGRATION_API = `${utils.api}/integrations`

/**
 * Recupere toutes les integrations configurees.
 * @returns {Promise<object>} Liste des integrations ou objet erreur
 */
export const getIntegrations = async () => {
  try {
    const response = await fetch(INTEGRATION_API, {
      headers: utils.options.headers,
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Erreur ${response.status}` }
    }
    return await response.json()
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Recupere une integration par ID.
 * @param {string} id - Identifiant de l'integration
 * @returns {Promise<object>} Donnees de l'integration ou objet erreur
 */
export const getIntegration = async (id) => {
  try {
    const response = await fetch(`${INTEGRATION_API}/${id}`, {
      headers: utils.options.headers,
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Erreur ${response.status}` }
    }
    return await response.json()
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Connecte une nouvelle integration.
 * @param {string} name - Nom de l'integration
 * @param {object} credentials - Identifiants de connexion
 * @param {object} settings - Parametres optionnels
 * @returns {Promise<object>} Integration connectee ou objet erreur
 */
export const connectIntegration = async (name, credentials, settings = {}) => {
  try {
    const response = await fetch(INTEGRATION_API, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, credentials, settings }),
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Erreur ${response.status}` }
    }
    return await response.json()
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Met a jour les parametres d'une integration.
 * @param {string} id - Identifiant de l'integration
 * @param {object} settings - Nouveaux parametres
 * @returns {Promise<object>} Integration mise a jour ou objet erreur
 */
export const updateIntegration = async (id, settings) => {
  try {
    const response = await fetch(`${INTEGRATION_API}/${id}`, {
      method: 'PUT',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Erreur ${response.status}` }
    }
    return await response.json()
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Declenche une synchronisation pour une integration.
 * @param {string} id - Identifiant de l'integration
 * @returns {Promise<object>} Resultat de la sync ou objet erreur
 */
export const syncIntegration = async (id) => {
  try {
    const response = await fetch(`${INTEGRATION_API}/${id}/sync`, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Erreur ${response.status}` }
    }
    return await response.json()
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Deconnecte (supprime) une integration.
 * @param {string} id - Identifiant de l'integration
 * @returns {Promise<object>} Confirmation ou objet erreur
 */
export const disconnectIntegration = async (id) => {
  try {
    const response = await fetch(`${INTEGRATION_API}/${id}`, {
      method: 'DELETE',
      headers: utils.options.headers,
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Erreur ${response.status}` }
    }
    return await response.json()
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Recupere les statistiques des integrations.
 * @returns {Promise<object>} Stats ou objet erreur
 */
export const getIntegrationStats = async () => {
  try {
    const response = await fetch(`${INTEGRATION_API}/stats`, {
      headers: utils.options.headers,
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return { error: errData.message || `Erreur ${response.status}` }
    }
    return await response.json()
  } catch (error) {
    return { error: error.message }
  }
}
