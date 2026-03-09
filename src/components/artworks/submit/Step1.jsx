import { Plus, X } from "lucide-react";
import { memo, useRef } from "react";
import { useToast } from "../../../store/ToastContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCategoryStore } from "../../../store/CategoryStore";

export const Step1 = memo(({ formState, setFormState }) => {
  const { categories } = useCategoryStore();
  const { makeToast } = useToast();
  const tagInputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formState.title.length > 0 &&
      formState.description.length > 0 &&
      formState.tags.length > 0
    ) {
      setFormState({ ...formState, step: formState.step + 1 });
    } else {
      makeToast(
        "Erreur",
        "warning",
        "Veuillez remplir tous les champs ou ajouter des mots clés"
      );
    }
  };

  // Animation for tags
  const handleAddTag = () => {
    if (
      formState.tag.length > 0 &&
      formState.tags.length < 5 &&
      !formState.tags.includes(formState.tag)
    ) {
      setFormState({
        ...formState,
        tags: [...formState.tags, formState.tag],
        tag: "",
      });
      setTimeout(() => tagInputRef.current?.focus(), 100);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      method="post"
      className="space-y-7 bg-gray-900 animate-fade-in"
    >
      {/* Titre */}
      <div className="relative flex flex-col gap-1">
        <label
          htmlFor="title"
          className="text-xs text-gray-400 font-medium transition-all"
        >
          Titre
        </label>
        <input
          onChange={(e) =>
            setFormState({ ...formState, title: e.target.value })
          }
          value={formState.title}
          type="text"
          id="title"
          className="rounded-md bg-gray-900 border border-gray-700 p-2 text-sm text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition-all"
          placeholder="Titre de l'oeuvre"
          minLength={4}
          required
        />
      </div>

      {/* Catégorie */}
      <div className="relative flex flex-col gap-1">
        <label
          htmlFor="category"
          className="text-xs text-gray-400 font-medium pointer-events-none"
        >
          Catégorie
        </label>
        <select
          required
          onChange={(e) =>
            setFormState({
              ...formState,
              category: e.target.value,
              categoryId: categories.find(
                (item) => item.title === e.target.value
              )?._id,
            })
          }
          value={formState.category}
          name="category"
          id="category"
          className="rounded-md bg-gray-900 border border-gray-700 p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition-all"
        >
          <option>Catégorie</option>
          {categories.map((category, index) => (
            <option key={index} value={category.title}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="description"
          className="text-xs text-gray-400 font-medium mb-1"
        >
          Description
        </label>
        <ReactQuill
          theme="snow"
          value={formState.description}
          onChange={(value) =>
            setFormState({ ...formState, description: value })
          }
          className="border border-gray-700 bg-gray-900 text-white rounded-md quill-dark"
          placeholder="Parlez-nous de votre œuvre et de son inspiration"
          minLength={15}
          required
        />
      </div>

      {/* Mettre en vente */}
      <div className="flex items-center gap-2 mt-2">
        <input
          onChange={(e) =>
            setFormState({ ...formState, forSale: e.target.checked })
          }
          checked={formState.forSale}
          type="checkbox"
          id="forSale"
          className="accent-indigo-kcb scale-110 focus:ring-2 focus:ring-indigo-kcb"
        />
        <label htmlFor="forSale" className="text-xs text-gray-300">
          Mettre en vente ?
        </label>
      </div>

      {/* Mettre aux enchères */}
      <div className="flex items-center gap-2 mt-2">
        <input
          onChange={(e) =>
            setFormState({
              ...formState,
              auctionStatus: e.target.checked
                ? "auction_ongoing"
                : "not_for_auction",
            })
          }
          checked={formState.auctionStatus === "auction_ongoing"}
          type="checkbox"
          id="auctionStatus"
          className="accent-indigo-kcb scale-110 focus:ring-2 focus:ring-indigo-kcb"
        />
        <label htmlFor="auctionStatus" className="text-xs text-gray-300">
          Mettre cette œuvre aux enchères ?
        </label>
      </div>

      {/* Mensurations */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="mensurations"
          className="text-xs text-gray-400 font-medium"
        >
          Mensurations
        </label>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <input
            className="w-full rounded-md bg-gray-900 border border-gray-700 p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition-all"
            min={10}
            max={500}
            onChange={(e) =>
              setFormState({ ...formState, height: e.target.value })
            }
            name="height"
            type="number"
            placeholder="Hauteur (cm)"
          />
          <input
            className="w-full rounded-md bg-gray-900 border border-gray-700 p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition-all"
            min={10}
            max={500}
            onChange={(e) =>
              setFormState({ ...formState, width: e.target.value })
            }
            name="width"
            type="number"
            placeholder="Largeur (cm)"
          />
          <input
            className="w-full rounded-md bg-gray-900 border border-gray-700 p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition-all"
            min={1}
            max={1000}
            onChange={(e) =>
              setFormState({ ...formState, weight: e.target.value })
            }
            name="weight"
            type="number"
            placeholder="Poids (kg)"
          />
        </div>
      </div>

      {/* Standard Kucibok */}
      <div className="border border-indigo-900/40 rounded-lg p-4 space-y-4 bg-indigo-950/20">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          Standard Kucibok — Certification
        </p>

        {/* Médium / Technique */}
        <div className="flex flex-col gap-1">
          <label htmlFor="medium" className="text-xs text-gray-400 font-medium">
            Médium / Technique
          </label>
          <input
            onChange={(e) => setFormState({ ...formState, medium: e.target.value })}
            value={formState.medium}
            type="text"
            id="medium"
            className="rounded-md bg-gray-900 border border-gray-700 p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition-all"
            placeholder="ex: Huile sur toile, Bronze, Bois sculpté…"
          />
        </div>

        {/* État */}
        <div className="flex flex-col gap-1">
          <label htmlFor="condition" className="text-xs text-gray-400 font-medium">
            État de conservation
          </label>
          <select
            onChange={(e) => setFormState({ ...formState, condition: e.target.value })}
            value={formState.condition}
            id="condition"
            className="rounded-md bg-gray-900 border border-gray-700 p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition-all"
          >
            <option value="">Sélectionner…</option>
            <option value="excellent">Excellent</option>
            <option value="very_good">Très bon</option>
            <option value="good">Bon</option>
            <option value="fair">Correct</option>
          </select>
        </div>

        {/* Provenance */}
        <div className="flex flex-col gap-1">
          <label htmlFor="provenance" className="text-xs text-gray-400 font-medium">
            Provenance
          </label>
          <input
            onChange={(e) => setFormState({ ...formState, provenance: e.target.value })}
            value={formState.provenance}
            type="text"
            id="provenance"
            className="rounded-md bg-gray-900 border border-gray-700 p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition-all"
            placeholder="ex: Collection privée, Galerie XYZ, Atelier de l'artiste…"
          />
        </div>

        {/* Disponibilité catalogue */}
        <div className="flex flex-col gap-1">
          <label htmlFor="availabilityStatus" className="text-xs text-gray-400 font-medium">
            Disponibilité catalogue
          </label>
          <select
            onChange={(e) => setFormState({ ...formState, availabilityStatus: e.target.value })}
            value={formState.availabilityStatus}
            id="availabilityStatus"
            className="rounded-md bg-gray-900 border border-gray-700 p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition-all"
          >
            <option value="available">Disponible</option>
            <option value="on_exhibition">En exposition</option>
            <option value="on_request">Sur demande</option>
            <option value="unavailable">Indisponible</option>
          </select>
        </div>
      </div>

      {/* Tags dynamiques */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="tags"
          className="text-xs text-gray-400 font-medium mb-1"
        >
          Mots-clés
        </label>
        <div className="flex gap-2">
          <input
            ref={tagInputRef}
            onChange={(e) =>
              setFormState({ ...formState, tag: e.target.value })
            }
            value={formState.tag}
            type="text"
            className="w-full rounded-md bg-gray-900 border border-gray-700 p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition-all"
            placeholder="Ajoutez des mots-clés"
            minLength={3}
            maxLength={12}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <button
            onClick={handleAddTag}
            type="button"
            className="bg-indigo-kcb text-white px-3 rounded-lg hover:bg-indigo-800 transition flex items-center justify-center shadow-md disabled:opacity-40"
            disabled={formState.tag.length === 0 || formState.tags.length >= 5}
            tabIndex={-1}
            aria-label="Ajouter mot-clé"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 min-h-[36px]">
          {formState.tags.map((tag, index) => (
            <span
              key={tag}
              className="bg-purple-700/70 flex items-center gap-1 text-white rounded-full px-3 py-1 text-xs font-semibold animate-fade-in shadow-sm group cursor-pointer hover:bg-purple-800 transition-all"
            >
              {tag}
              <button
                type="button"
                onClick={() =>
                  setFormState({
                    ...formState,
                    tags: formState.tags.filter((item) => item !== tag),
                  })
                }
                className="ml-1 text-gray-300 hover:text-white focus:outline-none"
                aria-label={`Supprimer ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">
            {formState.tags.length}/5 mots-clés
          </span>
        </div>
      </div>

      {/* Bouton suivant */}
      <div className="flex justify-end mt-8">
        <button
          className="p-2 text-sm rounded-md bg-indigo-800/90 text-white font-semibold hover:bg-indigo-800 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-kcb"
          type="submit"
        >
          Suivant
        </button>
      </div>
    </form>
  );
});
