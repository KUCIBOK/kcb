import { utils } from './useAPI'

const CRM_API = `${utils.api}/crm`

/**
 * Cree un nouveau client CRM.
 * @param {object} clientData - Donnees du client
 * @returns {Promise<object>} Client cree ou objet erreur
 */
export const createClient = async (clientData) => {
  try {
    const response = await fetch(`${CRM_API}/clients`, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData),
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
 * Recupere la liste des clients CRM avec parametres optionnels.
 * @param {object} params - Parametres de filtrage (search, status, etc.)
 * @returns {Promise<object>} Liste des clients ou objet erreur
 */
export const getClients = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams(params)
    const queryString = searchParams.toString()
    const url = queryString ? `${CRM_API}/clients?${queryString}` : `${CRM_API}/clients`
    const response = await fetch(url, {
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
 * Recupere un client CRM par ID.
 * @param {string} id - Identifiant du client
 * @returns {Promise<object>} Donnees du client ou objet erreur
 */
export const getClientById = async (id) => {
  try {
    const response = await fetch(`${CRM_API}/clients/${id}`, {
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
 * Met a jour un client CRM.
 * @param {string} id - Identifiant du client
 * @param {object} updates - Champs a mettre a jour
 * @returns {Promise<object>} Client mis a jour ou objet erreur
 */
export const updateClient = async (id, updates) => {
  try {
    const response = await fetch(`${CRM_API}/clients/${id}`, {
      method: 'PUT',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
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
 * Supprime un client CRM.
 * @param {string} id - Identifiant du client
 * @returns {Promise<object>} Confirmation ou objet erreur
 */
export const deleteClient = async (id) => {
  try {
    const response = await fetch(`${CRM_API}/clients/${id}`, {
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
 * Ajoute une note a un client CRM.
 * @param {string} clientId - Identifiant du client
 * @param {string} content - Contenu de la note
 * @returns {Promise<object>} Resultat ou objet erreur
 */
export const addNote = async (clientId, content) => {
  try {
    const response = await fetch(`${CRM_API}/clients/${clientId}/notes`, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
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
 * Supprime une note d'un client CRM.
 * @param {string} clientId - Identifiant du client
 * @param {string} noteId - Identifiant de la note
 * @returns {Promise<object>} Confirmation ou objet erreur
 */
export const deleteNote = async (clientId, noteId) => {
  try {
    const response = await fetch(`${CRM_API}/clients/${clientId}/notes/${noteId}`, {
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
 * Ajoute une interaction a un client CRM.
 * @param {string} clientId - Identifiant du client
 * @param {object} interactionData - Donnees de l'interaction
 * @returns {Promise<object>} Resultat ou objet erreur
 */
export const addInteraction = async (clientId, interactionData) => {
  try {
    const response = await fetch(`${CRM_API}/clients/${clientId}/interactions`, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(interactionData),
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
 * Supprime une interaction d'un client CRM.
 * @param {string} clientId - Identifiant du client
 * @param {string} interactionId - Identifiant de l'interaction
 * @returns {Promise<object>} Confirmation ou objet erreur
 */
export const deleteInteraction = async (clientId, interactionId) => {
  try {
    const response = await fetch(`${CRM_API}/clients/${clientId}/interactions/${interactionId}`, {
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
 * Recupere les statistiques CRM globales.
 * @returns {Promise<object>} Stats ou objet erreur
 */
export const getCrmStats = async () => {
  try {
    const response = await fetch(`${CRM_API}/stats`, {
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
 * Synchronise les clients depuis les transactions existantes.
 * @returns {Promise<object>} Resultat de la synchronisation ou objet erreur
 */
export const syncClientsFromTransactions = async () => {
  try {
    const response = await fetch(`${CRM_API}/sync-from-transactions`, {
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
 * Exporte les clients CRM au format CSV et declenche le telechargement.
 * @returns {Promise<object>} Objet { success: true } ou objet erreur
 */
export const exportClientsCSV = async () => {
  try {
    const response = await fetch(`${CRM_API}/export/csv`, {
      headers: utils.options.headers,
    })

    if (!response.ok) {
      return { error: `Erreur ${response.status}` }
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'clients.csv')
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)

    return { success: true }
  } catch (error) {
    return { error: error.message }
  }
}
