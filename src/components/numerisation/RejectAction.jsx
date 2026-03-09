import { useState } from "react"
import {X} from "lucide-react"
import { useNumerisation } from "../../store/NumerisationStore"
import { Modal, Input, Button, toast } from "../ui"

export function RejectAction({numerisation}){
    const [modal, setModal] = useState(false)
    return (
        <>
        <button
            onClick={() => setModal(true)}
            className="p-2 rounded-md bg-red-600 shadow-sm hover:bg-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Rejeter la demande"
            title="Rejeter la demande"
        >
            <X className="w-4 h-4 text-white" />
        </button>
        {modal && <RejectModal numerisation={numerisation} closeModal={() => setModal(false)} />}
        </>
    )
}

function RejectModal({numerisation, closeModal}){
    const [state, setState] = useState({
        reason: '',
        status: 'rejected',
        loading : false
    })
    const {updateStatus} = useNumerisation()

    const handleSubmit = async function(e){
        e.preventDefault();
        setState({...state, loading: true})
        try {
            const numReq = await updateStatus(numerisation?._id, {reason: state.reason, status: state.status})
            if(numReq?._id){
                toast.success('✓ Demande rejetée');
                closeModal()
            } else {
                toast.error('× ' + (numReq?.error || 'Erreur'));
            }
        } catch (error) {
            toast.error('× Erreur serveur');
        }
        setState({...state, loading: false})
    }

    return (
        <Modal
            isOpen={true}
            onClose={closeModal}
            title="Rejeter la demande"
            size="sm"
        >
            <form onSubmit={handleSubmit} method="post" className="space-y-4">
                <Input
                    label="Raison du rejet"
                    value={state.reason}
                    onChange={(e) => setState({...state, reason: e.target.value})}
                    placeholder="Entrez la raison"
                    required
                />

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={state.loading}
                        loading={state.loading}
                        variant="danger"
                    >
                        Rejeter
                    </Button>
                </div>
            </form>
        </Modal>
    )
}