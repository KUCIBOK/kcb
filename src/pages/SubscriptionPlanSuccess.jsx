import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { activateSubscription } from "../api/useSubscriptions"
import { DataLoader } from "../components/loaders/PageLoader"
import { CheckCircle, XCircle } from "lucide-react"

export default function SubscriptionPlanSuccess(){
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
            const {sub, plan, error} = await activateSubscription(subId)
            if(error){
                setState(prev => ({...prev, loading : false, error : error}))
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
        validateArtworkPurchase()
    }, [subId])
    return (
        <>
        <div className="flex flex-col justify-center items-center px-4 py-10 max-w-2xl mx-auto">
            {!state?.error ?(<>
            <div className="rounded-full bg-green-100 w-16 h-16 flex justify-center items-center mb-4">
                <CheckCircle className="text-green-600/80 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Abonnement activé</h1>
            <p className="text-gray-400 text-sm text-center mb-6">Bienvenue dans votre nouvel abonnement {state?.plan?.name}. Toutes les fonctionnalités sont maintenant disponibles.</p></>) 
            : 
            (<>
                <div className="rounded-full bg-red-100 w-16 h-16 flex justify-center items-center mb-4">
                    <XCircle className="text-red-600/80 w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2 text-center">Échec du paiement</h1>
                <p className="text-gray-400 text-sm text-center mb-6">Nous n'avons pas pu traiter votre paiement. Aucun montant n'a été débité.</p>
            </>)}
            <div className="w-full rounded-xl p-5 space-y-6 bg-background border border-gray-800">
                <h3 className="text-base font-semibold text-white mb-2">Détails de l'abonnement</h3>
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
                            <div className="text-md tracking-tight font-medium text-green-500/80"> {state?.plan?.role == "active" ? "Actif" : "Échec"} </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-xs md:text-sm tracking-tight font-medium">Prochain paiement</div>
                            <div className="text-md tracking-tight font-medium"> {state?.sub?.endDate?.toLocaleDateString()} </div>
                        </div>
                    </div>
                ) : (
                    <DataLoader />
                )}
                {!state?.error ? (
                    <div className="bg-blue-50 text-blue-800 rounded-lg px-4 py-4">
                    <div className="font-serif text-base font-medium mb-2">Ce qui vous attend</div>
                    <ul className="list-disc px-4 text-xs">
                        <li>Accès immédiat à toutes les fonctionnalités Collectionneur Expert</li>
                        <li>Possibilité de gérer votre abonnement à tout moment</li>
                        <li>Support prioritaire disponible</li>
                    </ul>
                </div>
                )
                :
                <div className="bg-red-50 text-red-800 rounded-lg px-4 py-4">
                    <div className="font-serif text-base font-medium mb-2">Raisons possibles de l'échec</div>
                    <ul className="list-disc px-4 text-xs">
                        <li>Fonds insuffisants sur votre compte</li>
                        <li>Problème de connexion réseau</li>
                        <li>Limite de transaction dépassée</li>
                        <li>Restriction bancaire sur les paiements récurrents</li>
                    </ul>
                </div>
                }
            </div>
            {state?.error &&
                (
                <div className="flex flex-col mt-6 lg:flex-row items-center w-full gap-4">
                    <Link to={`/dashboard/${state?.plan?.role}`} className="rounded-md flex items-center text-sm text-white justify-center w-full font-medium bg-blue-600 hover:bg-purple-800 transition py-2 px-4">
                        Aller au dashboard
                    </Link>
                </div>
            )
            }
            <Link className="w-fit p-2 bg-card rounded-lg mx-auto mt-4 font-medium tracking-tight text-white" to={"/explore"}>
                Explorer les oeuvres
            </Link>
        </div>
        </>
    )
}