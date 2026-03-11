import { Fragment, useEffect, useState } from "react";
import { BlogTableItem } from "./BlogTableItem";
import { ChevronLeft, ChevronRight } from "lucide-react";


export function BlogTable({ posts }) {
  const [state, setState] = useState({
    set: posts.slice(0, 5),
    posts: posts
  });
  useEffect(() => {
    setState({ set: posts.slice(0, 5), posts });
  }, [posts]);

  const handlePrev = () => {
    if (state.set[0] !== state.posts[0]) {
      const startIndex = state.posts.indexOf(state.set[0]) - 5;
      setState({ ...state, set: state.posts.slice(startIndex, startIndex + 5) });
    }
  };
  const handleNext = () => {
    const lastIndex = state.posts.indexOf(state.set[state.set.length - 1]);
    if (lastIndex < state.posts.length - 1) {
      setState({ ...state, set: state.posts.slice(lastIndex + 1, lastIndex + 6) });
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end gap-2 mb-3">
        <button
          className="rounded-lg px-3 py-1 text-xs text-white/60 bg-gray-900 hover:bg-gray-800 transition disabled:opacity-30 shadow-none border-none"
          onClick={handlePrev}
          disabled={state.set[0] === state.posts[0]}
        >
          <ChevronLeft size={16} className="inline align-middle mr-1" /> Précédent
        </button>
        <button
          className="rounded-lg px-3 py-1 text-xs text-white/60 bg-gray-900 hover:bg-gray-800 transition disabled:opacity-30 shadow-none border-none"
          onClick={handleNext}
          disabled={state.set[state.set.length - 1] === state.posts[state.posts.length - 1]}
        >
          Suivant <ChevronRight size={16} className="inline align-middle ml-1" />
        </button>
      </div>
      <div className="overflow-auto rounded-xl">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-white/70 border-b border-gray-900">
              <th className="py-2 px-2 font-medium text-left whitespace-nowrap">Aperçu</th>
              <th className="py-2 px-2 font-medium text-left whitespace-nowrap">Titre</th>
              <th className="py-2 px-2 font-medium text-left whitespace-nowrap">Extrait</th>
              <th className="py-2 px-2 font-medium text-left whitespace-nowrap">Date</th>
              <th className="py-2 px-2 font-medium text-left whitespace-nowrap">Visites</th>
              <th className="py-2 px-2 font-medium text-left whitespace-nowrap">Statut</th>
              <th className="py-2 px-2 font-medium text-left whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          {posts?.length >= 1 ? (
            <tbody>
              {state.set.map((item, index) => (
                <Fragment key={index}>
                  <BlogTableItem post={item} />
                </Fragment>
              ))}
            </tbody>
          ) : (
            <tfoot>
              <tr>
                <td colSpan={7} className="text-center text-white/40 py-8 text-sm">Aucun article trouvé.</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}