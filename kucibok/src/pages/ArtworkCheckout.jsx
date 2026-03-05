import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getArtistById } from "../api/useArtists";
import { getArtworkById } from "../api/useArtworks";
import { AlertCircle, ArrowLeft, Lock, ShoppingCart } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { DataLoader } from "../components/loaders/PageLoader";
import { usePayment } from "../hooks/usePayment";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import { toast } from "sonner";


export default function ArtworkCheckout(){
    const {id} = useParams()
    const {user} = useAuth()
    const { payForArtwork, loading: paymentLoading } = usePayment()
    
    const [artwork, setArtwork] = useState({
        artist : null,
        loading : true,
        error : ""
    })

    const [paymentMethod, setPaymentMethod] = useState('paydunya')

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchArtwork = async () =>{
            const data = await getArtworkById(id)
            if(data?._id){
                setArtwork(prev => ({...data, loading : false}))
                if(data?.artistId){
                    const artistData = await getArtistById(data?.artistId);
                    if(artistData?._id){
                        setArtwork(prev => ({...prev, artist : artistData}))
                    }
                }
                return
            }
            toast.error(data?.error || 'Erreur lors du chargement de l\'œuvre')
        }
        fetchArtwork()
        
    }, [id]);

    const handlePayment = async () => {
        if (user?.role !== "collector") {
            toast.error("Seuls les collectionneurs peuvent acheter des œuvres");
            return;
        }

        if (!artwork?._id) {
            toast.error("Œuvre introuvable");
            return;
        }

        try {
            if (paymentMethod === 'paydunya') {
                await payForArtwork(artwork._id);
            } else {
                toast.info("Méthode de paiement non encore disponible");
            }
        } catch (error) {
            toast.error("Erreur lors du paiement");
        }
    };
    
    return (
        <>
        <div className="min-h-screen flex py-8 justify-center bg-gray-900 px-2">
            <div className="w-full max-w-3xl mx-auto">
                <Link to={-1} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium mb-6">
                    <ArrowLeft className="w-5 h-5" /> Retour
                </Link>
                {artwork?.error && (
                    <div className="bg-red-900/20 flex items-center text-red-200 font-medium py-2 rounded-lg mb-4 px-4">
                        <AlertCircle className="w-4 h-4 mr-2" /> {artwork?.error}
                    </div>
                )}
                {!artwork?.loading ? (
                    <div className="flex flex-col md:flex-row gap-8 animate-fade-in">
                        {/* Résumé */}
                        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-6 shadow-md">
                            <h2 className="font-serif text-xl text-white font-semibold mb-2">Résumé de la commande</h2>
                            <div className="flex gap-4 items-center">
                                <img src={artwork?.image} alt={artwork?.title} className="rounded-lg w-24 h-24 object-cover border border-gray-800" />
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold text-white text-lg">{artwork?.title}</span>
                                    {artwork?.edition && (
                                        <span className="text-xs text-gray-400">Édition #{artwork?.edition?.number}/{artwork?.edition?.total}</span>
                                    )}
                                    <span className="text-indigo-kcb font-bold text-lg">{artwork?.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} {artwork?.currency}</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-800 pt-4 mt-2 text-white text-base space-y-2">
                                <div className="flex justify-between">
                                    <span>Prix</span>
                                    <span>{artwork?.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} {artwork?.currency}</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>{artwork?.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} {artwork?.currency}</span>
                                </div>
                            </div>
                        </div>
                        {/* Paiement */}
                        <div className="w-full md:w-96 bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-6 shadow-md">
                            <h3 className="flex items-center gap-2 text-white text-base font-semibold mb-2">
                                <Lock className="w-4 h-4"/> Paiement sécurisé
                            </h3>
                            
                            {/* Sélecteur de méthode de paiement */}
                            <PaymentMethodSelector
                                selectedMethod={paymentMethod}
                                onMethodChange={setPaymentMethod}
                                showTitle={false}
                            />

                            <button
                                disabled={user?.role !== "collector" || paymentLoading || artwork?.loading}
                                onClick={handlePayment}
                                className="rounded-md flex justify-center items-center gap-2 w-full bg-indigo-kcb hover:bg-indigo-kcb/90 transition shadow py-2 text-white font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {user?.role === "collector" ? (
                                    (paymentLoading || artwork?.loading) ? <DataLoader/> : (
                                        <>
                                            <ShoppingCart className="w-4 h-4" /> 
                                            Payer {artwork?.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} {artwork?.currency}
                                        </>
                                    )
                                ) : (
                                    <Lock className="w-6 h-6 my-2" />
                                )}
                            </button>
                            
                            {(user?.role !== "collector" || !user?._id) && (
                                <p className="flex items-center text-xs text-gray-400 mt-2"> 
                                    <AlertCircle className="w-4 h-4 mr-2" /> 
                                    Vous devez être inscrit en tant que collectionneur pour acheter une œuvre.
                                </p>
                            )}

                            {/* Informations de sécurité */}
                            <div className="text-xs text-gray-500 border-t border-gray-800 pt-4">
                                <p className="flex items-center gap-1 mb-1">
                                    <Lock className="w-3 h-3" />
                                    Paiement 100% sécurisé
                                </p>
                                <p>Vos données sont protégées par un cryptage SSL</p>
                                <p className="mt-1 text-gray-600">Powered by PayDunya - Service de paiement agréé</p>
                            </div>
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