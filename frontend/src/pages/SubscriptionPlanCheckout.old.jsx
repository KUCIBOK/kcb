import { Link, useParams } from "react-router-dom"
import { useAuth } from "../store/AuthContext"
import { useEffect, useState } from "react"
import {getPlanById} from "../api/usePlans"
import { AlertCircle, ArrowLeft, Check, Lock, ShieldCheck, ShoppingCart } from "lucide-react"
import { DataLoader } from "../components/loaders/PageLoader"
import { createSubscription } from "../api/useSubscriptions"

export default function SubscriptionPlanCheckout(){
    const {id} = useParams()
    const {user} = useAuth()
    const [state, setState] = useState({
        plan : {},
        loading : true,
        error : ""
    })
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
        const script = document.createElement("script");
        // script.src = "https://touchpay.gutouch.com/touchpay/script/prod_touchpay-0.0.1.js";
        script.src = "https://touchpay.gutouch.com/touchpay/script2/prod_touchpay-0.0.2.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, [])
    const calltouchpay = async function (){
        try {
            setState({...state, error : "", loading : true})
            const charge = {
                planId : state?.plan?._id
            }
            const sub = await createSubscription(charge)
            if(sub?._id){
                const paymentInfo = await sendPaymentInfos(
                    sub?._id, 
                    import.meta.env.VITE_INTOUCH_AGENCY_CODE,
                    import.meta.env.VITE_INTOUCH_SECURITY_CODE,
                    "www.kucibok.com",
                    `${import.meta.env.VITE_FRONTEND_URL}/subscription-purchase-success/${sub?._id}`,
                    `${import.meta.env.VITE_FRONTEND_URL}/subscription-purchase-failed/${sub?._id}`,
                    state?.plan?.price,
                    'Dakar',
                    user?.email,
                    user?.name?.split(' ')[0] || "",
                    user?.name?.split(' ')[1] || "",
                    user?.telephone
                )
                setState({...state, loading : false, error : JSON.stringify(paymentInfo)})
            }
        } catch (error) {
            setState({...state, loading : false, error : error.message})
            window.scrollTo(0, 0)
        }
    }
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
                            <button
                                disabled={user?.role != state?.plan?.role}
                                onClick={calltouchpay}
                                className="rounded-md flex justify-center items-center gap-2 w-full bg-indigo-kcb hover:bg-indigo-kcb/90 transition shadow py-2 text-white font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {(user?.role === "collector" || user?.role == "professional") ? (
                                    state?.loading ? <DataLoader/> : (<><ShoppingCart className="w-4 h-4" /> Payer {state?.plan?.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} {state?.plan?.currency}</>)
                                ) :
                                    (<Lock className="w-6 h-6 my-2" />)
                                }
                            </button>
                            {(!user?._id) && (
                                <p className="flex items-center text-xs text-gray-400 mt-2"> <AlertCircle className="w-4 h-4 mr-2" /> Vous devez être inscrit pour souscrire à un abonnement</p>
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