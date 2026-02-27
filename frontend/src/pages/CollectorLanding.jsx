import { lazy, Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
    Shield, 
    ArrowRight,
    FileStack,
    Award,
    ChartLine,
    NotepadText,
    Image,
    CreditCard,
    Package,
} from "lucide-react";
import { useArtworks } from "../store/ArtworkContext";
import { useArtist } from "../store/ArtistContext";
const FeaturedCarousel = lazy(() => import('../components/decoratives/FeaturedCarousel'))
const FeaturedArtists = lazy(() => import('../components/decoratives/FeaturedArtists'))
import { useState } from "react";
import { DataLoader } from "../components/loaders/PageLoader";
import RevealOnScroll from "../components/decoratives/RevealOnScroll";

export default function CollectorLanding () {
  const { featured } = useArtworks();
  const { featuredArtists } = useArtist();
  const featuredArtistsWithImage = featuredArtists?.filter(item => item?.image && item?.image != 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg')
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
    <main className="relative min-h-screen bg-gray-900 text-white pb-8">
      {/* Minimal background gradients */}
      <div className="fixed top-1/3 right-0 w-80 h-80 bg-gray-900/40 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 left-0 w-60 h-60 bg-gray-800/30 rounded-full blur-3xl -z-10"></div>
      <RevealOnScroll>
      {/* Carousel d'oeuvres minimaliste */}
      <section className="w-full mx-auto">
        {featuredArtists?.length > 0 && (
          <Suspense fallback={<DataLoader />}>
            <FeaturedCarousel artworks={featured?.slice(0, 6) || []} />
          </Suspense>
        )}
      </section>
      </RevealOnScroll>
      
      <RevealOnScroll>
      {/* Artistes en vedette - minimal */}
      <section className="w-full mx-auto py-4 px-2 flex flex-col gap-4 shadow-lg">
        <h3 className="text-2xl font-semibold text-center mb-2 tracking-tight">Artistes en vedette</h3>
        <Suspense fallback={<DataLoader />}>
          <FeaturedArtists artists={featuredArtistsWithImage?.slice(0, 4)} />
        </Suspense>
      </section>
      </RevealOnScroll>
      
      <RevealOnScroll>
      {/* Ventes aux enchères minimalistes */}
      {featured?.length > 0 && (
        <section className="w-full mx-auto py-8 px-8 lg:max-w-6xl flex flex-col gap-4 bg-gray-900 rounded-2xl shadow-lg border border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">Ventes aux enchères</h2>
            <Link
              className="px-4 py-2 rounded-md bg-gray-800 text-white font-medium hover:bg-gray-700 transition"
              to="/explore"
            >
              Voir toutes les enchères <ArrowRight className="inline w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured?.slice(9, 12)?.map((item, index) => (
              <Link
                to={`/artwork/${item._id}`}
                key={index}
                className="flex flex-col bg-gray-900 rounded-xl border border-gray-800 shadow hover:shadow-lg hover:scale-[1.02] transition p-3 min-h-[320px]"
              >
                <div className="w-full h-40 rounded-lg overflow-hidden mb-3 bg-gray-900 flex items-center justify-center">
                  <img
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                    src={item?.image}
                    alt={item.title}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-base font-semibold mb-1 truncate">{item.title}</p>
                    <p className="text-sm text-gray-400 mb-2">Prix de départ : <span className="font-bold text-white">{item.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} {item.currency}</span></p>
                  </div>
                  {item.endTime && (
                    <div className="mt-2">
                      <Countdown endDate={new Date(item.endTime)} />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      </RevealOnScroll>

      <RevealOnScroll>
      {/* Avantages minimalistes */}
      <section className="w-full lg:max-w-6xl mx-auto py-8 px-8 lg:px-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="flex flex-col items-center bg-gray-900 rounded-xl p-6 border border-gray-800 shadow">
          <FileStack className="text-forest h-10 w-10 mb-2" />
          <h4 className="text-base font-semibold mb-1">Sélection exclusive</h4>
          <p className="text-xs text-gray-400 text-center">Des œuvres rares, choisies avec soin pour les vrais passionnés.</p>
        </div>
        <div className="flex flex-col items-center bg-gray-900 rounded-xl p-6 border border-gray-800 shadow">
          <Award className="text-clay h-10 w-10 mb-2" />
          <h4 className="text-base font-semibold mb-1">Certificat numérique</h4>
          <p className="text-xs text-gray-400 text-center">Authenticité garantie, chaque œuvre est certifiée sur la blockchain.</p>
        </div>
        <div className="flex flex-col items-center bg-gray-900 rounded-xl p-6 border border-gray-800 shadow">
          <ChartLine className="text-kente h-10 w-10 mb-2" />
          <h4 className="text-base font-semibold mb-1">Suivi de valorisation</h4>
          <p className="text-xs text-gray-400 text-center">Votre collection prend de la valeur, suivez-la en temps réel.</p>
        </div>
        <div className="flex flex-col items-center bg-gray-900 rounded-xl p-6 border border-gray-800 shadow">
          <Shield className="text-green-500 h-10 w-10 mb-2" />
          <h4 className="text-base font-semibold mb-1">Paiement sécurisé</h4>
          <p className="text-xs text-gray-400 text-center">Transactions protégées, confidentialité assurée.</p>
        </div>
      </section>
      </RevealOnScroll>

      <RevealOnScroll>
      {/* Services additionnels minimalistes */}
      <section className="w-full mx-auto lg:max-w-4xl py-8 px-2 flex items-center flex-col md:flex-row gap-6 mt-8">
        <div className="my-auto">
          <img
            loading="lazy"
            src={"/images/collector/services.png"}
            alt="Art collector"
            className="w-full lg:max-w-sm max-w-md rounded-xl object-cover object-center opacity-90 shadow"
          />
        </div>
        <div className="flex-1 flex flex-col gap-4 max-w-md">
          <div className="flex flex-col max-w-lg bg-gray-900 rounded-xl p-5 border border-gray-800 shadow">
            <div className="flex items-center gap-3 mb-2">
              <img loading="lazy" src="/images/svg/transport_securise.svg" alt="Logistique" className="w-10 h-10 rounded object-contain" />
              <span className="text-base font-semibold">Logistique</span>
            </div>
            <p className="text-xs text-gray-400 mb-2">Transport sécurisé, partout où vos œuvres doivent aller.</p>
            <Link
              target="_blank"
              to="https://calendly.com/kucibok221/support-assurance"
              className="inline-block px-4 py-2 rounded-md bg-gray-800 text-white font-medium hover:bg-gray-700 transition text-xs"
            >Organiser</Link>
          </div>
          <div className="flex flex-col max-w-lg bg-gray-900 rounded-xl p-5 border border-gray-800 shadow">
            <div className="flex items-center gap-3 mb-2">
              <img loading="lazy" src="/images/svg/protegez_acquisition.svg" alt="Assurance" className="w-10 h-10 rounded object-contain" />
              <span className="text-base font-semibold">Assurance</span>
            </div>
            <p className="text-xs text-gray-400 mb-2">Protégez vos acquisitions avec nos partenaires de confiance.</p>
            <Link
              target="_blank"
              to="https://calendly.com/kucibok221/support-assurance"
              className="inline-block px-4 py-2 rounded-md bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-300 transition text-xs"
            >Simuler</Link>
          </div>
        </div>
      </section>
      </RevealOnScroll>
      <RevealOnScroll>
      {/* Comment ça marche - minimaliste */}
      <section className="w-full max-w-3xl mx-auto py-8 px-8 lg:px-2 mt-8">
        <h2 className="text-xl font-semibold text-center mb-4">Comment ça marche ?</h2>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: <NotepadText className="w-7 h-7 text-yellow-400" />,
              title: "Inscrivez-vous",
              desc: "Créez votre compte collecteur en quelques clics.",
            },
            {
              icon: <Image className="w-7 h-7 text-green-400" />,
              title: "Explorez",
              desc: "Découvrez des œuvres uniques et inspirantes.",
            },
            {
              icon: <CreditCard className="w-7 h-7 text-yellow-400" />,
              title: "Achetez",
              desc: "Payez en toute sécurité, simplement.",
            },
            {
              icon: <Package className="w-7 h-7 text-green-400" />,
              title: "Recevez",
              desc: "Vos œuvres et certificats vous attendent.",
            },
          ].map((step, i) => (
            <li key={i} className="flex items-center gap-3 bg-gray-900 rounded-lg p-4 border border-gray-800 shadow">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 mr-2">{step.icon}</div>
              <div>
                <h3 className="text-base font-semibold mb-1">{step.title}</h3>
                <p className="text-xs text-gray-400">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      </RevealOnScroll>
      
      <RevealOnScroll>
      {/* Appel à l'action minimaliste */}
      <section className="w-full lg:max-w-2xl max-w-xl mx-auto py-12 px-2 mt-8 text-center bg-gray-900 rounded-2xl shadow-lg border border-gray-800">
        <h2 className="text-xl font-semibold mb-3">Prêt à commencer votre collection ?</h2>
        <p className="text-sm text-gray-400 mb-6">Rejoignez notre communauté de collectionneurs passionnés et découvrez des œuvres uniques.</p>
        <Link to="/sign-up" className="inline-block px-6 py-3 rounded-md bg-gray-800 text-white font-medium hover:bg-gray-700 transition">Créer un compte collectionneur</Link>
      </section>
      </RevealOnScroll>
    </main>
    </>
    )
}


function Countdown({ endDate }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diffMs = endDate - new Date();
    return diffMs > 0 ? diffMs : 0;
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const next = endDate - new Date();
        return next > 0 ? next : 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate, timeLeft]);

  if (timeLeft <= 0) {
    return (
      <div className="mt-2 text-xs font-semibold text-red-700 bg-red-100 rounded px-2 py-1 inline-block">
        ⏳ Terminé
      </div>
    );
  }

  const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
  const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

  return (
    <div className="mt-2 text-xs font-semibold text-blue-700 bg-blue-100 rounded px-2 py-1 inline-block">
      ⏳ Fin dans : {days}j {hours}h {minutes}m {seconds}s
    </div>
  );
}

const advantages = [
  {
    backgroundColor : "forest/10",
    icon : <FileStack className="text-forest h-10 w-10" />,
    text : "Sélection exclusive"
  },
  {
    backgroundColor : "clay/10",
    icon : <Award className="text-clay h-10 w-10" />,
    text : " Certificat numérique "
  },
  {
    backgroundColor : "kente/10",
    icon : <ChartLine className="text-kente h-10 w-10" />,
    text : "Suivi de valorisation"
  },
  {
    backgroundColor : "green-500/10",
    icon : <Shield className="text-green-500 h-10 w-10" />,
    text : " Paiement sécurisé"
  },
]