import { useAuth } from "../../store/AuthContext";
import { RejectAction } from "./RejectAction";
import { SeeAction } from "./SeeAction";
import { ValidateAction } from "./ValidateAction";

export function DeliveryRequestListItem({ delivery }) {
    const {user} = useAuth();
    return (
        <tr className="border-b border-white/[0.06] last:border-0 hover:bg-kcb-ardoise/60 transition">
            <td className="text-white/90 text-xs">{delivery.trackingId || "À venir"}</td>
            <td className="text-white/90 text-xs">{delivery.deliveryPriority}</td>
            <td className="text-white/90 text-xs">{delivery.recipientName}</td>
            <td className="text-white/90 text-xs">{delivery.recipientPhone}</td>
            <td className="text-white/90 text-xs">{delivery.deliveryAddress}</td>
            <td className="text-white/90 text-xs">{delivery.status == "pending" ? "En attente" : delivery.status == "in_preparation" ? "En préparation" : delivery.status == "on_the_way" ? "En route" : delivery.status == 'delivered' ? "Livrée" : "Rejetée"}</td>
            <td className="text-white/90 text-xs">
                {delivery.collectDate
                    ? new Date(delivery.collectDate).toLocaleString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })
                    : 
                    ""
                }
            </td>
            <td className="text-white/90 text-xs">
                {delivery.deliveryDate
                    ? new Date(delivery.deliveryDate).toLocaleString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })
                    : 
                    ""
                }
            </td>
            <td className="text-white/90 text-xs">
                {delivery?.price?.toLocaleString('fr-FR')?.replace(/\s/g, '\u2007') || "À venir"} {delivery.currency || "FCFA"}
            </td>
            <td className="text-white/90 text-xs">
                {delivery.packageSize == "small" ? "Petit" : delivery.packageSize == "medium" ? "Moyen" : delivery.packageSize == "large" ? "Grand" : "Très grand"}
            </td>
            <td className="">
                <div className="flex items-center gap-2">
                    <SeeAction delivery={delivery} />
                    {user?.role == "admin" && (
                        <>
                            <ValidateAction delivery={delivery} />
                            <RejectAction delivery={delivery} />
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
    }