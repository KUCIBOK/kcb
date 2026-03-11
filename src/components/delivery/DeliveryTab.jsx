import { useState, useEffect } from "react";
import { Box, Boxes, CheckCircle, ClockFading, Package, Truck, RefreshCw, MapPin, Phone, User, Calendar, Calculator, Loader, AlertCircle, Check, Globe } from "lucide-react";
import { useDelivery } from "../../store/DeliveryStore";
import { useLogistics } from "../../hooks/useLogistics";
import { CustomsSimulator } from "./CustomsSimulator";

export function DeliveryTab() {
    const { myDeliveries } = useDelivery();
    const { getDeliveryZones, getPickupPoints, getShippingRates, createExpedition, syncWithLogidoo, loading: logisticsLoading, error: logisticsError } = useLogistics();
    
    const [zones, setZones] = useState([]);
    const [pickupPoints, setPickupPoints] = useState([]);
    const [rates, setRates] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState("");
    
    // Form state
    const [formData, setFormData] = useState({
        artworksIds: [],
        deliveryAddress: "",
        deliveryDate: "",
        collectDate: "",
        recipientName: "",
        recipientPhone: "",
        specialInstructions: "",
        packageSize: "small",
        packageWeight: 1,
        deliveryPriority: "standard",
        selectedZone: "",
        selectedPickupPoint: ""
    });
    
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const [formSuccess, setFormSuccess] = useState("");

    // Load Logidoo data on mount
    useEffect(() => {
        loadLogidooData();
    }, []);

    const loadLogidooData = async () => {
        try {
            const zonesData = await getDeliveryZones();
            if (zonesData?.zones) {
                setZones(zonesData.zones);
            }
            
            const pickupData = await getPickupPoints();
            if (pickupData?.pickupPoints) {
                setPickupPoints(pickupData.pickupPoints);
            }
        } catch (error) {
            // Loading failed silently
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        setSyncMessage("");
        try {
            const result = await syncWithLogidoo();
            setSyncMessage(`Synchronisé: ${result.syncedCount || 0} livraisons`);
            setTimeout(() => setSyncMessage(""), 3000);
        } catch (error) {
            setSyncMessage("Erreur de synchronisation");
        }
        setSyncing(false);
    };

    const calculateRate = async () => {
        if (!formData.selectedZone || !formData.packageWeight) return;
        
        try {
            const rateData = await getShippingRates(
                "Dakar",
                formData.selectedZone,
                { weight: parseFloat(formData.packageWeight), size: formData.packageSize }
            );
            setRates(rateData);
        } catch (error) {
            // Rate calculation failed silently
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");
        
        if (!formData.artworksIds.length) {
            setFormError("Vous devez choisir au moins une œuvre");
            return;
        }
        
        if (!formData.collectDate || !formData.deliveryDate) {
            setFormError("Les dates de collecte et livraison sont obligatoires");
            return;
        }
        
        if (!formData.recipientName || !formData.recipientPhone) {
            setFormError("Le nom et téléphone du destinataire sont obligatoires");
            return;
        }

        setFormLoading(true);
        
        try {
            const expeditionData = {
                recipient: {
                    name: formData.recipientName,
                    phone: formData.recipientPhone,
                    address: formData.deliveryAddress || formData.selectedPickupPoint
                },
                package: {
                    weight: parseFloat(formData.packageWeight),
                    size: formData.packageSize,
                    description: `Transport d'œuvres d'art - ${formData.artworksIds.length} pièce(s)`
                },
                serviceType: formData.deliveryPriority.toUpperCase(),
                collectionDate: formData.collectDate,
                deliveryDate: formData.deliveryDate,
                specialInstructions: formData.specialInstructions
            };
            
            const result = await createExpedition(expeditionData);
            
            if (result.expedition || result.mock) {
                setFormSuccess(`Expedition créée! ${result.expedition?.trackingNumber ? 'Tracking: ' + result.expedition.trackingNumber : '(Données de test)'}`);
                setFormData({
                    artworksIds: [],
                    deliveryAddress: "",
                    deliveryDate: "",
                    collectDate: "",
                    recipientName: "",
                    recipientPhone: "",
                    specialInstructions: "",
                    packageSize: "small",
                    packageWeight: 1,
                    deliveryPriority: "standard",
                    selectedZone: "",
                    selectedPickupPoint: ""
                });
                setRates(null);
            }
        } catch (error) {
            setFormError(error.message || "Erreur lors de la création");
        }
        
        setFormLoading(false);
    };

    // Statistics
    const stats = {
        total: myDeliveries?.length || 0,
        pending: myDeliveries?.filter(d => d?.status === "pending").length || 0,
        inPreparation: myDeliveries?.filter(d => d?.status === "in_preparation").length || 0,
        inTransit: myDeliveries?.filter(d => d?.status === "on_the_way").length || 0,
        delivered: myDeliveries?.filter(d => d?.status === "delivered").length || 0
    };

    return (
        <div className="space-y-6">
            {/* Header with Logidoo branding */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 lg:px-2">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl">
                        <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Interface Logistique Mondiale</h2>
                        <p className="text-xs text-gray-400">Powered by Logidoo API - Livraison dans le monde entier</p>
                    </div>
                </div>
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg text-sm transition"
                >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Synchronisation...' : 'Synchroniser avec Logidoo'}
                </button>
            </div>

            {syncMessage && (
                <div className="lg:px-2 bg-green-900/20 border border-green-600/50 text-green-400 px-4 py-2 rounded-lg text-sm">
                    {syncMessage}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:px-2">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400">Total</p>
                            <p className="text-2xl font-bold text-white">{stats.total}</p>
                        </div>
                        <Boxes className="w-5 h-5 text-blue-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-900/30 to-gray-900 rounded-xl p-4 border border-yellow-700/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400">En attente</p>
                            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                        </div>
                        <ClockFading className="w-5 h-5 text-yellow-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-900/30 to-gray-900 rounded-xl p-4 border border-orange-700/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400">En préparation</p>
                            <p className="text-2xl font-bold text-orange-400">{stats.inPreparation}</p>
                        </div>
                        <Package className="w-5 h-5 text-orange-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-900/30 to-gray-900 rounded-xl p-4 border border-blue-700/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400">En transit</p>
                            <p className="text-2xl font-bold text-blue-400">{stats.inTransit}</p>
                        </div>
                        <Truck className="w-5 h-5 text-blue-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-900/30 to-gray-900 rounded-xl p-4 border border-green-700/50">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400">Livrées</p>
                            <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                </div>
            </div>

            {/* Main Content Grid - 3 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:px-2">
                
                {/* Create Expedition Form - 2 columns on large screens */}
                <div className="lg:col-span-2 bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-blue-600/20 p-2 rounded-lg">
                            <Package className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Demande de Cotation</h3>
                    </div>

                    {formError && (
                        <div className="mb-4 bg-red-900/20 border border-red-600/50 text-red-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {formError}
                        </div>
                    )}

                    {formSuccess && (
                        <div className="mb-4 bg-green-900/20 border border-green-600/50 text-green-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            {formSuccess}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Zone de livraison */}
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Pays/Zone de livraison</label>
                            <select
                                value={formData.selectedZone}
                                onChange={(e) => {
                                    setFormData({...formData, selectedZone: e.target.value});
                                    setRates(null);
                                }}
                                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sélectionnez votre destination</option>
                                {zones && zones.length > 0 ? (
                                    zones.map(zone => (
                                        <option key={zone.id} value={zone.name}>
                                            {zone.region && `[${zone.region}] `}{zone.name} {zone.price ? `- ${zone.price} XOF` : ''}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Chargement des zones...</option>
                                )}
                            </select>
                        </div>

                        {/* Point de retrait */}
                        {pickupPoints.length > 0 && (
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Point de retrait (optionnel)</label>
                                <select
                                    value={formData.selectedPickupPoint}
                                    onChange={(e) => setFormData({...formData, selectedPickupPoint: e.target.value})}
                                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Livraison à l'adresse</option>
                                    {pickupPoints.map(point => (
                                        <option key={point.id} value={point.address}>
                                            {point.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Adresse de livraison */}
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Adresse de livraison</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    value={formData.deliveryAddress}
                                    onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                                    placeholder="Adresse complète, Ville, Code Postal"
                                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Destinataire */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Nom du destinataire</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={formData.recipientName}
                                        onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                                        placeholder="Nom complet"
                                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Téléphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                    <input
                                        type="tel"
                                        value={formData.recipientPhone}
                                        onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
                                        placeholder="Numéro international"
                                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Date de collecte</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                    <input
                                        type="date"
                                        value={formData.collectDate}
                                        onChange={(e) => setFormData({...formData, collectDate: e.target.value})}
                                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Date de livraison</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                    <input
                                        type="date"
                                        value={formData.deliveryDate}
                                        onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Package details */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Taille</label>
                                <select
                                    value={formData.packageSize}
                                    onChange={(e) => {
                                        setFormData({...formData, packageSize: e.target.value});
                                        setRates(null);
                                    }}
                                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="small">Petit</option>
                                    <option value="medium">Moyen</option>
                                    <option value="large">Grand</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Poids (kg)</label>
                                <input
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={formData.packageWeight}
                                    onChange={(e) => {
                                        setFormData({...formData, packageWeight: e.target.value});
                                        setRates(null);
                                    }}
                                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Priorité</label>
                                <select
                                    value={formData.deliveryPriority}
                                    onChange={(e) => setFormData({...formData, deliveryPriority: e.target.value})}
                                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="standard">Standard</option>
                                    <option value="priority">Prioritaire</option>
                                    <option value="express">Express</option>
                                </select>
                            </div>
                        </div>

                        {/* Calculate rate button */}
                        {formData.selectedZone && formData.packageWeight && (
                            <button
                                type="button"
                                onClick={calculateRate}
                                disabled={logisticsLoading}
                                className="w-full flex items-center justify-center gap-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition"
                            >
                                <Calculator className="w-4 h-4" />
                                {logisticsLoading ? 'Calcul...' : 'Calculer la cotation'}
                            </button>
                        )}

                        {/* Rate display */}
                        {rates && (
                            <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Tarif estimé:</span>
                                    <span className="text-2xl font-bold text-blue-400">
                                        {rates.price || '1500'} XOF
                                    </span>
                                </div>
                                {rates.estimatedDays && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Délai estimé: {rates.estimatedDays}
                                    </p>
                                )}
                                {rates.mock && <p className="text-xs text-yellow-500 mt-1">* Tarif approximatif</p>}
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={formLoading}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                        >
                            {formLoading ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Création en cours...
                                </>
                            ) : (
                                <>
                                    <Truck className="w-4 h-4" />
                                    Créer l'expedition
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Sidebar - Customs Simulator */}
                <div>
                    <CustomsSimulator />
                </div>
            </div>

            {/* Delivery History */}
            <div className="lg:px-2">
                <h3 className="text-white text-xl flex items-center gap-2 mb-4">
                    <Package className="w-6 h-6" />
                    Historique des expeditions
                </h3>
                <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
                    {myDeliveries && myDeliveries.length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="text-left text-xs text-gray-400 px-4 py-3">Tracking</th>
                                    <th className="text-left text-xs text-gray-400 px-4 py-3">Destinataire</th>
                                    <th className="text-left text-xs text-gray-400 px-4 py-3">Zone</th>
                                    <th className="text-left text-xs text-gray-400 px-4 py-3">Statut</th>
                                    <th className="text-left text-xs text-gray-400 px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {myDeliveries.slice(0, 10).map((delivery, idx) => (
                                    <tr key={idx} className="hover:bg-gray-800/30">
                                        <td className="px-4 py-3 text-blue-400 text-sm font-mono">
                                            {delivery.trackingId || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-white text-sm">
                                            {delivery.recipientName}
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-sm">
                                            {delivery.deliveryAddress?.substring(0, 20)}...
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                delivery.status === 'delivered' ? 'bg-green-900/30 text-green-400' :
                                                delivery.status === 'on_the_way' ? 'bg-blue-900/30 text-blue-400' :
                                                delivery.status === 'in_preparation' ? 'bg-orange-900/30 text-orange-400' :
                                                'bg-yellow-900/30 text-yellow-400'
                                            }`}>
                                                {delivery.status === 'pending' ? 'En attente' :
                                                 delivery.status === 'in_preparation' ? 'En préparation' :
                                                 delivery.status === 'on_the_way' ? 'En transit' :
                                                 delivery.status === 'delivered' ? 'Livrée' : delivery.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-sm">
                                            {delivery.collectDate ? new Date(delivery.collectDate).toLocaleDateString('fr-FR') : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center">
                            <Truck className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500">Aucune expedition trouvée</p>
                            <p className="text-gray-600 text-sm">Créez votre première expedition ci-dessus</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
