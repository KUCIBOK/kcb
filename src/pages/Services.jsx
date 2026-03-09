import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Camera, ShieldCheck, Truck, Smartphone, BarChart3, Users,
  MessageSquare, Award, Package, FileCheck, Gavel, Palette,
  ArrowRight, Check
} from "lucide-react"

const tabs = ["Artistes", "Collectionneurs", "Professionnels"]

const services = {
  Artistes: [
    {
      icon: Camera,
      title: "Numérisation d'œuvre",
      description: "Transformez vos créations physiques en actifs numériques haute résolution. Scan 3D, photographie professionnelle et restauration digitale.",
      badge: "Populaire",
      features: ["Scan haute résolution", "Modélisation 3D", "Retouche & recadrage", "Formats multiples"],
      cta: { label: "Commencer", path: "/sign-up" }
    },
    {
      icon: ShieldCheck,
      title: "Certification NFT",
      description: "Mint votre œuvre sur la blockchain et obtenez un certificat d'authenticité infalsifiable lié à votre identité d'artiste.",
      badge: null,
      features: ["Blockchain Ethereum", "Certificat unique", "Traçabilité complète", "Propriété prouvable"],
      cta: { label: "En savoir plus", path: "/faq" }
    },
    {
      icon: Gavel,
      title: "Mise aux enchères",
      description: "Organisez des enchères en direct ou programmées pour vos œuvres. Prix de réserve, durée flexible, notifications temps réel.",
      badge: null,
      features: ["Enchères en direct", "Prix de réserve", "Notifications SMS/email", "Rapport de vente"],
      cta: { label: "Voir les enchères", path: "/auction" }
    },
    {
      icon: Smartphone,
      title: "Passeport NFC",
      description: "Associez un tag NFC à votre œuvre physique. N'importe qui peut scanner et vérifier l'authenticité et l'historique de l'œuvre instantanément.",
      badge: "Nouveau",
      features: ["Tag NFC intégré", "QR code de secours", "Historique complet", "Compatible tous mobiles"],
      cta: { label: "Commander un tag", path: "/contact" }
    },
  ],
  Collectionneurs: [
    {
      icon: Truck,
      title: "Logistique internationale",
      description: "Transport sécurisé de vos acquisitions partout dans le monde. Emballage sur mesure, assurance incluse, suivi GPS en temps réel.",
      badge: "Partenaire agréé",
      features: ["Emballage muséal", "Assurance transport", "Suivi GPS", "Livraison white glove"],
      cta: { label: "Demander un devis", path: "/contact" }
    },
    {
      icon: FileCheck,
      title: "Certificat d'authenticité",
      description: "Chaque œuvre achetée est accompagnée d'un certificat blockchain infalsifiable incluant provenance, historique et empreinte numérique.",
      badge: null,
      features: ["NFT de provenance", "Historique transactions", "Certificat PDF signé", "Vérifiable en ligne"],
      cta: { label: "En savoir plus", path: "/faq" }
    },
    {
      icon: Package,
      title: "Gestion de collection",
      description: "Centralisez et gérez votre collection depuis votre espace personnel : inventaire, valorisation, documents et historique de chaque pièce.",
      badge: null,
      features: ["Inventaire digital", "Valorisation en temps réel", "Documents centralisés", "Export PDF/CSV"],
      cta: { label: "Mon espace", path: "/sign-up" }
    },
    {
      icon: ShieldCheck,
      title: "Assurance œuvres",
      description: "Protégez votre collection avec nos partenaires assureurs spécialisés en art. Couverture globale, évaluation et indemnisation simplifiées.",
      badge: null,
      features: ["Couverture mondiale", "Évaluation incluse", "Déclaration simplifiée", "Partenaires certifiés"],
      cta: { label: "Contacter un conseiller", path: "/contact" }
    },
  ],
  Professionnels: [
    {
      icon: BarChart3,
      title: "Analytics & rapports",
      description: "Suivez les performances de vos ventes, la tendance des prix et le comportement de vos clients avec des tableaux de bord détaillés.",
      badge: "Pro",
      features: ["Tableaux de bord temps réel", "Rapports exportables", "Tendances de marché", "KPIs personnalisés"],
      cta: { label: "Voir un exemple", path: "/professional/pricing" }
    },
    {
      icon: Users,
      title: "CRM clients",
      description: "Gérez vos relations clients avec un CRM dédié aux galeries et maisons de vente : historique, relances, segmentation et notes privées.",
      badge: null,
      features: ["Fiches clients", "Historique achats", "Relances automatiques", "Segmentation avancée"],
      cta: { label: "Découvrir le CRM", path: "/professional/pricing" }
    },
    {
      icon: MessageSquare,
      title: "Campagnes marketing",
      description: "Créez et envoyez des campagnes email ciblées à vos collectionneurs : newsletters, invitations vernissage, alertes nouvelles acquisitions.",
      badge: null,
      features: ["Templates professionnels", "Segmentation fine", "A/B testing", "Rapport d'ouverture"],
      cta: { label: "Créer une campagne", path: "/professional/pricing" }
    },
    {
      icon: Award,
      title: "Expertises certifiées",
      description: "Faites évaluer et certifier vos œuvres par nos experts partenaires. Rapports d'expertise reconnus par les assureurs et maisons de vente.",
      badge: null,
      features: ["Experts certifiés", "Rapport officiel", "Reconnaissance internationale", "Contre-expertise disponible"],
      cta: { label: "Demander une expertise", path: "/contact" }
    },
  ]
}

