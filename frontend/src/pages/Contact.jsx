import { Link } from "react-router-dom";
import {Clock, Mail, MapPin, Volume2, ArrowRight} from "lucide-react"

export default function Contact() {
  // Questions fréquentes pour la section contact
  const frequentQuestions = [
    {
      question: "Quel est le délai moyen de réponse ?",
      answer: "Nous répondons généralement dans les 24 heures ouvrables.",
    },
    {
      question: "Puis-je visiter votre galerie physique ?",
      answer:
        "Oui, notre espace à l'Institut Français est ouvert au public du lundi au vendredi de 9h à 18h.",
    },
    {
      question: "Comment devenir artiste partenaire ?",
      answer:
        "Remplissez le formulaire de contact en précisant votre demande et nous vous enverrons notre processus de sélection.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* En-tête */}
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Parlons d'art ensemble
        </h1>
        <p className="text-gray-400 text-xl md:text-2xl max-w-3xl">
          Une question ? Un projet ? Notre équipe est là pour vous accompagner
          dans votre parcours artistique.
        </p>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col lg:flex-row gap-12 relative">
        {/* Formulaire de contact */}
        <div className="flex-1 lg:sticky lg:top-24 lg:h-[calc(100vh-7.3rem)]">
          <div className="border border-gray-700 rounded-xl p-8 bg-[#0f172a]">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                Envoyez-nous un message
              </h2>
              <p className="text-gray-400">
                Remplissez le formulaire ci-dessous et nous vous répondrons
                rapidement.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Nom complet
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#020817] border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7170c4] focus:border-transparent"
                    placeholder="Votre nom"
                    id="name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#020817] border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7170c4] focus:border-transparent"
                    placeholder="votre@email.com"
                    id="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-1"
                >
                  Sujet
                </label>
                <input
                  type="text"
                  className="w-full bg-[#020817] border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7170c4] focus:border-transparent"
                  placeholder="De quoi souhaitez-vous parler ?"
                  id="subject"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
                >
                  Message
                </label>
                <textarea
                  className="w-full bg-[#020817] border border-gray-700 rounded-lg px-4 py-3 h-40 focus:ring-2 focus:ring-[#7170c4] focus:border-transparent"
                  placeholder="Votre message"
                  id="message"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#7170c4] to-[#b033a8] hover:from-[#5a5a9c] hover:to-[#8a2980] text-white font-medium px-6 py-3 rounded-lg transition duration-300"
              >
                Envoyer le message
              </button>
            </form>
          </div>
        </div>

        {/* Coordonnées et FAQ */}
        <div className="flex-1 space-y-8">
          {/* Coordonnées */}
          <div className="border border-gray-700 rounded-xl p-8 bg-[#0f172a]">
            <h2 className="text-3xl font-bold mb-6">Nos coordonnées</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#7170c4]/20 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#7170c4]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-400">contact@kucibok.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#7170c4]/20 flex items-center justify-center">
                    <Volume2 className="w-6 h-6 text-[#7170c4]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Téléphone</h3>
                    <p className="text-gray-400">+221 76 275 09 18</p>
                    <p className="text-gray-400">+221 77 505 43 92</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#7170c4]/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#7170c4]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Adresse</h3>
                    <p className="text-gray-400">Institut Français</p>
                    <p className="text-gray-400">89 rue Joseph Gomis, Dakar</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#7170c4]/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#7170c4]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Horaires</h3>
                    <p className="text-gray-400">Lun-Ven: 8h - 17h</p>
                    <p className="text-gray-400">Sam: 8h - 13h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section FAQ */}
          <div className="border border-gray-700 rounded-xl p-8 bg-[#0f172a]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Questions fréquentes</h2>
              <Link
                to="/faq"
                className="text-[#7170c4] hover:text-[#5a5a9c] flex items-center gap-2 transition"
              >
                Voir toutes
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {frequentQuestions.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-gray-700 pb-4 last:border-0"
                >
                  <h3 className="font-medium">{item.question}</h3>
                  <p className="text-gray-400 mt-2">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
