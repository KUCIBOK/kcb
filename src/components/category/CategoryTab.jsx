import { Plus } from "lucide-react";
import { useCategoryStore } from "../../store/CategoryStore";
import { useState } from "react";
import { CategoryList } from "./CategoryList";
import { Modal, Input, Button, toast } from "../ui";




export function CategoryTab() {
  const { categories } = useCategoryStore();
  const [showModal, setShowModal] = useState(false);
  return (
    <section>
      <div className="rounded-xl bg-gray-900 p-4 md:p-6 mb-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Catégories</h2>
          <button
            onClick={() => setShowModal(true)}
            className="rounded bg-indigo-kcb/90 hover:bg-indigo-kcb px-3 py-2 text-white text-xs md:text-sm font-medium flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
        <CategoryList categories={categories} />
      </div>
      {showModal && <AddCategoryModal closeModal={() => setShowModal(false)} />}
    </section>
  );
}


function AddCategoryModal({ closeModal }) {
  const { addCategory } = useCategoryStore();
  const [state, setState] = useState({
    title: "",
    loading: false
  });

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      setState({ ...state, loading: true });
      const category = await addCategory({ title: state.title });
      if (category?._id) {
        toast.success('✓ Catégorie ajoutée');
        closeModal();
      } else {
        toast.error('× ' + (category?.error || 'Erreur'));
      }
      setState({ ...state, loading: false });
    } catch (error) {
      toast.error('× Erreur serveur');
      setState({ ...state, loading: false });
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={closeModal}
      title="Ajouter une catégorie"
      size="sm"
    >
      <form onSubmit={handleAddCategory} className="space-y-4">
        <Input
          label="Titre de la catégorie"
          value={state.title}
          onChange={(e) => setState({ ...state, title: e.target.value })}
          placeholder="Titre de la catégorie"
          minLength={3}
          required
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={closeModal}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={state.loading}
            loading={state.loading}
          >
            Ajouter
          </Button>
        </div>
      </form>
    </Modal>
  );
}