import { utils } from "./useAPI";
const { api } = utils;

export async function getAllGalleries() {
  try {
    const response = await fetch(`${api}/galleries`, {
      ...utils.options,
      method: "GET",
    });
    const body = await response.json();

    // ok() helper wraps the payload in { data: {...} }
    const payload = body?.data ?? body;

    const galleries = Array.isArray(payload?.galleries)
      ? payload.galleries
      : Array.isArray(payload)
      ? payload
      : [];

    const total =
      typeof payload?.total === "number" ? payload.total : galleries.length;
    const filtered =
      typeof payload?.filtered === "number" ? payload.filtered : galleries.length;

    if (!response.ok) {
      return {
        galleries,
        total,
        filtered,
        error: body?.error || body?.message,
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
    const headers = { ...utils.options.headers };
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
