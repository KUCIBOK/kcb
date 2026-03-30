import { PlansListItem } from "./PlansListItem";

export function PlansList({ plans, title, icon }) {
    return (
        <>
        <h3 className="flex items-center gap-2"> {icon} {title} </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-4">
            {plans?.length > 0 ? 
                plans.map((plan, index) => (
                    <div key={index}>
                        <PlansListItem plan={plan} />
                    </div>
                ))
                :
                (
                    <div className="col-span-3 text-center p-4 border rounded-[4px]">
                        <p className="text-kcb-pierre">Pas de plan disponible</p>
                    </div>
                )
            }
        </div>
        </>
    )
}