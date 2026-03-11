import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getDeliveryByTracking } from "../api/useDelivery";
import RevealOnScroll from "../components/landing/RevealOnScroll";
import {
  MapPin, Clock, Package, Truck, CheckCircle, AlertCircle,
  Loader2, ShieldCheck, ArrowLeft
} from "lucide-react";

const STATUS_LABELS = {
  pending:          "En attente de confirmation",
  in_preparation:   "En préparation (emballage muséal)",
  in_transit:       "En transit",
  customs_cleared:  "Dédouané",
  delivered:        "Livré",
  rejected:         "Demande rejetée",
};

const STATUS_COLORS = {
  pending:          "text-kcb-pierre border-white/[0.08]",
  in_preparation:   "text-yellow-400 border-yellow-600",
  in_transit:       "text-kcb-or border-kcb-or",
  customs_cleared:  "text-kcb-or border-indigo-600",
  delivered:        "text-green-400 border-green-600",
  rejected:         "text-red-400 border-red-600",
};

function StatusIcon({ status, className = "w-6 h-6" }) {
  switch (status) {
    case "delivered":         return <CheckCircle className={`${className} text-green-400`} />;
    case "in_transit":        return <Truck       className={`${className} text-kcb-or`}  />;
    case "customs_cleared":   return <ShieldCheck className={`${className} text-kcb-or`}/>;
    case "in_preparation":    return <Package      className={`${className} text-yellow-400`}/>;
    case "rejected":          return <AlertCircle  className={`${className} text-red-400`}  />;
    default:                  return <Clock        className={`${className} text-kcb-pierre`} />;
  }
}

// Progression visuelle des statuts (hors rejected)
const STEPS = ["pending", "in_preparation", "in_transit", "customs_cleared", "delivered"];

