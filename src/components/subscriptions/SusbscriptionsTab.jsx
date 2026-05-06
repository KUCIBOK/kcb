import { useEffect, useState } from 'react'
import { SubscriptionsList } from './SubscriptionsList'
import { getAllSubscriptions } from '../../api/useSubscriptions'

export function SubscriptionTab() {
  const [state, setState] = useState({
    subscriptions: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const result = await getAllSubscriptions()
        if (Array.isArray(result)) {
          setState({ subscriptions: result, loading: false, error: null })
        } else {
          setState({ subscriptions: [], loading: false, error: result?.error ?? 'Erreur de chargement' })
        }
      } catch {
        setState({ subscriptions: [], loading: false, error: 'Erreur de chargement' })
      }
    }
    fetchSubscriptions()
  }, [])

  return (
    <div className="my-4">
      <SubscriptionsList
        subscriptions={state.subscriptions}
        loading={state.loading}
        error={state.error}
      />
    </div>
  )
}
