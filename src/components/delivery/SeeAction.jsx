import { Eye } from "lucide-react";
import { useState } from "react";
import { Modal } from "../ui";

export function SeeAction({ delivery }) {
    const [modal, setModal] = useState(false)
    return (
        <>
        <button
            onClick={() => setModal(true)}
            className="p-2 rounded-md border border-gray-200 bg-white shadow-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Voir la livraison"
            title="Voir la livraison"
        >
            <Eye className="w-4 h-4 text-blue-500" />
        </button>
        {modal && <SeeModal delivery={delivery} closeModal={() => setModal(false)} />}
        </>
    );
}

function SeeModal({delivery, closeModal}){
    return (
        <Modal
            isOpen={true}
            onClose={closeModal}
            title="Détails de la livraison"
            size="sm"
        >
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">Adresse:</span>
                    <span className="text-white font-medium">{delivery.deliveryAddress}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{delivery.deliveryDate}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Collecte:</span>
                    <span className="text-white">{delivery.collectDate}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Frais:</span>
                    <span className="text-white">{delivery.price?.toLocaleString('fr-FR')?.replace(/\s/g, '\u2007') || "À venir"} {delivery.currency || "FCFA"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Client:</span>
                    <span className="text-white">{delivery.recipientName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Téléphone:</span>
                    <span className="text-white">{delivery.recipientPhone}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Priorité:</span>
                    <span className="text-white">{delivery.deliveryPriority}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Instructions:</span>
                    <span className="text-white">{delivery.specialInstructions || "Aucune"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Taille:</span>
                    <span className="text-white">{delivery.packageSize == "small" ? "Petit" : delivery.packageSize == "medium" ? "Moyen" : delivery.packageSize == "large" ? "Grand" : "Très grand"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Poids:</span>
                    <span className="text-white">{delivery.packageWeight}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Statut:</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${delivery.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}>
                        {delivery.status}
                    </span>
                </div>
            </div>
        </Modal>
    );
}