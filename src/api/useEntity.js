import { utils } from "./useAPI";

const ENTITY_API = `${utils.api}/entities`;

/**
 * Cree une nouvelle entite.
 * @param {object} entityData - Donnees de l'entite
 * @returns {Promise<object>} Entite creee ou objet erreur
 */
export const createEntity = async (entityData) => {
  try {
    const response = await fetch(ENTITY_API, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(entityData),
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
 * Recupere toutes les entites.
 * @returns {Promise<object>} Liste des entites ou objet erreur
 */
export const getEntities = async () => {
  try {
    const response = await fetch(ENTITY_API, {
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
 * Recupere une entite par ID.
 * @param {string} id - Identifiant de l'entite
 * @returns {Promise<object>} Donnees de l'entite ou objet erreur
 */
export const getEntityById = async (id) => {
  try {
    const response = await fetch(`${ENTITY_API}/${id}`, {
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
 * Met a jour une entite.
 * @param {string} id - Identifiant de l'entite
 * @param {object} updates - Champs a mettre a jour
 * @returns {Promise<object>} Entite mise a jour ou objet erreur
 */
export const updateEntity = async (id, updates) => {
  try {
    const response = await fetch(`${ENTITY_API}/${id}`, {
      method: 'PUT',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
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
 * Supprime une entite.
 * @param {string} id - Identifiant de l'entite
 * @returns {Promise<object>} Confirmation ou objet erreur
 */
export const deleteEntity = async (id) => {
  try {
    const response = await fetch(`${ENTITY_API}/${id}`, {
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
 * Bascule vers une autre entite active.
 * @param {string} id - Identifiant de l'entite cible
 * @returns {Promise<object>} Resultat ou objet erreur
 */
export const switchEntity = async (id) => {
  try {
    const response = await fetch(`${ENTITY_API}/${id}/switch`, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
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
 * Ajoute un membre a une entite.
 * @param {string} entityId - Identifiant de l'entite
 * @param {string} userId - Identifiant de l'utilisateur a ajouter
 * @param {string} role - Role du membre (defaut: "artist")
 * @returns {Promise<object>} Resultat ou objet erreur
 */
export const addMember = async (entityId, userId, role = "artist") => {
  try {
    const response = await fetch(
      `${ENTITY_API}/${entityId}/members`,
      {
        method: 'POST',
        headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      }
    );
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
 * Met a jour le role d'un membre dans une entite.
 * @param {string} entityId - Identifiant de l'entite
 * @param {string} memberId - Identifiant du membre
 * @param {string} role - Nouveau role
 * @returns {Promise<object>} Resultat ou objet erreur
 */
export const updateMemberRole = async (entityId, memberId, role) => {
  try {
    const response = await fetch(
      `${ENTITY_API}/${entityId}/members/${memberId}`,
      {
        method: 'PUT',
        headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      }
    );
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
 * Retire un membre d'une entite.
 * @param {string} entityId - Identifiant de l'entite
 * @param {string} memberId - Identifiant du membre
 * @returns {Promise<object>} Confirmation ou objet erreur
 */
export const removeMember = async (entityId, memberId) => {
  try {
    const response = await fetch(
      `${ENTITY_API}/${entityId}/members/${memberId}`,
      {
        method: 'DELETE',
        headers: utils.options.headers,
      }
    );
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return { error: errData.message || `Erreur ${response.status}` };
    }
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};
