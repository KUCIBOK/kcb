import { useEffect, useRef, useState } from "react";

const tabs = [
  { label: "Questions Générales", value: "general" },
  { label: "Artistes", value: "artists" },
  { label: "Collectionneurs", value: "collectors" },
];

export const faqs = {
  general: [
    {
      question: "Qu'est-ce que Kucibok ?",
      answer:
        "Kucibok est une plateforme panafricaine qui permet aux artistes de vendre leurs œuvres en ligne, aux collectionneurs d’acquérir des pièces certifiées, et aux professionnels de l'art de gérer leurs catalogues, expositions et ventes. Elle combine marketplace et boîte à outils SaaS.",
    },
    {
      question: "Comment fonctionne la certification des œuvres ?",
      answer:
        "Chaque œuvre vendue sur Kucibok est certifiée numériquement avec un certificat d'authenticité (avec ou sans puce NFC), garantissant sa traçabilité.",
    },
    {
      question: "Quels sont les moyens de paiement acceptés ?",
      answer:
        "Nous acceptons les paiements par carte bancaire, mobile money (Orange Money, Wave, MTN), et virement bancaire.",
    },
    {
      question: "Comment les artistes sont-ils sélectionnés ?",
      answer:
        "Nous avons un processus de validation qui examine la qualité artistique, l'originalité et l'authenticité de chaque soumission avant publication.",
    },
    {
      question: "Quels sont les frais de transaction ?",
      answer:
        "Nos frais de transaction sont compétitifs et transparents. Les détails sont disponibles dans nos conditions d'utilisation.",
    },
  ],
  artists: [
    {
      question: "Qui peut vendre sur Kucibok ?",
      answer:
        "Tout artiste africain (professionnel ou émergent) peut postuler. Notre équipe examine les dossiers avant validation pour garantir la qualité et la cohérence avec notre ligne éditoriale.",
    },
    {
      question: "Quels services sont proposés aux artistes ?",
      answer:
        "Mise en vente d'œuvres en ligne - Certification numérique - Intégration de puces NFC (sur demande) - Outils de gestion de catalogue - Formation en ligne (vidéos + quiz) - Récompenses via un système de points",
    },
    {
      question: "Combien de temps prend la validation ?",
      answer:
        "Le processus de validation prend généralement 2-5 jours ouvrables. Vous recevrez une notification par email une fois la révision terminée.",
    },
    {
      question: "Comment puis-je fixer le prix de mon art ?",
      answer:
        "Vous avez le contrôle total sur le prix de vos œuvres. Notre équipe peut vous conseiller sur les prix de marché si nécessaire.",
    },
  ],
  collectors: [
    {
      question: "Puis-je créer une collection privée sur la plateforme ?",
      answer:
        "Oui, chaque collectionneur dispose d'un tableau de bord personnel pour gérer ses œuvres, suivre leur valeur et consulter leur historique d'acquisition.",
    },
    {
      question: "L'achat d'une œuvre inclut-il la livraison ?",
      answer:
        "La livraison est un service additionnel proposé au moment du paiement. Elle est sécurisée et traçable, avec possibilité d'assurance.",
    },
    {
      question: "Comment gérer ma collection ?",
      answer:
        "Votre tableau de bord collectionneur vous permet de visualiser, organiser et gérer toute votre collection d'art numérique.",
    },
    {
      question: "Y a-t-il une garantie de remboursement ?",
      answer:
        "Nous offrons une garantie de satisfaction sous certaines conditions. Consultez notre politique de remboursement pour plus de détails.",
    },
  ],
};

const FaqTabs = ({ onChange }) => {
  const tabRef = useRef(null);
  const [tabWidth, setTabWidth] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);

  const updateWidth = () => {
    if (tabRef.current) {
      const parentWidth = tabRef.current.getBoundingClientRect().width;
      const numberOfTabs = tabs.length;
      const newTabWidth = parentWidth / numberOfTabs;
      setTabWidth(newTabWidth);
    }
  };

  useEffect(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleTabChange = (index) => {
    setCurrentTab(index);
    onChange(tabs[index].value);
  };

  return (
    <div
      className="w-full  flex items-center justify-between relative rounded-lg"
      ref={tabRef}
    >
      {tabs.map((tab, index) => (
        <button
          className={`relative py-3 text-sm font-semibold transition-colors ${
            currentTab === index ? "text-white" : "text-kcb-pierre"
          }`}
          key={index}
          style={{ width: tabWidth }}
          onClick={() => handleTabChange(index)}
        >
          {tab.label}
        </button>
      ))}
      <div
        className="absolute inset-0 bg-kcb-ardoise rounded-lg mix-blend-exclusion transition-all duration-300"
        style={{
          width: tabWidth,
          transform: `translateX(${currentTab * tabWidth}px)`,
        }}
      />
    </div>
  );
};

export default FaqTabs;
