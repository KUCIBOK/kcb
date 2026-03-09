import { useState, useEffect } from 'react';
import { useSupportTickets } from '../../hooks/useSupportTickets';
import { MessageSquare, Plus, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import CreateTicketModal from './CreateTicketModal';

const statusIcons = {
  ouvert: <Clock className="w-4 h-4" />,
  en_cours: <Clock className="w-4 h-4" />,
  resolu: <CheckCircle className="w-4 h-4" />,
  ferme: <AlertCircle className="w-4 h-4" />,
  en_attente: <Clock className="w-4 h-4" />,
};

const statusColors = {
  ouvert: 'bg-green-500/10 text-green-300 border-green-500/30',
  en_cours: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  en_attente: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
  resolu: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  ferme: 'bg-gray-500/10 text-gray-300 border-gray-500/30',
};

const priorityBadges = {
  basse: 'bg-blue-500/20 text-blue-300',
  normale: 'bg-gray-500/20 text-gray-300',
  haute: 'bg-orange-500/20 text-orange-300',
  critique: 'bg-red-500/20 text-red-300',
};

export default function MyTickets() {
  const { tickets, loading, getMyTickets } = useSupportTickets();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState('');

  useEffect(() => {
    loadTickets();
  }, [activeStatus]);

  const loadTickets = () => {
    getMyTickets({ status: activeStatus || undefined });
  };

  const filteredTickets = activeStatus
    ? tickets.filter((t) => t.status === activeStatus)
    : tickets;

  const handleTicketCreated = () => {
    loadTickets();
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Mes tickets support</h2>
          <p className="text-gray-400 text-sm mt-1">
            Gérez vos demandes de support et suivez leur statut
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition"
        >
          <Plus className="w-5 h-5" /> Nouveau ticket
        </button>
      </div>

      {/* Filtres par statut */}
      <div className="flex gap-2 flex-wrap">
        {['', 'ouvert', 'en_cours', 'resolu', 'ferme'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeStatus === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {status === '' ? 'Tous' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full text-gray-400 text-center py-8">
            Chargement de vos tickets...
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">Aucun ticket trouvé</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Créer un ticket →
            </button>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              onClick={() => setSelectedTicket(ticket)}
              className={`p-4 rounded-lg border cursor-pointer transition ${
                selectedTicket?._id === ticket._id
                  ? 'bg-indigo-500/20 border-indigo-500'
                  : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
              }`}
            >
              {/* En-tête du ticket */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-gray-500">
                      {ticket.ticketId}
                    </span>
                    <span
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${
                        statusColors[ticket.status]
                      }`}
                    >
                      {statusIcons[ticket.status]}
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {ticket.subject}
                  </h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${priorityBadges[ticket.priority]}`}>
                  {ticket.priority}
                </span>
              </div>

              {/* Corps */}
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {ticket.description}
              </p>

              {/* Métadonnées */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {ticket.responses?.length || 0} réponse{ticket.responses?.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de création */}
      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTicketCreated}
      />
    </div>
  );
}
