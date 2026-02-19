import { useState } from "react";
import { Mail, Lock, Wallet, EyeClosed, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { DataLoader } from "../../components/loaders/PageLoader";
import {
  getMetamaskAddress,
  loginUser,
  MetamaskLogin,
} from "../../api/useAuth";
import { useAuth } from "../../store/AuthContext";
import { Helmet } from "react-helmet";

export default function SignIn () {
    const {login, setProfile} = useAuth()
    const [formState, setFormState] = useState({
        email: "",
        password: "",

        seePassword : false,
        loading: false,
        error: null,
    });

  const handleConnect = async (e) => {
    e.preventDefault();
    alert("Form submitted - attempting login...");
    console.log("Form submitted with:", formState.email, formState.password);
    setFormState({ ...formState, loading: true });
    try {
      console.log("Calling loginUser...");
      const data = await loginUser(formState.email, formState.password);
      console.log("loginUser returned:", data);
      if(!data?.user?._id || !data?.user?.role) {setFormState({ ...formState, loading: false, error: data?.error }); return;}
      login({ ...data?.user, isLogin: true });
      if (data?.user?.role == "artist") {
        setProfile(data?.artist);
      }
      if (data?.user?.role) {
        setProfile(data?.profile);
      }
      setFormState({ ...formState, error: "", loading: false });
      // Navigation handled by GuestProtectedRoute
    } catch (error) {
      setFormState({
        ...formState,
        loading: false,
        error: error?.message || "Erreur pendant la connexion",
      });
      window.scrollTo(0, 0);
    }
  };

    const handleConnectMetamask = async () => {
        setFormState({ ...formState, error: '', loading: true });
        const checkMetaMask = async () => {
            if (!window.ethereum) {
                return false;
            }
            return true;
        };
        if (!(await checkMetaMask())) setFormState(prev => ({...prev, error : "Vous ne disposez pas de l'extension Metamask. Veuillez l'installer pour continuer.", loading : false}));
        try {
            const {address, signature, message} = await getMetamaskAddress()
            if(address) {
                const {user, artist, profile, error} = await MetamaskLogin({
                    address : address,
                    signature : signature,
                    message : message
                })
                if(user?._id){
                  login(user)
                    if(user?.role == "artist"){
                      setProfile(artist)
                    }
                    if(user?.role == "professional" || user?.role == "collector"){
                      setProfile(profile)
                    }
                    setFormState({ ...formState, error: '', loading: false });
                    // Navigation handled by GuestProtectedRoute
                    return
                }
                setFormState({...formState, loading : false, error : error})
            }
        } catch (error) {
            setFormState({ ...formState, error : `Erreur pendant l'authentification Metamask, veuillez vous connecter avec votre email`, loading: false });
        }
    }
    return (
        <>
        <Helmet>
            <title>{(`Sign in | Kucibok`)}</title>
            <meta name="description" content={"Connectez-vous à votre compte Kucibok"} />
            <meta property="og:title" content={"Connexion Kucibok"} />
            <meta property="og:description" content={"Connectez-vous à votre compte Kucibok"} />
            <meta property="og:image" content={"/images/kucibok-black.png"} />
            <meta property="og:url" content={`https://kucibok.com/sign-in`} />
        </Helmet>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pb-8">
          <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-8 mt-8">
              {/* <h1 className="font-serif text-2xl font-bold text-white tracking-tight mb-2">KUCIBOK</h1> */}
              <Link to='/'>
                <img src="/images/kucibok-white-logo.svg" alt="logo kucibok" className="w-12 h-12 object-cover mx-auto" />
              </Link>
              <h2 className="text-lg font-semibold text-gray-200 mb-1">Connexion</h2>
              <p className="text-xs text-gray-400">La marketplace d'art africain</p>
            </div>
            {formState.error && (
              <div className="mb-4 text-red-300 text-center bg-red-900/20 border border-red-900 rounded-md p-2 text-xs">
                {formState.error}
              </div>
            )}
            <div className="rounded-xl border border-gray-800 bg-card shadow-sm">
              <div className="p-5">
                <button
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-md mb-4 font-medium py-3 px-4 text-sm text-white transition"
                  onClick={async () => await handleConnectMetamask()}
                  type="button"
                >
                  <Wallet className="h-5 w-5" />
                  Connexion MetaMask
                </button>
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-700" />
                  <span className="mx-2 text-xs text-gray-500">ou</span>
                  <div className="flex-grow border-t border-gray-700" />
                </div>
                <form onSubmit={handleConnect} className="space-y-4" method="post">
                  <div>
                    <label htmlFor="email" className="text-xs font-medium text-gray-400">Email</label>
                    <input
                      onChange={e => setFormState({ ...formState, email: e.target.value })}
                      value={formState.email}
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="w-full border border-gray-800 bg-gray-900 rounded-md px-3 py-2 mt-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-kcb"
                      minLength={6}
                      placeholder="Votre email"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="text-xs font-medium text-gray-400">Mot de passe</label>
                    <div className="flex mt-1">
                      <input
                        onChange={e => setFormState({ ...formState, password: e.target.value })}
                        value={formState.password}
                        type={formState.seePassword ? "text" : "password"}
                        name="password"
                        id="password"
                        minLength={8}
                        required
                        className="w-9/10 border border-gray-800 bg-gray-900 rounded-s-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-kcb"
                        placeholder="Votre mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setFormState({ ...formState, seePassword: !formState.seePassword })}
                        className={`w-1/10 border border-gray-800 bg-gray-900 rounded-e-md p-2 text-sm text-white hover:bg-gray-800 transition`}
                      >
                        {formState.seePassword ? <EyeClosed className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end mb-2">
                    <Link to="/forgot-password" className="text-xs text-indigo-kcb hover:underline">Mot de passe oublié ?</Link>
                  </div>
                  <button
                    type="submit"
                    onClick={() => alert("Button clicked!")}
                    className="w-full py-2 rounded-md bg-indigo-kcb text-white font-semibold text-sm hover:bg-indigo-700 transition"
                  >
                    {formState.loading ? <DataLoader /> : "Se connecter"}
                  </button>
                </form>
              </div>
              <div className="flex items-center justify-center border-t border-gray-800 p-4">
                <p className="text-xs text-gray-400">
                  Pas de compte ?{' '}
                  <Link to="/sign-up" className="font-semibold text-indigo-kcb hover:underline">Inscription</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}