const pricingCta = {
  Artistes: { label: "Voir les offres artiste", path: "/artist" },
  Collectionneurs: { label: "Voir les offres collectionneur", path: "/collector/pricing" },
  Professionnels: { label: "Voir les offres professionnel", path: "/professional/pricing" },
}

export default function Services() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const [activeTab, setActiveTab] = useState("Artistes")

  return (
    <div className="min-h-screen animate-fade-in-up">

      {/* Hero */}
      <div className="text-center py-16 px-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-center mx-auto mb-6 rounded-full bg-gray-700/90 w-fit px-3 py-1 text-sm font-medium text-white">
          <div className="rounded-full bg-purple-kcb w-2 h-2 mr-2"></div>
          Nos services
        </div>
        <h1 className="font-playfair text-4xl md:text-5xl text-white font-medium mb-4">
          Tout ce dont vous avez besoin<br />
          <span className="text-gradient">pour valoriser l'art africain</span>
        </h1>
        <p className="text-gray-400 text-lg">
          De la numérisation à la certification blockchain, en passant par la logistique et le marketing — Kucibok couvre l'ensemble de votre parcours.
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex gap-2 border-b border-gray-800 mb-10">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-indigo-kcb text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {services[activeTab].map((service, idx) => (
            <div
              key={idx}
              className="bg-card border border-gray-800 rounded-xl p-6 flex flex-col gap-4 hover:border-indigo-kcb/40 transition-colors"
              style={{ animationDelay: `${0.05 * idx}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="bg-indigo-kcb/10 p-3 rounded-lg">
                  <service.icon className="w-5 h-5 text-indigo-kcb" />
                </div>
                {service.badge && (
                  <span className="text-xs font-medium bg-indigo-kcb/20 text-indigo-300 px-2 py-1 rounded-full">
                    {service.badge}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
              </div>
              <ul className="space-y-1">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={service.cta.path}
                className="mt-auto flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >
                {service.cta.label} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Pricing CTA */}
        <div className="bg-gray-700/40 border border-gray-700 rounded-2xl p-8 text-center mb-16">
          <h2 className="font-playfair text-2xl text-white mb-2">
            Accédez à tous ces services avec un abonnement
          </h2>
          <p className="text-gray-400 mb-6 text-sm max-w-xl mx-auto">
            Nos offres donnent accès à l'ensemble de nos outils selon votre profil. Pas de frais cachés.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to={pricingCta[activeTab].path}
              className="px-5 py-2 bg-gradient rounded-md text-white text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              {pricingCta[activeTab].label} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm font-medium hover:bg-gray-700 transition"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
