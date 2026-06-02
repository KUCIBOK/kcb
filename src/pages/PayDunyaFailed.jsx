import { useParams, Link } from 'react-router-dom'
import { XCircle, ArrowLeft, RefreshCcw, HelpCircle } from 'lucide-react'
import RevealOnScroll from '../components/landing/RevealOnScroll'

const PayDunyaFailed = () => {
  const { transactionId } = useParams()

  return (
    <div className="min-h-screen bg-kcb-noir-deep flex items-center justify-center px-4">
      <RevealOnScroll>
        <div className="max-w-md w-full text-center">
          {/* Icône d'erreur */}
          <div className="rounded-full bg-red-100 w-16 h-16 flex justify-center items-center mb-4 mx-auto">
            <XCircle className="text-red-600 w-8 h-8" />
          </div>

          {/* Titre et message */}
          <h1 className="text-2xl font-bold text-white mb-2">Paiement échoué</h1>
          <p className="text-kcb-pierre text-sm mb-6">
            Nous n'avons pas pu traiter votre paiement. Aucun montant n'a été débité de votre
            compte.
          </p>

          {/* Raisons possibles */}
          <div className="bg-kcb-ardoise rounded-[4px] p-4 mb-6 text-left">
            <h3 className="text-white font-semibold mb-3">Raisons possibles :</h3>
            <ul className="space-y-2 text-sm text-kcb-pierre">
              <li>• Solde insuffisant</li>
              <li>• Informations de paiement incorrectes</li>
              <li>• Problème de connexion réseau</li>
              <li>• Transaction annulée</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full inline-flex items-center justify-center gap-2 bg-kcb-or hover:bg-kcb-bronze text-white px-6 py-3 rounded-[4px] transition"
            >
              <RefreshCcw className="w-4 h-4" />
              Réessayer le paiement
            </button>

            <Link
              to="/africa/catalogue"
              className="w-full inline-flex items-center justify-center gap-2 border border-white/[0.06] hover:bg-kcb-ardoise text-white px-6 py-3 rounded-[4px] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'exploration
            </Link>

            <Link
              to="/africa/contact"
              className="w-full inline-flex items-center justify-center gap-2 text-kcb-pierre hover:text-white transition text-sm"
            >
              <HelpCircle className="w-4 h-4" />
              Besoin d'aide ? Contactez-nous
            </Link>
          </div>

          {/* Information */}
          {transactionId && (
            <div className="mt-6 p-3 bg-kcb-ardoise rounded-[4px]">
              <p className="text-xs text-kcb-pierre">
                Référence: <span className="font-mono">{transactionId}</span>
              </p>
              <p className="text-xs text-kcb-pierre mt-1">
                Conservez cette référence pour toute assistance
              </p>
            </div>
          )}
        </div>
      </RevealOnScroll>
    </div>
  )
}

export default PayDunyaFailed
