import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowLeft, Download, Eye } from 'lucide-react'
import { usePayment } from '../hooks/usePayment'
import { DataLoader } from '../components/loaders/PageLoader'
import RevealOnScroll from '../components/landing/RevealOnScroll'

const PayDunyaSuccess = () => {
  const { transactionId } = useParams()
  const navigate = useNavigate()
  const { verifyPayment } = usePayment()

  const [status, setStatus] = useState({
    loading: true,
    verified: false,
    error: null,
    transaction: null,
  })

  useEffect(() => {
    const MAX_RETRIES = 3
    const RETRY_DELAY_MS = 2000

    const verifyTransaction = async () => {
      if (!transactionId) {
        setStatus({
          loading: false,
          verified: false,
          error: 'ID de transaction manquant',
          transaction: null,
        })
        return
      }

      // Le webhook PayDunya peut arriver quelques secondes après la redirection.
      // On retente jusqu'à MAX_RETRIES fois avant d'afficher une erreur.
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const result = await verifyPayment(transactionId)

          if (result.success) {
            setStatus({
              loading: false,
              verified: true,
              error: null,
              transaction: result.data,
            })
            return
          }

          if (attempt < MAX_RETRIES) {
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
            continue
          }

          // Toutes les tentatives épuisées — message neutre (le webhook peut encore arriver)
          setStatus({
            loading: false,
            verified: false,
            error:
              'Votre paiement est en cours de traitement. Un email de confirmation vous sera envoyé sous peu.',
            transaction: null,
          })
        } catch (err) {
          if (attempt < MAX_RETRIES) {
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
            continue
          }
          setStatus({
            loading: false,
            verified: false,
            error: 'Erreur de connexion. Votre paiement sera confirmé par email.',
            transaction: null,
          })
        }
      }
    }

    verifyTransaction()
  }, [transactionId, verifyPayment])

  if (status.loading) {
    return (
      <div className="min-h-screen bg-kcb-noir-deep flex items-center justify-center">
        <div className="text-center">
          <DataLoader />
          <p className="text-kcb-pierre mt-4">Vérification du paiement en cours...</p>
        </div>
      </div>
    )
  }

  if (!status.verified) {
    return (
      <div className="min-h-screen bg-kcb-noir-deep flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="rounded-full bg-red-100 w-16 h-16 flex justify-center items-center mb-4 mx-auto">
            <CheckCircle className="text-red-600 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Erreur de vérification</h1>
          <p className="text-kcb-pierre text-sm mb-6">{status.error}</p>
          <Link
            to="/africa/catalogue"
            className="inline-flex items-center gap-2 bg-kcb-or hover:bg-kcb-bronze text-white px-6 py-2 rounded-[4px] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'exploration
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-kcb-noir-deep flex items-center justify-center px-4">
      <RevealOnScroll>
        <div className="max-w-md w-full text-center">
          {/* Icône de succès */}
          <div className="rounded-full bg-green-100 w-16 h-16 flex justify-center items-center mb-4 mx-auto">
            <CheckCircle className="text-green-600 w-8 h-8" />
          </div>

          {/* Titre et message */}
          <h1 className="text-2xl font-bold text-white mb-2">Paiement réussi !</h1>
          <p className="text-kcb-pierre text-sm mb-6">
            Félicitations ! Votre achat a été traité avec succès.
          </p>

          {/* Détails de la transaction */}
          <div className="bg-kcb-ardoise rounded-[4px] p-4 mb-6 text-left">
            <h3 className="text-white font-semibold mb-3">Détails de la transaction</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-kcb-pierre">Transaction ID:</span>
                <span className="text-white font-mono text-xs">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kcb-pierre">Statut:</span>
                <span className="text-green-400 font-medium">Confirmé</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kcb-pierre">Méthode:</span>
                <span className="text-white">PayDunya</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to="/profile/purchases"
              className="w-full inline-flex items-center justify-center gap-2 bg-kcb-or hover:bg-kcb-bronze text-white px-6 py-3 rounded-[4px] transition"
            >
              <Eye className="w-4 h-4" />
              Voir mes achats
            </Link>

            <Link
              to="/africa/catalogue"
              className="w-full inline-flex items-center justify-center gap-2 border border-white/[0.06] hover:bg-kcb-ardoise text-white px-6 py-3 rounded-[4px] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Continuer l'exploration
            </Link>
          </div>

          {/* Note */}
          <p className="text-xs text-kcb-pierre mt-6">
            Un email de confirmation vous a été envoyé avec tous les détails de votre achat.
          </p>
        </div>
      </RevealOnScroll>
    </div>
  )
}

export default PayDunyaSuccess
