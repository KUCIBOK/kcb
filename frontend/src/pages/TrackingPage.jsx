import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLogistics } from "../hooks/useLogistics";
import { MapPin, Clock, Package, Truck, CheckCircle, AlertCircle, Loader } from "lucide-react";

export default function TrackingPage() {
  const { trackingId } = useParams();
  const { getTrackingInfo, loading, error } = useLogistics();
  const [trackingData, setTrackingData] = useState(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const data = await getTrackingInfo(trackingId);
        setTrackingData(data);
      } catch (err) {
        console.error('Failed to fetch tracking data:', err);
      }
    };

    if (trackingId) {
      fetchTrackingData();
    }
  }, [trackingId, getTrackingInfo]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-400 border-green-400';
      case 'in_transit': return 'text-blue-400 border-blue-400';
      case 'preparing': return 'text-yellow-400 border-yellow-400';
      case 'pending': return 'text-gray-400 border-gray-400';
      case 'cancelled': return 'text-red-400 border-red-400';
      default: return 'text-white border-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-6 w-6 text-green-400" />;
      case 'in_transit': return <Truck className="h-6 w-6 text-blue-400" />;
      case 'preparing': return <Package className="h-6 w-6 text-yellow-400" />;
      case 'pending': return <Clock className="h-6 w-6 text-gray-400" />;
      case 'cancelled': return <AlertCircle className="h-6 w-6 text-red-400" />;
      default: return <Package className="h-6 w-6 text-white" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-white">Chargement des informations de suivi...</p>
        </div>
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Suivi non trouvé</h2>
          <p className="text-gray-400 mb-6">
            Nous n'avons pas pu trouver les informations de suivi pour ce numéro.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Suivi de livraison</h1>
          <p className="text-gray-400">Numéro de suivi: {trackingId}</p>
        </div>

        {/* Status Card */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(trackingData.currentStatus)}
              <div>
                <h2 className="text-xl font-semibold text-white capitalize">
                  {trackingData.currentStatus === 'in_transit' ? 'En transit' :
                   trackingData.currentStatus === 'preparing' ? 'En préparation' :
                   trackingData.currentStatus === 'delivered' ? 'Livré' :
                   trackingData.currentStatus === 'pending' ? 'En attente' :
                   trackingData.currentStatus === 'cancelled' ? 'Annulé' : trackingData.currentStatus}
                </h2>
                <p className="text-gray-400">
                  {trackingData.provider ? `Via ${trackingData.provider}` : 'Kucibok Logistics'}
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full border ${getStatusColor(trackingData.currentStatus)}`}>
              <span className="text-sm font-medium capitalize">
                {trackingData.currentStatus}
              </span>
            </div>
          </div>

          {trackingData.estimatedDelivery && (
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="h-5 w-5" />
              <span>Livraison estimée: {new Date(trackingData.estimatedDelivery).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </div>

        {/* Recipient Information */}
        {trackingData.recipient && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Informations du destinataire
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Nom</p>
                <p className="text-white">{trackingData.recipient.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Téléphone</p>
                <p className="text-white">{trackingData.recipient.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-400 text-sm">Adresse</p>
                <p className="text-white">{trackingData.recipient.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Package Information */}
        {trackingData.package && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informations du colis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Taille</p>
                <p className="text-white capitalize">{trackingData.package.size}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Poids</p>
                <p className="text-white">{trackingData.package.weight} kg</p>
              </div>
              {trackingData.package.description && (
                <div>
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white">{trackingData.package.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        {trackingData.history && trackingData.history.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-6">Historique du suivi</h3>
            <div className="space-y-4">
              {trackingData.history.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    {index < trackingData.history.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-600 flex-grow"></div>
                    )}
                  </div>
                  <div className="pb-4 flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-white font-medium">{event.status}</h4>
                      <span className="text-gray-400 text-sm">
                        {new Date(event.timestamp).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    {event.location && (
                      <p className="text-gray-400 text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className="text-gray-300 text-sm mt-1">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dates */}
        {(trackingData.dates?.collect || trackingData.dates?.delivery) && (
          <div className="bg-gray-800 rounded-lg p-6 mt-8 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Dates importantes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trackingData.dates.collect && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Date de collecte</p>
                    <p className="text-white">{new Date(trackingData.dates.collect).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              )}
              {trackingData.dates.delivery && (
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Date de livraison</p>
                    <p className="text-white">{new Date(trackingData.dates.delivery).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Back button */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}