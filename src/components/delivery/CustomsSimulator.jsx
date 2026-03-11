import { useState } from "react";
import { FileText, Calculator, AlertCircle, TrendingUp, DollarSign, Package } from "lucide-react";

export function CustomsSimulator() {
    const [formData, setFormData] = useState({
        artworkValue: "",
        artworkCategory: "painting", // painting, sculpture, jewelry, other
        originCountry: "SN", // Senegal
        destinationCountry: "FR",
        weight: "1",
        shippingMethod: "air" // air, sea, express
    });

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    // Customs rates approximation (real rates vary by country)
    const customsRates = {
        paintings: { baseRate: 0.05, description: "Peintures & Dessins" },
        sculptures: { baseRate: 0.08, description: "Sculptures & Statues" },
        jewelry: { baseRate: 0.12, description: "Bijoux & Joaillerie" },
        other: { baseRate: 0.10, description: "Autres Objets d'Art" }
    };

    const shippingMultipliers = {
        air: { cost: 15, days: "2-3 jours", name: "Aérien" },
        sea: { cost: 5, days: "10-15 jours", name: "Maritime" },
        express: { cost: 25, days: "1-2 jours", name: "Express" }
    };

    const insuranceRate = 0.02; // 2% de la valeur

    const countries = {
        "SN": "Sénégal",
        "FR": "France",
        "DE": "Allemagne",
        "IT": "Italie",
        "ES": "Espagne",
        "GB": "Royaume-Uni",
        "US": "États-Unis",
        "CA": "Canada",
        "AU": "Australie",
        "JP": "Japon",
        "CN": "Chine",
        "BR": "Brésil",
        "MX": "Mexique",
        "AE": "Émirats Arabes",
        "SG": "Singapour"
    };

    const calculateCustoms = async () => {
        if (!formData.artworkValue) {
            alert("Veuillez entrer la valeur de l'œuvre");
            return;
        }

        setLoading(true);

        try {
            const value = parseFloat(formData.artworkValue);
            const weight = parseFloat(formData.weight);
            const categoryKey = formData.artworkCategory;
            const rate = customsRates[categoryKey].baseRate;

            // Calculate customs duty
            const customsDuty = value * rate;

            // Calculate VAT (approximation for EU countries)
            const isEU = ["FR", "DE", "IT", "ES", "GB"].includes(formData.destinationCountry);
            const vat = isEU ? (value + customsDuty) * 0.20 : 0; // 20% VAT in EU

            // Calculate shipping
            const shippingRate = shippingMultipliers[formData.shippingMethod];
            const shippingCost = shippingRate.cost * weight;

            // Calculate insurance
            const insuranceCost = value * insuranceRate;

            // Total
            const total = value + customsDuty + vat + shippingCost + insuranceCost;

            setResults({
                artworkValue: value,
                customsDuty: customsDuty.toFixed(2),
                vat: vat.toFixed(2),
                shippingCost: shippingCost.toFixed(2),
                insuranceCost: insuranceCost.toFixed(2),
                total: total.toFixed(2),
                deliveryTime: shippingRate.days,
                shippingMethod: shippingRate.name,
                notes: [
                    isEU ? "TVA 20% appliquée (zone EU)" : "Pas de TVA applicable",
                    "Les droits de douane sont approximatifs",
                    "Des frais supplémentaires peuvent s'appliquer",
                    "Délai estimé du transport inclus"
                ]
            });
        } catch (error) {
            // Calculation failed silently
        }

        setLoading(false);
    };

    return (
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-orange-600/20 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Simulateur de Douane</h3>
                    <p className="text-xs text-gray-400">Powered by Logidoo</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Artwork Value */}
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Valeur déclarée de l'œuvre (XOF)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="number"
                            value={formData.artworkValue}
                            onChange={(e) => {
                                setFormData({...formData, artworkValue: e.target.value});
                                setResults(null);
                            }}
                            placeholder="Valeur en XOF"
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Catégorie d'œuvre</label>
                    <select
                        value={formData.artworkCategory}
                        onChange={(e) => {
                            setFormData({...formData, artworkCategory: e.target.value});
                            setResults(null);
                        }}
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                    >
                        {Object.entries(customsRates).map(([key, val]) => (
                            <option key={key} value={key}>
                                {val.description} (Taux: {(val.baseRate * 100).toFixed(0)}%)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Origin Country */}
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Pays d'origine</label>
                    <select
                        value={formData.originCountry}
                        onChange={(e) => setFormData({...formData, originCountry: e.target.value})}
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                    >
                        {Object.entries(countries).map(([code, name]) => (
                            <option key={code} value={code}>{name}</option>
                        ))}
                    </select>
                </div>

                {/* Destination Country */}
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Pays de destination</label>
                    <select
                        value={formData.destinationCountry}
                        onChange={(e) => {
                            setFormData({...formData, destinationCountry: e.target.value});
                            setResults(null);
                        }}
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                    >
                        {Object.entries(countries).map(([code, name]) => (
                            <option key={code} value={code}>{name}</option>
                        ))}
                    </select>
                </div>

                {/* Weight */}
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Poids (kg)</label>
                    <div className="relative">
                        <Package className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={formData.weight}
                            onChange={(e) => {
                                setFormData({...formData, weight: e.target.value});
                                setResults(null);
                            }}
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>

                {/* Shipping Method */}
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Mode de transport</label>
                    <select
                        value={formData.shippingMethod}
                        onChange={(e) => {
                            setFormData({...formData, shippingMethod: e.target.value});
                            setResults(null);
                        }}
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                    >
                        {Object.entries(shippingMultipliers).map(([key, val]) => (
                            <option key={key} value={key}>
                                {val.name} - {val.cost} XOF/kg
                            </option>
                        ))}
                    </select>
                </div>

                {/* Calculate Button */}
                <button
                    onClick={calculateCustoms}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                >
                    <Calculator className="w-4 h-4" />
                    {loading ? "Calcul en cours..." : "Simuler les frais de douane"}
                </button>
            </div>

            {/* Results */}
            {results && (
                <div className="mt-6 pt-6 border-t border-gray-700 space-y-4">
                    <div className="bg-orange-900/20 border border-orange-600/50 rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-3">
                            <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-orange-400 text-sm font-medium">Simulation de frais de douane</p>
                                <p className="text-orange-300 text-xs">Ces valeurs sont des estimations basées sur les tarifs Logidoo</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Valeur déclarée:</span>
                            <span className="text-white font-medium">{parseFloat(results.artworkValue).toLocaleString('fr-FR')} XOF</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Droits de douane:</span>
                            <span className="text-yellow-400 font-medium">{parseFloat(results.customsDuty).toLocaleString('fr-FR')} XOF</span>
                        </div>
                        {parseFloat(results.vat) > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">TVA (20%):</span>
                                <span className="text-blue-400 font-medium">{parseFloat(results.vat).toLocaleString('fr-FR')} XOF</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Transport ({results.shippingMethod}):</span>
                            <span className="text-green-400 font-medium">{parseFloat(results.shippingCost).toLocaleString('fr-FR')} XOF</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Assurance (2%):</span>
                            <span className="text-purple-400 font-medium">{parseFloat(results.insuranceCost).toLocaleString('fr-FR')} XOF</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                        <span className="text-white font-semibold">Coût total estimé:</span>
                        <span className="text-2xl font-bold text-orange-400">
                            {parseFloat(results.total).toLocaleString('fr-FR')} XOF
                        </span>
                    </div>

                    <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-3">
                        <p className="text-blue-400 text-xs font-medium mb-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Délai de livraison
                        </p>
                        <p className="text-blue-300 text-sm">{results.deliveryTime}</p>
                    </div>

                    <div className="space-y-1">
                        {results.notes.map((note, idx) => (
                            <p key={idx} className="text-gray-400 text-xs flex items-start gap-2">
                                <span className="text-orange-400 mt-0.5">•</span>
                                {note}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
