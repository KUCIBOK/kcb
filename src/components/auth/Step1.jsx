import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

/** Google SVG inline — Google button spec */
const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export const Step1 = ({ formState, setFormState, onGoogleSignup }) => (
  <div className="bg-kcb-ardoise border border-white/[0.06] p-8 relative overflow-hidden">
    {/* Top accent */}
    <div className="absolute top-0 left-0 w-full h-0.5 bg-kcb-or" />

    {formState.error && (
      <div className="mb-6 text-red-300 text-center bg-red-900/20 border border-red-900/40 p-3 text-xs">
        {formState.error}
      </div>
    )}

    <p className="text-center text-base font-semibold text-white mb-1">Choisissez votre mode d'inscription</p>
    <p className="text-xs text-center text-kcb-pierre mb-8">Rapide, sécurisé et sans friction</p>

    {/* Google */}
    {onGoogleSignup && (
      <button
        className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 py-3 px-4 text-sm font-medium text-gray-800 transition-all duration-200 border border-gray-200 mb-3"
        onClick={onGoogleSignup}
        disabled={formState.loading}
        type="button"
      >
        <GoogleIcon />
        Continuer avec Google
      </button>
    )}

    {/* Divider */}
    <div className="flex items-center my-4 gap-3">
      <div className="flex-1 h-px bg-white/[0.06]" />
      <span className="text-[11px] text-kcb-pierre/60 uppercase tracking-wider">ou</span>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>

    {/* Email */}
    <button
      className="w-full flex items-center justify-center gap-2.5 border border-white/[0.10] hover:border-kcb-or/50 bg-transparent hover:bg-kcb-or/[0.04] py-3 px-4 text-sm font-medium text-white transition-all duration-200"
      onClick={() => setFormState(p => ({ ...p, connectMethod: "email", error: "", step: 1, loading: false }))}
      disabled={formState.loading}
      type="button"
    >
      <Mail className="w-4 h-4 text-kcb-pierre" />
      Inscription avec email
    </button>

    <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center justify-between">
      <Link to={-1} className="text-xs text-kcb-pierre hover:text-white transition">← Retour</Link>
      <Link to="/sign-in" className="text-xs text-kcb-or hover:underline">Déjà inscrit ?</Link>
    </div>
  </div>
);
