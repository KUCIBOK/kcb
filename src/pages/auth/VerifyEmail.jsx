import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import RevealOnScroll from "../../components/landing/RevealOnScroll";

const ROLE_DASHBOARDS = {
  artist:  '/dashboard/artist',
  curator: '/dashboard/curator',
  buyer:   '/account',
  admin:   '/dashboard/admin',
};

export default function VerifyEmail() {
  const [state, setState] = useState({ loading: true, error: null });
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase détecte automatiquement le token dans l'URL (detectSessionInUrl: true)
    // et déclenche SIGNED_IN via onAuthStateChange — on écoute et on redirige.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Lire le rôle depuis public.users (source de vérité)
          const { data: dbUser } = await supabase
            .from('users').select('role').eq('id', session.user.id).single();
          const role = dbUser?.role ?? 'buyer';
          navigate(ROLE_DASHBOARDS[role] ?? '/', { replace: true });
        }
        if (event === 'TOKEN_REFRESHED') return;
        // Timeout : si aucun événement SIGNED_IN après 5s, le lien est invalide
      }
    );

    const timeout = setTimeout(() => {
      setState({ loading: false, error: 'Lien de vérification invalide ou expiré.' });
      setTimeout(() => navigate('/sign-in', { replace: true }), 3000);
    }, 5000);

    return () => { subscription.unsubscribe(); clearTimeout(timeout); };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-kcb-noir-deep px-4">
      <RevealOnScroll>
      <div className="w-full max-w-md bg-kcb-noir-deep border border-white/[0.06] rounded-[4px] shadow-xl p-8 flex flex-col items-center text-center">
        <h1 className="font-playfair text-[clamp(20px,2.5vw,28px)] font-bold text-white mb-4 tracking-tight">Vérification de l’email</h1>
        {state.loading && (
          <p className="text-kcb-pierre text-base mb-2">Vérification en cours...</p>
        )}
        {state.error && (
          <>
            <p className="text-red-400 font-medium mb-2">{state.error}</p>
            <p className="text-sm text-kcb-pierre mt-2">
              Le lien est peut-être expiré.<br />
              Retournez à
              <a href="/sign-up" className="text-kcb-or font-medium hover:underline mx-1">l’inscription</a>
              ou
              <a href="/sign-in" className="text-kcb-or font-medium hover:underline mx-1">connectez-vous</a>.
            </p>
          </>
        )}
      </div>
      </RevealOnScroll>
    </div>
  );
}
