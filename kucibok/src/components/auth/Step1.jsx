import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "../ui";

export const Step1 = ({ formState, setFormState, onGoogleSignup }) => {
    return (
        <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background px-4">
          <div className="w-full max-w-sm mx-auto">
            {formState.error && (
              <div className="mb-4 text-red-300 text-center bg-red-900/20 border border-red-900 rounded-md p-2 text-xs">
                {formState.error}
              </div>
            )}
            <div className="bg-card rounded-xl border border-gray-800 shadow-sm p-6">
              <p className="text-center text-xl font-bold text-white mb-2">Inscription</p>
              <p className="text-xs text-center text-gray-400 mb-6">Choisissez votre mode de connexion</p>

              {/* Bouton Google — style spécifique conservé */}
              {onGoogleSignup && (
                <button
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 rounded-md mb-3 font-medium py-3 px-4 text-sm text-gray-800 transition border border-gray-200"
                  onClick={onGoogleSignup}
                  type="button"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  S'inscrire avec Google
                </button>
              )}

              <Button
                variant="outline"
                fullWidth
                icon={Mail}
                onClick={() => setFormState({ ...formState, connectMethod: "email", error: "", step: 1, loading: false })}
                className="text-sm"
              >
                Inscription avec email
              </Button>

              <div className="mt-6 text-center">
                <Link to={-1} className="text-xs text-gray-400 hover:underline">Retour</Link>
              </div>
            </div>
          </div>
        </div>
        </>
    );
};
