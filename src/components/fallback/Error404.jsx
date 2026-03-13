import { ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Error404() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-kcb-noir relative overflow-hidden px-4">
            {/* Background decorative elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-kcb-or/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-kcb-bronze/5 rounded-full blur-3xl" />

            <div className="max-w-md w-full bg-kcb-ardoise/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-white/[0.06]">
                <div className="p-6 sm:p-10">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-8xl font-bold text-kcb-or mb-2 tracking-tighter">404</h1>
                        <h2 className="text-2xl font-bold text-white mb-4">Page introuvable</h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-kcb-or to-kcb-bronze mb-6" />

                        <p className="text-kcb-pierre mb-8">
                            Oups ! On dirait que vous vous aventurez en territoire inconnu. La page que vous recherchez n'existe pas dans la galerie <span className="font-semibold text-kcb-ivoire">Kucibok</span>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <button
                                className="w-full flex items-center justify-center py-2.5 px-4 text-white hover:bg-white/[0.08] group bg-kcb-ardoise border border-white/[0.06] rounded-lg transition-colors"
                                onClick={() => navigate(-1)}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Retour
                            </button>

                            <Link
                                to="/"
                                className="w-full flex items-center justify-center py-2.5 px-4 bg-kcb-or text-kcb-noir font-medium hover:bg-kcb-bronze rounded-lg transition-colors"
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-sm text-kcb-pierre">
                &copy; {new Date().getFullYear()} Kucibok. Tous droits réservés.
            </div>
        </div>
    );
}
