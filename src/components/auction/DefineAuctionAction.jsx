import { useState, useEffect } from 'react'
import { PenBox } from 'lucide-react'
import { Modal, Input, Button, toast } from '../ui'
import { utils } from '../../api/useAPI'

export function DefineAuctionAction({ artwork }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex p-2 gap-2 items-center border bg-green-600 border-border rounded-[4px]"
      >
        <PenBox className="w-4 h-4 text-white font-bold mx-auto" />
        <p className="mx-auto text-sm">Définir l'enchère</p>
      </button>

      {showModal && <DefineAuctionModal artwork={artwork} closeModal={() => setShowModal(false)} />}
    </>
  )
}

function DefineAuctionModal({ artwork, closeModal }) {
  const [state, setState] = useState({
    startingPrice: '',
    startTime: '',
    endTime: '',
    loading: false,
  })

  useEffect(() => {
    const now = new Date()
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    setState((prev) => ({
      ...prev,
      startingPrice: artwork?.price || '',
      startTime: now.toISOString().slice(0, 16),
      endTime: in24h.toISOString().slice(0, 16),
    }))
  }, [artwork])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setState((prev) => ({ ...prev, loading: true }))

      const res = await fetch(`${utils.api}/auction`, {
        method: 'POST',
        headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworkId: artwork.id || artwork._id,
          startingPrice: Number(state.startingPrice),
          startTime: state.startTime,
          endTime: state.endTime,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || `Erreur ${res.status}`)
      }

      toast.success('Enchere creee avec succes')
      closeModal()
    } catch (err) {
      toast.error(err.message || 'Erreur')
    } finally {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  return (
    <Modal isOpen={true} onClose={closeModal} title="Définir l'enchère" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Prix de départ"
          type="number"
          min={0}
          value={state.startingPrice}
          onChange={(e) => setState({ ...state, startingPrice: e.target.value })}
          required
        />

        <Input
          label="Date de début"
          type="datetime-local"
          value={state.startTime}
          onChange={(e) => setState({ ...state, startTime: e.target.value })}
          required
        />

        <Input
          label="Date de fin"
          type="datetime-local"
          value={state.endTime}
          onChange={(e) => setState({ ...state, endTime: e.target.value })}
          required
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={closeModal}>
            Annuler
          </Button>
          <Button type="submit" disabled={state.loading} loading={state.loading}>
            Créer l'enchère
          </Button>
        </div>
      </form>
    </Modal>
  )
}
