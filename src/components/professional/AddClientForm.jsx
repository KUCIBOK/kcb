import { useState } from 'react'
import { createClient } from '../../api/useCrm'
import { Input, Select, Button, toast } from '../ui'

export function AddClientForm({ onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    segment: 'other',
  })

  const segmentOptions = [
    { value: 'art-collector', label: "Collectionneur d'art" },
    { value: 'corporate', label: 'Corporate' },
    { value: 'museum', label: 'Musée' },
    { value: 'gallery', label: 'Galerie' },
    { value: 'investor', label: 'Investisseur' },
    { value: 'other', label: 'Autre' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await createClient(formData)

    if (result.error) {
      toast.error(`× ${result.error}`)
    } else {
      toast.success('✓ Client créé avec succès!')
      setFormData({
        name: '',
        email: '',
        phone: '',
        country: '',
        city: '',
        segment: 'other',
      })
      setTimeout(() => onSuccess(), 500)
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom */}
        <Input
          label="Nom complet"
          tooltip="Le nom complet du client (obligatoire)"
          tooltipPlacement="top"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Jean Dupont"
        />

        {/* Email */}
        <Input
          label="Email"
          tooltip="Adresse e-mail pour les communications"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="jean@example.com"
        />

        {/* Téléphone */}
        <Input
          label="Téléphone"
          tooltip="Numéro de téléphone avec l'indicatif pays"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+221 77 XXX XX XX"
        />

        {/* Pays */}
        <Input
          label="Pays"
          tooltip="Pays de résidence ou d'enregistrement"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Sénégal"
        />

        {/* Ville */}
        <Input
          label="Ville"
          tooltip="Ville ou localité de résidence"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Dakar"
        />

        {/* Segment */}
        <div>
          <Select
            label="Segment client"
            options={segmentOptions}
            value={formData.segment}
            onChange={(value) => setFormData((prev) => ({ ...prev, segment: value }))}
          />
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading || !formData.name}
            loading={loading}
            className="flex-1"
          >
            {loading ? 'Création...' : 'Créer le client'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AddClientForm
