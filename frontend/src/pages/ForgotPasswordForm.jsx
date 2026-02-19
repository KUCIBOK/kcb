import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { Helmet } from "react-helmet";
import { forgotPassword } from "../api/useAuth";

export default function ForgotPasswordForm() {
  const [state, setState] = useState({
    email : "",
    message : '',
    error : "",
    success : "",
    loading : ""
  })
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({...state, loading : true})
    try {
      const data = await forgotPassword({email : state?.email})

      if (!data.ok) throw new Error(data.message || "Une erreur s'est produite");

      setState({...state, error : "", loading : false, message : "Un email de réinitialisation vous a été envoyé."});
      setTimeout(() => navigate('/sign-in'), 5000)
    } catch (err) {
      setState({...state, error : err.message, loading : false})
    }
  };
  return (
    <>
      <Helmet>
        <title>Mot de passe oublié | Kucibok</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background px-2 py-10">
        <div className="w-full max-w-sm mx-auto">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-gradient font-serif mb-1">Kucibok</h1>
            <p className="text-base font-semibold text-white mb-1">Mot de passe oublié</p>
            <p className="text-xs text-gray-400">Entrez votre email pour recevoir un lien de réinitialisation</p>
          </div>
          {state?.error && (
            <div className="mb-3 border border-red-900 rounded-lg bg-red-950/90 text-white p-3 text-xs flex items-center">
              {state?.error}
            </div>
          )}
          {state?.message && (
            <div className="mb-3 border border-green-900 rounded-lg bg-green-950/90 text-green-200 p-3 text-xs flex items-center">
              {state?.message}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-gray-800 rounded-xl shadow-md p-5 space-y-4"
            autoComplete="off"
          >
            <div>
              <input
                type="email"
                id="email"
                value={state?.email}
                onChange={e => setState({ ...state, email: e.target.value })}
                required
                placeholder="Adresse email"
                className="w-full border border-gray-800 bg-gray-900 rounded-md px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition"
              />
            </div>
            <button
              type="submit"
              disabled={state?.loading}
              className="w-full py-2 rounded-md bg-indigo-kcb text-white font-semibold text-sm hover:bg-indigo-700 transition flex items-center justify-center min-h-[40px]"
            >
              {state?.loading ? "Envoi en cours..." : "Envoyer le lien"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
