import { utils } from "./useAPI";
const { api } = utils;

/**
 * Crée une demande de mise en relation (sourcing) pour une œuvre.
 *
 * @param {object} payload - { artworkId, purpose, message, organization?, budget? }
 * @returns {Promise<object>} L'inquiry créée ou { error: string }
 */
export async function createInquiry(payload) {
  try {
    const response = await fetch(`${api}/sourcing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...utils.options.headers,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) return { error: data?.message || data?.error || "Erreur serveur" };
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Récupère les demandes de sourcing de l'utilisateur connecté.
 *
 * @returns {Promise<Array|object>} Liste des inquiries ou { error: string }
 */
export async function getMyInquiries() {
  try {
    const response = await fetch(`${api}/sourcing/mine`, {
      ...utils.options,
    });
    const data = await response.json();
    if (!response.ok) return { error: data?.message || data?.error || "Erreur serveur" };
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Récupère le catalogue certifié (pro) avec filtres optionnels.
 *
 * @param {object} params - { page?, limit?, category?, availabilityStatus?, priceMin?, priceMax?, search? }
 * @returns {Promise<object>} { data, total, page, pages } ou { error: string }
 */
export async function getCataloguePro(params = {}) {
  try {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null))
    ).toString();
    const response = await fetch(`${api}/artworks/catalogue${qs ? `?${qs}` : ""}`, {
      ...utils.options,
    });
    const data = await response.json();
    if (!response.ok) return { error: data?.message || data?.error || "Erreur serveur" };
    return data;
  } catch (error) {
    return { error: error.message };
  }
}
