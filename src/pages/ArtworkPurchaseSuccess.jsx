import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { purchaseArtwork } from "../api/useArtworks";
import { useState } from "react";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import { DataLoader } from "../components/loaders/PageLoader";
import RevealOnScroll from "../components/landing/RevealOnScroll";

export default function ArtworkPurchaseSuccess(){
    const {transactionId} = useParams()
    const [state, setState] = useState({
        artwork : {},
        transaction : {},
        loading : true,
        error : ""
    })
    const navigate = useNavigate()
    useEffect(() => {
        const validateArtworkPurchase = async function () {
            const data = await purchaseArtwork(transactionId)
            if(data?.error){
                navigate('/dashboard/collector')
            }
            if(data?.artwork && data?.transaction){
                setState(prev => ({
                    ...prev,
                    loading : false,
                    artwork : data?.artwork,
                    transaction : data?.transaction
                }))
            }
        }
        validateArtworkPurchase()
    }, [transactionId])
    return (
        <>
        <RevealOnScroll>
        <div className="flex flex-col justify-center items-center px-4 py-10 max-w-lg mx-auto">
            {!state?.error ?(<>
            <div className="rounded-full bg-green-100 w-16 h-16 flex justify-center items-center mb-4">
                <CheckCircle className="text-green-600/80 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Achat réussi</h1>
            <p className="text-kcb-pierre text-sm text-center mb-6">Félicitations ! Vous êtes maintenant propriétaire de cette œuvre d'art.</p></>) 
            : 
            (<>
                <div className="rounded-full bg-red-100 w-16 h-16 flex justify-center items-center mb-4">
                    <XCircle className="text-red-600/80 w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2 text-center">Échec du paiement</h1>
                <p className="text-kcb-pierre text-sm text-center mb-6">Nous n'avons pas pu traiter votre paiement. Aucun montant n'a été débité.</p>
            </>)}
            <div className="w-full rounded-[4px] p-5 space-y-6 bg-kcb-noir-deep border border-white/[0.06]">
                <h3 className="text-base font-semibold text-white mb-2">Détails de l'achat</h3>
                {(state?.artwork && !state?.loading) ? (
                    <div className="flex gap-4 items-center">
                        <img src={state?.artwork?.image} alt={state?.artwork?.title} className="rounded-[4px] w-20 h-20 object-cover border border-white/[0.06]" />
                        <div>
                            <div className="font-playfair font-semibold text-white text-lg mb-1">{state?.artwork?.title}</div>
                            <div className="text-xs text-kcb-pierre mb-1">Édition #{state?.artwork?.edition?.number}/{state?.artwork?.edition?.total}</div>
                            <div className="font-semibold text-kcb-or text-sm">{state?.artwork?.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} {state?.artwork?.currency}</div>
                        </div>
                    </div>
                ) : (
                    <DataLoader />
                )}
                <div className="bg-kcb-noir rounded-[4px] px-4 py-4">
                    <div className="font-playfair text-base font-medium mb-2 text-white">Informations importantes</div>
                    <ul className="list-disc px-4 text-xs text-kcb-sable">
                        <li>Certificat d'authenticité inclus</li>
                        <li>Résolution haute qualité disponible</li>
                        <li>Confirmation envoyée par email</li>
                    </ul>
                </div>
                {state?.error && (
                    <div className="bg-red-50 text-red-800 font-medium rounded-[4px] px-4 py-4">
                        <div className="font-playfair text-base mb-2">Erreur serveur</div>
                        <div>{state?.error}</div>
                    </div>
                )}
            </div>
            <div className="flex flex-col lg:flex-row gap-4 mt-6 w-full">
                <Link to={'/dashboard/collector'} className="rounded-md border border-white/[0.06] bg-kcb-noir-deep hover:bg-kcb-noir-deep transition flex items-center gap-2 px-4 py-2 w-full text-sm font-medium text-white justify-center">
                    <Eye className="w-4 h-4" /> Voir ma collection
                </Link>
                <Link to={'/explore'} className="rounded-md bg-kcb-noir-deep hover:bg-kcb-ardoise transition flex items-center gap-2 px-4 py-2 w-full text-sm font-medium text-white justify-center">
                    Découvrir d'autres œuvres
                </Link>
            </div>
        </div>
        </RevealOnScroll>
        </>
    )
}