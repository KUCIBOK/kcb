import { Link, useParams } from "react-router-dom"
import { useAuth } from "../store/AuthContext"
import { useEffect, useState } from "react"
import {getPlanById} from "../api/usePlans"
import { AlertCircle, ArrowLeft, Check, Lock, ShieldCheck, ShoppingCart } from "lucide-react"
import { DataLoader } from "../components/loaders/PageLoader"
import { createSubscription } from "../api/useSubscriptions"
import { usePayment } from "../hooks/usePayment"
import PaymentMethodSelector from "../components/PaymentMethodSelector"
import { toast } from "react-hot-toast"

export default function SubscriptionPlanCheckout(){
    const {id} = useParams()
    const {user} = useAuth()
    const { payForSubscription, loading: paymentLoading } = usePayment()
    const [state, setState] = useState({
        plan : {},
        loading : true,
        error : "",
        paymentMethod: 'paydunya'
    })

    const handlePaymentMethodChange = (method) => {
        setState(prev => ({ ...prev, paymentMethod: method }))
    }

    const handlePayment = async () => {
        if (!user?._id) {
            toast.error("Vous devez être connecté pour souscrire à un abonnement")
            return
        }

        if (user?.role !== state?.plan?.role) {
            toast.error("Ce plan n'est pas compatible avec votre type de compte")
            return
        }

        try {
            // Créer d'abord l'abonnement
            const subscription = await createSubscription({ planId: id })
            
            if (subscription.error) {
                toast.error(subscription.error)
                return
            }

            if (!subscription._id) {
                toast.error("Erreur lors de la création de l'abonnement")
                return
            }

            // Initier le paiement selon la méthode choisie
            if (state.paymentMethod === 'paydunya') {
                const result = await payForSubscription(subscription._id, {
                    usePopup: false // Redirection directe pour les abonnements
                })

                if (!result.success) {
                    toast.error(result.error || "Erreur lors de l'initialisation du paiement")
                }
            } else {
                toast.info("Méthode de paiement non encore disponible")
            }

        } catch (error) {
            console.error('Erreur paiement:', error)
            toast.error("Erreur lors du traitement du paiement")
        }
    }
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPlan = async () =>{
            const plan = await getPlanById(id)
            if(plan?._id){
                setState(prev => ({...prev, plan : plan, error : "", loading : false}))
                return
            }
        }
        fetchPlan()
        
    }, [])
    
    return (
        <>
        <div className="min-h-screen flex py-8 justify-center bg-gray-900 px-4">
            <div className="w-full max-w-4xl mx-auto px-4">
                <Link to={-1} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium mb-6">
                    <ArrowLeft className="w-5 h-5" /> Retour
                </Link>
                {state?.error && (
                    <div className="bg-red-900/20 flex items-center text-red-200 font-medium py-2 rounded-lg mb-4 px-4">
                        <AlertCircle className="w-4 h-4 mr-2" /> {state?.error}
                    </div>
                )}
                {!state?.loading ? (
                    <div className="flex flex-col md:flex-row gap-8 animate-fade-in">
                        <div className="flex-1 border border-gray-800 rounded-xl p-6 flex flex-col shadow-md">
                            <h2 className="font-serif text-xl text-white font-semibold mb-6">Résumé de votre abonnement</h2>
                            <h2 className="font-serif text-xl text-white font-semibold text-center"> {state?.plan?.name} </h2>
                            <p className="text-center"><span className="text-xl text-white font-black mb-2"> {state?.plan?.price.toLocaleString('fr-FR').replace(/\s/g, ' ')} {state?.plan?.currency}</span><span classname="text-sm font-normal">/mois</span></p>
                            <h2 className="font-serif text-lg text-white mb-2"> {state?.plan?.name} </h2>
                            <ul className="list-none pb-4 border-b border-gray-400/70">
                                {state?.plan?.features?.map((item, idx) => (
                                    <li className="py-2 text-sm  text-white flex items-center gap-2"> <Check className="text-green-500 w-4 h-4" /> {item} </li>
                                ))}
                            </ul>
                            <table className="w-full">
                                <tr>
                                    <td>Abonnement {state?.plan?.name} </td>
                                    <td className="text-end"> {(state?.plan?.price - state?.plan?.price/5).toLocaleString('fr-FR').replace(/\s/g, ' ')} <span className="text-xs font-normal text-gray-500">{state?.plan.currency}</span> </td>
                                </tr>
                                <tr>
                                    <td> TVA (20%) </td>
                                    <td className="text-end"> {(state?.plan?.price/5).toLocaleString('fr-FR').replace(/\s/g, ' ')} <span className="text-xs font-normal text-gray-500">{state?.plan.currency}</span> </td>
                                </tr>
                                <tr>
                                    <td> Total mensuel </td>
                                    <td className="text-end"> {state?.plan?.price.toLocaleString('fr-FR').replace(/\s/g, ' ')} <span className="text-xs font-normal text-gray-500">{state?.plan.currency}</span> </td>
                                </tr>
                            </table>
                            <ul className="rounded-lg p-2 bg-gray-700 mt-4 list-disc ps-8">
                                <li>Annulation possible à tout moment</li>
                                <li>Première facture aujourd'hui</li>
                            </ul>
                        </div>

                        <div className="w-full md:w-96 border border-gray-800 rounded-xl p-6 flex flex-col gap-6 shadow-md">
                            <h3 className="flex items-center gap-2 text-white text-base font-semibold mb-2">
                                <ShieldCheck/> Paiement sécurisé
                            </h3>

                            {user?._id && user?.role === state?.plan?.role && (
                                <PaymentMethodSelector
                                    selectedMethod={state.paymentMethod}
                                    onMethodChange={handlePaymentMethodChange}
                                    availableMethods={['paydunya']}
                                />
                            )}

                            <button
                                disabled={!user?._id || user?.role !== state?.plan?.role || paymentLoading}
                                onClick={handlePayment}
                                className="rounded-md flex justify-center items-center gap-2 w-full bg-indigo-kcb hover:bg-indigo-kcb/90 transition shadow py-2 text-white font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {!user?._id ? (
                                    <Lock className="w-6 h-6 my-2" />
                                ) : user?.role !== state?.plan?.role ? (
                                    <Lock className="w-6 h-6 my-2" />
                                ) : paymentLoading ? (
                                    <DataLoader/>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-4 h-4" /> 
                                        Payer {state?.plan?.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} {state?.plan?.currency}
                                    </>
                                )}
                            </button>

                            {!user?._id && (
                                <p className="flex items-center text-xs text-gray-400 mt-2">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Vous devez être inscrit pour souscrire à un abonnement
                                </p>
                            )}

                            {user?._id && user?.role !== state?.plan?.role && (
                                <p className="flex items-center text-xs text-gray-400 mt-2">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Ce plan n'est pas compatible avec votre type de compte
                                </p>
                            )}

                            {state.paymentMethod === 'paydunya' && (
                                <div className="text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg">
                                    <p className="flex items-center gap-2 mb-1">
                                        <ShieldCheck className="w-4 h-4 text-green-500" />
                                        Paiement sécurisé avec PayDunya
                                    </p>
                                    <p>Accepte Mobile Money, cartes bancaires et virements</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center min-h-[300px]">
                        <DataLoader />
                    </div>
                )}
            </div>
        </div>
        </>
    )
}