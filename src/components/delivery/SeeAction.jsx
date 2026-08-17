import { Eye } from 'lucide-react'
import { useState } from 'react'
import { Modal } from '../ui'

export function SeeAction({ delivery }) {
  const [modal, setModal] = useState(false)
  return (
    <>
      <button
        onClick={() => setModal(true)}
        className="p-2 rounded-[4px] border border-white/[0.06] bg-kcb-ardoise shadow-sm hover:bg-kcb-ardoise transition-colors focus:outline-none focus:ring-2 focus:ring-kcb-or"
        aria-label="Voir la livraison"
        title="Voir la livraison"
      >
        <Eye className="w-4 h-4 text-kcb-or" />
      </button>
      {modal && <SeeModal delivery={delivery} closeModal={() => setModal(false)} />}
    </>
  )
}

function SeeModal({ delivery, closeModal }) {
  return (
    <Modal isOpen={true} onClose={closeModal} title="Détails de la livraison" size="sm">
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-kcb-pierre">Adresse:</span>
          <span className="text-white font-medium">{delivery.deliveryAddress}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-kcb-pierre">Date:</span>
          <span className="text-white">{delivery.deliveryDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-kcb-pierre">Collecte:</span>
          <span className="text-white">{delivery.collectDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-kcb-pierre">Frais:</span>
          <span className="text-white">
            {delivery.price?.toLocaleString('fr-FR')?.replace(/\s/g, '\u2007') || 'À venir'}{' '}
            {delivery.currency || 'FCFA'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-kcb-pierre">Client:</span>
          <span className="text-white">{delivery.recipientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-kcb-pierre">Téléphone:</span>
          <span className="text-white">{delivery.recipientPhone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-kcb-pierre">Priorité:</span>
          <span className="text-white">{delivery.deliveryPriority}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-kcb-pierre">Instructions:</span>
          <span className="text-white">{delivery.specialInstructions || 'Aucune'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-kcb-pierre">Taille:</span>
          <span className="text-white">
            {delivery.packageSize == 'small'
              ? 'Petit'
              : delivery.packageSize == 'medium'
                ? 'Moyen'
                : delivery.packageSize == 'large'
                  ? 'Grand'
                  : 'Très grand'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-kcb-pierre">Poids:</span>
          <span className="text-white">{delivery.packageWeight}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-kcb-pierre">Statut:</span>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${delivery.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}
          >
            {delivery.status}
          </span>
        </div>
      </div>
    </Modal>
  )
}
