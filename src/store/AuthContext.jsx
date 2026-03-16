import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { setSupabaseToken } from '../api/useAPI';
import { changePassword, getUserProfile, updateProfile, updateUser } from '../api/useAuth';
import { updateArtist } from '../api/useArtists';
import { createLog } from '../api/useLog';

/** @type {React.Context} */
export const AuthContext = createContext(null);

/** @type {string[]} Rôles valides de la plateforme */
const VALID_ROLES = ['collector', 'artist', 'professional', 'admin'];

/**
 * Normalise un utilisateur Supabase vers la forme KCB.
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

/**
 * Retourne la clé de profil dans le state selon le rôle.
 *
 * @param {string} role
 * @returns {string}
 */
const profileKeyForRole = (role) => {
  const map = {
    artist: 'artistProfile',
    collector: 'collectorProfile',
    professional: 'professionalProfile',
    admin: 'adminProfile',
  };
  return map[role] ?? 'collectorProfile';
};

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fournit le contexte d'authentification à toute l'application.
 * Utilise supabase.auth.onAuthStateChange() comme source de vérité unique.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function AuthContextProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [artistProfile, setArtistProfile] = useState(null);
  const [collectorProfile, setCollectorProfile] = useState(null);
  const [professionalProfile, setProfessionalProfile] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Chargement du profil étendu (Supabase — artists / profiles) ─────────────
  const loadProfile = useCallback(async (kcbUser) => {
    if (!kcbUser?._id) return;
    const profileData = await getUserProfile(kcbUser._id);
    if (!profileData?._id && !profileData?.userId) return;

    const key = profileKeyForRole(kcbUser.role);
    if (key === 'artistProfile') setArtistProfile(profileData);
    else if (key === 'collectorProfile') setCollectorProfile(profileData);
    else if (key === 'professionalProfile') setProfessionalProfile(profileData);
    else if (key === 'adminProfile') setAdminProfile(profileData);
  }, []);

  /**
   * Récupère le rôle autoritatif depuis public.users (source de vérité DB).
   * Ne jamais lire le rôle depuis user_metadata côté client.
   */
  const loadDbRole = useCallback(async (userId) => {
    if (!userId) return null;
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    return data?.role ?? null;
  }, []);

  // ── Écoute les changements de session Supabase ────────────────────────────
  useEffect(() => {
    // Récupère la session initiale au montage
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSupabaseToken(session?.access_token ?? null);
      const kcbUser = toKcbUser(session?.user ?? null);
      if (kcbUser) {
        const dbRole = await loadDbRole(kcbUser._id);
        if (dbRole) kcbUser.role = dbRole;
        setUser(kcbUser);
        loadProfile(kcbUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // S'abonne aux changements (login, logout, refresh token, OAuth callback)
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Synchronise le token dans useAPI.js à chaque changement de session
        setSupabaseToken(session?.access_token ?? null);

        const kcbUser = toKcbUser(session?.user ?? null);

        if (kcbUser) {
          const dbRole = await loadDbRole(kcbUser._id);
          if (dbRole) kcbUser.role = dbRole;
          setUser(kcbUser);
        } else {
          setUser(null);
        }

        if (event === 'SIGNED_IN' && kcbUser) {
          loadProfile(kcbUser);
          createLog({
            description: `L'utilisateur ${kcbUser.name || kcbUser.email} s'est connecté`,
            userId: kcbUser._id,
          }).catch(() => {});
        }

        if (event === 'SIGNED_OUT') {
          setArtistProfile(null);
          setCollectorProfile(null);
          setProfessionalProfile(null);
          setAdminProfile(null);
          setSubscription(null);
          setPlan(null);
        }

        setLoading(false);
      }
    );

    return () => authListener.unsubscribe();
  }, [loadProfile, loadDbRole]);

  // ── Actions exposées ──────────────────────────────────────────────────────

  /** Déconnecte l'utilisateur et redirige vers l'accueil. */
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/');
  }, [navigate]);

  /** Met à jour le profil selon le rôle de l'utilisateur. */
  const setProfile = useCallback((profile) => {
    if (!user?.role) return;
    const key = profileKeyForRole(user.role);
    if (key === 'artistProfile') setArtistProfile(profile);
    else if (key === 'collectorProfile') setCollectorProfile(profile);
    else if (key === 'professionalProfile') setProfessionalProfile(profile);
    else if (key === 'adminProfile') setAdminProfile(profile);
  }, [user]);

  /** Met à jour les données utilisateur dans Supabase (public.users + user_metadata). */
  const updateUserCtx = useCallback(async (payload) => {
    if (!user?._id) return { error: 'Utilisateur non connecté.' };
    // Ne jamais autoriser le changement de rôle depuis le frontend
    const { role: _discardedRole, ...safePayload } = payload;
    const updated = await updateUser(user._id, safePayload);
    if (updated?._id) {
      // Sync le user_metadata Supabase si le nom change (jamais le rôle)
      if (safePayload.name) {
        await supabase.auth.updateUser({ data: { name: safePayload.name } });
      }
      setUser((prev) => ({ ...prev, ...updated }));
      await createLog({
        description: `L'utilisateur ${updated.name} s'est mis à jour`,
        userId: updated._id,
      }).catch(() => {});
      return updated;
    }
    return { error: updated?.message };
  }, [user]);

  /** Met à jour le profil artiste. */
  const updateArtistCtx = useCallback(async (payload) => {
    if (!user?._id) return { error: 'Utilisateur non connecté.' };
    const profile = await updateArtist(user._id, payload);
    if (profile?._id) {
      setArtistProfile(profile);
      await createLog({
        description: `L'utilisateur ${user.name} a mis son profil Artiste à jour`,
        userId: user._id,
      }).catch(() => {});
      return profile;
    }
    return { error: profile?.message };
  }, [user]);

  /** Met à jour le profil collector / professional. */
  const updateProfileCtx = useCallback(async (payload) => {
    if (!user?._id) return { error: 'Utilisateur non connecté.' };
    const profile = await updateProfile(user._id, payload);
    if (profile?._id) {
      setProfile(profile);
      await createLog({
        description: `L'utilisateur ${user.name} a mis son profil à jour`,
        userId: user._id,
      }).catch(() => {});
      return profile;
    }
    return { error: profile?.message };
  }, [user, setProfile]);

  /** Change le mot de passe via Supabase Auth (vérifie l'ancien mot de passe côté serveur). */
  const changePasswordCtx = useCallback(async (payload) => {
    const result = await changePassword(payload);
    if (result?._id) {
      await createLog({
        description: `L'utilisateur ${user?.name} a changé son mot de passe`,
        userId: user?._id,
      }).catch(() => {});
      return result;
    }
    return { error: result?.error || result?.message };
  }, [user]);

  // ─────────────────────────────────────────────────────────────────────────
  const value = {
    user,
    artistProfile,
    collectorProfile,
    professionalProfile,
    adminProfile,
    subscription,
    plan,
    loading,
    logout,
    setProfile,
    updateUser: updateUserCtx,
    updateArtist: updateArtistCtx,
    updateProfile: updateProfileCtx,
    changePassword: changePasswordCtx,
    // Compatibilité descendante — login() n'est plus nécessaire (onAuthStateChange gère tout)
    login: () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook d'accès au contexte d'authentification.
 *
 * @returns {ReturnType<typeof AuthContextProvider> extends { value: infer V } ? V : never}
 */
export function useAuth() {
  return useContext(AuthContext);
}
