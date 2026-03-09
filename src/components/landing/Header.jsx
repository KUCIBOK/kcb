import { memo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { UserLinks } from "./UserLinks";
import { Menu, ChevronDown } from "lucide-react";

export const Header = memo(() => {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [showExploreMenu, setShowExploreMenu] = useState(false);
  const location = useLocation();
  const links = [
    { name: "Accueil", path: "/" },
    { name: "Artistes", path: "/artists" },
    { name: "Services", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "À propos", path: "/about" },
  ];
  const isActive = (path) => location.pathname === path;

  const exploreLinks = [
    { name: "Oeuvres", path: "/explore" },
    { name: "Comment ça marche", path: "/how-it-works" },
  ];

  const NavLinks = () => (
    <>
      {/* First link - Accueil */}
      <Link
        to="/"
        onClick={() => setShow(false)}
        className={`font-medium transition-colors hover:text-indigo-kcb ${
          isActive("/") ? "text-gradient" : "text-gray-300"
        }`}
      >
        Accueil
      </Link>

      {/* Second position - Explorer dropdown */}
      <div className="relative group">
        <button
          className={`font-medium transition-colors flex items-center gap-1 ${
            isActive("/explore")
              ? "text-gradient"
              : "text-gray-300"
          } hover:text-indigo-kcb`}
          onClick={() => setShowExploreMenu(!showExploreMenu)}
        >
          Explorer
        </button>
        <div
          className={`absolute left-0 mt-2 w-40 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-10 ${
            showExploreMenu ? "block" : "hidden"
          } group-hover:block`}
          onMouseLeave={() => setShowExploreMenu(false)}
        >
          {exploreLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => {
                setShow(false);
                setShowExploreMenu(false);
              }}
              className={`block px-4 py-2 text-sm ${
                isActive(link.path)
                  ? "text-indigo-kcb bg-gray-800"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Rest of the links */}
      {links.slice(1).map((link) => (
        <Link
          key={link.path}
          to={link.path}
          onClick={() => setShow(false)}
          className={`font-medium transition-colors hover:text-indigo-kcb ${
            isActive(link.path) ? "text-gradient" : "text-gray-300"
          }`}
        >
          {link.name}
        </Link>
      ))}

      {user ? (
        <Link
          onClick={() => setShow(false)}
          to={
            user?.role == "collector"
              ? "/collector/pricing"
              : "/professional/pricing"
          }
          className={`font-medium transition-colors hover:text-indigo-kcb`}
        >
          Pricing
        </Link>
      ) : (
        <>
          <Link
            onClick={() => setShow(false)}
            to={"/collector/pricing"}
            className={`font-medium transition-colors hover:text-indigo-kcb`}
          >
            Pricing Collectionneur
          </Link>
          <Link
            onClick={() => setShow(false)}
            to={"/professional/pricing"}
            className={`font-medium transition-colors hover:text-indigo-kcb`}
          >
            Pricing Professionnel
          </Link>
        </>
      )}
    </>
  );

  // Mobile NavLinks with separate explore items
  const MobileNavLinks = () => (
    <>
      <Link
        to="/"
        onClick={() => setShow(false)}
        className={`font-medium transition-colors hover:text-indigo-kcb ${
          isActive("/") ? "text-gradient" : "text-gray-300"
        }`}
      >
        Accueil
      </Link>

      {/* Mobile explore links - shown directly without dropdown */}
      <div className="flex flex-col pl-4">
        <span className="font-medium text-gray-400 mb-1">Explorer</span>
        {exploreLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setShow(false)}
            className={`font-medium transition-colors hover:text-indigo-kcb ${
              isActive(link.path) ? "text-gradient" : "text-gray-300"
            } py-1`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {links.slice(1).map((link) => (
        <Link
          key={link.path}
          to={link.path}
          onClick={() => setShow(false)}
          className={`font-medium transition-colors hover:text-indigo-kcb ${
            isActive(link.path) ? "text-gradient" : "text-gray-300"
          }`}
        >
          {link.name}
        </Link>
      ))}

      {user ? (
        <Link
          onClick={() => setShow(false)}
          to={
            user?.role == "collector"
              ? "/collector/pricing"
              : "/professional/pricing"
          }
          className={`font-medium transition-colors hover:text-indigo-kcb`}
        >
          Pricing
        </Link>
      ) : (
        <>
          <Link
            onClick={() => setShow(false)}
            to={"/collector/pricing"}
            className={`font-medium transition-colors hover:text-indigo-kcb`}
          >
            Pricing Collectionneur
          </Link>
          <Link
            onClick={() => setShow(false)}
            to={"/professional/pricing"}
            className={`font-medium transition-colors hover:text-indigo-kcb`}
          >
            Pricing Professionnel
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 left-0 right-0 z-50 animate-fade-in-up backdrop-blur-md pt-2 pb-3.5 px-4 border-b border-gray-800 bg-gray-900/80">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="/images/kucibok-white-logo.svg"
            alt="logo"
            className="w-8"
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <NavLinks />
        </nav>
        <div className="flex items-center gap-2">
          {!user?.role && (
            <>
              <Link
                to="/sign-in"
                className="text-sm hidden md:block font-medium transition-colors bg-gray-800 border border-gray-700 hover:bg-gray-600/60 px-4 py-2 rounded-md"
              >
                Connexion
              </Link>
              <Link
                to="/sign-up"
                className="text-sm hidden md:block font-medium transition-colors hover:bg-gray-600/60 px-3 py-2 rounded-md bg-gradient"
              >
                Inscription
              </Link>
            </>
          )}
          <button
            onClick={() => setShow(!show)}
            className="md:hidden hover:bg-indigo-950 px-3 py-2 rounded-md cursor-pointer"
          >
            <Menu className="text-lg text-white" />
            <span className="sr-only">Toggle menu</span>
          </button>
          {user?.role && <UserLinks />}
        </div>
      </div>
      {/* Mobile navbar */}
      {show && (
        <div className="animate-fade-in bg-gray-900/80 z-90 fixed lg:hidden w-screen h-screen top-0 left-0 flex justify-end">
          <div className="animate-slide-left z-99 duration-500 ease-in-out w-4/5 max-w-xs h-full bg-gray-900 border-l border-gray-800 px-5 py-6 flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-800 pb-5">
              <Link
                to="/"
                className="flex items-center"
                onClick={() => setShow(false)}
              >
                <img
                  src="/images/kucibok-white-logo.svg"
                  alt="logo"
                  className="w-8"
                />
                <span className="font-playfair text-xl font-bold text-gradient ml-2">
                  Kucibok
                </span>
              </Link>
              <button
                onClick={() => setShow(false)}
                className="hover:bg-indigo-950 px-3 py-2 rounded-md"
              >
                <span className="text-white text-2xl">×</span>
                <span className="sr-only">Fermer le menu</span>
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-5">
              <MobileNavLinks />
              {!user?.role && (
                <>
                  <Link
                    to="/sign-in"
                    className="text-sm font-medium transition-colors bg-gray-800 border border-gray-700 hover:bg-gray-600/60 px-4 py-2 rounded-md w-full text-center"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/sign-up"
                    className="text-sm font-medium transition-colors bg-gradient hover:bg-gray-600/60 px-3 py-2 rounded-md w-full text-center"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
});
