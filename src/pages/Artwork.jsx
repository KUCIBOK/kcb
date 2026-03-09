import { ArrowLeft, Image, Share, ShoppingCart, Volume2, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getArtworkById } from "../api/useArtworks";
import { useToast } from "../store/ToastContext";
import { useAuth } from "../store/AuthContext";
import { DataLoader } from "../components/loaders/PageLoader";
import { getArtistById } from "../api/useArtists";
import { Helmet } from "react-helmet";
import { RequestShipmentModal } from "../components/artworks/RequestShipmentModal";

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
                    <Link to={-1} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium">
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
                    <section className="w-full animate-fade-in">
                        <div className="flex flex-col md:flex-row gap-10">
                            {/* IMAGE + SHARE */}
                            <div className="md:w-7/12 w-full flex flex-col items-center md:items-start">
                                <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 shadow-lg">
                                    <img
                                        src={artwork?.image}
                                        alt={artwork?.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                    <button
                                        className="absolute top-3 right-3 bg-gray-800/80 hover:bg-gray-900/90 rounded-full p-2 text-gray-300 border border-gray-700 shadow"
                                        onClick={() => { navigator.clipboard.writeText(window.location.href); makeToast('Lien copié !', 'success'); }}
                                        title="Partager"
                                    >
                                        <Share className="w-5 h-5" />
                                    </button>
                                </div>
                                {artwork?.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {artwork.tags.map((tag, index) => (
                                            <span key={index} className="rounded-full px-3 py-1 text-xs border border-gray-700 text-gray-300 font-medium bg-gray-800/60">{tag}</span>
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
                                                <img src={artwork.artist.image} alt={artwork.artist.name} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-kcb shadow" />
                                            </Link>
                                        )}
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-center">
                                                <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-1 leading-tight tracking-tight">{artwork?.title}</h1>
                                                <button onClick={launchDescriptionSpeech} className="py-2 px-4 rounded bg-white text-black">
                                                    <Volume2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {artwork?.artist?.name && (
                                                <span className="text-gray-400 text-sm flex items-center gap-1">par <span className="text-white font-semibold">{artwork.artist.name}</span> <span className="inline-block bg-green-600/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full ml-1">Artiste vérifié</span></span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="border border-indigo-kcb/30 rounded-lg p-6 bg-gray-900/95 flex flex-col gap-3 shadow-xl mt-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-serif text-2xl text-white font-semibold">{artwork?.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} {artwork?.currency}</span>
                                            <Link
                                                to={`/artwork-checkout/${artwork?._id}`}
                                                className="rounded-sm bg-indigo-kcb text-md hover:bg-indigo-kcb/90 transition text-white font-medium px-5 py-2 flex items-center gap-2 shadow focus:outline-none focus:ring-2 focus:ring-indigo-kcb"
                                            >
                                                <ShoppingCart className="w-5 h-5" /> Acheter
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-400">Paiement sécurisé</span>
                                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <h2 className="text-lg font-semibold text-white mb-1">Détails</h2>
                                        <ul className="text-sm text-gray-300 space-y-1">
                                            <li className="flex justify-between"><span>Artiste</span><span className="text-white">{artwork?.artist?.name}</span></li>
                                            <li className="flex justify-between"><span>Créé le</span><span className="text-white">{new Date(artwork?.created).toLocaleDateString()}</span></li>
                                            <li className="flex justify-between"><span>Catégorie</span><span className="text-white">{artwork?.category}</span></li>
                                            <li className="flex justify-between"><span>Certificat</span><span className="text-white underline">{artwork?.certificatePath ? <a href={artwork?.certificatePath} target="_blank" rel="noopener noreferrer">Voir le certificat</a> : "À venir"}</span></li>
                                        </ul>
                                    </div>
                                    <div className="mt-4">
                                        <h2 className="text-lg font-semibold text-white mb-1">Description</h2>
                                        <p id="artwork-description" className="text-gray-300 text-sm text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: artwork?.description }}></p>
                                    </div>

                                    {/* Bouton expédition transfrontalière */}
                                    {user && (
                                        <div className="mt-4">
                                            <button
                                                onClick={() => setShipmentOpen(true)}
                                                className="flex items-center gap-2 text-sm px-4 py-2 rounded-md border border-indigo-700/50 text-indigo-300 hover:bg-indigo-900/20 transition w-full justify-center"
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
                    <div className="text-center py-12 px-6 border border-dashed border-gray-700 rounded-xl bg-gray-900/70 mt-10">
                        <Image className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                        <h2 className="text-lg font-semibold mb-2 text-white">Œuvre indisponible</h2>
                        <div className="my-6">
                            <Link to="/explore" className="bg-indigo-kcb hover:bg-indigo-kcb/90 rounded-md py-2 px-4 text-white font-medium transition">Aller sur la marketplace</Link>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
