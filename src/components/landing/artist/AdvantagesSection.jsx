import {
  Lock,
  Earth,
  Paintbrush,
  Users,
  TrendingUp,
  Truck,
} from "lucide-react";
import RevealOnScroll from "../../decoratives/RevealOnScroll";

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
    icon: <Users className="text-blue-700 h-10 w-10" />,
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

export default function AdvantagesSection() {
  return (
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
  );
}
