import { InfiniteCarousel } from "../../decoratives/InfiniteCarousel";
import RevealOnScroll from "../../decoratives/RevealOnScroll";

const moreTestimonials = [
  {
    name: "Awa Diop",
    role: "Artiste digitale, Sénégal",
    quote:
      "Grâce à Kucibok, j'ai pu exposer mes œuvres à un public international et sécuriser mes créations.",
    avatar: "/images/testimonials/awa.webp",
  },
  {
    name: "Jean Kouassi",
    role: "Peintre numérique, Côte d'Ivoire",
    quote:
      "L'équipe Kucibok m'a accompagné à chaque étape, de la mise en ligne à la vente de mes œuvres.",
    avatar: "/images/testimonials/jean.webp",
  },
  {
    name: "Fatoumata Traoré",
    role: "Illustratrice, Mali",
    quote:
      "La plateforme est simple à utiliser et m'a permis de rencontrer de nouveaux collectionneurs.",
    avatar: "/images/testimonials/fatoumata.webp",
  },
  {
    name: "Moussa Sissoko",
    role: "Sculpteur, Burkina Faso",
    quote:
      "Kucibok m'a permis de vendre mes œuvres à des collectionneurs du monde entier.",
    avatar: "/images/testimonials/moussa.webp",
  },
  {
    name: "Nadia Kone",
    role: "Photographe, Côte d'Ivoire",
    quote:
      "La visibilité offerte par la plateforme a boosté ma carrière artistique.",
    avatar: "/images/testimonials/nadia.webp",
  },
  {
    name: "Chantal Mbaye",
    role: "Peintre digitale, Sénégal",
    quote: "La communauté Kucibok est bienveillante et inspirante.",
    avatar: "/images/testimonials/chantal.webp",
  },
];

export default function ArtistTestimonialsSection() {
  return (
    <RevealOnScroll>
      {/* Témoignages */}
      <section className="py-6 mx-auto lg:max-w-6xl animate-fade-in-up">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-md mx-auto text-center mb-10">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Témoignages d'artistes
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
    </RevealOnScroll>
  );
}
