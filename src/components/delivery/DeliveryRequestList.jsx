import { Search } from "lucide-react";
import { DeliveryRequestListItem } from "./DeliveryRequestListItem"
import { useEffect, useState } from "react";

export function DeliveryRequestList({deliveries}){
    const [state, setState] = useState({
        set : deliveries,
        search : ""
    });
    useEffect(() => {
        let filtered;
        if(state?.search != ""){
            filtered = deliveries?.filter(delivery => {
            const query = state.search.toLowerCase();
                return (
                    delivery.recipientName?.toLowerCase().includes(query) ||
                    delivery.recipientPhone?.toLowerCase().includes(query) ||
                    delivery.trackingId?.toLowerCase().includes(query)
                );
            })
        }
        else if(state?.search == ""){
            filtered = deliveries
        }
        setState(prev => ({
            ...prev,
            set : filtered
        }))

    }, [state.search, deliveries])
    return (
        <>
        <div className="relative w-full max-w-xl flex items-center mb-6">
            <span className="border-s border-y rounded-s-md text-white p-2 bg-kcb-noir">
            <Search className="h-5 w-5" />
            </span>
            <input
            type="text"
            value={state?.search}
            onChange={e => setState({...state, search: e.target.value})}
            placeholder="Rechercher une livraison par destinataire, trackingId ou numéro de téléphone"
            className="w-full p-2 text-sm rounded-e-md border-y border-e border-border bg-kcb-noir text-white focus:outline-none"
            />
        </div>
        <div className="overflow-auto rounded-md border border-white/[0.06] bg-kcb-ardoise px-0 py-0">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-kcb-ardoise text-white/80">
                        <th className="font-semibold text-left text-xs">Tracking Id</th>
                        <th className="font-semibold text-left text-xs">Priorité</th>
                        <th className="font-semibold text-left text-xs">Destinataire</th>
                        <th className="font-semibold text-right text-xs">Numéro</th>
                        <th className="font-semibold text-right text-xs">Destination</th>
                        <th className="font-semibold text-right text-xs">Statut</th>
                        <th className="font-semibold text-right text-xs">Date de collecte</th>
                        <th className="font-semibold text-right text-xs">Date de livraison</th>
                        <th className="font-semibold text-right text-xs">Prix</th>
                        <th className="font-semibold text-right text-xs">Taille du colis</th>
                        <th className="font-semibold text-right text-xs">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {state?.set?.length > 0 ? (
                        state?.set?.map((delivery, index) => (
                            <DeliveryRequestListItem key={index} delivery={delivery} />
                        ))
                    ) : (
                        <tr>
                        <td colSpan="11" className="text-center py-8 text-white/40">Pas de demandes de livraison</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        </>
    )
}