import { useState } from 'react';
import { Send } from 'lucide-react';
import { Modal, Input, Select, Button, toast } from "../ui";
import { utils } from '../../api/useAPI';

export default function CreateTicketModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    category: 'autre',
    priority: 'normale',
    subject: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    { value: 'paiement', label: '💳 Paiement' },
    { value: 'livraison', label: '🚚 Livraison' },
    { value: 'artwork', label: '🎨 Œuvre d\'art' },
    { value: 'compte', label: '👤 Compte' },
    { value: 'encheres', label: '⚒️ Enchères' },
    { value: 'autre', label: '❓ Autre' }
  ];

  const priorityOptions = [
    { value: 'basse', label: 'Basse' },
    { value: 'normale', label: 'Normale' },
    { value: 'haute', label: 'Haute' },
    { value: 'critique', label: 'Critique' }
  ];

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${utils.api}/support-tickets/create`, {
        method: 'POST',
        headers: utils.options.headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du ticket');
      }

      const data = await response.json();
      toast.success('✓ Ticket créé avec succès');
      
      setFormData({
        category: 'autre',
        priority: 'normale',
        subject: '',
        description: '',
      });

      if (onSuccess) {
        onSuccess(data.ticket);
      }

      onClose();
    } catch (err) {
      toast.error('× ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer un ticket support"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Catégorie"
          options={categoryOptions}
          value={formData.category}
          onChange={(value) => handleInputChange('category', value)}
        />

        <Select
          label="Priorité"
          options={priorityOptions}
          value={formData.priority}
          onChange={(value) => handleInputChange('priority', value)}
        />

        <Input
          label="Sujet"
          value={formData.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          placeholder="Résumé du problème..."
          maxLength={200}
          required
          tooltip="Résumé court de votre problème"
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Décrivez votre problème en détail..."
            required
            rows={4}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm resize-none focus:ring-2 focus:ring-indigo-600 focus:outline-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            className="flex-1"
          >
            <Send className="w-4 h-4 mr-2" />
            Créer le ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
}
