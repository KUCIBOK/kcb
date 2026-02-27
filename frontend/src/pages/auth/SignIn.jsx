import { useState } from "react";
import { Wallet, EyeClosed, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  getMetamaskAddress,
  loginUser,
  MetamaskLogin,
  loginWithGoogle,
} from "../../api/useAuth";
import { useAuth } from "../../store/AuthContext";
import { Helmet } from "react-helmet";
import { useGoogleLogin } from "@react-oauth/google";
import { Button, Input } from "../../components/ui";

export default function SignIn () {
    const {login, setProfile} = useAuth()
    const navigate = useNavigate();
    const [formState, setFormState] = useState({
        email: "",
        password: "",

        seePassword : false,
        loading: false,
        error: null,
    });

  const handleConnect = async (e) => {
    e.preventDefault();
    setFormState({ ...formState, loading: true });
    try {
      const data = await loginUser(formState.email, formState.password);
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

    const handleGoogleSuccess = async (tokenResponse) => {
        setFormState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await loginWithGoogle(tokenResponse.access_token);
            if (!data?.user?._id) {
                setFormState(prev => ({ ...prev, loading: false, error: data?.error || "Échec de la connexion Google" }));
                return;
            }
            login({ ...data.user, isLogin: true });
            if (data.user.role === "artist") setProfile(data.artist);
            else setProfile(data.profile);
            setFormState(prev => ({ ...prev, loading: false, error: "" }));
            if (data.isNewUser) {
                navigate("/auth/role-selection");
            }
        } catch (err) {
            setFormState(prev => ({ ...prev, loading: false, error: err?.message }));
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => setFormState(prev => ({ ...prev, error: "Connexion Google annulée ou refusée." })),
    });

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
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 rounded-md mb-3 font-medium py-3 px-4 text-sm text-gray-800 transition border border-gray-200"
                  onClick={() => googleLogin()}
                  type="button"
                  disabled={formState.loading}
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Se connecter avec Google
                </button>
                <Button
                  variant="outline"
                  fullWidth
                  icon={Wallet}
                  onClick={async () => await handleConnectMetamask()}
                  disabled={formState.loading}
                  className="mb-4 py-3 text-sm"
                >
                  Connexion MetaMask
                </Button>
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-700" />
                  <span className="mx-2 text-xs text-gray-500">ou</span>
                  <div className="flex-grow border-t border-gray-700" />
                </div>
                <form onSubmit={handleConnect} className="space-y-4" method="post">
                  <Input
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Votre email"
                    required
                    minLength={6}
                    value={formState.email}
                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                    size="sm"
                  />
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
                  <Button
                    type="submit"
                    fullWidth
                    loading={formState.loading}
                    className="bg-indigo-kcb hover:bg-indigo-700 border-0 text-sm font-semibold"
                  >
                    Se connecter
                  </Button>
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