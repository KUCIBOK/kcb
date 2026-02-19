
import { Filter } from "lucide-react";
import { useCategoryStore } from "../../store/CategoryStore";

export const Filters = ({ state, setState }) => {
    const { categories } = useCategoryStore();
    const periods = [
        { period: "Toutes", value: "all" },
        { period: "Dernières 24h", value: "last-24" },
        { period: "7 derniers jours", value: "last-7d" },
        { period: "30 derniers jours", value: "last-30d" },
        { period: "90 derniers jours", value: "last-90d" }
    ];

    return (
        <aside className="flex flex-col md:min-w-80 md:max-w-64">
            <div className="p-4 rounded-xl bg-gray-900/70 border border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <h3 className="text-white text-base font-semibold">Filtres</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="category" className="block text-xs font-medium text-gray-300 mb-1">Catégorie</label>
                        <select
                            id="category"
                            name="category"
                            value={state.filters.category}
                            onChange={e => setState(prev => ({
                                ...prev,
                                filters: { ...prev.filters, category: e.target.value }
                            }))}
                            className="w-full rounded-md bg-background text-xs text-white py-1.5 px-3 border border-gray-700 focus:outline-none"
                        >
                            <option value="all">Toutes</option>
                            {categories.map((category, idx) => (
                                <option key={idx} value={category.title}>{category.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min={1}
                            value={state.filters.minPrice}
                            onChange={e => setState(prev => ({
                                ...prev,
                                filters: { ...prev.filters, minPrice: e.target.value }
                            }))}
                            placeholder="Min"
                            className="rounded-md w-1/2 bg-background text-xs text-white py-1.5 px-3 border border-gray-700 focus:outline-none"
                        />
                        <input
                            type="number"
                            min={1}
                            value={state.filters.maxPrice}
                            onChange={e => setState(prev => ({
                                ...prev,
                                filters: { ...prev.filters, maxPrice: e.target.value }
                            }))}
                            placeholder="Max"
                            className="rounded-md w-1/2 bg-background text-xs text-white py-1.5 px-3 border border-gray-700 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="created" className="block text-xs font-medium text-gray-300 mb-1">Créé</label>
                        <select
                            id="created"
                            name="created"
                            value={state.filters.created}
                            onChange={e => setState(prev => ({
                                ...prev,
                                filters: { ...prev.filters, created: e.target.value }
                            }))}
                            className="w-full rounded-md bg-background text-xs text-white py-1.5 px-3 border border-gray-700 focus:outline-none"
                        >
                            {periods.map((period, idx) => (
                                <option key={idx} value={period.value}>{period.period}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </aside>
    );
};