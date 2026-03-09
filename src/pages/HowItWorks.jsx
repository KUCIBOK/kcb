import { useEffect } from "react"
import { Link } from "react-router-dom"
import { UserPlus, Upload, ShoppingCart, Award, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

const stepsArtist = [
  {
    number: "01",
    icon: UserPlus,
    title: "Créez votre profil artiste",
    description: "Inscrivez-vous gratuitement, choisissez le rôle 'Artiste' et complétez votre profil : biographie, style, pays d'origine. Votre espace est prêt en moins de 5 minutes.",
    details: ["Inscription gratuite", "Profil public visible par les collectionneurs", "Verification email sécurisée", "Pas de carte bancaire requise"]
  },
  {
    number: "02",
    icon: Upload,
    title: "Soumettez votre œuvre",
    description: "Uploadez vos créations (image, vidéo, 3D). Ajoutez titre, description, dimensions et prix. Notre équipe vérifie et valide chaque soumission sous 48h.",
    details: ["Formats acceptés : JPG, PNG, MP4, GLB", "Taille max : 100 MB", "Validation manuelle en 48h", "Notification email à chaque étape"]
  },
  {
    number: "03",
    icon: ShoppingCart,
    title: "Vendez ou organisez une enchère",
    description: "Choisissez entre vente directe (prix fixe) ou mise aux enchères. Définissez votre prix de réserve, la durée et regardez les offres arriver en temps réel.",
    details: ["Vente directe ou enchère", "Prix de réserve configurable", "Durée d'enchère flexible (24h–7j)", "Notifications en temps réel"]
  },
  {
    number: "04",
    icon: Award,
    title: "Obtenez votre certification",
    description: "À chaque vente, votre œuvre est certifiée sur la blockchain. L'acheteur reçoit un NFT de provenance et vous recevez votre paiement directement.",
    details: ["Certificat NFT infalsifiable", "Paiement sous 48h", "Historique permanent sur blockchain", "Commission : 10% par vente"]
  }
]

const stepsCollector = [
  {
    number: "01",
    icon: UserPlus,
    title: "Créez votre compte collectionneur",
    description: "Inscription rapide, choisissez le rôle 'Collectionneur'. Accédez immédiatement à toute la galerie d'œuvres africaines disponibles.",
    details: ["Inscription gratuite", "Accès à toutes les œuvres", "Favoris et liste de souhaits", "Notifications de nouvelles œuvres"]
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Explorez & achetez",
    description: "Naviguez dans notre galerie filtrée par style, artiste, prix ou région. Achetez directement ou participez à une enchère live.",
    details: ["Filtres avancés", "Enchères en direct", "Achat sécurisé PayDunya", "Mobile Money & carte bancaire"]
  },
  {
    number: "03",
    icon: Award,
    title: "Recevez votre certificat",
    description: "Chaque achat génère automatiquement un NFT de provenance à votre nom. L'œuvre et son historique sont enregistrés de façon permanente.",
    details: ["NFT de provenance automatique", "Certificat PDF téléchargeable", "Historique inaltérable", "Compatible wallets MetaMask"]
  },
  {
    number: "04",
    icon: Upload,
    title: "Gérez votre collection",
    description: "Retrouvez toutes vos acquisitions dans votre espace personnel. Valorisation en temps réel, documents et historique centralisés.",
    details: ["Inventaire digital complet", "Valorisation marché", "Documents centralisés", "Export PDF de votre collection"]
  }
]

const faqs = [
  {
    question: "Est-ce que Kucibok accepte tous les types d'art ?",
    answer: "Oui, Kucibok accepte les œuvres d'art numériques, les photographies d'œuvres physiques, la peinture, la sculpture, les textiles, et l'art traditionnel africain. Chaque œuvre est vérifiée par notre équipe avant publication."
  },
  {
    question: "Quel est le délai pour recevoir mon paiement ?",
    answer: "Les paiements sont traités sous 48h ouvrées après confirmation de la vente. Nous supportons Mobile Money (Orange Money, Wave) et les virements bancaires."
  },
  {
    question: "Puis-je annuler une vente ou une enchère ?",
    answer: "Une vente directe peut être annulée avant qu'un acheteur ne confirme. Une enchère en cours ne peut pas être annulée une fois les premières offres reçues."
  },
  {
    question: "Comment fonctionne la commission ?",
    answer: "Kucibok prélève 10% de commission sur chaque vente réalisée. Il n'y a aucun frais d'inscription, de publication ou d'abonnement obligatoire pour les artistes."
  },
  {
    question: "Le certificat NFT est-il reconnu légalement ?",
    answer: "Le certificat NFT constitue une preuve d'authenticité et de propriété sur la blockchain. Pour les juridictions africaines, nous fournissons également un certificat PDF signé électroniquement."
  }
]

export default function HowItWorks() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const [activeProfile, setActiveProfile] = useState("artist")
  const [openFaq, setOpenFaq] = useState(null)

  const steps = activeProfile === "artist" ? stepsArtist : stepsCollector

  return (
    <div className="min-h-screen animate-fade-in-up">

      {/* Hero */}
      <div className="text-center py-16 px-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-center mx-auto mb-6 rounded-full bg-gray-700/90 w-fit px-3 py-1 text-sm font-medium text-white">
          <div className="rounded-full bg-purple-kcb w-2 h-2 mr-2"></div>
          Comment ça marche
        </div>
        <h1 className="font-playfair text-4xl md:text-5xl text-white font-medium mb-4">
          Simple, rapide et<br />
          <span className="text-gradient">sécurisé par la blockchain</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Que vous soyez artiste ou collectionneur, découvrez comment Kucibok vous accompagne à chaque étape.
        </p>
      </div>

      {/* Profile toggle */}
      <div className="flex justify-center mb-12 px-4">
        <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
          <button
            onClick={() => setActiveProfile("artist")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeProfile === "artist"
                ? "bg-indigo-kcb text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Je suis artiste
          </button>
          <button
            onClick={() => setActiveProfile("collector")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeProfile === "collector"
                ? "bg-indigo-kcb text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Je suis collectionneur
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="px-4 md:px-6 lg:px-8 max-w-4xl mx-auto mb-20">
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-[2.25rem] top-12 bottom-12 w-px bg-gradient-to-b from-indigo-kcb/60 via-purple-kcb/40 to-transparent" />

          <div className="flex flex-col gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-6 animate-fade-in" style={{ animationDelay: `${0.1 * idx}s` }}>
                {/* Icon + number */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-full bg-indigo-kcb/20 border border-indigo-kcb/40 flex items-center justify-center z-10">
                    <step.icon className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                {/* Content */}
                <div className="bg-card border border-gray-800 rounded-xl p-6 flex-1 hover:border-indigo-kcb/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg">{step.title}</h3>
                    <span className="text-2xl font-black text-gray-700 leading-none">{step.number}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{step.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {step.details.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-kcb shrink-0" />
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="px-4 md:px-6 lg:px-8 max-w-3xl mx-auto mb-20">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-3xl text-white font-medium mb-2">Questions fréquentes</h2>
          <p className="text-gray-400 text-sm">Vous avez encore des doutes ? Voici les réponses aux questions les plus posées.</p>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-card border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-white font-medium text-sm">{faq.question}</span>
                {openFaq === idx
                  ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                }
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/faq" className="text-sm text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 justify-center">
            Voir toutes les FAQs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-700/40 border border-gray-700 rounded-2xl p-8 text-center max-w-4xl mx-auto mb-16 mx-4 md:mx-auto">
        <h2 className="font-playfair text-3xl text-white mb-2">Prêt à vous lancer ?</h2>
        <p className="text-gray-400 mb-6 text-sm max-w-xl mx-auto">
          Rejoignez des centaines d'artistes et collectionneurs africains sur Kucibok.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/sign-up" className="px-5 py-2 bg-gradient rounded-md text-white text-sm font-medium hover:opacity-90 transition flex items-center gap-2">
            Créer un compte gratuit <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/explore" className="px-5 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm font-medium hover:bg-gray-700 transition">
            Explorer les œuvres
          </Link>
        </div>
      </div>

    </div>
  )
}
