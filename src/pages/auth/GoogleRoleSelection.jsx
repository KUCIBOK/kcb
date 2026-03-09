import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Award, Brush, ShoppingBag } from "lucide-react";
import { Helmet } from "react-helmet";
import { useAuth } from "../../store/AuthContext";
import { DataLoader } from "../../components/loaders/PageLoader";

const ROLE_DASHBOARDS = {
  artist: "/dashboard/artist",
  collector: "/dashboard/collector",
  professional: "/dashboard/professional",
  admin: "/dashboard/admin",
};

export default function GoogleRoleSelection() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState(user?.role || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!role) return;
    setLoading(true);
    setError("");
    try {
      // updateUser (AuthContext) met à jour public.users + user_metadata + déclenche onAuthStateChange
      const updated = await updateUser({ role });
      if (updated?.error) {
        setError(updated.error);
        setLoading(false);
        return;
      }
      navigate(ROLE_DASHBOARDS[role] || "/");
    } catch (err) {
      setError(err?.message || "Erreur lors de la mise à jour du rôle.");
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Choisir votre rôle | Kucibok</title>
        <meta name="description" content="Choisissez votre rôle sur Kucibok" />
      </Helmet>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-md mx-auto py-8">
          <div className="text-center mb-8">
            <Link to="/">
              <img
                src="/images/kucibok-white-logo.svg"
                alt="logo kucibok"
                className="w-12 h-12 object-cover mx-auto"
              />
            </Link>
            <h2 className="text-lg font-semibold text-gray-200 mb-1">
              Bienvenue sur Kucibok
            </h2>
            <p className="text-xs text-gray-400">
              Comment souhaitez-vous utiliser la plateforme ?
            </p>
          </div>
          <div className="bg-card rounded-xl border border-gray-800 shadow-sm p-6">
            {error && (
              <div className="mb-4 text-red-300 text-center bg-red-900/20 border border-red-900 rounded-md p-2 text-xs">
                {error}
              </div>
            )}
            <p className="text-center text-xl font-bold text-white mb-2">
              Choisissez votre rôle
            </p>
            <p className="text-xs text-center text-gray-400 mb-6">
              Sélectionnez votre profil pour personnaliser votre expérience
            </p>
            <div className="space-y-3">
              <div
                onClick={() => setRole("artist")}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg border cursor-pointer transition ${
                  role === "artist"
                    ? "border-indigo-kcb bg-indigo-kcb/10"
                    : "border-gray-800 hover:border-indigo-kcb/60"
                }`}
                style={{ userSelect: "none" }}
              >
                <span className="rounded-full bg-indigo-kcb/10 p-2">
                  <Brush className="text-indigo-kcb/80" />
                </span>
                <span className="text-white text-base font-medium">Artiste</span>
              </div>
              <div
                onClick={() => setRole("collector")}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg border cursor-pointer transition ${
                  role === "collector"
                    ? "border-indigo-kcb bg-indigo-kcb/10"
                    : "border-gray-800 hover:border-indigo-kcb/60"
                }`}
                style={{ userSelect: "none" }}
              >
                <span className="rounded-full bg-indigo-kcb/10 p-2">
                  <ShoppingBag className="text-indigo-kcb/80" />
                </span>
                <span className="text-white text-base font-medium">
                  Collectionneur
                </span>
              </div>
              <div
                onClick={() => setRole("professional")}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg border cursor-pointer transition ${
                  role === "professional"
                    ? "border-indigo-kcb bg-indigo-kcb/10"
                    : "border-gray-800 hover:border-indigo-kcb/60"
                }`}
                style={{ userSelect: "none" }}
              >
                <span className="rounded-full bg-indigo-kcb/10 p-2">
                  <Award className="text-indigo-kcb/80" />
                </span>
                <span className="text-white text-base font-medium">
                  Professionnel de l'art
                </span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!role || loading}
                className="w-full py-2 rounded-md bg-indigo-kcb text-white font-semibold text-sm hover:bg-indigo-700 transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <DataLoader /> : "Continuer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
