import { useState } from 'react'
import { useDelivery } from '../../store/DeliveryStore'
import { X } from 'lucide-react'
import { Modal, Input, Button, toast } from '../ui'

export function RejectAction({ delivery }) {
  const [modal, setModal] = useState(false)
  return (
    <>
      <button
        aria-label="Rejeter la demande"
        title="Rejeter la demande"
        onClick={() => setModal(true)}
        className="text-white p-2 rounded-[4px] bg-red-800 hover:bg-red-900 shadow-sm transition-colors"
      >
        <X className="w-4 h-4 text-white" />
      </button>
      {modal && <RejectModal delivery={delivery} closeModal={() => setModal(false)} />}
    </>
  )
}

function RejectModal({ delivery, closeModal }) {
  const { changeStatus } = useDelivery()
  const [state, setState] = useState({
    reason: '',
    status: 'rejected',
    loading: false,
  })

  const handleValidation = async (e) => {
    e.preventDefault()
    try {
      setState((prev) => ({ ...prev, loading: true }))
      const response = await changeStatus(delivery._id, {
        status: state.status,
        reason: state.reason,
      })
      if (response?._id || response?.id) {
        toast.success('✓ Livraison rejetée')
        closeModal()
      } else {
        toast.error('× ' + (response?.error || 'Erreur'))
      }
      setState((prev) => ({ ...prev, loading: false }))
    } catch (error) {
      toast.error('× Erreur lors du rejet')
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  return (
    <Modal isOpen={true} onClose={closeModal} title="Rejet de la livraison" size="sm">
      <form className="space-y-4" onSubmit={handleValidation} method="post">
        <Input
          label="Raison du rejet"
          value={state.reason}
          onChange={(e) => setState({ ...state, reason: e.target.value })}
          placeholder="Raison du rejet"
          required
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={state.loading} loading={state.loading} variant="danger">
            Rejeter
          </Button>
        </div>
      </form>
    </Modal>
  )
}
