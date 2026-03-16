import { ArrowLeft, Image, Share, ShoppingCart, Volume2, Truck } from "lucide-react";
import DOMPurify from 'dompurify';
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getArtworkById } from "../api/useArtworks";
import { useToast } from "../store/ToastContext";
import { useAuth } from "../store/AuthContext";
import { DataLoader } from "../components/loaders/PageLoader";
import { getArtistById } from "../api/useArtists";
import { Helmet } from "react-helmet";
import { RequestShipmentModal } from "../components/artworks/RequestShipmentModal";
import RevealOnScroll from "../components/landing/RevealOnScroll";

export default function Artwork() {
    const [artwork, setArtwork] = useState({ loading: true, artist: null });
    const [shipmentOpen, setShipmentOpen] = useState(false);
    const { id } = useParams();
    const { makeToast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchArtwork = async () => {
            const data = await getArtworkById(id);
            if (data?._id) {
                setArtwork(prev => ({ ...data, loading: false }));
                if (data?.artistId) {
                    const artistData = await getArtistById(data.artistId);
                    if (artistData?._id) {
                        setArtwork(prev => ({ ...prev, artist: artistData }));
                    }
                }
                return;
            }
            makeToast('Erreur', 'warning', data?.error);
        };
        fetchArtwork();
    }, [id]);

    const launchDescriptionSpeech = () => {
        try {
            const description = document.getElementById('artwork-description').textContent
            const utterance = new SpeechSynthesisUtterance(description)
            utterance.lang = "fr-FR";
            const voices = window.speechSynthesis.getVoices();
            const frVoice = voices.find(v => v.lang === "fr-FR");
            if (frVoice) utterance.voice = frVoice;
            window.speechSynthesis.speak(utterance)
        } catch (error) {
            // lecture vocale non disponible sur ce navigateur
        }
    }

    return (
        <>
            <Helmet>
                <title>{artwork.title ? `${artwork.title} | Kucibok` : "Kucibok"}</title>
                <meta name="description" content={artwork.description || ""} />
                <meta property="og:title" content={artwork.title || "Kucibok"} />
                <meta property="og:description" content={artwork.description || ""} />
                <meta property="og:image" content={artwork.image || ""} />
                <meta property="og:url" content={`https://kucibok.com/artwork/${artwork._id || ""}`} />
            </Helmet>
            <main className="max-w-5xl mx-auto px-2 md:px-6 py-8">
                <div className="mb-6">
                    <Link to={-1} className="flex items-center gap-2 text-kcb-pierre hover:text-white text-sm font-medium transition">
                        <ArrowLeft className="w-5 h-5" /> Retour
                    </Link>
                </div>
                {artwork?.loading && (
                    <div className="flex items-center justify-center min-h-[300px]">
                        <DataLoader />
                    </div>
                )}
                {artwork?._id && !artwork.loading && (
                    <>
                    <RevealOnScroll>
                    <section className="w-full">
                        <div className="flex flex-col md:flex-row gap-10">
                            {/* IMAGE + SHARE */}
                            <div className="md:w-7/12 w-full flex flex-col items-center md:items-start">
                                <div className="relative w-full max-w-lg aspect-square rounded-[4px] overflow-hidden border border-white/[0.06] bg-kcb-noir shadow-lg">
                                    <img
                                        src={artwork?.image}
                                        alt={artwork?.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                    <button
                                        className="absolute top-3 right-3 bg-kcb-ardoise/80 hover:bg-kcb-noir/90 rounded-full p-2 text-kcb-sable border border-white/[0.06] shadow"
                                        onClick={() => { navigator.clipboard.writeText(window.location.href); makeToast('Lien copié !', 'success'); }}
                                        title="Partager"
                                    >
                                        <Share className="w-5 h-5" />
                                    </button>
                                </div>
                                {artwork?.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {artwork.tags.map((tag, index) => (
                                            <span key={index} className="rounded-[4px] px-3 py-1 text-xs border border-white/[0.06] text-kcb-sable font-medium bg-kcb-ardoise">{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* INFOS */}
                            <div className="flex-1 flex flex-col gap-6 justify-between">
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        {artwork?.artist?.image && (
                                            <Link to={`/artist/${artwork.artist?._id}`}>
                                                <img src={artwork.artist.image} alt={artwork.artist.name} className="w-12 h-12 rounded-full object-cover border-2 border-kcb-or/30 shadow" />
                                            </Link>
                                        )}
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-center">
                                                <h1 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-1 leading-tight tracking-tight">{artwork?.title}</h1>
                                                <button onClick={launchDescriptionSpeech} className="py-2 px-4 rounded-[4px] bg-white text-black">
                                                    <Volume2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {artwork?.artist?.name && (
                                                <span className="text-kcb-pierre text-sm flex items-center gap-1">par <span className="text-white font-semibold">{artwork.artist.name}</span> <span className="inline-block bg-green-600/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full ml-1">Artiste vérifié</span></span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="border border-kcb-or/20 rounded-[4px] p-6 bg-kcb-ardoise flex flex-col gap-3 shadow-xl mt-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-playfair text-2xl text-white font-semibold">{artwork?.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} {artwork?.currency}</span>
                                            <Link
                                                to={`/artwork-checkout/${artwork?._id}`}
                                                className="rounded-[4px] bg-kcb-or text-sm hover:bg-kcb-bronze transition text-kcb-noir font-semibold px-5 py-2 flex items-center gap-2 shadow focus:outline-none focus:ring-2 focus:ring-kcb-or uppercase tracking-[0.05em]"
                                            >
                                                <ShoppingCart className="w-5 h-5" /> Acheter
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-kcb-pierre">Paiement sécurisé</span>
                                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <h2 className="text-lg font-semibold text-white mb-1">Détails</h2>
                                        <ul className="text-sm text-kcb-sable space-y-1">
                                            <li className="flex justify-between"><span>Artiste</span><span className="text-white">{artwork?.artist?.name}</span></li>
                                            <li className="flex justify-between"><span>Créé le</span><span className="text-white">{new Date(artwork?.created).toLocaleDateString()}</span></li>
                                            <li className="flex justify-between"><span>Catégorie</span><span className="text-white">{artwork?.category}</span></li>
                                            <li className="flex justify-between"><span>Certificat</span><span className="text-white underline">{artwork?.certificatePath ? <a href={artwork?.certificatePath} target="_blank" rel="noopener noreferrer">Voir le certificat</a> : "À venir"}</span></li>
                                        </ul>
                                    </div>
                                    <div className="mt-4">
                                        <h2 className="text-lg font-semibold text-white mb-1">Description</h2>
                                        <p id="artwork-description" className="text-kcb-sable text-sm text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(artwork?.description ?? '') }}></p>
                                    </div>

                                    {/* Bouton expédition transfrontalière */}
                                    {user && (
                                        <div className="mt-4">
                                            <button
                                                onClick={() => setShipmentOpen(true)}
                                                className="flex items-center gap-2 text-sm px-4 py-2 rounded-[4px] border border-kcb-or/30 text-kcb-or hover:bg-kcb-or/5 transition w-full justify-center"
                                            >
                                                <Truck className="w-4 h-4" />
                                                Demander l'expédition transfrontalière
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                    </RevealOnScroll>

                    {/* Modal expédition */}
                    {user && (
                        <RequestShipmentModal
                            artwork={artwork}
                            isOpen={shipmentOpen}
                            onClose={() => setShipmentOpen(false)}
                        />
                    )}
                    </>
                )}
                {artwork?.error && (
                    <div className="text-center py-12 px-6 border border-dashed border-white/[0.06] rounded-[4px] bg-kcb-ardoise/30 mt-10">
                        <Image className="w-16 h-16 mx-auto mb-4 text-kcb-pierre" />
                        <h2 className="text-lg font-semibold mb-2 text-white">Œuvre indisponible</h2>
                        <div className="my-6">
                            <Link to="/explore" className="bg-kcb-or hover:bg-kcb-bronze rounded-[4px] py-2 px-4 text-kcb-noir font-semibold transition uppercase tracking-[0.05em] text-sm">Aller sur la marketplace</Link>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
