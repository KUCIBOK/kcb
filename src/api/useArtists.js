/**
 * useArtists.js — Fonctions d'appel API pour les artistes.
 *
 * Auth : token Supabase récupéré à chaque appel via getSession() (stateless).
 * Storage : images uploadées vers Supabase Storage avant envoi au backend.
 *
 * @module useArtists
 */

import { supabase } from '../lib/supabase';
import { uploadProfileImage } from '../lib/storage';
import { utils } from './useAPI';

const { api } = utils;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS PRIVÉS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retourne les headers d'auth Supabase pour les requêtes protégées.
 *
 * @returns {Promise<Record<string, string>>}
 */
async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token ?? '';
  return {
    'Content-Type': 'application/json',
    'kcb-api-key': import.meta.env.VITE_API_KEY,
    Authorization: `Bearer ${token}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LECTURE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Récupère tous les artistes.
 *
 * @returns {Promise<object[] | { error: string }>}
 */
export async function getAllArtists(params = {}) {
  try {
    const qs = new URLSearchParams(params).toString();
    const response = await fetch(`${api}/artist${qs ? `?${qs}` : ''}`, { ...utils.options });
    const body = await response.json();
    if (!response.ok) return { error: body?.error || 'Erreur serveur' };
    return body?.data ?? body;
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Récupère un artiste par son ID et incrémente son compteur de visites.
 *
 * @param {string} id
 * @returns {Promise<object | { error: string }>}
 */
export async function getArtistAndUpdateVisited(id) {
  // La nouvelle API incrémente les visites automatiquement dans GET /api/artist/:id
  return getArtistById(id);
}

/**
 * Récupère un artiste par son ID.
 *
 * @param {string} id
 * @returns {Promise<object | { error: string }>}
 */
export async function getArtistById(id) {
  try {
    const response = await fetch(`${api}/artist/${id}`, { ...utils.options });
    const body = await response.json();
    if (!response.ok) return { error: body?.error || 'Artiste introuvable' };
    return body?.data ?? body;
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Récupère les artistes gérés par un professionnel.
 *
 * @param {string} id - ID du professionnel
 * @returns {Promise<object[] | { error: string }>}
 */
/**
 * Artistes gérés — concept supprimé dans la nouvelle architecture.
 * Retourne une liste vide pour la compatibilité ascendante.
 *
 * @returns {Promise<{ data: [] }>}
 */
export async function getManagedArtists() {
  return { data: [] };
}

/**
 * Récupère une sélection aléatoire d'artistes mis en avant.
 *
 * @returns {Promise<object[] | { error: string }>}
 */
export async function getFeaturedArtists() {
  try {
    const response = await fetch(`${api}/artist?random=true`, { ...utils.options });
    const body = await response.json();
    if (!response.ok) return { error: body?.error || 'Erreur serveur' };
    return body?.data ?? body;
  } catch (err) {
    return { error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ÉCRITURE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crée un profil artiste. Si le payload (FormData) contient une image File,
 * elle est uploadée vers Supabase Storage et remplacée par son URL publique.
 *
 * @param {FormData} payload
 * @returns {Promise<object | { error: string }>}
 */
export async function createArtist(payload) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    // Extraire les champs du FormData
    const fields = {};
    for (const [key, value] of payload.entries()) {
      fields[key] = value;
    }

    // Upload image si présente
    if (fields.image instanceof File && userId) {
      const uploadResult = await uploadProfileImage(userId, fields.image);
      if (uploadResult.error) return { error: uploadResult.error };
      fields.image = uploadResult.url;
    }

    const headers = await authHeaders();
    const response = await fetch(`${api}/artist`, {
      method: 'POST',
      headers,
      body: JSON.stringify(fields),
    });
    const body = await response.json();
    if (!response.ok) return { error: body?.error || 'Erreur serveur' };
    return body?.data ?? body;
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Met à jour un profil artiste. Si le payload (FormData) contient une image File,
 * elle est uploadée vers Supabase Storage et remplacée par son URL publique.
 *
 * @param {string} id - ID artiste (Supabase UUID)
 * @param {FormData} payload
 * @returns {Promise<object | { error: string }>}
 */
export async function updateArtist(id, payload) {
  try {
    // Extraire les champs du FormData
    const fields = {};
    for (const [key, value] of payload.entries()) {
      fields[key] = value;
    }

    // Upload image si c'est un File
    if (fields.image instanceof File) {
      const uploadResult = await uploadProfileImage(id, fields.image);
      if (uploadResult.error) return { error: uploadResult.error };
      fields.image = uploadResult.url;
    }

    const headers = await authHeaders();
    const response = await fetch(`${api}/artist/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(fields),
    });
    const body = await response.json();
    if (!response.ok) return { error: body?.error || 'Erreur serveur' };
    return body?.data ?? body;
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Met à jour un artiste géré par un professionnel.
 *
 * @param {string} id - ID de la relation managed artist
 * @param {FormData} payload
 * @returns {Promise<object | { error: string }>}
 */
/**
 * Mise à jour artiste géré — non implémentée dans la nouvelle architecture.
 * Utiliser updateArtist() directement.
 *
 * @param {string}   id
 * @param {FormData} payload
 * @returns {Promise<object | { error: string }>}
 */
export async function updateManagedArtist(id, payload) {
  return updateArtist(id, payload);
}
