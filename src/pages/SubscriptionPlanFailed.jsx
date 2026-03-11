import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { failSubscription } from "../api/useSubscriptions"
import { DataLoader } from "../components/loaders/PageLoader"
import { CreditCard, HelpCircle, XCircle } from "lucide-react"

export default function SubscriptionPlanFailed(){
    const {subId} = useParams()
    const [state, setState] = useState({
        sub : {},
        plan : {},
        loading : true,
        error : ""
    })
    const navigate = useNavigate()
    useEffect(() => {
        const validateArtworkPurchase = async function () {
            const {sub, plan, error} = await failSubscription(subId)
            if(error || !sub?._id || !plan?._id){
                navigate("/404")
            }
            if(sub?._id && plan?._id){
                setState(prev => ({
                    ...prev,
                    loading : false,
                    sub : sub,
                    plan : plan
                }))
            }
        }
        if(subId == undefined){
            return <Navigate to="/404" />
        }
        validateArtworkPurchase()
    }, [subId])
    return (
        <>
        <div className="flex flex-col justify-center items-center px-4 py-10 max-w-2xl mx-auto">
            <div className="rounded-full bg-red-100 w-16 h-16 flex justify-center items-center mb-4">
                <XCircle className="text-red-600/80 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Échec du paiement</h1>
            <p className="text-gray-400 text-sm text-center mb-6">Nous n'avons pas pu traiter votre abonnement. Aucun montant n'a été débité.</p>
            <div className="w-full rounded-xl p-5 space-y-6 border border-gray-800">
                <h3 className="text-base font-semibold text-white mb-2">Détails de la tentative d'abonnement</h3>
                {(state?.plan && !state?.loading) ? (
                    <div className="space-y-4 animate-fade-in text-white animate-fade-in">
                        <div className="flex justify-between items-center">
                            <div className="text-xs md:text-sm tracking-tight font-medium">Plan séléctionné</div>
                            <div className="text-md tracking-tight font-medium"> {state?.plan?.name} </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-xs md:text-sm tracking-tight font-medium">Prix {state?.plan?.duration == "monthly" ? "mensuel" : "annuel"} </div>
                            <div className="text-md tracking-tight font-medium"> {state?.plan?.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} FCFA </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-xs md:text-sm tracking-tight font-medium">Statut</div>
                            <div className="text-md tracking-tight font-medium text-red-500/80"> Échec </div>
                        </div>
                    </div>
                ) : (
                    <DataLoader />
                )}
                <div className="bg-red-50 text-red-800 rounded-lg px-4 py-4">
                    <div className="font-serif text-base font-medium mb-2">Raisons possibles de l'échec</div>
                    <ul className="list-disc px-4 text-xs">
                        <li>Fonds insuffisants sur votre compte</li>
                        <li>Problème de connexion réseau</li>
                        <li>Limite de transaction dépassée</li>
                        <li>Restriction bancaire sur les paiements récurrents</li>
                    </ul>
                </div>
           </div>
            <div className="flex flex-col mt-6 lg:flex-row items-center w-full gap-4">
                <Link to={`/subscription-checkout/${state?.plan?._id}`} className="rounded-md flex items-center justify-center w-full text-sm font-medium bg-purple-900 hover:bg-purple-800 transition py-2 px-4">
                    Réessayer le paiement
                </Link>
            </div>
            <div className="flex flex-col mt-6 lg:flex-row items-center w-full gap-4">
                <div className="rounded-xl border p-6 w-full">
                    <h6 className="font-bold mb-4 flex gap-2 items-center"> <CreditCard className="w-4 h-4" /> Vérifiez votre paiement </h6>
                    <h4>Détails de la carte</h4>
                    <p>Vérifiez que les informations de votre carte sont correctes et à jour.</p>
                    <h4 className="mt-4">Limite de paiement</h4>
                    <p>Assurez-vous que votre limite de paiement en ligne permet cette transaction.</p>
                </div>
                <div className="rounded-xl border p-6 w-full">
                    <h6 className="font-bold mb-4 flex gap-2 items-center"> <HelpCircle className="w-4 h-4" /> Vérifiez votre paiement </h6>
                    <h4>Contactez votre banque</h4>
                    <p>Votre banque peut avoir bloqué la transaction pour sécurité.</p>
                    <h4 className="mt-4">Essayez plus tard</h4>
                    <p>Il peut s'agir d'un problème temporaire. Réessayez dans quelques minutes.</p>
                </div>
            </div>
            <div className="rounded-xl border p-6 w-full my-4">
                <h3>Abonnement gratuit temporaire</h3>
                <p className="my-4 text-xs">En attendant de résoudre le problème de paiement, vous pouvez utiliser notre plan gratuit avec des fonctionnalités limitées.</p>
                <div className="w-full border py-2 text-sm text-center rounded-lg mt-4 mx-auto">
                    <Link className="w-full" to={`/dashboard/${state.plan?.role}`}>
                        Continuer avec le plan gratuit
                    </Link>
                </div>
            </div>
        </div>
        
        </>
    )
}