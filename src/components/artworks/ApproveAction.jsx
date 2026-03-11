import { Check, X } from "lucide-react"
import { memo, useState } from "react"
import { useArtworks } from "../../store/ArtworkContext"
import { DataLoader } from "../loaders/PageLoader"

export const ApproveAction = memo(({artwork}) => {
    const {approveArtwork} = useArtworks()
    const [state, setState] = useState({
        loading : false,
        error : ""
    })
    const setStatus = async (status) => {
        setState({...state, loading : true})
        const updated = await approveArtwork(artwork?._id, status) 
        if(updated?._id){
            setState({...state, loading : false})
        }
        else{
            setState({...state, loading : false, error : updated?.error})
        }
    }
    return (
        <>
            <div className="flex gap-2">
                {(artwork?.status == "pending" || artwork?.status == "rejected") && (
                    <button title="Approuver" onClick={async () => await setStatus('approved')} className="rounded-md bg-green-600 hover:opacity-90 flex items-center gap-3 p-2">
                        {state?.loading ? <DataLoader/> : (<><Check className="w-5 h-5"/></>)}
                    </button>
                )}
                {(artwork?.status == "pending" || artwork?.status == "approved") && 
                    <button title="Rejeter" onClick={async () => await setStatus('rejected')}  className="rounded-md bg-red-900 hover:opacity-90 flex items-center gap-3 p-2">
                        {state?.loading ? <DataLoader/> : (<><X className="w-5 h-5"/></>)}
                    </button>
                }
            </div>
        </>
    )
})

