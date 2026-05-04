import { useState, useEffect } from 'react';
import { utils } from '../../api/useAPI';
import {
  Truck,
  Package,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Bell,
  Eye,
  Trash2,
  TrendingUp,
} from 'lucide-react';

export default function LogidooDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadAlerts();
    loadStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadAlerts();
      loadStats();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await fetch(`${utils.api}/logistics/alerts?limit=20`, {
        headers: utils.options.headers,
      });
      const data = await response.json();
      if (data.success) {
        setAlerts(data.alerts);
      }
    } catch (err) {
      // Silenced for production
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${utils.api}/logistics/alerts/stats`, {
        headers: utils.options.headers,
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      // Silenced for production
    }
  };

  const handleMarkRead = async (alertId) => {
    try {
      await fetch(`${utils.api}/logistics/alerts/${alertId}/read`, {
        method: 'PATCH',
        headers: utils.options.headers,
      });
      loadAlerts();
      loadStats();
    } catch (err) {
      // Silenced for production
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${utils.api}/logistics/alerts/read-all`, {
        method: 'PATCH',
        headers: utils.options.headers,
      });
      loadAlerts();
      loadStats();
    } catch (err) {
      // Silenced for production
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch(`${utils.api}/logistics/sync`, {
        method: 'POST',
        headers: utils.options.headers,
      });
      loadAlerts();
      loadStats();
    } catch (err) {
      // Silenced for production
    } finally {
      setSyncing(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-500/20 border-red-500/50 text-red-300',
      warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
      success: 'bg-green-500/20 border-green-500/50 text-green-300',
      info: 'bg-kcb-or/20 border-kcb-or/50 text-kcb-sable',
    };
    return colors[severity] || colors.info;
  };

  const getTypeIcon = (type) => {
    const icons = {
      status_change: <RefreshCw className="w-4 h-4" />,
      delivery_exception: <AlertTriangle className="w-4 h-4" />,
      delay: <Clock className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      created: <Package className="w-4 h-4" />,
      cancelled: <Trash2 className="w-4 h-4" />,
    };
    return icons[type] || <Bell className="w-4 h-4" />;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return d.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-kcb-pierre">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">🚚 Dashboard Logidoo</h1>
          <p className="text-kcb-pierre mt-1">Suivi des expéditions et alertes en temps réel</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 bg-kcb-or hover:bg-kcb-or/90 rounded-[4px] text-kcb-noir font-medium transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Synchronisation...' : 'Sync Now'}
        </button>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Total alertes"
            value={stats.total}
            icon={<Bell className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            label="Non lues"
            value={stats.unread}
            icon={<AlertTriangle className="w-5 h-5" />}
            color={stats.unread > 0 ? 'yellow' : 'green'}
          />
          <StatCard
            label="Dernières 24h"
            value={stats.last24h}
            icon={<Clock className="w-5 h-5" />}
            color="kcb"
          />
          <StatCard
            label="Taux de succès"
            value={stats.bySeverity?.success ? `${((stats.bySeverity.success / stats.total) * 100).toFixed(0)}%` : 'N/A'}
            icon={<TrendingUp className="w-5 h-5" />}
            color="green"
          />
        </div>
      )}

      {/* Alertes */}
      <div className="bg-kcb-ardoise/50 rounded-[4px] border border-white/[0.06] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5" /> Alertes & Notifications
            {stats?.unread > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {stats.unread}
              </span>
            )}
          </h2>
          {stats?.unread > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-kcb-or hover:text-kcb-or/80"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-kcb-pierre">Aucune alerte - Tout est en ordre!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className={`p-4 rounded-[4px] border ${getSeverityColor(alert.severity)} ${
                  !alert.read ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getTypeIcon(alert.type)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{alert.title}</h3>
                        {!alert.read && (
                          <span className="w-2 h-2 bg-kcb-or rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-kcb-sable mt-1">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-kcb-pierre">
                        <span>{formatDate(alert.created_at)}</span>
                        {alert.trackingId && (
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" /> {alert.trackingId}
                          </span>
                        )}
                        {alert.metadata?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {alert.metadata.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!alert.read && (
                      <button
                        onClick={() => handleMarkRead(alert._id)}
                        className="p-2 hover:bg-white/10 rounded transition"
                        title="Marquer comme lu"
                      >
                        <Eye className="w-4 h-4 text-kcb-pierre" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Répartition par type */}
      {stats?.byType && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-kcb-ardoise/50 rounded-[4px] border border-white/[0.06] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Par type</h3>
            <div className="space-y-3">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-kcb-pierre capitalize">{type.replace(/_/g, ' ')}</span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-kcb-ardoise/50 rounded-[4px] border border-white/[0.06] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Par sévérité</h3>
            <div className="space-y-3">
              {Object.entries(stats.bySeverity).map(([severity, count]) => (
                <div key={severity} className="flex justify-between items-center">
                  <span className={`capitalize flex items-center gap-2 ${
                    severity === 'critical' ? 'text-red-400' :
                    severity === 'warning' ? 'text-yellow-400' :
                    severity === 'success' ? 'text-green-400' : 'text-kcb-or'
                  }`}>
                    {severity === 'critical' && <AlertTriangle className="w-4 h-4" />}
                    {severity === 'warning' && <Clock className="w-4 h-4" />}
                    {severity === 'success' && <CheckCircle className="w-4 h-4" />}
                    {severity === 'info' && <Bell className="w-4 h-4" />}
                    {severity}
                  </span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const colors = {
    blue: 'bg-kcb-or/10 border-kcb-or/30',
    green: 'bg-green-500/10 border-green-500/30',
    yellow: 'bg-yellow-500/10 border-yellow-500/30',
    kcb: 'bg-kcb-bronze/10 border-kcb-bronze/30',
    red: 'bg-red-500/10 border-red-500/30',
  };

  const textColors = {
    blue: 'text-kcb-sable',
    green: 'text-green-300',
    yellow: 'text-yellow-300',
    kcb: 'text-kcb-sable',
    red: 'text-red-300',
  };

  return (
    <div className={`border rounded-[4px] p-4 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-kcb-pierre">{label}</span>
        <span className={textColors[color]}>{icon}</span>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}
