
import { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useCategoryStore } from "../../store/CategoryStore";

export const Filters = ({ state, setState }) => {
    const { categories } = useCategoryStore();
    const [open, setOpen] = useState(false);
    const periods = [
        { period: "Toutes", value: "all" },
        { period: "Dernières 24h", value: "last-24" },
        { period: "7 derniers jours", value: "last-7d" },
        { period: "30 derniers jours", value: "last-30d" },
        { period: "90 derniers jours", value: "last-90d" }
    ];

    return (
        <aside className="w-full md:w-64 md:flex-shrink-0">
            <div className="rounded-xl bg-gray-900/70 border border-gray-800">
                {/* Header — always visible, toggle on mobile */}
                <button
                    type="button"
                    onClick={() => setOpen(o => !o)}
                    className="w-full flex items-center justify-between p-4 md:cursor-default"
                    aria-expanded={open}
                >
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <span className="text-white text-base font-semibold">Filtres</span>
                    </div>
                    <span className="md:hidden text-gray-400">
                        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                </button>

                {/* Body — always open on md+, toggled on mobile */}
                <div className={`px-4 pb-4 space-y-4 ${open ? "block" : "hidden md:block"}`}>
                    {/* Catégorie */}
                    <div>
                        <label htmlFor="filter-category" className="block text-xs font-medium text-gray-300 mb-1">
                            Catégorie
                        </label>
                        <select
                            id="filter-category"
                            value={state.filters.category}
                            onChange={e => setState(prev => ({
                                ...prev,
                                filters: { ...prev.filters, category: e.target.value }
                            }))}
                            className="w-full rounded-md bg-background text-xs text-white py-2 px-3 border border-gray-700 focus:outline-none focus:border-kcb-or"
                        >
                            <option value="all">Toutes</option>
                            {categories.map((category, idx) => (
                                <option key={idx} value={category.title}>{category.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Prix */}
                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Prix (CFA)</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                min={1}
                                value={state.filters.minPrice}
                                onChange={e => setState(prev => ({
                                    ...prev,
                                    filters: { ...prev.filters, minPrice: e.target.value }
                                }))}
                                placeholder="Min"
                                className="rounded-md w-full bg-background text-xs text-white py-2 px-3 border border-gray-700 focus:outline-none focus:border-kcb-or"
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
                                className="rounded-md w-full bg-background text-xs text-white py-2 px-3 border border-gray-700 focus:outline-none focus:border-kcb-or"
                            />
                        </div>
                    </div>

                    {/* Période */}
                    <div>
                        <label htmlFor="filter-created" className="block text-xs font-medium text-gray-300 mb-1">
                            Période
                        </label>
                        <select
                            id="filter-created"
                            value={state.filters.created}
                            onChange={e => setState(prev => ({
                                ...prev,
                                filters: { ...prev.filters, created: e.target.value }
                            }))}
                            className="w-full rounded-md bg-background text-xs text-white py-2 px-3 border border-gray-700 focus:outline-none focus:border-kcb-or"
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
