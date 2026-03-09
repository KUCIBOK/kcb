import { Trash2 } from "lucide-react";
import { useCategoryStore } from "../../store/CategoryStore";


export function CategoryList({ categories }) {
  const { deleteCategory } = useCategoryStore();
  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
  };
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900 px-0 py-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900 text-white/80">
            <th className="py-2 px-4 font-semibold text-left">Titre</th>
            <th className="py-2 px-4 font-semibold text-left">Créé le</th>
            <th className="py-2 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories?.length > 0 ? (
            categories.map((category, index) => (
              <tr key={index} className="border-b border-gray-800 last:border-0 hover:bg-gray-900/60 transition">
                <td className="py-2 px-4 text-white/90">{category.title}</td>
                <td className="py-2 px-4 text-white/50">{new Date(category.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 text-right">
                  <button
                    onClick={async () => await handleDeleteCategory(category._id)}
                    className="bg-red-700/80 hover:bg-red-700 text-white p-2 rounded-sm transition"
                    aria-label="Supprimer la catégorie"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-8 text-white/40">Aucune catégorie disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}