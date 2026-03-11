import { useState } from "react"
import {Eye} from "lucide-react"
import { Modal } from "../ui"

export function SeeAction({numerisation}){
    const [modal, setModal] = useState(false)
    return (
        <>
        <button
            onClick={() => setModal(true)}
            className="p-2 rounded-md border border-gray-200 bg-white shadow-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Voir la demande"
            title="Voir la demande"
        >
            <Eye className="w-4 h-4 text-blue-500" />
        </button>
        {modal && <SeeModal numerisation={numerisation} closeModal={() => setModal(false)} />}
        </>
    )
}

function SeeModal({numerisation, closeModal}){
    return (
        <Modal
            isOpen={true}
            onClose={closeModal}
            title="Détails de la numérisation"
            size="sm"
        >
            <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">Catégorie:</span>
                    <span className="text-white font-medium">{numerisation.category}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Nombre d'œuvres:</span>
                    <span className="text-white">{numerisation.artworkCount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Adresse:</span>
                    <span className="text-white">{numerisation.address}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Téléphone:</span>
                    <span className="text-white">{numerisation.telephone}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Frais:</span>
                    <span className="text-white">{numerisation.price?.toLocaleString('fr-FR')?.replace(/\s/g, '\u2007') || "À venir"} {numerisation.currency || "FCFA"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Description:</span>
                    <span className="text-white">{numerisation.description || "Aucune"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{new Date(numerisation.createdAt).toLocaleDateString('fr-Fr')}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Statut:</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${numerisation.status === 'accepted' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}>
                        {numerisation.status}
                    </span>
                </div>
            </div>
        </Modal>
    )
}