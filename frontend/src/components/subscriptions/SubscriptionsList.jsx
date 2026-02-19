import { Users } from "lucide-react"
import { useState, useEffect } from "react"
import { getUserById } from "../../api/useAuth"

export function SubscriptionsList({ subscriptions }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-gray-900 p-4 md:p-6 my-6 shadow-md">
      {subscriptions?.length >= 1 ? (
        <table className="w-full text-xs md:text-sm text-zinc-200">
          <thead>
            <tr>
              <th className="font-semibold pb-2 text-left text-zinc-400">Utilisateur</th>
              <th className="font-semibold pb-2 text-left text-zinc-400">Plan</th>
              <th className="font-semibold pb-2 text-left text-zinc-400">Formule</th>
              <th className="font-semibold pb-2 text-left text-zinc-400">Statut</th>
              <th className="font-semibold pb-2 text-left text-zinc-400">Montant</th>
              <th className="font-semibold pb-2 text-left text-zinc-400">Début</th>
              <th className="font-semibold pb-2 text-left text-zinc-400">Fin</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions?.map((item, index) => (
              <tr key={index} className="hover:bg-zinc-800/40 transition">
                <td className="py-2 px-2 md:px-4"><UserInfo id={item.userId} /></td>
                <td className="py-2 px-2 md:px-4">{item?.planRole}</td>
                <td className="py-2 px-2 md:px-4">{item?.planName}</td>
                <td className="py-2 px-2 md:px-4 text-zinc-400">{item?.status}</td>
                <td className="py-2 px-2 md:px-4">{item?.amount} {item?.currency}</td>
                <td className="py-2 px-2 md:px-4 text-zinc-400">{new Date(item?.startDate).toLocaleDateString()}</td>
                <td className="py-2 px-2 md:px-4 text-zinc-400">{new Date(item?.endDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-16 rounded-xl w-full bg-gray-900/60">
          <Users className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
          <h3 className="font-medium text-base text-zinc-400 mb-1">Aucun abonnement trouvé</h3>
        </div>
      )}
    </div>
  );
}
function UserInfo({ id }) {
    const [state, setState] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserById(id);
                if (user?._id) {
                    setState(user);
                } else {
                    setState({ name: 'Utilisateur inconnu', email: '' });
                }
            } catch (error) {
                setState({ name: 'Utilisateur inconnu', email: '' });
            }
        };
        fetchUser();
    }, [id]);
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-zinc-100 truncate">{state?.name}</span>
            {state?.email && <span className="text-xs text-zinc-400 truncate">{state?.email}</span>}
        </div>
    );
}
