import { LogOut, User, X } from "lucide-react"
import { memo, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../store/AuthContext"

/**
 * User menu dropdown — aligned with KCB design system.
 */
export const UserLinks = memo(() => {
  const { user, artistProfile, buyerProfile, curatorProfile, logout } = useAuth()
  const [show, setShow] = useState(false)
  const dashboard = user?.role === "artist" ? "artist" : user?.role === "curator" ? "curator" : user?.role === "collector" ? "collector" : user?.role === "admin" ? "admin" : "collector"
  const profileImg = artistProfile?.image || buyerProfile?.image || curatorProfile?.image || "/images/profile/girafe.png"

  return (
    <>
      <button
        onClick={() => setShow(!show)}
        aria-label="Ouvrir le menu utilisateur"
      >
        <img src={profileImg} alt={user?.name} className="object-cover rounded-full w-9 h-9 border border-white/[0.08]" />
      </button>
      {show && (
        <div className="fixed z-[200] bg-black/60 w-screen h-screen left-0 top-0 flex justify-end">
          <div className="w-full max-w-xs h-full bg-kcb-noir-deep border-l border-white/[0.05] px-6 py-8 flex flex-col animate-slide-left relative font-dm-sans">
            <button
              className="absolute top-4 right-4 rounded-full hover:bg-white/[0.05] p-2"
              onClick={() => setShow(false)}
              aria-label="Fermer le menu utilisateur"
            >
              <X className="w-5 h-5 text-kcb-pierre" />
            </button>
            <div className="flex flex-col items-center gap-3 mt-8 mb-6">
              <img className="w-16 h-16 rounded-full object-cover border-2 border-kcb-or/30" src={profileImg} alt="profile" />
              <div className="text-center">
                <p className="font-playfair font-bold text-lg text-white">{user?.name}</p>
                <p className="text-xs text-kcb-pierre">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <Link
                to={`/dashboard/${dashboard}`}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/90 no-underline transition-colors hover:bg-white/[0.03]"
                onClick={() => setShow(false)}
              >
                <User className="w-4 h-4" /> Tableau de bord
              </Link>
              <button
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-kcb-pierre border border-white/[0.05] transition-colors hover:bg-white/[0.03]"
                onClick={() => { setShow(false); logout() }}
              >
                <LogOut className="w-4 h-4" /> Deconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
})
