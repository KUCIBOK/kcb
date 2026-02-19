import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { Helmet } from "react-helmet";
import { DataLoader } from "../components/loaders/PageLoader";
import { resetPassword } from "../api/useAuth";

export default function ResetPasswordForm() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    password : '',
    confirmPassword : '',

    error : "",
    success : false,
    loading : false
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (state?.password !== state?.confirmPassword) {
      setState({...state, error : "Les mots de passe ne correspondent pas."});
      return;
    }
    setState({...state, error : "", loading : true});
    try {
      const data = await resetPassword({ token, newPassword: state?.password })
      if (data.ok) {
        setState({...state, success : true});
        setTimeout(() => navigate("/sign-in"), 3000);
      } else {
        setState({...state, error : data.error});
      }
    } catch (err) {
      setState({...state, error : "Erreur serveur. Veuillez réessayer plus tard."});
    } finally {
      setState({...state, loading : false});
    }
  };

  return (
    <>
      <Helmet>
        <title>Réinitialiser le mot de passe | Kucibok</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background px-2 py-10">
        <div className="w-full max-w-sm mx-auto">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-gradient font-serif mb-1">Kucibok</h1>
            <p className="text-base font-semibold text-white mb-1">Nouveau mot de passe</p>
            <p className="text-xs text-gray-400">Entrez un nouveau mot de passe sécurisé</p>
          </div>
          {state?.error && (
            <div className="mb-3 border border-red-900 rounded-lg bg-red-950/90 text-white p-3 text-xs flex items-center">
              {state?.error}
            </div>
          )}
          {state?.success && (
            <div className="mb-3 border border-green-900 rounded-lg bg-green-950/90 text-green-200 p-3 text-xs flex items-center">
              Mot de passe réinitialisé ! Redirection en cours...
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-gray-800 rounded-xl shadow-md p-5 space-y-4"
            autoComplete="off"
          >
            <div>
              <input
                type="password"
                id="password"
                value={state?.password}
                onChange={e => setState({ ...state, password: e.target.value })}
                required
                minLength={8}
                placeholder="Nouveau mot de passe"
                className="w-full border border-gray-800 bg-gray-900 rounded-md px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition"
              />
            </div>
            <div>
              <input
                type="password"
                id="confirmPassword"
                value={state?.confirmPassword}
                onChange={e => setState({ ...state, confirmPassword: e.target.value })}
                required
                minLength={8}
                placeholder="Répétez le mot de passe"
                className="w-full border border-gray-800 bg-gray-900 rounded-md px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition"
              />
            </div>
            <button
              type="submit"
              disabled={state?.loading}
              className="w-full py-2 rounded-md bg-indigo-kcb text-white font-semibold text-sm hover:bg-indigo-700 transition flex items-center justify-center min-h-[40px]"
            >
              {state?.loading ? <DataLoader /> : "Réinitialiser"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
