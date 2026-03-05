/**
 * AutoAuth — Composant de restauration de session au montage de l'app.
 *
 * Avec Supabase, la session est gérée automatiquement par onAuthStateChange()
 * dans AuthContext. Ce composant est conservé pour les redirections post-OAuth
 * (callback Google) et la restauration de session initiale.
 *
 * Il ne fait rien de visible — retourne un fragment vide.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

/** @type {Record<string, string>} Mapping rôle → route dashboard */
const DASHBOARD_BY_ROLE = {
  artist: '/dashboard/artist',
  collector: '/dashboard/collector',
  professional: '/dashboard/professional',
  admin: '/dashboard/admin',
};

/**
 * Restaure la session Supabase au démarrage et gère les redirections OAuth.
 * À monter une seule fois, au plus haut niveau de l'arbre de composants.
 *
 * @returns {React.ReactElement}
 */
export function AutoAuth() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Récupère la session active (inclut le callback OAuth via l'URL hash)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error || !session) return;

      const role = session.user?.user_metadata?.role;
      const isOAuthCallback = window.location.hash.includes('access_token');

      // Redirige vers le dashboard uniquement après un callback OAuth
      if (isOAuthCallback && role && DASHBOARD_BY_ROLE[role]) {
        navigate(DASHBOARD_BY_ROLE[role]);
      }
    });
  }, [navigate]);

  return <></>;
}
