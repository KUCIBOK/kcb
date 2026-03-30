import { useState, useEffect } from 'react';
import { MessageSquare, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { utils } from '../../api/useAPI';

export default function SupportTicketTab() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    ouvert: 0,
    en_cours: 0,
    resolu: 0,
    ferme: 0,
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await fetch(`${utils.api}/support-tickets/admin/all`, {
        headers: utils.options.headers,
      });
      const data = await response.json();
      setTickets(data.tickets || []);

      // Calculer les stats
      const newStats = {
        total: data.count || 0,
        ouvert: data.tickets?.filter(t => t.status === 'ouvert').length || 0,
        en_cours: data.tickets?.filter(t => t.status === 'en_cours').length || 0,
        resolu: data.tickets?.filter(t => t.status === 'resolu').length || 0,
        ferme: data.tickets?.filter(t => t.status === 'ferme').length || 0,
      };
      setStats(newStats);
    } catch (error) {
      // Silenced for production
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    ouvert: 'bg-green-500/20 text-green-300',
    en_cours: 'bg-kcb-or/20 text-kcb-sable',
    resolu: 'bg-kcb-bronze/20 text-kcb-sable',
    ferme: 'bg-gray-500/20 text-gray-300',
  };

  const priorityColors = {
    basse: 'bg-kcb-or/20 text-kcb-sable',
    normale: 'bg-gray-500/20 text-gray-300',
    haute: 'bg-orange-500/20 text-orange-300',
    critique: 'bg-red-500/20 text-red-300',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white text-center">
          <div className="animate-spin mb-4">⏳</div>
          <p>Chargement des tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total" value={stats.total} color="kcb" />
        <StatCard label="Ouverts" value={stats.ouvert} color="green" />
        <StatCard label="En cours" value={stats.en_cours} color="kcb" />
        <StatCard label="Résolus" value={stats.resolu} color="kcbBronze" />
        <StatCard label="Fermés" value={stats.ferme} color="gray" />
      </div>

      {/* Liste des tickets */}
      <div className="bg-kcb-ardoise/50 rounded-[4px] border border-white/[0.06] p-6">
        <h3 className="text-xl font-bold text-white mb-4">📋 Tous les tickets</h3>
        
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto text-kcb-pierre mb-4" />
            <p className="text-kcb-pierre">Aucun ticket pour le moment</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="p-4 bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] hover:border-white/[0.08] transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-kcb-pierre mb-1">{ticket.ticketId}</div>
                    <h4 className="font-semibold text-white">{ticket.subject}</h4>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${priorityColors[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </div>
                
                <p className="text-sm text-kcb-pierre mb-3">{ticket.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${statusColors[ticket.status]}`}>
                      {ticket.status}
                    </span>
                    <span className="text-xs bg-kcb-ardoise text-kcb-sable px-2 py-1 rounded">
                      {ticket.category}
                    </span>
                  </div>
                  <div className="text-xs text-kcb-pierre">
                    {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorClasses = {
    kcb: 'bg-kcb-or/10 border-kcb-or/30 text-kcb-sable',
    green: 'bg-green-500/10 border-green-500/30 text-green-300',
    kcbBronze: 'bg-kcb-bronze/10 border-kcb-bronze/30 text-kcb-sable',
    gray: 'bg-gray-500/10 border-gray-500/30 text-gray-300',
  };

  return (
    <div className={`border rounded-[4px] p-4 ${colorClasses[color]}`}>
      <div className="text-xs font-medium opacity-75">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
