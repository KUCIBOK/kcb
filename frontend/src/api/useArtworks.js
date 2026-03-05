import { utils } from "./useAPI";
const { api } = utils;

// Vérification publique Standard Kucibok — aucune auth requise
export async function verifyArtwork(kuciobkId) {
  try {
    const response = await fetch(`${api}/artworks/verify/${kuciobkId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "kcb-api-key": import.meta.env.VITE_API_KEY,
      },
    });
    const data = await response.json();
    if (!response.ok) return { error: data?.message || data?.error || "Erreur serveur" };
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

//Récupérer les oeuvres d'art en vente par un artiste ✅
export async function getArtistForSaleArtworks(id) {
  try {
    const response = await fetch(`${api}/artworks/forsale/artist/${id}`, {
      ...utils.options,
    });
    const data = await response.json();
    if (data?.length >= 1) {
      return data;
    }
    return {
      error: data?.error || data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function getArtworkById(id) {
  //✅
  try {
    const response = await fetch(`${api}/artworks/one/${id}`, {
      ...utils.options,
    });
    const data = await response.json();
    if (data?.id) {
      return data;
    }
    return {
      error: data?.error || data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

//Soumettre une oeuvre d'art ✅
export async function submitArtwork(data) {
  try {
    const response = await fetch(`${api}/artworks`, {
      method: "POST",
      headers: {
        "kcb-api-key": import.meta.env.VITE_API_KEY,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: data,
    });
    const artwork = await response.json();
    if (artwork?._id) {
      return artwork;
    }
    return {
      error: artwork?.error || artwork?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

//Récupérer les oeuvres d'art en vente par un propriétaire ✅
export async function getOwnerForSaleArtworks(id) {
  try {
    const response = await fetch(`${api}/artworks/sale/${id}`, {
      ...utils.options,
    });
    const data = await response.json();
    if (data?.length >= 1) {
      return data;
    }
    return {
      error: data?.error || data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

//Récupérer les oeuvres d'art en vente ✅
export async function getForSaleArtworks() {
  try {
    const response = await fetch(`${api}/artworks/forsale`, {
      ...utils.options,
    });
    const data = await response.json();
    if (data?.length >= 1) {
      return data;
    }
    return {
      error: data?.error || data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function getAllArtworks() {
  try {
    const response = await fetch(`${api}/artworks`, { ...utils.options });
    const artworks = await response.json();
    if (artworks?.length > 0) {
      return artworks;
    }
    return {
      error: artworks?.error || artworks?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

//Récupérer les oeuvres d'art de l'artiste ✅
export async function getMyArtworks(id) {
  try {
    const response = await fetch(`${api}/artworks/artist/${id}`, {
      ...utils.options,
    });
    const data = await response.json();
    if (data?.length >= 1) {
      return data;
    }
    return {
      error: data?.error || data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

//Récupérer les oeuvres d'art du propriétaire (celui qui a acheté l'oeuvre) ✅
export async function getOwnerArtworks(id) {
  try {
    const response = await fetch(`${api}/artworks/owner/${id}`, {
      ...utils.options,
    });
    const data = await response.json();
    if (data?.length >= 1) {
      return data;
    }
    return {
      error: data?.error || data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

//Récupérer les oeuvres d'art en attente d'approbation (admin) ✅
export async function getPendingArtworks() {
  try {
    const response = await fetch(`${api}/artworks/pending`, {
      ...utils.options,
    });
    // const response = await fetch('/data/data.json')
    const data = await response.json();
    if (data?.length >= 1) {
      return data;
    }
    return {
      error: data?.error || data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

//Récupérer les oeuvres d'art approuvées (admin) ✅
export async function getApprovedArtworks() {
  try {
    const response = await fetch(`${api}/artworks/approved`, {
      ...utils.options,
    });
    // const response = await fetch('/data/data.json')
    const data = await response.json();
    if (data?.length >= 1) {
      return data;
    }
    return {
      error: data?.error || data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

//Récupérer les oeuvres d'art rejetées (admin) ✅
export async function getRejectedArtworks() {
  try {
    const response = await fetch(`${api}/artworks/rejected`, {
      ...utils.options,
    });
    const data = await response.json();
    if (data?.length >= 1) {
      return data;
    }
    return {
      error: data?.error || data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

//Approuver ou rejeter une oeuvre d'art (admin) ✅
export async function setArtworkStatus(id, status) {
  try {
    const response = await fetch(`${api}/artworks/status/${id}`, {
      ...utils.options,
      method: "PUT",
      body: JSON.stringify({
        status: status,
      }),
    });
    const data = await response.json();
    if (data?.id) {
      return data;
    }
    return {
      error: data?.error || data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

//à faire : acheter une oeuvre d'art avec touchpoint
export async function purchaseArtwork(transactionId) {
  try {
    const response = await fetch(`${api}/artworks/purchase/${transactionId}`, {
      ...utils.options,
    });
    const data = await response.json();
    if (data?.artwork && data?.transaction) {
      return data;
    }
    return {
      error: data?.error || data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function getRandomArtworks() {
  try {
    const response = await fetch(`${api}/artworks/random`, {
      ...utils.options,
    });
    const data = await response.json();
    if (data?.length >= 1) {
      return data;
    }
    return {
      error: data?.error || data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function getRandomArtworksByCategories(category) {
  try {
    const response = await fetch(`${api}/artworks/random/${category}`, {
      ...utils.options,
    });
    const data = await response.json();
    if (data?.length >= 1) {
      return data;
    }
    return {
      error: data?.error || data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function updateEtherscan(id, etherscan) {
  try {
    const response = await fetch(`${api}/artworks/etherscan/${id}`, {
      ...utils.options,
      method: "PUT",
      body: JSON.stringify({
        etherscan: etherscan,
      }),
    });
    const artwork = await response.json();
    if (artwork?._id) {
      return artwork;
    }
    return {
      error: artwork?.error || artwork?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function updateArtwork(id, payload) {
  try {
    const response = await fetch(`${api}/artworks/${id}`, {
      method: "PUT",
      headers: {
        "kcb-api-key": import.meta.env.VITE_API_KEY,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: payload,
    });
    const artwork = await response.json();
    if (artwork?._id) {
      return artwork;
    }
    return {
      error: artwork?.error || artwork?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function getManagedArtworks() {
  try {
    const response = await fetch(`${api}/artworks/managed`, { ...utils.options });
    const artworks = await response.json();
    if (artworks?.length > 0) {
      return artworks;
    }
    return {
      error: artworks?.message || artworks?.error,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

// 🔹 Récupérer les œuvres likées par l’utilisateur
export async function getLikedArtworks() {
  try {
    const response = await fetch(`${api}/artworks/liked`, { ...utils.options });
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      return data;
    }

    return { error: data?.message || data?.error };
  } catch (error) {
    return { error: error.message };
  }
}

// 🔹 Liker une œuvre
export async function likeArtwork(id) {
  try {
    const response = await fetch(`${api}/artworks/like/${id}`, {
      ...utils.options,
      method: "POST",
    });
    const data = await response.json();

    if (data?.artwork?._id) {
      localStorage.removeItem('likedArtworks')
      localStorage.setItem('likedArtworks', JSON.stringify(data.likedArtworks))
      return { artwork: data.artwork, user: data.user };
    }

    return { error: data?.message || data?.error };
  } catch (error) {
    return { error: error.message };
  }
}

// 🔹 Disliker une œuvre
export async function dislikeArtwork(id) {
  try {
    const response = await fetch(`${api}/artworks/dislike/${id}`, {
      ...utils.options,
      method: "DELETE",
    });
    const data = await response.json();

    if (data?.artwork?._id) {
      localStorage.removeItem('likedArtworks')
      localStorage.setItem('likedArtworks', JSON.stringify(data.likedArtworks))
      return { artwork: data.artwork, user: data.user };
    }

    return { error: data?.message || data?.error };
  } catch (error) {
    return { error: error.message };
  }
}
