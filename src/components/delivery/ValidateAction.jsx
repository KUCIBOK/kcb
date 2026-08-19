import { useState } from 'react'
import { useDelivery } from '../../store/DeliveryStore'
import { Check } from 'lucide-react'
import { Modal, Input, Select, Button, toast } from '../ui'

export function ValidateAction({ delivery }) {
  const [modal, setModal] = useState(false)
  return (
    <>
      <button
        aria-label="Valider la demande"
        title="Valider la demande"
        onClick={() => setModal(true)}
        className="text-green-500 hover:text-green-700 p-2 rounded-[4px] bg-green-600 hover:bg-green-700 shadow-sm transition-colors"
      >
        <Check className="w-4 h-4 text-white" />
      </button>
      {modal && <ValidateModal delivery={delivery} closeModal={() => setModal(false)} />}
    </>
  )
}

function ValidateModal({ delivery, closeModal }) {
  const { changeStatus } = useDelivery()
  const [state, setState] = useState({
    trackingId: delivery?.trackingId || '',
    price: delivery?.price || '',
    status: 'in_preparation',
    loading: false,
  })

  const statusOptions = [
    { value: 'in_preparation', label: 'En préparation' },
    { value: 'on_the_way', label: 'Expédié' },
    { value: 'delivered', label: 'Livré' },
  ]

  const handleValidation = async (e) => {
    e.preventDefault()
    try {
      setState((prev) => ({ ...prev, loading: true }))
      const response = await changeStatus(delivery._id, {
        status: state.status,
        price: state.price,
        trackingId: state.trackingId,
      })
      if (response?._id || response?.id) {
        toast.success('✓ Livraison validée')
        closeModal()
      } else {
        toast.error('× ' + (response?.error || 'Erreur'))
      }
      setState((prev) => ({ ...prev, loading: false }))
    } catch (error) {
      toast.error('× Erreur lors de la validation')
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  return (
    <Modal isOpen={true} onClose={closeModal} title="Validation de la livraison" size="sm">
      <form className="space-y-4" onSubmit={handleValidation} method="post">
        <Input
          label="Numéro de tracking"
          value={state.trackingId}
          onChange={(e) => setState({ ...state, trackingId: e.target.value })}
          placeholder="Numéro de tracking"
          required
        />

        <Input
          label="Prix"
          type="number"
          value={state.price}
          onChange={(e) => setState({ ...state, price: e.target.value })}
          placeholder="Prix de la livraison"
          required
        />

        <Select
          label="Statut"
          options={statusOptions}
          value={state.status}
          onChange={(value) => setState({ ...state, status: value })}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={state.loading} loading={state.loading}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
