import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { verifyEmail } from "../../api/useAuth";

export default function VerifyEmail() {
  const { token } = useParams();
  const {login, setProfile} = useAuth();
  const [state, setState] = useState({
    loading : true,
    user : null,
    profile : null,
    artist : null,
    error: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await verifyEmail(token);
        if(!data?.user?._id || !data?.user?.role || data?.error) {setState(prev => ({ ...prev, error: data?.error || "Erreur lors de la vérification.", loading: false })); setTimeout(() => {navigate("/sign-in")}, 3000); return;};
        login({ ...data?.user, isLogin: true });
        if (data?.user?.role == "artist") {
          setProfile(data?.artist);
        }
        if (data?.user?.role) {
          setProfile(data?.profile);
        }
        window.location.reload();
      } catch (err) {
        setState(prev => ({ ...prev, error: "Erreur lors de la vérification." }));
      }
    };
    
    token ? verify() : setState({ ...state, error: "Aucun token fourni." });

  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-xl p-8 flex flex-col items-center animate-fade-in text-center">
        <h1 className="text-2xl font-bold text-white mb-4 tracking-tight">Vérification de l’email</h1>
        {state.loading && (
          <p className="text-gray-400 text-base mb-2">Vérification en cours...</p>
        )}
        {state.error && (
          <>
            <p className="text-red-400 font-medium mb-2">{state.error}</p>
            <p className="text-sm text-gray-400 mt-2">
              Le lien est peut-être expiré.<br />
              Retournez à
              <a href="/sign-up" className="text-indigo-kcb font-medium hover:underline mx-1">l’inscription</a>
              ou
              <a href="/sign-in" className="text-indigo-kcb font-medium hover:underline mx-1">connectez-vous</a>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
