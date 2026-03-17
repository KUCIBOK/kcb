import { Link } from "react-router-dom";
import RevealOnScroll from "../../decoratives/RevealOnScroll";

export default function CallToActionSection() {
  return (
    <RevealOnScroll>
      {/* Appel à l'action minimaliste */}
      <section className="py-12 px-8 lg:px-2 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Prêt à partager votre art ?</h2>
        <p className="text-base text-white/60 mb-6">
          Rejoignez notre communauté grandissante d'artistes numériques
          africains qui façonnent l'avenir de l'art NFT.
        </p>
        <Link
          to="/sign-up?role=artist"
          className="p-2 rounded-full bg-purple-kcb text-white font-semibold shadow hover:bg-purple-kcb/80 transition text-sm"
        >
          Commencez votre parcours d'artiste
        </Link>
      </section>
    </RevealOnScroll>
  );
}
