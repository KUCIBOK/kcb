import { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { createInquiry } from "../../api/useSourcing";

const PURPOSE_OPTIONS = [
  { value: "exhibition", label: "Exposition temporaire" },
  { value: "acquisition", label: "Acquisition" },
  { value: "loan", label: "Prêt temporaire" },
  { value: "expertise", label: "Expertise / Estimation" },
  { value: "other", label: "Autre" },
];

const AVAILABILITY_LABELS = {
  available: { label: "Disponible", color: "text-green-400 bg-green-900/30 border-green-700/40" },
  on_exhibition: { label: "En exposition", color: "text-yellow-400 bg-yellow-900/30 border-yellow-700/40" },
  on_request: { label: "Sur demande", color: "text-indigo-400 bg-indigo-900/30 border-indigo-700/40" },
  unavailable: { label: "Indisponible", color: "text-red-400 bg-red-900/30 border-red-700/40" },
};

const INITIAL = { purpose: "", organization: "", budget: "", message: "" };

/**
 * Modal de demande de mise en relation (sourcing) pour le catalogue certifié F3.
 *
 * @param {object} props
 * @param {object} props.artwork - L'œuvre cible
 * @param {boolean} props.isOpen - Visibilité de la modale
 * @param {Function} props.onClose - Fermeture
 */
export function SourcingInquiryModal({ artwork, isOpen, onClose }) {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const availability = artwork?.availabilityStatus
    ? AVAILABILITY_LABELS[artwork.availabilityStatus]
    : null;

  const handleClose = () => {
    setForm(INITIAL);
    setSuccess(false);
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.purpose || !form.message) {
      setError("Veuillez indiquer l'objet et votre message.");
      return;
    }
    setLoading(true);
    const result = await createInquiry({
      artworkId: artwork._id,
      purpose: form.purpose,
      organization: form.organization,
      budget: form.budget,
      message: form.message,
    });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="font-serif text-lg font-bold text-white">Demande de mise en relation</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="w-14 h-14 text-green-400" />
            <h3 className="text-white font-semibold text-lg">Demande envoyée</h3>
            <p className="text-gray-400 text-sm">
              Votre demande de sourcing a bien été transmise à l'équipe Kucibok.
              Un responsable vous contactera sous 48 h ouvrées.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 px-5 py-2 bg-indigo-kcb hover:bg-indigo-kcb/90 text-white rounded-md text-sm font-medium transition"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Artwork info */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-900 border border-gray-800">
              {artwork?.image && (
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-700 shrink-0"
                />
              )}
              <div>
                <p className="text-white font-semibold text-sm leading-tight">{artwork?.title}</p>
                <p className="text-gray-400 text-xs mt-0.5">{artwork?.artist}</p>
                {availability && (
                  <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full border font-medium ${availability.color}`}>
                    {availability.label}
                  </span>
                )}
              </div>
            </div>

            {/* Objet */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Objet de la demande *</label>
              <select
                required
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                className="rounded-md bg-gray-900 border border-gray-700 p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition"
              >
                <option value="">Sélectionner…</option>
                {PURPOSE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Organisation */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Organisation / Institution</label>
              <input
                type="text"
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                placeholder="ex: Musée d'Art Moderne, Galerie Templon…"
                className="rounded-md bg-gray-900 border border-gray-700 p-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition"
              />
            </div>

            {/* Budget */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Budget indicatif</label>
              <input
                type="text"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="ex: €5 000 – €10 000, Sur demande…"
                className="rounded-md bg-gray-900 border border-gray-700 p-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Message *</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Décrivez votre projet, votre intérêt pour cette œuvre…"
                className="rounded-md bg-gray-900 border border-gray-700 p-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-kcb transition resize-none"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-kcb hover:bg-indigo-kcb/90 text-white rounded-md text-sm font-medium transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? "Envoi…" : "Envoyer la demande"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
