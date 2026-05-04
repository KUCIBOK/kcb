import { useState } from 'react'
import { useAuth } from '../../store/AuthContext'
import { PenBox } from 'lucide-react'
import { Modal, Input, Button, toast } from '../ui'

export function ChangePassword() {
  const [state, setState] = useState(false)
  return (
    <>
      <button
        onClick={() => setState(true)}
        className="px-4 py-2 text-white text-sm my-4 rounded-md flex justify-center items-center gap-2 bg-background mx-auto hover:bg-background/80"
      >
        <PenBox className="w-4 h-4" />
        Modifier le mot de passe
      </button>
      {state && <ChangePasswordModal closeModal={() => setState(false)} />}
    </>
  )
}

function ChangePasswordModal({ closeModal }) {
  const { changePassword } = useAuth()
  const [state, setState] = useState({
    oldPassword: '',
    newPassword: '',
    loading: false,
  })

  const handleUpdate = async function (e) {
    e.preventDefault()
    try {
      setState({ ...state, loading: true })
      const user = await changePassword({
        oldPassword: state.oldPassword,
        newPassword: state.newPassword,
      })
      if (user?.id || user?._id) {
        toast.success('✓ Mot de passe modifié')
        closeModal()
      } else {
        toast.error('× ' + (user?.error || 'Erreur'))
      }
      setState({ ...state, loading: false })
    } catch (error) {
      toast.error('× Erreur serveur')
      setState({ ...state, loading: false })
    }
  }

  return (
    <Modal isOpen={true} onClose={closeModal} title="Changer le mot de passe" size="sm">
      <form className="space-y-4" autoComplete="off" onSubmit={handleUpdate}>
        <Input
          label="Mot de passe actuel"
          type="password"
          value={state?.oldPassword}
          onChange={(e) => setState({ ...state, oldPassword: e.target.value })}
          minLength={8}
          required
        />

        <Input
          label="Nouveau mot de passe"
          type="password"
          value={state?.newPassword}
          onChange={(e) => setState({ ...state, newPassword: e.target.value })}
          minLength={8}
          required
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={closeModal}>
            Annuler
          </Button>
          <Button type="submit" disabled={state?.loading} loading={state?.loading}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
