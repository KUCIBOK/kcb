import { Link } from "react-router-dom"
import { Mail, Wallet } from "lucide-react"
import { getMetamaskAddress } from "../../api/useAuth";


export const Step1 = ({ formState, setFormState }) => {

    const handleConnectMetamask = async () => {
        setFormState({ ...formState, error: '', loading: true });
        const checkMetaMask = async () => {
            if (!window.ethereum) {
                return false;
            }
            return true;
        };
        if (!(await checkMetaMask())) setFormState({...formState, error : "Vous ne disposez pas de l'extension Metamask. Veuillez l'installer pour continuer.", loading : false});
        try {
            const credentials = await getMetamaskAddress()
            if(credentials?.address){
                setFormState({...formState, error : "", credentials : credentials, step : 2, connectMethod : 'metamask'})
                return
            }
            setFormState({...formState, error : "Erreur pendant l'authentification Metamask (Veuillez réessayez)", loading : false})
        } catch (error) {
            setFormState({ ...formState, error : `Erreur pendant l'authentification Metamask`, loading: false });
        }
    }

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
              <button
                className="w-full flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-md mb-3 font-medium py-3 px-4 text-sm text-white transition"
                onClick={async () => await handleConnectMetamask()}
                type="button"
              >
                <Wallet className="h-5 w-5" />
                Inscription avec MetaMask
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-md font-medium py-3 px-4 text-sm text-white transition"
                onClick={() => {
                  setFormState({ ...formState, connectMethod: "email", error: "", step: 1, loading: false });
                }}
                type="button"
              >
                <Mail className="h-5 w-5" />
                Inscription avec email
              </button>
              <div className="mt-6 text-center">
                <Link to={-1} className="text-xs text-gray-400 hover:underline">Retour</Link>
              </div>
            </div>
          </div>
        </div>
        </>
    )
}