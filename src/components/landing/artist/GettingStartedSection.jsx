import { Link } from "react-router-dom";
import { User, Image, DollarSign, Package } from "lucide-react";
import RevealOnScroll from "../../decoratives/RevealOnScroll";

export default function GettingStartedSection() {
  return (
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
  );
}
