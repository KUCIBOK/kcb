import { useGalleries } from "../../store/GalleryContext";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { importGalleries } from "../../api/useGallery"; // 🔑 utiliser l’API centralisée
import { useToast } from "../../store/ToastContext";

export default function GalleriesTab() {
  const { galleries, total, filtered, refresh } = useGalleries();
  const { makeToast } = useToast();

  const [state, setState] = useState({
    set: galleries.slice(0, 40),
    galleries: galleries,
  });

  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // Export CSV helper
  const escapeCsv = (val) => {
    const s = String(val).replaceAll('"', '""');
    if (s.includes(",") || s.includes("\n") || s.includes('"')) return `"${s}"`;
    return s;
  };

  const handleExport = () => {
    const rows = [
      "name,email",
      ...state.galleries.map(
        (g) => `${escapeCsv(g?.name || "")},${escapeCsv(g?.email || "")}`
      ),
    ];
    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `galleries_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Initial state sync
  useEffect(() => {
    setState({
      set: galleries.slice(0, 40),
      galleries,
    });
  }, [galleries]);

  // Search filter
  useEffect(() => {
    const query = search.trim().toLowerCase();
    let filteredList = galleries;
    if (query !== "") {
      filteredList = galleries.filter((g) => {
        return (
          g.name?.toLowerCase().includes(query) ||
          g.email?.toLowerCase().includes(query)
        );
      });
    }
    setState({
      set: filteredList.slice(0, 40),
      galleries: filteredList,
    });
  }, [search, galleries]);

  // Handle file import
  const handleImport = async () => {
    if (!file) {
      fileInputRef.current?.click();
      return;
    }
    try {
      setUploading(true);
      setImportResult(null);

      const form = new FormData();
      form.append("file", file);

      const data = await importGalleries(form); // 🔑 centralisé via useGallery.js

      if (data?.error) {
        makeToast("Erreur", "warning", data.error);
        setImportResult({ error: data.error });
      } else {
        makeToast("Succès", "success", "Import réussi !");
        setImportResult(data);
        // refresh list to include new/updated galleries
        refresh?.();
      }
    } catch (e) {
      setImportResult({ error: e.message });
    } finally {
      setUploading(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-[4px] bg-kcb-ardoise shadow-none p-6">
      <h2 className="text-xl font-semibold text-white/90 mb-6">
        Galeries & Institutions
      </h2>

      {/* Import / Export */}
      <div className="mb-4 p-3 rounded-md border border-white/[0.06] bg-kcb-ardoise/40 flex flex-col md:flex-row gap-2 items-start md:items-center">
        <input
          type="file"
          accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm text-kcb-sable"
          ref={fileInputRef}
        />
        <button
          disabled={uploading}
          onClick={handleImport}
          className="px-3 py-2 rounded-md bg-kcb-or hover:bg-kcb-or/90 text-kcb-noir text-sm disabled:opacity-50"
        >
          {uploading ? "Import en cours..." : "Importer (CSV/XLSX)"}
        </button>
        {importResult && (
          <span className="text-xs text-kcb-pierre">
            {importResult.error
              ? `Erreur d'import: ${importResult.error}`
              : `Import ok. Lignes: ${importResult.totalRows} | Avec email: ${importResult.withEmailCount}`}
          </span>
        )}
        <div className="flex-1" />
        <button
          onClick={handleExport}
          className="px-3 py-2 rounded-md bg-kcb-ardoise hover:bg-white/[0.08] text-white text-sm"
        >
          Exporter CSV
        </button>
      </div>

      {/* Statistiques */}
      <div className="mb-2 flex gap-4 text-sm text-kcb-pierre">
        <span>
          Total : <span className="font-bold text-white/80">{total}</span>
        </span>
        <span>
          Avec email :{" "}
          <span className="font-bold text-green-400">{filtered}</span>
        </span>
        <span>
          Affichées :{" "}
          <span className="font-bold text-kcb-or">
            {state.galleries.length}
          </span>
        </span>
      </div>

      {/* Recherche */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          className="w-full max-w-9/10 rounded-s-md border-y border-s border-white/[0.06] bg-kcb-ardoise px-3 py-2 text-sm text-kcb-sable placeholder-kcb-pierre focus:outline-none"
          placeholder="Rechercher une galerie, ville, pays, téléphone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="w-full max-w-1/10 rounded-e-md border-y border-e border-white/[0.06] bg-kcb-ardoise px-3 py-2.5 text-sm text-kcb-sable">
          <Search className="w-4 h-4" />
        </span>
      </div>

      {/* Liste */}
      {state?.set?.length === 0 ? (
        <div className="text-kcb-pierre">Aucune galerie trouvée.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm bg-kcb-noir rounded-[4px]">
              <thead>
                <tr>
                  <th className="border px-2 py-2">Nom</th>
                  <th className="border px-2 py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {state.set.map((g) => (
                  <tr key={g?._id} className="hover:bg-kcb-ardoise/40">
                    <td className="border px-2 py-2 font-bold text-white/90">
                      {g?.name}
                    </td>
                    <td className="border px-2 py-2 text-xs">
                      {g?.email || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {state.galleries.length > 40 && (
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="rounded-md border border-white/[0.06] px-4 py-2 text-sm text-kcb-sable bg-transparent hover:bg-kcb-ardoise transition"
                onClick={() => {
                  if (state.set[0] !== state.galleries[0]) {
                    const startIndex =
                      state.galleries.indexOf(state.set[0]) - 40;
                    setState({
                      ...state,
                      set: state.galleries.slice(startIndex, startIndex + 40),
                    });
                  }
                }}
                disabled={state.set[0] === state.galleries[0]}
              >
                <ChevronLeft className="w-4 h-4 mr-1 inline-block" /> Précédent
              </button>
              <span className="text-xs text-kcb-pierre flex items-center px-2">
                Page{" "}
                {Math.floor(state.galleries.indexOf(state.set[0]) / 40) + 1} /{" "}
                {Math.ceil(state.galleries.length / 40)}
              </span>
              <button
                className="rounded-md border border-white/[0.06] px-4 py-2 text-sm text-kcb-sable bg-transparent hover:bg-kcb-ardoise transition"
                onClick={() => {
                  const lastIndex = state.galleries.indexOf(
                    state.set[state.set.length - 1]
                  );
                  if (lastIndex < state.galleries.length - 1) {
                    setState({
                      ...state,
                      set: state.galleries.slice(lastIndex + 1, lastIndex + 41),
                    });
                  }
                }}
                disabled={
                  state.set[state.set.length - 1] ===
                  state.galleries[state.galleries.length - 1]
                }
              >
                Suivant <ChevronRight className="w-4 h-4 ml-1 inline-block" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
