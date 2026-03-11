import { utils } from './useAPI';

const CONTACT_API = `${utils.api}/contacts`;

// ===== CONTACTS =====

/**
 * Recupere la liste des contacts avec filtres optionnels.
 * @param {object} filters - Filtres de recherche
 * @returns {Promise<object>} Donnees des contacts ou objet erreur
 */
export const getContacts = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${CONTACT_API}/contacts?${params}`, {
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
 * Recupere un contact par ID.
 * @param {string} id - Identifiant du contact
 * @returns {Promise<object>} Donnees du contact ou objet erreur
 */
export const getContact = async (id) => {
  try {
    const response = await fetch(`${CONTACT_API}/contacts/${id}`, {
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
 * Cree un nouveau contact.
 * @param {object} data - Donnees du contact
 * @returns {Promise<object>} Contact cree ou objet erreur
 */
export const createContact = async (data) => {
  try {
    const response = await fetch(`${CONTACT_API}/contacts`, {
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
 * Met a jour un contact existant.
 * @param {string} id - Identifiant du contact
 * @param {object} data - Donnees a mettre a jour
 * @returns {Promise<object>} Contact mis a jour ou objet erreur
 */
export const updateContact = async (id, data) => {
  try {
    const response = await fetch(`${CONTACT_API}/contacts/${id}`, {
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
 * Supprime un contact.
 * @param {string} id - Identifiant du contact
 * @returns {Promise<object>} Confirmation ou objet erreur
 */
export const deleteContact = async (id) => {
  try {
    const response = await fetch(`${CONTACT_API}/contacts/${id}`, {
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
 * Importe des contacts en masse dans une liste.
 * @param {object[]} contacts - Tableau de contacts a importer
 * @param {string} listId - Identifiant de la liste cible
 * @returns {Promise<object>} Resultat de l'import ou objet erreur
 */
export const importContacts = async (contacts, listId) => {
  try {
    const response = await fetch(`${CONTACT_API}/contacts/import`, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ contacts, listId }),
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
 * Desinscrit un contact avec motif.
 * @param {string} id - Identifiant du contact
 * @param {string} reason - Motif de desinscription
 * @returns {Promise<object>} Resultat ou objet erreur
 */
export const unsubscribeContact = async (id, reason) => {
  try {
    const response = await fetch(`${CONTACT_API}/contacts/${id}/unsubscribe`, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
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
 * Recupere les statistiques globales des contacts.
 * @returns {Promise<object>} Stats ou objet erreur
 */
export const getContactStats = async () => {
  try {
    const response = await fetch(`${CONTACT_API}/contacts/stats`, {
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

// ===== LISTS =====

/**
 * Recupere les listes de contacts avec filtres optionnels.
 * @param {object} filters - Filtres de recherche
 * @returns {Promise<object>} Donnees des listes ou objet erreur
 */
export const getLists = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${CONTACT_API}/lists?${params}`, {
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
 * Recupere une liste par ID.
 * @param {string} id - Identifiant de la liste
 * @returns {Promise<object>} Donnees de la liste ou objet erreur
 */
export const getList = async (id) => {
  try {
    const response = await fetch(`${CONTACT_API}/lists/${id}`, {
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
 * Cree une nouvelle liste de contacts.
 * @param {object} data - Donnees de la liste
 * @returns {Promise<object>} Liste creee ou objet erreur
 */
export const createList = async (data) => {
  try {
    const response = await fetch(`${CONTACT_API}/lists`, {
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
 * Met a jour une liste existante.
 * @param {string} id - Identifiant de la liste
 * @param {object} data - Donnees a mettre a jour
 * @returns {Promise<object>} Liste mise a jour ou objet erreur
 */
export const updateList = async (id, data) => {
  try {
    const response = await fetch(`${CONTACT_API}/lists/${id}`, {
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
 * Supprime une liste de contacts.
 * @param {string} id - Identifiant de la liste
 * @returns {Promise<object>} Confirmation ou objet erreur
 */
export const deleteList = async (id) => {
  try {
    const response = await fetch(`${CONTACT_API}/lists/${id}`, {
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
 * Met a jour le RSVP d'un contact dans une liste.
 * @param {string} listId - Identifiant de la liste
 * @param {string} contactId - Identifiant du contact
 * @param {string} status - Statut RSVP
 * @param {number} guestsCount - Nombre d'invites
 * @param {string} notes - Notes supplementaires
 * @returns {Promise<object>} Resultat ou objet erreur
 */
export const updateRSVP = async (listId, contactId, status, guestsCount, notes) => {
  try {
    const response = await fetch(`${CONTACT_API}/lists/${listId}/rsvp`, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactId,
        status,
        guestsCount,
        notes,
      }),
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

// ===== CRM SYNC =====

/**
 * Synchronise un contact depuis le CRM vers une liste.
 * @param {string} crmContactId - ID du contact CRM source
 * @param {string} listId - ID de la liste cible
 * @param {string[]} tags - Tags a appliquer
 * @returns {Promise<object>} Resultat ou objet erreur
 */
export const syncFromCRM = async (crmContactId, listId, tags) => {
  try {
    const response = await fetch(`${CONTACT_API}/sync/crm`, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crmContactId,
        listId,
        tags,
      }),
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
 * Synchronise plusieurs contacts CRM en masse.
 * @param {string[]} crmContactIds - IDs des contacts CRM
 * @param {string} listId - ID de la liste cible
 * @param {string[]} tags - Tags a appliquer
 * @returns {Promise<object>} Resultat ou objet erreur
 */
export const bulkSyncFromCRM = async (crmContactIds, listId, tags) => {
  try {
    const response = await fetch(`${CONTACT_API}/sync/crm/bulk`, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crmContactIds,
        listId,
        tags,
      }),
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
 * Verifie le statut de synchronisation d'un contact CRM.
 * @param {string} crmContactId - ID du contact CRM
 * @returns {Promise<object>} Statut de sync ou objet erreur
 */
export const checkCRMSync = async (crmContactId) => {
  try {
    const response = await fetch(`${CONTACT_API}/sync/crm/${crmContactId}/check`, {
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
