import { LogOut, User, X } from "lucide-react";
import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";


export const UserLinks = memo(() => {
  const { user, artistProfile, collectorProfile, professionalProfile, logout } = useAuth();
  const [show, setShow] = useState(false);
  const dashboard = user?.role === "artist" ? "artist" : user?.role === "collector" ? "collector" : user?.role === "professional" ? "professional" : user?.role === "admin" ? "admin" : null;
  const profileImg = artistProfile?.image || collectorProfile?.image || professionalProfile?.image || "/images/profile/girafe.png";
  return (
    <>
      <button
        onClick={() => setShow(!show)}
        aria-label="Ouvrir le menu utilisateur"
      >
        {/* <User className="h-5 w-5 text-white" /> */}
        <img src={profileImg} alt={user?.name} className="object-cover rounded-full w-10 h-10" />
      </button>
      {show && (
        <div className="fixed z-50 bg-black/60 w-screen h-screen left-0 top-0 flex justify-end">
          <div className="w-full max-w-xs h-full bg-gray-900 border-l border-gray-800 px-6 py-8 flex flex-col animate-slide-left relative">
            <button
              className="absolute top-4 right-4 rounded-full hover:bg-indigo-kcb/10 p-2"
              onClick={() => setShow(false)}
              aria-label="Fermer le menu utilisateur"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="flex flex-col items-center gap-3 mt-8 mb-6">
              <img className="w-16 h-16 rounded-full object-cover border-2 border-indigo-kcb" src={profileImg} alt="profile" />
              <div className="text-center">
                <p className="font-playfair font-bold text-lg text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <Link
                to={`/dashboard/${dashboard}`}
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-indigo-kcb/10 text-white/90 transition-colors"
                onClick={() => setShow(false)}
              >
                <User className="w-4 h-4" /> Tableau de bord
              </Link>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md text-white/80 border border-gray-700 hover:bg-gray-800/80 transition-colors"
                onClick={() => { setShow(false); logout(); }}
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
