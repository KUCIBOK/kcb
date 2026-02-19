import { useState, useEffect } from 'react';
import { MessageSquare, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/support-tickets/admin/all', {
        headers: { Authorization: `Bearer ${token}` },
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
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    ouvert: 'bg-green-500/20 text-green-300',
    en_cours: 'bg-blue-500/20 text-blue-300',
    resolu: 'bg-purple-500/20 text-purple-300',
    ferme: 'bg-gray-500/20 text-gray-300',
  };

  const priorityColors = {
    basse: 'bg-blue-500/20 text-blue-300',
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
        <StatCard label="Total" value={stats.total} color="indigo" />
        <StatCard label="Ouverts" value={stats.ouvert} color="green" />
        <StatCard label="En cours" value={stats.en_cours} color="blue" />
        <StatCard label="Résolus" value={stats.resolu} color="purple" />
        <StatCard label="Fermés" value={stats.ferme} color="gray" />
      </div>

      {/* Liste des tickets */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
        <h3 className="text-xl font-bold text-white mb-4">📋 Tous les tickets</h3>
        
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">Aucun ticket pour le moment</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-gray-600 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{ticket.ticketId}</div>
                    <h4 className="font-semibold text-white">{ticket.subject}</h4>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${priorityColors[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </div>
                
                <p className="text-sm text-gray-400 mb-3">{ticket.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${statusColors[ticket.status]}`}>
                      {ticket.status}
                    </span>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      {ticket.category}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
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
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
    green: 'bg-green-500/10 border-green-500/30 text-green-300',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    gray: 'bg-gray-500/10 border-gray-500/30 text-gray-300',
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="text-xs font-medium opacity-75">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
