import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useArtworks } from "../store/ArtworkContext";
import { Award, BarChart4, Truck, FileCheck, Monitor, Search, Handshake, Ruler, Gem } from "lucide-react";
import RevealOnScroll from "../components/decoratives/RevealOnScroll";

export default function ProfessionalLanding() {
  const { featured } = useArtworks();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Background blobs with brand colors */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-kcb/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[320px] h-[320px] bg-purple-kcb/20 rounded-full blur-2xl"></div>
      </div>

      <RevealOnScroll>
      {/* Hero section */}
      <section className="w-full max-w-5xl mx-auto pt-16 pb-8 px-4 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Optimisez la gestion et la vente de votre collection d’art avec <span className="text-purple-kcb">Kucibok</span>
          </h1>
          <p className="text-base text-white/70 mb-6 max-w-lg mx-auto md:mx-0">
            Solution SaaS pour <span className="text-purple-kcb font-semibold">cataloguer</span>, <span className="text-amber-300 font-semibold">certifier</span>, <span className="text-white font-semibold">vendre</span>, <span className="text-emerald-200 font-semibold">transporter</span> et <span className="text-indigo-300 font-semibold">suivre</span> vos œuvres d’art en un seul espace.
          </p>
          <div className="flex gap-3 justify-center md:justify-start">
            <Link to="https://calendly.com/kucibok221/support-assurance" className="bg-purple-kcb text-white text-sm px-5 py-2 rounded-md font-semibold shadow hover:bg-purple-kcb/80 transition">Demander une démo</Link>
            <Link to="/sign-up" className="px-5 py-2 rounded-md text-sm border border-indigo-kcb text-white hover:bg-indigo-kcb/80 transition">Accéder à votre tableau de bord</Link>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img src="/images/homepage/collector-hero.jpeg" alt="Gestion d'art professionnel" className="w-full max-w-xs rounded-2xl shadow-lg object-cover" />
        </div>
      </section>
      </RevealOnScroll>

      <RevealOnScroll>
      {/* Avantages minimalistes modernisés */}
      <section className="py-12 px-8 lg:px-2 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Avantages pour les professionnels</h2>
          <p className="text-white/60 text-base">Pourquoi choisir Kucibok pour la gestion de votre entreprise ou galerie</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {proAdvantages.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 bg-gradient-to-b from-gray-900/80 to-gray-950/90 rounded-2xl p-5 border border-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-200 group"
            >
              <div
                className={`w-14 h-14 ${item.background} rounded-full flex items-center justify-center mb-1 shadow-inner group-hover:scale-105 transition-transform`}
              >
                {item.icon}
              </div>
              <h4 className="text-base font-semibold text-white text-center tracking-tight group-hover:text-purple-kcb transition-colors">
                {item.title}
              </h4>
            </div>
          ))}
        </div>
      </section>
      </RevealOnScroll>
      
      <RevealOnScroll>
      {/* Services minimalistes modernisés */}
      <section className="py-10 px-8 lg:px-2 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Services logistiques & administratifs</h2>
          <p className="text-white/60">Des services sur-mesure pour la gestion et la valorisation de vos œuvres</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: "🖨", title: "Numérisation haute qualité", desc: "Confiez-nous vos œuvres pour les numériser en studio et les intégrer.", btn: "Demander une numérisation", color: "bg-amber-600 hover:bg-amber-700" },
            { icon: "🔐", title: "Certification numérique & puces NFC", desc: "Assurez la traçabilité de vos œuvres grâce à nos certificats et puces intelligentes.", btn: "Créer un certificat", color: "bg-purple-kcb hover:bg-purple-kcb/80" },
            { icon: "🚚", title: "Logistique spécialisée art", desc: "Demandez l’emballage, le transport, l’assurance et le stockage sécurisé.", btn: "Commander une logistique", color: "bg-emerald-600 hover:bg-emerald-700" },
          ].map((service, i) => (
            <div key={i} className="flex flex-col items-center bg-gray-900 rounded-xl p-6 border border-gray-800 shadow text-center">
              <div className="w-12 h-12 bg-indigo-kcb/20 rounded-full flex items-center justify-center text-2xl mb-3">{service.icon}</div>
              <h3 className="text-base font-semibold mb-1">{service.title}</h3>
              <p className="text-xs text-white/60 mb-3">{service.desc}</p>
              <Link to="/sign-up" className={`px-4 py-1 rounded-full ${service.color} text-white text-xs font-medium shadow transition`}>{service.btn}</Link>
            </div>
          ))}
        </div>
      </section>
      </RevealOnScroll>

      <RevealOnScroll>
      {/* Outils intégrés minimalistes */}
      <section className="py-10 px-8 lg:px-2 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">🧰 Vos outils intégrés pour gérer</h2>
          <p className="text-white/60">Kucibok intègre une boîte à outils complète pour les professionnels.<br />Accédez facilement à des fonctionnalités avancées pour :</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            "Gérer et publier votre catalogue d’œuvres",
            "Suivre vos ventes et la visibilité de vos collections",
            "Générer des certificats d’authenticité numériques",
            "Intégrer des puces NFC pour la traçabilité",
            "Exporter vos données (PDF, Excel)",
            "Tout est centralisé dans votre tableau de bord."
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-900 rounded-xl p-4 border border-gray-800 shadow text-white">
              <span className="text-2xl">{["📂","📈","🧾","📡","⬇️","➡"][i]}</span>
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <Link to="/sign-up" className="px-6 py-2 rounded-full bg-purple-kcb text-white font-semibold shadow hover:bg-purple-kcb/80 transition">Accéder à mes outils</Link>
        </div>
      </section>
      </RevealOnScroll>
      
      <RevealOnScroll>
      {/* Pour qui ? minimaliste */}
      <section className="py-10 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Pour qui ?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { icon: "🏛", label: "Galeries & maisons de vente" },
            { icon: "🧠", label: "Experts & conservateurs" },
            { icon: "📚", label: "Fondations & musées" },
            { icon: "🏢", label: "Entreprises et mécènes" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center bg-gray-900 rounded-xl p-5 border border-gray-800 shadow">
              <span className="text-3xl mb-1">{item.icon}</span>
              <p className="font-medium text-center text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
      </RevealOnScroll>
    
      <RevealOnScroll>
      {/* Appel à l'action minimaliste */}
      <section className="py-12 px-8 lg:px-2 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Une solution à votre image, évolutive et sécurisée</h2>
        <p className="text-base text-white/60 mb-6">Contactez notre équipe pour une démonstration personnalisée et découvrez comment <span className="text-purple-kcb font-semibold">Kucibok</span> peut s’adapter à vos processus métier.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="https://calendly.com/kucibok221/support-assurance" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-purple-kcb text-white font-semibold shadow hover:bg-purple-kcb/80 transition">Réserver un créneau avec un conseiller</a>
          <a  href="/documents/brochure-kucibok.pdf" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border border-indigo-kcb text-white hover:bg-indigo-kcb/80 transition">Recevoir une brochure PDF</a>
        </div>
      </section>
      </RevealOnScroll>

      <RevealOnScroll>
      {/* Oeuvres en vogue minimalistes */}
      {featured?.length > 0 && (
        <section className="py-10 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-purple-kcb mb-2 text-center">Oeuvres en vogue</h2>
          <p className="text-base text-white/60 mb-6 text-center">Découvrez une sélection d’œuvres remarquables, choisies pour vous.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 8).map((item, index) => (
              <Link
                key={item._id}
                to={`/artwork/${item._id}`}
                className="group flex flex-col bg-gradient-to-b from-gray-900/80 to-gray-950/90 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-3 gap-2 border border-gray-800 hover:border-purple-kcb/40"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="overflow-hidden rounded-md mb-1">
                  <img
                    loading="lazy"
                    className="w-full h-[160px] object-cover group-hover:scale-105 transition-transform duration-300"
                    src={item.image}
                    alt={item.title}
                  />
                </div>
                <div className="py-1 px-1 text-white">
                  <p className="font-serif font-bold text-base group-hover:text-purple-kcb transition-colors duration-200">{item.title}</p>
                  <p className="my-1 font-semibold text-xs">Prix : <span className="text-white/80">{item.price?.toLocaleString('fr-FR').replace(/\s/g, ' ')} {item.currency}</span></p>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Link to="/explore" className="px-6 py-2 rounded-full bg-purple-kcb text-white font-semibold shadow hover:bg-purple-kcb/80 transition">Explorer toutes les œuvres</Link>
          </div>
        </section>
      )}
      </RevealOnScroll>
    </main>
  );
}

const proAdvantages = [
  {
    icon: <Gem className="text-purple-kcb h-10 w-10" />,
    background : "bg-purple-kcb/10",
    title: "Base de données culturelle",
  },
  {
    icon: <Handshake className="text-indigo-kcb h-10 w-10" />,
    background : "bg-indigo-kcb/10",
    title: "Certification & Expertise",
  },
  {
    icon: <Search className="text-amber-300 h-10 w-10" />,
    background : "bg-amber-300/10",
    title: "Recherche Optimisée",
  },
  {
    icon: <Truck className="text-emerald-400 h-10 w-10" />,
    background : "bg-emerald-400/10",
    title: "Service de livraison",
  },
  {
    icon: <Ruler className="text-indigo-kcb h-10 w-10" />,
    background : "bg-indigo-kcb/10",
    title: "Outils de gestion d’inventaire",
  },
  {
    icon: <BarChart4 className="text-purple-kcb h-10 w-10" />,
    background : "bg-purple-kcb/10",
    title: "Suivi des Tendances",
  },
];