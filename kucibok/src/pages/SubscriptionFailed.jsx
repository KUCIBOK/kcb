import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { XCircle, ArrowLeft, RefreshCw, MessageCircle, CreditCard } from 'lucide-react'
import { failSubscription, getSubscriptionById } from '../api/useSubscriptions'
import { DataLoader } from '../components/loaders/PageLoader'

export default function SubscriptionFailed() {
  const { subscriptionId } = useParams()
  const [state, setState] = useState({
    subscription: null,
    plan: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const markFailedAndFetchSubscription = async () => {
      try {
        // Marquer l'abonnement comme échoué
        const failResult = await failSubscription(subscriptionId)
        
        if (failResult.error) {
          setState(prev => ({
            ...prev,
            error: failResult.error,
            loading: false
          }))
          return
        }

        // Récupérer les détails de l'abonnement
        const subscriptionDetails = await getSubscriptionById(subscriptionId)
        
        if (subscriptionDetails.error) {
          setState(prev => ({
            ...prev,
            error: subscriptionDetails.error,
            loading: false
          }))
          return
        }

        setState(prev => ({
          ...prev,
          subscription: failResult.sub,
          plan: failResult.plan,
          loading: false
        }))

      } catch (error) {
        console.error('Erreur lors du marquage d\'échec:', error)
        setState(prev => ({
          ...prev,
          error: 'Erreur lors du traitement de l\'échec de paiement',
          loading: false
        }))
      }
    }

    if (subscriptionId) {
      markFailedAndFetchSubscription()
    }
  }, [subscriptionId])

  const handleRetry = () => {
    // Rediriger vers la page de checkout pour réessayer
    window.location.href = `/subscription-plan-checkout/${state.plan?._id}`
  }

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <DataLoader />
          <p className="text-gray-400 mt-4">Traitement de l'échec de paiement...</p>
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Erreur</h1>
          <p className="text-gray-400 mb-6">{state.error}</p>
          <Link
            to="/plans"
            className="inline-flex items-center gap-2 bg-indigo-kcb hover:bg-indigo-kcb/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux plans
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header d'échec */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Paiement échoué</h1>
          <p className="text-gray-400">
            Le paiement pour votre abonnement {state.plan?.name} n'a pas pu être traité
          </p>
        </div>

        {/* Détails de l'abonnement échoué */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Détails de la tentative</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Plan</span>
              <span className="text-white font-medium">{state.plan?.name}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Montant</span>
              <span className="text-white font-medium">
                {state.subscription?.amount?.toLocaleString('fr-FR')} {state.subscription?.currency}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Statut</span>
              <span className="text-red-400 font-medium">Échec</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Date de tentative</span>
              <span className="text-white font-medium">
                {new Date(state.subscription?.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>

        {/* Raisons possibles */}
        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-yellow-200 mb-4">Raisons possibles de l'échec</h3>
          <ul className="space-y-2 text-yellow-100">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              Fonds insuffisants sur votre compte ou carte
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              Informations de paiement incorrectes
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              Problème temporaire avec votre banque ou opérateur mobile
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              Connexion internet interrompue pendant le paiement
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 bg-indigo-kcb hover:bg-indigo-kcb/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer le paiement
          </button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/plans"
              className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Choisir un autre plan
            </Link>
            
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Contacter le support
            </Link>
          </div>
        </div>

        {/* Note d'aide */}
        <div className="mt-8 bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
          <p className="text-blue-200 text-sm">
            <strong>Besoin d'aide ?</strong> Si le problème persiste, vérifiez vos informations de paiement 
            ou contactez notre équipe de support. Aucun montant n'a été débité de votre compte.
          </p>
        </div>
      </div>
    </div>
  )
}
