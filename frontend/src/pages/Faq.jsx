import { Palette, Users, ShieldCheck, ShoppingBag, ArrowRightCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import FaqTabs from "../components/faq/FaqTabs";
import Accordions from "../components/faq/Accordions";
import { faqs } from "../components/faq/FaqTabs";

export default function Faq() {
  const [currentTab, setCurrentTab] = useState("general");

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      {/* ENTÊTE */}
      <div className="flex flex-col w-full items-center gap-5 py-[100px] bg-gradient-to-br from-[#7170c4] via-[#b033a8] to-[#7170c4]">
        <h1 className="text-4xl md:text-7xl font-bold text-center px-4">
          Questions Fréquentes
        </h1>
        <p className="text-lg md:text-xl text-center px-4 max-w-2xl">
          Trouvez toutes les réponses à vos questions sur Kucibok
        </p>
      </div>

      {/* Comment ça marche */}
      <div className="py-10 md:py-20 container mx-auto px-4">
        <div className="flex flex-col gap-8 items-center">
          <div className="text-center flex flex-col items-center gap-4">
            <h2 className="text-3xl font-bold">Comment ça marche ?</h2>
            <p className="text-lg md:text-xl w-full md:w-[80%]">
              Découvrez comment Kucibok révolutionne le marché de l'art numérique
              africain en quatre étapes simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {[
              {
                icon: Users,
                title: "Inscription",
                description:
                  "Créez votre compte et choisissez votre rôle : artiste, collectionneur ou professionnel.",
                footer:
                  "L'inscription est gratuite et vous permet d'accéder à toutes les fonctionnalités de base de la plateforme.",
              },
              {
                icon: Palette,
                title: "Création et soumission",
                description:
                  "Les artistes créent et soumettent leurs œuvres d'art numériques pour validation.",
                footer:
                  "Chaque œuvre est examinée par notre équipe pour garantir la qualité et l'authenticité.",
              },
              {
                icon: ShoppingBag,
                title: "Achat et collection",
                description:
                  "Découvrez et achetez des œuvres d'art africaines uniques.",
                footer:
                  "Tous les achats sont sécurisés et vous recevez un certificat d'authenticité numérique.",
              },
              {
                icon: ShieldCheck,
                title: "Certification",
                description:
                  "Chaque œuvre est certifiée et vous recevez un certificat d'authenticité blockchain.",
                footer:
                  "Vos œuvres sont protégées par la technologie blockchain pour garantir leur provenance.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center p-6 border-2 border-gray-700 rounded-lg h-full bg-[#020817] hover:border-[#7170c4] transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-[#7170c4]/20 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-[#7170c4]" />
                </div>
                <div className="p-3 w-8 h-8 bg-[#7170c4] rounded-full flex items-center justify-center my-4">
                  {index + 1}
                </div>
                <h4 className="text-xl font-bold mb-4 text-center">
                  {step.title}
                </h4>
                <p className="text-center text-gray-300 mb-6">
                  {step.description}
                </p>
                <div className="mt-auto w-full p-4 bg-[#7170c4]/10 rounded-lg">
                  <p className="text-sm text-center text-gray-300">
                    {step.footer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/sign-in"
            className="px-6 py-3 bg-[#7170c4] rounded-lg flex items-center gap-2 text-white font-semibold hover:bg-[#5a5a9c] transition group mt-6"
          >
            Commencer maintenant
            <ArrowRightCircle className="text-xl text-white group-hover:translate-x-2 transition" />
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="flex flex-col items-center py-10 md:py-20 px-4 max-w-6xl mx-auto">
        <div className="w-full mb-10">
          <FaqTabs onChange={setCurrentTab} />
        </div>
        <div className="w-full p-6 md:p-8 bg-[#0f172a] rounded-lg">
          <Accordions faqs={faqs[currentTab]} />
        </div>
      </div>
    </div>
  );
}
