import { supabase } from '../lib/supabase';
import { utils } from './useAPI';

const { api } = utils;

// ─────────────────────────────────────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalise un utilisateur Supabase vers la forme KCB attendue par les composants.
 * Expose `_id` (alias de `id`) pour la compatibilité avec le code existant.
 *
 * @param {import('@supabase/supabase-js').User | null} supabaseUser
 * @returns {object | null}
 */
const toKcbUser = (supabaseUser) => {
  if (!supabaseUser) return null;
  return {
    _id: supabaseUser.id,
    id: supabaseUser.id,
    email: supabaseUser.email,
    role: supabaseUser.user_metadata?.role ?? 'collector',
    name: supabaseUser.user_metadata?.name ?? '',
    isEmailVerified: !!supabaseUser.email_confirmed_at,
    ...supabaseUser.user_metadata,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTH — SUPABASE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Connecte un utilisateur avec email + mot de passe.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: object } | { error: string }>}
 */
export async function loginUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { user: toKcbUser(data.user) };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Inscrit un nouvel utilisateur. Stocke le rôle et le nom dans user_metadata.
 * Pour les artistes avec image, l'upload reste géré par le backend (M2 → Supabase Storage).
 *
 * @param {{ email: string, password: string, role: string, name: string, [key: string]: any }} charge
 * @returns {Promise<{ user: object, message: string } | { error: string }>}
 */
export async function SignUpUser(charge) {
  try {
    const { email, password, role, name, image, ...rest } = charge;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: role ?? 'collector', name: name ?? '', ...rest },
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        return { error: "L'utilisateur existe déjà. Essayez de vous connecter." };
      }
      return { error: error.message };
    }

    return {
      user: toKcbUser(data.user),
      message: 'Inscription réussie. Vérifiez votre adresse email pour continuer.',
    };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Déclenche le flux OAuth Google.
 * Supabase redirige vers /auth/callback après authentification.
 *
 * @returns {Promise<{ error: string } | void>}
 */
export async function loginWithGoogle() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) return { error: error.message };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Vérifie l'email après inscription (géré automatiquement par Supabase via lien email).
 * Cette fonction récupère la session active après redirection de confirmation.
 *
 * @returns {Promise<{ user: object } | { error: string }>}
 */
export async function verifyEmail() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) return { error: error.message };
    if (!data.session) return { error: "Aucune session active après vérification." };
    return { user: toKcbUser(data.session.user) };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Envoie un email de réinitialisation du mot de passe.
 *
 * @param {{ email: string }} payload
 * @returns {Promise<{ ok: true } | { error: string }>}
 */
export async function forgotPassword({ email }) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) return { error: error.message };
    return { ok: true };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Réinitialise le mot de passe après clic sur le lien email.
 * À appeler depuis la page /auth/reset-password (session active requise).
 *
 * @param {{ password: string }} payload
 * @returns {Promise<{ ok: true, user: object } | { error: string }>}
 */
export async function resetPassword({ password }) {
  try {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) return { error: error.message };
    return { ok: true, user: toKcbUser(data.user) };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Déconnecte l'utilisateur et invalide la session Supabase.
 *
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  await supabase.auth.signOut();
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFIL & UTILISATEUR — BACKEND (migration M2 → Supabase PostgreSQL)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Récupère le profil étendu d'un utilisateur depuis le backend MongoDB.
 * Sera migré vers Supabase PostgreSQL en Phase M2.
 *
 * @param {string} id - ID utilisateur (Supabase UUID post-M1)
 * @returns {Promise<object | { error: string }>}
 */
export async function getUserProfile(id) {
  try {
    const response = await fetch(`${api}/profile/${id}`, { ...utils.options });
    const data = await response.json();
    if (data?._id || data?.userId) return data;
    return { error: data?.message };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Récupère un utilisateur par son ID depuis le backend MongoDB.
 * Sera migré vers Supabase PostgreSQL en Phase M2.
 *
 * @param {string} id
 * @returns {Promise<object | { error: string }>}
 */
export async function getUserById(id) {
  try {
    const response = await fetch(`${api}/auth/${id}`, { ...utils.options });
    const data = await response.json();
    if (data?._id) return data;
    return { error: data?.message };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Met à jour les données utilisateur dans le backend MongoDB.
 * Sera migré vers Supabase en Phase M2.
 *
 * @param {string} id
 * @param {object} payload
 * @returns {Promise<object | { error: string }>}
 */
export async function updateUser(id, payload) {
  try {
    const response = await fetch(`${api}/auth/${id}`, {
      ...utils.options,
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    const user = await response.json();
    if (user?.role || user?._id) return user;
    return { error: user?.message };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Met à jour le profil utilisateur (avec image) dans le backend MongoDB.
 * Sera migré vers Supabase Storage + PostgreSQL en Phase M2.
 *
 * @param {string} id
 * @param {FormData} payload
 * @returns {Promise<object | { error: string }>}
 */
export async function updateProfile(id, payload) {
  try {
    const response = await fetch(`${api}/profile/${id}`, {
      method: 'PUT',
      headers: {
        'kcb-api-key': import.meta.env.VITE_API_KEY,
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token ?? ''}`,
      },
      body: payload,
    });
    const profile = await response.json();
    if (profile?.userId) return profile;
    return { error: profile?.error || profile?.message };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Change le mot de passe via le backend MongoDB.
 * Sera migré vers supabase.auth.updateUser() en Phase M2.
 *
 * @param {object} payload
 * @returns {Promise<object | { error: string }>}
 */
export async function changePassword(payload) {
  try {
    const response = await fetch(`${api}/auth/change-password`, {
      ...utils.options,
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    const user = await response.json();
    if (user?._id) return user;
    return { error: user?.error || user?.message };
  } catch (err) {
    return { error: err.message };
  }
}
