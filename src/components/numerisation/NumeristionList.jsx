import { NumerisationListItem } from './NumeristationListItem'

export function NumerisationList({ numerisations }) {
  return (
    <div className="overflow-auto rounded-[4px] border border-white/[0.06] bg-kcb-ardoise px-0 py-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-kcb-ardoise text-white/80">
            <th className="font-semibold text-left text-xs">Catégorie</th>
            <th className="font-semibold text-left text-xs">Nombre d'oeuvres</th>
            <th className="font-semibold text-right text-xs">Numéro</th>
            <th className="font-semibold text-right text-xs">Statut</th>
            <th className="font-semibold text-right text-xs">Prix</th>
            <th className="font-semibold text-right text-xs">Date de création</th>
            <th className="font-semibold text-right text-xs">Actions</th>
          </tr>
        </thead>
        <tbody>
          {numerisations?.length > 0 ? (
            numerisations?.map((numerisation, index) => (
              <NumerisationListItem key={index} numerisation={numerisation} />
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center py-8 text-white/40">
                Pas de numérisations
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
