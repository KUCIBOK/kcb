import { useState } from 'react'
import { Modal, Input, Button, toast } from '../ui'

const AddClient = ({ onAddClient, onClose }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    ville: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.telephone && formData.telephone.trim() !== '') {
      const phoneRegex = /^[\d\s+\-()]+$/
      if (!phoneRegex.test(formData.telephone.trim())) {
        toast.error('× Numéro de téléphone invalide')
        return
      }
    }

    setIsLoading(true)

    const result = await onAddClient(formData)
    setIsLoading(false)

    if (!result.error) {
      toast.success('✓ Client ajouté')
      onClose()
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        ville: '',
      })
    } else {
      toast.error('× ' + result.error)
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Ajouter un client" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Nom"
            value={formData.nom}
            onChange={(e) => handleInputChange('nom', e.target.value)}
            required
          />
          <Input
            label="Prénom"
            value={formData.prenom}
            onChange={(e) => handleInputChange('prenom', e.target.value)}
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />

        <Input
          label="Téléphone"
          type="tel"
          value={formData.telephone}
          onChange={(e) => handleInputChange('telephone', e.target.value)}
        />

        <Input
          label="Ville"
          value={formData.ville}
          onChange={(e) => handleInputChange('ville', e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading} loading={isLoading}>
            Ajouter
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddClient
