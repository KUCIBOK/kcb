import { useAuth } from '../../store/AuthContext'
import { RejectAction } from './RejectAction'
import { SeeAction } from './SeeAction'
import { ValidateAction } from './ValidateAction'

export function NumerisationListItem({ numerisation }) {
  const { user } = useAuth()
  return (
    <tr className="hover:bg-kcb-ardoise">
      <td className="text-left">{numerisation.category}</td>
      <td className="text-left">{numerisation.artworkCount}</td>
      <td className="text-right">{numerisation.telephone}</td>
      <td className="text-right">{numerisation.status}</td>
      <td className="text-right">
        {numerisation.price || 'Non renseigné'} {numerisation.currency}
      </td>
      <td className="text-right">
        {new Date(numerisation.created_at).toLocaleDateString('fr-FR')}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <SeeAction numerisation={numerisation} />
          {user?.role == 'admin' && (
            <>
              <ValidateAction numerisation={numerisation} />
              <RejectAction numerisation={numerisation} />
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
