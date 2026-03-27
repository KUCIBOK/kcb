import { Fragment, useEffect, useState } from 'react'
import { BlogTableItem } from './BlogTableItem'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { SkeletonTable, EmptyState } from '../ui'

export function BlogTable({ posts, loading = false }) {
  const [state, setState] = useState({
    set: posts.slice(0, 5),
    posts: posts,
  })
  useEffect(() => {
    setState({ set: posts.slice(0, 5), posts }) // eslint-disable-line react-hooks/set-state-in-effect
  }, [posts])

  const handlePrev = () => {
    if (state.set[0] !== state.posts[0]) {
      const startIndex = state.posts.indexOf(state.set[0]) - 5
      setState({ ...state, set: state.posts.slice(startIndex, startIndex + 5) })
    }
  }
  const handleNext = () => {
    const lastIndex = state.posts.indexOf(state.set[state.set.length - 1])
    if (lastIndex < state.posts.length - 1) {
      setState({ ...state, set: state.posts.slice(lastIndex + 1, lastIndex + 6) })
    }
  }

  // Show skeleton table while initial data is loading
  if (loading) {
    return <SkeletonTable rows={4} cols={7} />
  }

  // Empty state when posts array is empty and not loading
  if (!posts?.length) {
    return (
      <EmptyState
        icon={FileText}
        title="Aucun article trouvé"
        description="Les articles apparaîtront ici une fois publiés ou archivés."
      />
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-end gap-2 mb-3">
        <button
          className="rounded-[4px] px-3 py-1 text-xs text-white/60 bg-kcb-ardoise hover:bg-white/[0.08] transition disabled:opacity-30 shadow-none border-none"
          onClick={handlePrev}
          disabled={state.set[0] === state.posts[0]}
        >
          <ChevronLeft size={16} className="inline align-middle mr-1" /> Précédent
        </button>
        <button
          className="rounded-[4px] px-3 py-1 text-xs text-white/60 bg-kcb-ardoise hover:bg-white/[0.08] transition disabled:opacity-30 shadow-none border-none"
          onClick={handleNext}
          disabled={state.set[state.set.length - 1] === state.posts[state.posts.length - 1]}
        >
          Suivant <ChevronRight size={16} className="inline align-middle ml-1" />
        </button>
      </div>
      <div className="overflow-auto rounded-[4px]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-white/70 border-b border-white/[0.06]">
              <th className="py-2 px-2 font-medium text-left whitespace-nowrap">Aperçu</th>
              <th className="py-2 px-2 font-medium text-left whitespace-nowrap">Titre</th>
              <th className="py-2 px-2 font-medium text-left whitespace-nowrap">Extrait</th>
              <th className="py-2 px-2 font-medium text-left whitespace-nowrap">Date</th>
              <th className="py-2 px-2 font-medium text-left whitespace-nowrap">Visites</th>
              <th className="py-2 px-2 font-medium text-left whitespace-nowrap">Statut</th>
              <th className="py-2 px-2 font-medium text-left whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.set.map((item, index) => (
              <Fragment key={index}>
                <BlogTableItem post={item} />
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
