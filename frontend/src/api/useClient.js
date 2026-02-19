import { utils } from "./useAPI";
const { api, options } = utils;

export async function addClient(payload) {
  try {
    const response = await fetch(`${api}/clients/add`, {
      ...options,
      method: "POST",
      body: JSON.stringify(payload),
    });

    const client = await response.json();
    if (client?.client?._id) {
      return client.client;
    }
    return {
      error:
        client?.message || client?.error || "Erreur lors de l'ajout du client",
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function uploadClientsFromFile(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${api}/clients/upload`, {
      method: "POST",
      headers: {
        Authorization: options.headers.Authorization,
      },
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      return result;
    }
    return {
      error: result?.message || result?.error || "Erreur lors de l'import",
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function getAllClients() {
  try {
    const response = await fetch(`${api}/clients/`, {
      ...options,
      method: "GET",
    });

    const data = await response.json();
    if (response.ok) {
      return data.clients;
    }
    return {
      error: data?.message || data?.error || "Erreur lors de la récupération",
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function getClientsByArtist() {
  try {
    const response = await fetch(`${api}/clients/all`, {
      ...options,
      method: "GET",
    });

    const data = await response.json();
    if (response.ok) {
      return data.clients;
    }
    return {
      error: data?.message || data?.error || "Erreur lors de la récupération",
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function updateClient(id, payload) {
  try {
    const response = await fetch(`${api}/clients/update/${id}`, {
      ...options,
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const client = await response.json();
    if (client?.client?._id) {
      return client.client;
    }
    return {
      error:
        client?.message || client?.error || "Erreur lors de la mise à jour",
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function deleteClient(id) {
  try {
    const response = await fetch(`${api}/clients/delete/${id}`, {
      ...options,
      method: "DELETE",
    });

    const result = await response.json();
    if (response.ok) {
      return result;
    }
    return {
      error:
        result?.message || result?.error || "Erreur lors de la suppression",
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}
