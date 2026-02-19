import { PlansListItemActions } from "./PlansListItemActions";


export function PlansListItem({ plan }) {
    // Format price with thousands separators
    const formattedPrice = plan.price?.toLocaleString('fr-FR').replace(/\s/g, ' ');

    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 flex flex-col shadow-md hover:shadow-lg transition">
        <div className="p-5 text-center flex flex-col gap-1">
          <h3 className="text-base font-semibold text-white mb-1 tracking-tight">{plan.name}</h3>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xl font-bold text-white">{formattedPrice} {plan.currency}</span>
            <span className="text-xs text-zinc-400 font-medium">{plan.duration === "monthly" ? "/mois" : "/an"}</span>
          </div>
          <p className="text-xs text-zinc-400 mb-2">{plan.description}</p>
        </div>
        <div className="flex-1 px-5 pb-3">
          <ul className="space-y-1">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center text-xs text-zinc-300">
                <span className="mr-2 text-zinc-500">•</span> {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="px-5 pb-4">
          <PlansListItemActions plan={plan} />
        </div>
      </div>
    );
}