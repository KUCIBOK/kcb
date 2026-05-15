import { Loader2, Users } from 'lucide-react'

const STATUS_COLORS = {
  active: 'bg-green-500/20 text-green-300 border-green-500/30',
  expired: 'bg-red-500/20 text-red-300 border-red-500/30',
  cancelled: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
}

function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

export function SubscriptionsList({ subscriptions, loading, error }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 bg-kcb-ardoise rounded-[4px]">
        <Loader2 className="w-6 h-6 animate-spin text-kcb-or" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-[4px] text-red-300 text-sm">
        {error}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-[4px] bg-kcb-ardoise p-4 md:p-6 shadow-md">
      {subscriptions?.length >= 1 ? (
        <>
          <p className="text-xs text-kcb-pierre mb-3">{subscriptions.length} abonnement(s)</p>
          <table className="w-full text-xs md:text-sm text-zinc-200">
            <thead>
              <tr>
                <th className="font-semibold pb-2 text-left text-kcb-pierre">Utilisateur</th>
                <th className="font-semibold pb-2 text-left text-kcb-pierre">Plan</th>
                <th className="font-semibold pb-2 text-left text-kcb-pierre">Rôle</th>
                <th className="font-semibold pb-2 text-left text-kcb-pierre">Statut</th>
                <th className="font-semibold pb-2 text-left text-kcb-pierre">Montant</th>
                <th className="font-semibold pb-2 text-left text-kcb-pierre">Début</th>
                <th className="font-semibold pb-2 text-left text-kcb-pierre">Fin</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((item, index) => (
                <tr key={item.id ?? index} className="hover:bg-zinc-800/40 transition">
                  <td className="py-2 px-2 md:px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-zinc-100 truncate">
                        {item.users?.name ?? '—'}
                      </span>
                      {item.users?.email && (
                        <span className="text-xs text-kcb-pierre truncate">{item.users.email}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-2 md:px-4">{item.plans?.name ?? '—'}</td>
                  <td className="py-2 px-2 md:px-4 text-kcb-pierre">{item.plans?.role ?? '—'}</td>
                  <td className="py-2 px-2 md:px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs border ${STATUS_COLORS[item.status] ?? 'bg-white/10 text-kcb-pierre border-white/20'}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2 px-2 md:px-4">
                    {item.amount != null ? `${item.amount} ${item.currency ?? ''}` : '—'}
                  </td>
                  <td className="py-2 px-2 md:px-4 text-kcb-pierre">{fmt(item.start_date)}</td>
                  <td className="py-2 px-2 md:px-4 text-kcb-pierre">{fmt(item.end_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="text-center py-16 rounded-[4px] w-full">
          <Users className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
          <h3 className="font-medium text-base text-kcb-pierre mb-1">Aucun abonnement trouvé</h3>
          <p className="text-xs text-kcb-pierre mt-1">
            Les abonnements créés via PayDunya apparaîtront ici.
          </p>
        </div>
      )}
    </div>
  )
}
