import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { failTransaction } from "../api/useTransaction";
import { XCircle } from "lucide-react";
import { DataLoader } from "../components/loaders/PageLoader";

export default function ArtworkPurchaseFailed(){
    const {transactionId} = useParams()
    const [params, setParams] = useSearchParams()
    const num_transaction_from_gu = params.get("num_transaction_from_gu");
    const num_command = params.get("num_command");
    const amount = params.get("amount");
    const errorCode = params.get("errorCode");
    const navigate = useNavigate()
    const [state, setState] = useState({
        artwork : {},
        transaction : {},
        loading : true,
        error : ""
    })
    useEffect(() => {
        const failArtworkPurchase = async function () {
            const data = await failTransaction(transactionId)
            if(data?.error){
                navigate('/explore')
                setState(prev => ({...prev, loading : false}))
            }
            if(data?.artwork && data?.transaction){
                setState(prev => ({
                    ...prev,
                    loading : false,
                    artwork : data?.artwork,
                    transaction : data?.transaction,
                    error : ""
                }))
            }
        }
        if(!num_transaction_from_gu && !num_command && !amount && errorCode){
            navigate('/explore')
        }
        failArtworkPurchase()
    }, [transactionId, num_transaction_from_gu, num_command, amount, errorCode])
    return (
        <>
        <div className="flex flex-col justify-center items-center px-4 py-10 max-w-lg mx-auto">
            <div className="rounded-full bg-red-100 w-16 h-16 flex justify-center items-center mb-4">
                <XCircle className="text-red-600/80 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Échec du paiement</h1>
            <p className="text-gray-400 text-sm text-center mb-6">Nous n'avons pas pu traiter votre paiement. Aucun montant n'a été débité.</p>
            <div className="w-full rounded-xl p-5 space-y-6 bg-background border border-gray-800">
                <h3 className="text-base font-semibold text-white mb-2">Détails de la tentative d'achat</h3>
                {(state?.artwork && !state?.loading) ? (
                    <div className="flex gap-4 items-center animate-fade-in">
                        <img src={state?.artwork?.image} alt={state?.artwork?.title} className="rounded-lg w-20 h-20 object-cover border border-gray-800" />
                        <div>
                            <div className="font-serif font-semibold text-white text-lg mb-1">{state?.artwork?.title}</div>
                            <div className="text-xs text-gray-400 mb-1">Édition #{state?.artwork?.edition?.number}/{state?.artwork?.edition?.total}</div>
                            <div className="font-semibold text-purple-400 text-sm">{state?.artwork?.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} {state?.artwork?.currency}</div>
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
                    </ul>
                </div>
            </div>
            <Link to={`/artwork-checkout/${state?.artwork?._id}`} className="rounded-md flex items-center justify-center w-full text-sm font-medium bg-purple-900 hover:bg-purple-800 transition py-2 px-4 mt-6">
                Réessayer le paiement
            </Link>
            <Link to={`/artwork/${state?.artwork?._id}`} className="rounded-md flex items-center justify-center w-full text-sm font-medium bg-gray-900 hover:bg-gray-800 transition py-2 px-4 mt-2">
                Retour à l'œuvre
            </Link>
        </div>
        </>
    )
}