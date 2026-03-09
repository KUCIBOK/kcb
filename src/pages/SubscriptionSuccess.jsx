import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, ArrowLeft, Download, Calendar, CreditCard } from 'lucide-react'
import { activateSubscription, getSubscriptionById } from '../api/useSubscriptions'
import { DataLoader } from '../components/loaders/PageLoader'
import { toast } from 'sonner'

export default function SubscriptionSuccess() {
  const { subscriptionId } = useParams()
  const [state, setState] = useState({
    subscription: null,
    plan: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const activateAndFetchSubscription = async () => {
      try {
        // Activer l'abonnement
        const activationResult = await activateSubscription(subscriptionId)
        
        if (activationResult.error) {
          setState(prev => ({
            ...prev,
            error: activationResult.error,
            loading: false
          }))
          toast.error(activationResult.error)
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
          subscription: activationResult.sub,
          plan: activationResult.plan,
          loading: false
        }))

        toast.success('Abonnement activé avec succès !')

      } catch (error) {
        console.error('Erreur lors de l\'activation:', error)
        setState(prev => ({
          ...prev,
          error: 'Erreur lors de l\'activation de l\'abonnement',
          loading: false
        }))
        toast.error('Erreur lors de l\'activation de l\'abonnement')
      }
    }

    if (subscriptionId) {
      activateAndFetchSubscription()
    }
  }, [subscriptionId])

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <DataLoader />
          <p className="text-gray-400 mt-4">Activation de votre abonnement...</p>
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Erreur d'activation</h1>
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
        {/* Header de succès */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Abonnement activé !</h1>
          <p className="text-gray-400">
            Votre abonnement {state.plan?.name} a été activé avec succès
          </p>
        </div>

        {/* Détails de l'abonnement */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Détails de votre abonnement</h2>
          
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
              <span className="text-gray-400">Date de début</span>
              <span className="text-white font-medium">
                {new Date(state.subscription?.startDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Date de fin</span>
              <span className="text-white font-medium">
                {new Date(state.subscription?.endDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Prochain paiement</span>
              <span className="text-white font-medium">
                {new Date(state.subscription?.nextPaymentDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>

        {/* Fonctionnalités du plan */}
        {state.plan?.features && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Fonctionnalités incluses</h3>
            <ul className="space-y-2">
              {state.plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-kcb hover:bg-indigo-kcb/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Accéder au tableau de bord
          </Link>
          
          <Link
            to="/plans"
            className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Voir tous les plans
          </Link>
        </div>

        {/* Note importante */}
        <div className="mt-8 bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
          <p className="text-blue-200 text-sm">
            <strong>Note :</strong> Vous recevrez un email de confirmation avec les détails de votre abonnement. 
            Votre abonnement sera automatiquement renouvelé à la date indiquée ci-dessus.
          </p>
        </div>
      </div>
    </div>
  )
}
