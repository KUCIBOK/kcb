import { utils } from "./useAPI";
const { api, options } = utils;

export async function getAllGalleries() {
  try {
    const response = await fetch(`${api}/galleries`, {
      ...options,
      method: "GET",
    });
    const data = await response.json();

    const galleries = Array.isArray(data)
      ? data
      : Array.isArray(data?.galleries)
      ? data.galleries
      : [];

    const total =
      typeof data?.total === "number" ? data.total : galleries.length;
    const filtered =
      typeof data?.filtered === "number" ? data.filtered : galleries.length;

    if (!response.ok) {
      return {
        galleries,
        total,
        filtered,
        error: data?.message || data?.error,
      };
    }
    return { galleries, total, filtered };
  } catch (error) {
    return { galleries: [], total: 0, filtered: 0, error: error.message };
  }
}

export async function importGalleries(payload) {
  try {
    // Use FormData correctly: do NOT send "Content-Type: application/json"
    // Copy auth headers but drop Content-Type so the browser sets the multipart boundary
    const headers = { ...options.headers };
    delete headers["Content-Type"]; // critical for multer

    const response = await fetch(`${api}/galleries/import`, {
      method: "POST",
      headers,
      body: payload,
    });
    const data = await response.json();

    if (response.ok) {
      return data;
    }
    return { error: data?.message || data?.error };
  } catch (error) {
    return { error: error.message };
  }
}
