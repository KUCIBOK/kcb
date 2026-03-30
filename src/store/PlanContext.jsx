import { createContext, useEffect, useState } from 'react'
import { createPlan, deletePlan, getAllPlans, updatePlan } from '../api/usePlans'
import { useContext } from 'react'
import { createLog } from '../api/useLog'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'

const initialState = {
  plans: [],
  buyerPlans: [],
  curatorPlans: [],
  loading: true,
}

const PlanContext = createContext(initialState)

export function PlanProvider({ children }) {
  const { user } = useAuth()
  const [state, setState] = useState(initialState)
  const { makeToast } = useToast()
  useEffect(() => {
    // Fetch plans from an API or other source
    const fetchPlans = async () => {
      try {
        const plans = await getAllPlans()
        if (plans?.length > 0) {
          setState((prev) => ({
            ...prev,
            plans: plans,
            buyerPlans: plans.filter((plan) => plan.role === 'buyer'),
            curatorPlans: plans.filter((plan) => plan.role === 'curator'),
          }))
        }
      } catch (error) {
        console.error('[PlanContext] fetchPlans failed:', error)
      }
    }

    fetchPlans().finally(() => {
      setState((prev) => ({ ...prev, loading: false }))
    })
  }, [])
  return (
    <PlanContext.Provider
      value={{
        plans: state.plans,
        buyerPlans: state?.buyerPlans,
        curatorPlans: state?.curatorPlans,
        loading: state.loading,
        addPlan: async (plan) => {
          try {
            const newPlan = await createPlan(plan)
            if (newPlan?._id) {
              setState((prev) => ({
                ...prev,
                plans: [newPlan, ...prev.plans],
                buyerPlans:
                  newPlan.role === 'buyer' ? [newPlan, ...prev.buyerPlans] : prev.buyerPlans,
                curatorPlans:
                  newPlan.role === 'curator' ? [newPlan, ...prev.curatorPlans] : prev.curatorPlans,
              }))
              makeToast('Succès', 'success', 'Le plan a été ajouté avec succès')
              await createLog({
                description: `Le plan ${plan?.name} a été ajouté`,
                userId: user?._id,
              })
              return newPlan
            }
          } catch (error) {
            console.error('[PlanContext] addPlan failed:', error)
          }
        },
        updatePlan: async (id, payload) => {
          try {
            const plan = await updatePlan(id, payload)
            if (plan?._id) {
              setState((prev) => ({
                ...prev,
                plans: prev.plans.map((p) => (p._id === id ? plan : p)),
                buyerPlans:
                  plan?.role === 'buyer'
                    ? [plan, ...prev.buyerPlans.filter((item) => item?._id != plan?._id)]
                    : prev.buyerPlans,
                curatorPlans:
                  plan?.role === 'curator'
                    ? [plan, ...prev.curatorPlans.filter((item) => item?._id != plan?._id)]
                    : prev.curatorPlans,
              }))
              makeToast('Succès', 'success', 'Le plan a été mis à jour avec succès')
              await createLog({
                description: `Le plan ${plan?.name} a été modifié`,
                userId: user?._id,
              })
              return plan
            }
          } catch (error) {
            console.error('[PlanContext] updatePlan failed:', error)
          }
        },
        deletePlan: async (id) => {
          try {
            const plan = await deletePlan(id)
            if (plan?._id) {
              setState((prev) => ({
                ...prev,
                plans: prev.plans.filter((p) => p._id != id),
                buyerPlans: prev.buyerPlans.filter((item) => item?._id != id),
                curatorPlans: prev.curatorPlans.filter((item) => item?._id != id),
              }))
              makeToast('Succès', 'success', 'Le plan a été supprimé avec succès')
              await createLog({
                description: `Le plan ${plan?.name} a été supprimé`,
                userId: user?._id,
              })
              return plan
            }
          } catch (error) {
            console.error('[PlanContext] deletePlan failed:', error)
          }
        },
      }}
    >
      {children}
    </PlanContext.Provider>
  )
}

export function usePlanStore() {
  return useContext(PlanContext)
}
