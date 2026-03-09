import { useState } from "react"
import {Check} from "lucide-react"
import { useNumerisation } from "../../store/NumerisationStore"
import { Modal, Input, Button, toast } from "../ui"

export function ValidateAction({numerisation}){
    const [modal, setModal] = useState(false)
    return (
        <>
        <button
            onClick={() => setModal(true)}
            className="p-2 rounded-md bg-green-600 shadow-sm hover:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Approuver la demande"
            title="Approuver la demande"
        >
            <Check className="w-4 h-4 text-white" />
        </button>
        {modal && <ApproveModal numerisation={numerisation} closeModal={() => setModal(false)} />}
        </>
    )
}

function ApproveModal({numerisation, closeModal}){
    const [state, setState] = useState({
        price : '',
        status : 'accepted',
        comingDate: '',
        loading : false
    })
    const {updateStatus} = useNumerisation()

    const handleSubmit = async function(e){
        e.preventDefault();
        setState({...state, loading: true})
        try {
            const numReq = await updateStatus(numerisation?._id, {price: state.price, status: state.status, comingDate: state.comingDate})
            if(numReq?._id){
                toast.success('✓ Demande approuvée');
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
            title="Approuver la demande"
            size="sm"
        >
            <form onSubmit={handleSubmit} method="post" className="space-y-4">
                <Input
                    label="Frais"
                    type="number"
                    value={state.price}
                    onChange={(e) => setState({...state, price: e.target.value})}
                    placeholder="Entrez les frais"
                    required
                />

                <Input
                    label="Date de numérisation"
                    type="date"
                    value={state.comingDate}
                    onChange={(e) => setState({...state, comingDate: e.target.value})}
                    required
                />

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={state.loading}
                        loading={state.loading}
                    >
                        Approuver
                    </Button>
                </div>
            </form>
        </Modal>
    )
}