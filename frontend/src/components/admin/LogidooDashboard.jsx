import { useState, useEffect } from 'react';
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/logistics/alerts?limit=20', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setAlerts(data.alerts);
      }
    } catch (err) {
      console.error('Erreur chargement alertes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/logistics/alerts/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Erreur chargement stats:', err);
    }
  };

  const handleMarkRead = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/logistics/alerts/${alertId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadAlerts();
      loadStats();
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3000/api/logistics/alerts/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadAlerts();
      loadStats();
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3000/api/logistics/sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadAlerts();
      loadStats();
    } catch (err) {
      console.error('Erreur sync:', err);
    } finally {
      setSyncing(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-500/20 border-red-500/50 text-red-300',
      warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
      success: 'bg-green-500/20 border-green-500/50 text-green-300',
      info: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
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
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">🚚 Dashboard Logidoo</h1>
          <p className="text-gray-400 mt-1">Suivi des expéditions et alertes en temps réel</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition disabled:opacity-50"
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
            color="purple"
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
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
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
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-400">Aucune alerte - Tout est en ordre!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} ${
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
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>{formatDate(alert.createdAt)}</span>
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
                        <Eye className="w-4 h-4 text-gray-400" />
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
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Par type</h3>
            <div className="space-y-3">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-gray-400 capitalize">{type.replace(/_/g, ' ')}</span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Par sévérité</h3>
            <div className="space-y-3">
              {Object.entries(stats.bySeverity).map(([severity, count]) => (
                <div key={severity} className="flex justify-between items-center">
                  <span className={`capitalize flex items-center gap-2 ${
                    severity === 'critical' ? 'text-red-400' :
                    severity === 'warning' ? 'text-yellow-400' :
                    severity === 'success' ? 'text-green-400' : 'text-blue-400'
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
    blue: 'bg-blue-500/10 border-blue-500/30',
    green: 'bg-green-500/10 border-green-500/30',
    yellow: 'bg-yellow-500/10 border-yellow-500/30',
    purple: 'bg-purple-500/10 border-purple-500/30',
    red: 'bg-red-500/10 border-red-500/30',
  };

  const textColors = {
    blue: 'text-blue-300',
    green: 'text-green-300',
    yellow: 'text-yellow-300',
    purple: 'text-purple-300',
    red: 'text-red-300',
  };

  return (
    <div className={`border rounded-lg p-4 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-400">{label}</span>
        <span className={textColors[color]}>{icon}</span>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}