export default function TrackingPage() {
  const { trackingId } = useParams();
  const [delivery, setDelivery]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [errorMsg, setErrorMsg]   = useState("");

  useEffect(() => {
    if (!trackingId) { setLoading(false); setErrorMsg("Identifiant de suivi manquant."); return; }
    getDeliveryByTracking(trackingId).then((data) => {
      if (data?.error) setErrorMsg(data.error);
      else setDelivery(data);
      setLoading(false);
    });
  }, [trackingId]);

  const currentStepIndex = STEPS.indexOf(delivery?.status);

  return (
    <div className="min-h-screen bg-kcb-noir-deep py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <RevealOnScroll>
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-1 text-kcb-pierre hover:text-white text-sm transition"
            >
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Suivi d'expédition</h1>
              <p className="text-kcb-pierre text-sm font-mono">{trackingId}</p>
            </div>
          </div>
        </RevealOnScroll>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-kcb-or animate-spin" />
          </div>
        )}

        {/* Erreur */}
        {!loading && errorMsg && (
          <div className="bg-kcb-ardoise border border-red-700/40 rounded-[4px] p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h2 className="text-white font-semibold text-lg mb-2">Suivi introuvable</h2>
            <p className="text-kcb-pierre text-sm">{errorMsg}</p>
            <Link to="/" className="inline-block mt-6 text-sm text-kcb-or hover:text-kcb-or transition">
              ← Retour à kucibok.com
            </Link>
          </div>
        )}

        {/* Résultat */}
        {!loading && delivery && (
          <div className="space-y-6">
            {/* Statut actuel */}
            <RevealOnScroll delay={0.1}>
              <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon status={delivery.status} className="w-8 h-8" />
                  <div>
                    <p className="text-white font-semibold text-lg">
                      {STATUS_LABELS[delivery.status] || delivery.status}
                    </p>
                    <p className="text-kcb-pierre text-sm">
                      {delivery.corridor === "AF_TO_FR" ? "Afrique → France" : "France → Afrique"}
                      {delivery.originCountry ? ` · depuis ${delivery.originCountry}` : ""}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${STATUS_COLORS[delivery.status] || "text-kcb-pierre border-white/[0.08]"}`}>
                  {delivery.status}
                </span>
              </div>

              {/* Barre de progression */}
              {delivery.status !== "rejected" && (
                <div className="mt-6">
                  <div className="flex justify-between items-center relative">
                    <div className="absolute left-0 right-0 top-3 h-0.5 bg-kcb-ardoise z-0" />
                    <div
                      className="absolute left-0 top-3 h-0.5 bg-kcb-or z-0 transition-all duration-500"
                      style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                    />
                    {STEPS.map((step, i) => (
                      <div key={step} className="flex flex-col items-center z-10 gap-1.5">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          i <= currentStepIndex
                            ? "bg-kcb-or border-kcb-or"
                            : "bg-kcb-ardoise border-white/[0.08]"
                        }`}>
                          {i < currentStepIndex && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-[10px] text-kcb-pierre text-center max-w-[60px] leading-tight hidden sm:block">
                          {STATUS_LABELS[step]?.split(" ")[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </RevealOnScroll>

            {/* Destinataire */}
            <RevealOnScroll delay={0.15}>
              <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-kcb-or" /> Destinataire
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-kcb-pierre">Nom</p>
                  <p className="text-white">{delivery.recipientName || "—"}</p>
                </div>
                <div>
                  <p className="text-kcb-pierre">Téléphone</p>
                  <p className="text-white">{delivery.recipientPhone || "—"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-kcb-pierre">Adresse de livraison</p>
                  <p className="text-white">{delivery.deliveryAddress || "—"}</p>
                </div>
              </div>
            </div>
            </RevealOnScroll>

            {/* Colis */}
            <RevealOnScroll delay={0.2}>
              <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-kcb-or" /> Colis
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                {delivery.packageSize && (
                  <div>
                    <p className="text-kcb-pierre">Taille</p>
                    <p className="text-white capitalize">{delivery.packageSize}</p>
                  </div>
                )}
                {delivery.packageWeight && (
                  <div>
                    <p className="text-kcb-pierre">Poids</p>
                    <p className="text-white">{delivery.packageWeight} kg</p>
                  </div>
                )}
                {delivery.deliveryPriority && (
                  <div>
                    <p className="text-kcb-pierre">Priorité</p>
                    <p className="text-white capitalize">{delivery.deliveryPriority}</p>
                  </div>
                )}
              </div>

              {/* Checklist emballage */}
              {delivery.packagingChecklist && Object.values(delivery.packagingChecklist).some(Boolean) && (
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <p className="text-kcb-pierre text-xs uppercase tracking-wider mb-2">Protocole emballage muséal</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "museum_wrap",      label: "Emballage muséal" },
                      { key: "bubble_wrap",       label: "Bulles de protection" },
                      { key: "crate",             label: "Caisse bois" },
                      { key: "fragile_label",     label: "Étiquette fragile" },
                      { key: "humidity_control",  label: "Contrôle humidité" },
                    ].filter(item => delivery.packagingChecklist[item.key]).map(item => (
                      <span key={item.key} className="flex items-center gap-1 text-xs bg-green-900/30 text-green-400 border border-green-800/50 rounded-full px-2 py-0.5">
                        <CheckCircle className="w-3 h-3" /> {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </RevealOnScroll>

            {/* Historique des événements */}
            {delivery.events?.length > 0 && (
              <RevealOnScroll delay={0.25}>
                <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5">
                <h3 className="text-white font-semibold mb-5">Historique</h3>
                <div className="space-y-4">
                  {[...delivery.events].reverse().map((event, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-kcb-or mt-1 shrink-0" />
                        {idx < delivery.events.length - 1 && (
                          <div className="w-px flex-1 bg-kcb-ardoise mt-1" />
                        )}
                      </div>
                      <div className="pb-4 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-white text-sm font-medium">
                            {STATUS_LABELS[event.status] || event.status}
                          </p>
                          <span className="text-kcb-pierre text-xs shrink-0">
                            {new Date(event.date).toLocaleDateString("fr-FR", {
                              day: "numeric", month: "short", year: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {event.note && (
                          <p className="text-kcb-pierre text-xs mt-0.5">{event.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </RevealOnScroll>
            )}

            {/* Dates */}
            {(delivery.collectDate || delivery.deliveryDate) && (
              <RevealOnScroll delay={0.3}>
                <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5">
                <h3 className="text-white font-semibold mb-4">Dates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {delivery.collectDate && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-kcb-or shrink-0" />
                      <div>
                        <p className="text-kcb-pierre">Collecte</p>
                        <p className="text-white">{new Date(delivery.collectDate).toLocaleDateString("fr-FR")}</p>
                      </div>
                    </div>
                  )}
                  {delivery.deliveryDate && (
                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-green-400 shrink-0" />
                      <div>
                        <p className="text-kcb-pierre">Livraison prévue</p>
                        <p className="text-white">{new Date(delivery.deliveryDate).toLocaleDateString("fr-FR")}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </RevealOnScroll>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
