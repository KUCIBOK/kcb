import { Link } from "react-router-dom";
import {
  Wrench,
  FolderOpen,
  BarChart3,
  Receipt,
  Radio,
  Hammer,
  ArrowRight,
} from "lucide-react";
import RevealOnScroll from "../../decoratives/RevealOnScroll";

export default function IntegratedToolsSection() {
  return (
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
            {
              text: "Gérer et publier votre catalogue d'œuvres",
              icon: <FolderOpen className="h-5 w-5 text-indigo-kcb" />,
            },
            {
              text: "Suivre vos ventes et la visibilité de vos créations",
              icon: <BarChart3 className="h-5 w-5 text-green-500" />,
            },
            {
              text: "Générer des certificats d'authenticité numériques",
              icon: <Receipt className="h-5 w-5 text-purple-kcb" />,
            },
            {
              text: "Intégrer des puces NFC pour la traçabilité de vos œuvres",
              icon: <Radio className="h-5 w-5 text-blue-500" />,
            },
            {
              text: "Préparer et suivre vos ventes aux enchères",
              icon: <Hammer className="h-5 w-5 text-orange-500" />,
            },
            {
              text: "Tout est centralisé dans votre tableau de bord.",
              icon: <ArrowRight className="h-5 w-5 text-gray-400" />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-gray-900 rounded-xl p-4 border border-gray-800 shadow text-white"
            >
              <div className="flex items-center justify-center w-8 h-8">
                {item.icon}
              </div>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <Link
            to="/sign-up?role=artist"
            className="px-6 py-2 rounded-full bg-indigo-kcb text-white font-semibold shadow hover:bg-indigo-kcb/80 transition"
          >
            Accéder à mes outils
          </Link>
        </div>
      </section>
    </RevealOnScroll>
  );
}
