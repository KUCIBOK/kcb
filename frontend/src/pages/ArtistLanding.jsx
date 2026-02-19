import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Paintbrush,
  Users,
  TrendingUp,
  Lock,
  Earth,
  Truck,
  Palette,
  FolderOpen,
  Sparkles,
  FileText,
  Shield,
  Gem,
  Smartphone,
  RotateCcw,
  User,
  Image,
  DollarSign,
  Package,
  Wrench,
  BarChart3,
  Receipt,
  Radio,
  Hammer,
  ArrowRight,
} from "lucide-react";
import { InfiniteCarousel } from "../components/decoratives/InfiniteCarousel";
import RevealOnScroll from "../components/decoratives/RevealOnScroll";

export default function ArtistLanding() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
              <span className="text-indigo-kcb">Kucibok</span> connecte votre
              art au <span className="text-purple-kcb">monde</span>
            </h1>
            <p className="text-base text-white/70 mb-6 max-w-lg mx-auto md:mx-0">
              Rejoignez la communauté d’artistes africains et accédez à des
              outils professionnels pour créer, certifier et vendre vos œuvres
              en toute autonomie.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <Link
                to="/sign-up"
                className="bg-indigo-kcb text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-indigo-kcb/80 transition"
              >
                Démarrez en tant qu'artiste
              </Link>
              <Link
                to="/explore"
                className="px-5 py-2 rounded-full border border-purple-kcb text-white hover:bg-purple-kcb/80 transition"
              >
                Explorer les œuvres
              </Link>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img
              loading="lazy"
              src="/images/homepage/artist-hero.jpeg"
              alt="African digital artist"
              className="w-full max-w-xs rounded-2xl shadow-lg object-cover"
            />
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        {/* Avantages minimalistes modernisés */}
        <section className="py-12 px-8 lg:px-2 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">
              Avantages pour les artistes
            </h2>
            <p className="text-white/60 text-base">
              Pourquoi choisir Kucibok pour votre carrière
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {advantages.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 bg-gradient-to-b from-gray-900/80 to-gray-950/90 rounded-2xl p-5 border border-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-200 group"
              >
                <div
                  className={`w-14 h-14 ${item.background} rounded-full flex items-center justify-center mb-1 shadow-inner group-hover:scale-105 transition-transform`}
                >
                  {item.icon}
                </div>
                <h4 className="text-base font-semibold text-white text-center tracking-tight group-hover:text-indigo-kcb transition-colors">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        {/* Passeport Artistique Express Section */}
        <section className="py-16 px-8 lg:px-2 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Colonne gauche - Contenu */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white flex items-center gap-3">
                  <Palette className="text-indigo-kcb h-8 w-8" />
                  <span className="text-indigo-kcb">
                    Passeport Artistique Express
                  </span>
                </h1>
                <h2 className="text-xl md:text-2xl text-white/80 mb-6 font-medium">
                  Un certificat, un QR code, une œuvre valorisée.
                </h2>
              </div>

              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                <p className="text-white/90 mb-6 leading-relaxed">
                  Avec Kucibok, authentifier une œuvre devient aussi simple que
                  de la signer. En un clic, générez un PDF premium horodaté,
                  intégrant toutes les informations essentielles : artiste,
                  titre, date, numéro unique et QR code menant vers la fiche
                  publique de l'œuvre.
                </p>

                {/* Comment ça marche - 3 étapes */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Comment ça marche :
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        step: "1",
                        text: "Ajoutez ou sélectionnez l'œuvre depuis votre espace artiste",
                        icon: (
                          <FolderOpen className="h-5 w-5 text-indigo-kcb" />
                        ),
                      },
                      {
                        step: "2",
                        text: "Cliquez sur « Certifier »",
                        icon: <Sparkles className="h-5 w-5 text-indigo-kcb" />,
                      },
                      {
                        step: "3",
                        text: "Téléchargez ou partagez votre certificat officiel",
                        icon: <FileText className="h-5 w-5 text-indigo-kcb" />,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-indigo-kcb rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {item.step}
                        </div>
                        <div className="flex items-center justify-center w-8 h-8">
                          {item.icon}
                        </div>
                        <span className="text-white/90 text-sm">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <Link
                    to="/sign-up"
                    className="inline-block bg-gradient-to-r from-indigo-kcb to-purple-kcb text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    Obtenir mon Passeport Artistique
                  </Link>
                  <p className="text-white/60 text-sm mt-2">
                    Disponible dès maintenant pour tous les artistes inscrits
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne droite - Visuel */}
            <div className="flex flex-col items-center space-y-6">
              {/* Mockup certificat */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="absolute top-4 right-4">
                  <span className="bg-indigo-kcb text-white text-xs px-2 py-1 rounded-full font-medium">
                    Bêta 2025
                  </span>
                </div>

                <div className="text-center mb-6">
                  <div className="text-indigo-kcb font-bold text-lg mb-2">
                    CERTIFICAT D'AUTHENTICITÉ
                  </div>
                  <div className="h-px bg-gray-300 mb-4"></div>
                  <div className="text-gray-800 space-y-2">
                    <p className="font-semibold">
                      Œuvre : "Masque Traditionnel Digital"
                    </p>
                    <p>Artiste : Jean Kouassi</p>
                    <p>Date : 15 Août 2025</p>
                    <p>N° : KCB-2025-001234</p>
                  </div>
                </div>

                {/* QR Code mockup */}
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-white text-xs">QR CODE</div>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-600">
                  <p>Scannez pour voir l'œuvre</p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-indigo-kcb font-bold">KUCIBOK</div>
                    <div className="text-gray-500">
                      Horodaté le 15/08/2025 à 14:30 UTC
                    </div>
                  </div>
                </div>
              </div>

              {/* Note de réassurance */}
              <div className="bg-gray-900/30 rounded-xl p-4 text-center max-w-md">
                <p className="text-white/70 text-sm flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4 text-indigo-kcb" />
                  Tous les certificats sont stockés de manière sécurisée et
                  horodatés pour garantir leur authenticité.
                </p>
                <p className="text-white/50 text-xs mt-2">
                  Service en version bêta 2025.
                </p>
              </div>
            </div>
          </div>

          {/* Bandeau avantages */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="h-8 w-8 text-indigo-kcb" />,
                title: "Authenticité garantie",
                desc: "Certificat horodaté et sécurisé",
              },
              {
                icon: <Gem className="h-8 w-8 text-purple-kcb" />,
                title: "Valorisation",
                desc: "Renforce la confiance et la valeur de vos œuvres",
              },
              {
                icon: <Smartphone className="h-8 w-8 text-blue-500" />,
                title: "Partage facile",
                desc: "QR code menant directement à la fiche publique",
              },
              {
                icon: <RotateCcw className="h-8 w-8 text-green-500" />,
                title: "Accessibilité",
                desc: "Téléchargeable et consultable à tout moment",
              },
            ].map((advantage, index) => (
              <div
                key={index}
                className="bg-gray-900/40 rounded-xl p-6 border border-gray-800 text-center hover:bg-gray-900/60 transition-all"
              >
                <div className="flex justify-center mb-3">{advantage.icon}</div>
                <h4 className="text-white font-semibold mb-2">
                  {advantage.title}
                </h4>
                <p className="text-white/70 text-sm">{advantage.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        {/* Témoignages */}
        <ArtistTestimonialsSection />
      </RevealOnScroll>

      <RevealOnScroll>
        {/* Étapes minimalistes */}
        <section className="py-6 px-8 lg:px-2 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Étapes pour démarrer</h2>
            <p className="text-white/60">
              Découvrez comment devenir artiste sur Kucibok en 4 étapes simples
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <User className="h-6 w-6 text-indigo-kcb" />,
                title: "Créez votre compte gratuitement",
                desc: "Créez un profil en quelques clics et remplissez votre fiche artiste.",
                btn: "Créer mon profil",
              },
              {
                icon: <Image className="h-6 w-6 text-purple-kcb" />,
                title: "Téléversez votre œuvre",
                desc: "Ajoutez vos œuvres ou collections, renseignez les informations (titre, format, histoire.)",
                btn: "Ajouter une œuvre",
              },
              {
                icon: <DollarSign className="h-6 w-6 text-green-500" />,
                title: "Vendez et engagez votre public",
                desc: "Vos œuvres sont visibles par les collectionneurs. Participez à des ventes aux enchères ou fixez votre propre prix.",
                btn: "Gérer mes ventes",
              },
              {
                icon: <Package className="h-6 w-6 text-blue-500" />,
                title: "Recevez vos paiements",
                desc: "Vous êtes payé rapidement et en toute sécurité. Vous gagnez également une commission sur les ventes secondaires grâce à notre système de royalties intégrées.",
                btn: "Activer mes services",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center bg-gray-900 rounded-xl p-6 border border-gray-800 shadow text-center"
              >
                <div className="w-12 h-12 bg-indigo-kcb/20 rounded-full flex items-center justify-center mb-3">
                  {step.icon}
                </div>
                <h3 className="text-base font-semibold mb-1">{step.title}</h3>
                <p className="text-xs text-white/60 mb-3">{step.desc}</p>
                <Link
                  to="/sign-up"
                  className="px-4 py-1 rounded-full bg-purple-kcb text-white text-xs font-medium shadow hover:bg-purple-kcb/80 transition"
                >
                  {step.btn}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        {/* Outils intégrés minimalistes */}
        <section className="py-10 px-8 lg:px-2 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-3">
              <Wrench className="h-6 w-6 text-indigo-kcb" />
              Vos outils intégrés pour réussir
            </h2>
            <p className="text-white/60">
              Kucibok intègre une boîte à outils complète directement dans votre
              espace artiste.
              <br />
              Accédez facilement à des fonctionnalités professionnelles pour :
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              "Gérer et publier votre catalogue d’œuvres",
              "Suivre vos ventes et la visibilité de vos créations",
              "Générer des certificats d’authenticité numériques",
              "Intégrer des puces NFC pour la traçabilité de vos œuvres",
              "Préparer et suivre vos ventes aux enchères",
              "Tout est centralisé dans votre tableau de bord.",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-900 rounded-xl p-4 border border-gray-800 shadow text-white"
              >
                <span className="text-2xl">
                  {["📂", "📈", "🧾", "📡", "🔨", "➡"][i]}
                </span>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link
              to="/sign-up"
              className="px-6 py-2 rounded-full bg-indigo-kcb text-white font-semibold shadow hover:bg-indigo-kcb/80 transition"
            >
              Accéder à mes outils
            </Link>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        {/* Appel à l'action minimaliste */}
        <section className="py-12 px-8 lg:px-2 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Prêt à partager votre art ?
          </h2>
          <p className="text-base text-white/60 mb-6">
            Rejoignez notre communauté grandissante d'artistes numériques
            africains qui façonnent l'avenir de l'art NFT.
          </p>
          <Link
            to="/sign-up"
            className="p-2 rounded-full bg-purple-kcb text-white font-semibold shadow hover:bg-purple-kcb/80 transition text-sm"
          >
            Commencez votre parcours d'artiste
          </Link>
        </section>
      </RevealOnScroll>

      {/* Animations et styles custom */}
      <style>{`
        .animate-gradient-text {
        background: linear-gradient(90deg, #7072c5, #b132a7, #7072c5);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradient-move 4s ease-in-out infinite;
        }
        @keyframes gradient-move {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
        }
        .drop-shadow-glow {
        filter: drop-shadow(0 0 16px #7072c588) drop-shadow(0 0 32px #b132a744);
        }
        .animate-blob-move1 {
        animation: blob-move1 18s ease-in-out infinite alternate;
        }
        .animate-blob-move2 {
        animation: blob-move2 22s ease-in-out infinite alternate;
        }
        .animate-blob-move3 {
        animation: blob-move3 26s ease-in-out infinite alternate;
        }
        @keyframes blob-move1 {
        0% { transform: translate(0,0) scale(1);}
        50% { transform: translate(80px, 60px) scale(1.1);}
        100% { transform: translate(0,0) scale(1);}
        }
        @keyframes blob-move2 {
        0% { transform: translate(0,0) scale(1);}
        50% { transform: translate(-60px, 40px) scale(1.08);}
        100% { transform: translate(0,0) scale(1);}
        }
        @keyframes blob-move3 {
        0% { transform: translate(0,0) scale(1);}
        50% { transform: translate(40px, -40px) scale(1.13);}
        100% { transform: translate(0,0) scale(1);}
        }
        .animate-sparkle1 {
        animation: sparkle1 3.5s infinite alternate;
        }
        .animate-sparkle2 {
        animation: sparkle2 4.2s infinite alternate;
        }
        .animate-sparkle3 {
        animation: sparkle3 5.1s infinite alternate;
        }
        @keyframes sparkle1 {
        0% { opacity: 0.7; transform: scale(1) translateY(0);}
        50% { opacity: 1; transform: scale(1.2) translateY(-10px);}
        100% { opacity: 0.7; transform: scale(1) translateY(0);}
        }
        @keyframes sparkle2 {
        0% { opacity: 0.5; transform: scale(1) translateX(0);}
        50% { opacity: 1; transform: scale(1.3) translateX(12px);}
        100% { opacity: 0.5; transform: scale(1) translateX(0);}
        }
        @keyframes sparkle3 {
        0% { opacity: 0.6; transform: scale(1) translateY(0);}
        50% { opacity: 1; transform: scale(1.1) translateY(8px);}
        100% { opacity: 0.6; transform: scale(1) translateY(0);}
        }

      `}</style>
    </main>
  );
}

const advantages = [
  {
    icon: <Lock className="text-clay h-10 w-10" />,
    background: "bg-clay/10",
    title: "Protégez votre art",
  },
  {
    icon: <Earth className="text-forest h-10 w-10" />,
    background: "bg-forest/10",
    title: "Visibilité mondiale",
  },
  {
    icon: <Paintbrush className="text-earth h-10 w-10" />,
    background: "bg-earth/10",
    title: "Outils professionnels",
  },
  {
    icon: <Users className="text-blue-700 h-h-10 w-10" />,
    background: "bg-blue-700/10",
    title: "Accompagnement",
  },
  {
    icon: <TrendingUp className="text-kente h-10 w-10" />,
    background: "bg-kente/10",
    title: "Curation",
  },
  {
    icon: <Truck className="text-primary h-10 w-10" />,
    background: "bg-primary/10",
    title: "Logistique",
  },
];

export function ArtistTestimonialsSection() {
  return (
    <section className="py-6 mx-auto lg:max-w-6xl animate-fade-in-up">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-md mx-auto text-center mb-10">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Témoignages d’artistes
          </h2>
          <p className="text-muted-foreground">Ils nous font confiance</p>
        </div>
        <InfiniteCarousel
          testimonials={moreTestimonials}
          visible={3}
          interval={3500}
        />
      </div>
    </section>
  );
}

const moreTestimonials = [
  {
    name: "Awa Diop",
    role: "Artiste digitale, Sénégal",
    quote:
      "Grâce à Kucibok, j’ai pu exposer mes œuvres à un public international et sécuriser mes créations.",
    avatar: "/images/testimonials/awa.png",
  },
  {
    name: "Jean Kouassi",
    role: "Peintre numérique, Côte d’Ivoire",
    quote:
      "L’équipe Kucibok m’a accompagné à chaque étape, de la mise en ligne à la vente de mes œuvres.",
    avatar: "/images/testimonials/jean.png",
  },
  {
    name: "Fatoumata Traoré",
    role: "Illustratrice, Mali",
    quote:
      "La plateforme est simple à utiliser et m’a permis de rencontrer de nouveaux collectionneurs.",
    avatar: "/images/testimonials/fatoumata.png",
  },
  {
    name: "Moussa Sissoko",
    role: "Sculpteur, Burkina Faso",
    quote:
      "Kucibok m’a permis de vendre mes œuvres à des collectionneurs du monde entier.",
    avatar: "/images/testimonials/moussa.png",
  },
  {
    name: "Nadia Kone",
    role: "Photographe, Côte d’Ivoire",
    quote:
      "La visibilité offerte par la plateforme a boosté ma carrière artistique.",
    avatar: "/images/testimonials/nadia.png",
  },
  {
    name: "Chantal Mbaye",
    role: "Peintre digitale, Sénégal",
    quote: "La communauté Kucibok est bienveillante et inspirante.",
    avatar: "/images/testimonials/chantal.png",
  },
];
