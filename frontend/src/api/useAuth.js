import { MetaMaskSDK } from "@metamask/sdk";
import { utils } from "./useAPI";
const { api } = utils;

//Login ✅
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${api}/auth/login`, {
      ...utils.options,
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 409) {
      return { error: "L'utilisateur existe déjà. Essayez de vous connecter." };
    }

    const data = await response.json();

    if (data?.token && data?.user) {
      // ⚡ utilise user renvoyé par le backend (avec likedArtworks inclus)
      const user = { ...data.user, token: data.token };

      // sécurisation (id + role)
      if (user?.role || user?._id) {
        localStorage.setItem("token", data.token);
        // P2-ARCH-008 — Stockage du refresh token (30j)
        if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("likedArtworks", JSON.stringify(user.likedArtworks));
        return {
          user,
          artist: data?.artist,
          profile: data?.profile,
          likedArtworks: user?.likedArtworks || [], // ici ça marchera ✅
        };
      }
    }

    localStorage.removeItem("token");
    return { error: data?.message };
  } catch (error) {
    return { error: error?.message };
  }
}

// Connexion / Inscription avec Google
export async function loginWithGoogle(access_token) {
  try {
    const response = await fetch(`${utils.api}/auth/google`, {
      ...utils.options,
      method: "POST",
      body: JSON.stringify({ access_token }),
    });

    const data = await response.json();

    if (data?.token && data?.user) {
      const user = { ...data.user, token: data.token };
      if (user?.role || user?._id) {
        localStorage.setItem("token", data.token);
        if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("likedArtworks", JSON.stringify(user.likedArtworks || []));
        return {
          user,
          artist: data?.artist,
          profile: data?.profile,
          isNewUser: data?.isNewUser,
        };
      }
    }

    return { error: data?.message || "Échec de connexion Google" };
  } catch (error) {
    return { error: error?.message };
  }
}

export async function getMetamaskAddress() {
  try {
    const MMSDK = new MetaMaskSDK({
      dappMetadata: {
        name: "kucibok.com",
        url: window.location.href,
        logging: { developerMode: false },
        checkInstallationImmediately: false,
        preferDesktop: false,
      },
    });
    // Connect and get accounts
    const accounts = await MMSDK.connect();

    // Get provider for RPC requests
    const provider = MMSDK.getProvider();

    // Make an RPC request
    const address = await provider.request({
      method: "eth_accounts",
      params: [],
    });
    const message = "Connexion à Kucibok";
    if (address) {
      const signature = await MMSDK.connectAndSign({
        msg: message,
      });
      const credentials = {
        address: address[0],
        signature: signature,
        message: message,
      };
      return credentials;
    }
  } catch (error) {
    return {
      error: error?.message,
    };
  }
}

export async function MetamaskLogin(payload) {
  //✅
  try {
    const response = await fetch(`${api}/auth/login-metamask`, {
      ...utils.options,
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    // P2-ARCH-008 — Utiliser data.user (le JWT ne contient plus les données complètes)
    if (data?.token && data?.user) {
      const user = { ...data.user, token: data.token };
      if (user?.role || user?._id) {
        localStorage.setItem("token", data.token);
        // P2-ARCH-008 — Stockage du refresh token
        if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
        return {
          user,
          artist: data?.artist,
          profile: data?.profile,
        };
      }
    }
    return {
      error: data?.message || data?.error,
    };
  } catch (error) {
    return {
      error: error?.message,
    };
  }
}

export async function verifyEmail(token) {
  try {
    const response = await fetch(`${api}/auth/verify-email/${token}`, {
      ...utils.options,
    });
    const data = await response.json();
    // P2-ARCH-008 — Utiliser data.user (le JWT ne contient plus les données complètes)
    if (data?.token && data?.user) {
      const user = { ...data.user, token: data.token };
      if (user?.role || user?._id) {
        localStorage.setItem("token", data.token);
        // P2-ARCH-008 — Stockage du refresh token
        if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
        return {
          user,
          artist: data?.artist,
          profile: data?.profile,
        };
      }
    }
    return {
      error: data?.message || "Erreur lors de la vérification de l'email.",
    };
  } catch (error) {
    return {
      error: error?.message,
    };
  }
}

export async function MetamaskSignUp(payload) {
  try {
    const response = await fetch(`${api}/auth/signup-metamask`, {
      ...utils.options,
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    // P2-ARCH-008 — Utiliser data.user (le JWT ne contient plus les données complètes)
    if (data?.token && data?.user) {
      const user = { ...data.user, token: data.token };
      if (user?.role || user?._id) {
        localStorage.setItem("token", data.token);
        // P2-ARCH-008 — Stockage du refresh token
        if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
        return {
          user,
          artist: data?.artist,
          profile: data?.profile,
        };
      }
    }
    return {
      error: data?.message || data?.error,
    };
  } catch (error) {
    return {
      error: error?.message,
    };
  }
}

export async function SignUpUser(charge) {
  //✅
  try {
    const formData = new FormData();
    let response;
    if (charge?.role == "artist" && charge?.image) {
      Object.keys(charge).forEach((key) => {
        formData.append(key, charge[key]);
      });
      response = await fetch(`${api}/auth/register`, {
        headers: {
          "kcb-api-key": import.meta.env.VITE_API_KEY,
          Accept: "*/*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "POST",
        body: formData,
      });
    } else {
      response = await fetch(`${api}/auth/register`, {
        ...utils.options,
        method: "POST",
        body: JSON.stringify(charge),
      });
    }
    const data = await response.json();
    if (response.status === 409) {
      return {
        error: "L'utilisateur existe déjà. Essayez de vous connecter.",
      };
    }
    if (data?.user?._id) {
      const user = data?.user;
      if (user?.role || user?._id) {
        return {
          user: user,
          message:
            "Inscription réussie. Vérifiez votre adresse email pour continuer.",
        };
      }
    }
    return {
      error: data?.message,
    };
  } catch (error) {
    return {
      error: error?.message,
    };
  }
}

export async function getUserProfile(id) {
  //✅
  try {
    const response = await fetch(`${api}/profile/${id}`, {
      ...utils.options,
    });
    const data = await response.json();
    if (data?._id) {
      return data;
    }
    return {
      error: data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function getUserById(id) {
  try {
    const response = await fetch(`${api}/auth/${id}`, {
      ...utils.options,
    });
    const data = await response.json();
    if (data?._id) {
      return data;
    }
    return {
      error: data?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function updateUser(id, payload) {
  //✅
  try {
    const response = await fetch(`${api}/auth/${id}`, {
      ...utils.options,
      method: "PUT",
      body: JSON.stringify({
        ...payload,
      }),
    });
    const user = await response.json();
    if (user?.role || user?._id) {
      return user;
    }
    return {
      error: user?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function updateProfile(id, payload) {
  //✅
  try {
    const response = await fetch(`${api}/profile/${id}`, {
      method: "PUT",
      headers: {
        "kcb-api-key": import.meta.env.VITE_API_KEY,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: payload,
    });
    const profile = await response.json();
    if (profile?.userId) {
      return profile;
    }
    return {
      error: profile?.error || profile?.message,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function changePassword(payload) {
  try {
    const { api } = utils;
    const response = await fetch(`${api}/auth/change-password`, {
      ...utils.options,
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const user = await response.json();
    if (user?._id) {
      return user;
    }
    return {
      error: user?.error || user?.message,
    };
  } catch (error) {
    return { error: error.message };
  }
}

export async function forgotPassword(payload) {
  try {
    const { api } = utils;
    const response = await fetch(`${api}/auth/forgot-password`, {
      ...utils.options,
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.status == 200) {
      return {
        ...data,
        ok: true,
      };
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

export async function resetPassword(payload) {
  try {
    const { api } = utils;
    const response = await fetch(`${api}/auth/reset-password`, {
      ...utils.options,
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.status == 200) {
      return {
        ...data,
        ok: true,
      };
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

// P2-ARCH-008 — Renouvelle le token d'accès via le refresh token (30j)
export async function refreshTokenApi() {
  try {
    const { api } = utils;
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (!storedRefreshToken) return { error: "Refresh token absent." };

    const response = await fetch(`${api}/auth/refresh-token`, {
      ...utils.options,
      method: "POST",
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
    });
    const data = await response.json();
    if (data?.token) {
      localStorage.setItem("token", data.token);
      if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
      return { token: data.token };
    }
    return { error: data?.error || data?.message || "Échec du renouvellement." };
  } catch (error) {
    return { error: error.message };
  }
}

export async function logoutUser() {
  try {
    await fetch(`${utils.api}/auth/logout`, {
      ...utils.options,
      method: "POST",
    });
  } catch (_) { /* ignore — déconnexion locale même si le serveur est injoignable */ }
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("likedArtworks");
}
