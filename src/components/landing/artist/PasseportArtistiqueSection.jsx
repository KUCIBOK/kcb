import { Link } from "react-router-dom";
import {
  Palette,
  FolderOpen,
  Sparkles,
  FileText,
  Lock,
  Shield,
  Gem,
  Smartphone,
  RotateCcw,
} from "lucide-react";
import RevealOnScroll from "../../decoratives/RevealOnScroll";

export default function PasseportArtistiqueSection() {
  return (
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
                Avec Kucibok, authentifier une œuvre devient aussi simple que de
                la signer. En un clic, générez un PDF premium horodaté,
                intégrant toutes les informations essentielles : artiste, titre,
                date, numéro unique et QR code menant vers la fiche publique de
                l'œuvre.
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
                      icon: <FolderOpen className="h-5 w-5 text-indigo-kcb" />,
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
                      <span className="text-white/90 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Link
                  to="/sign-up?role=artist"
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
  );
}
