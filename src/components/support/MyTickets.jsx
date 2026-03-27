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
  en_cours: 'bg-kcb-or/10 text-kcb-or border-kcb-or/30',
  en_attente: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
  resolu: 'bg-kcb-bronze/10 text-kcb-bronze border-kcb-bronze/30',
  ferme: 'bg-gray-500/10 text-kcb-sable border-gray-500/30',
};

const priorityBadges = {
  basse: 'bg-kcb-or/10 text-kcb-or',
  normale: 'bg-gray-500/20 text-kcb-sable',
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
          <p className="text-kcb-pierre text-sm mt-1">
            Gérez vos demandes de support et suivez leur statut
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-kcb-or hover:bg-kcb-or/90 rounded-[4px] text-kcb-noir font-semibold transition"
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
            className={`px-4 py-2 rounded-[4px] text-sm font-medium transition ${
              activeStatus === status
                ? 'bg-kcb-or text-kcb-noir'
                : 'bg-kcb-ardoise text-kcb-sable hover:bg-kcb-ardoise'
            }`}
          >
            {status === '' ? 'Tous' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full text-kcb-pierre text-center py-8">
            Chargement de vos tickets...
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto text-kcb-pierre mb-4" />
            <p className="text-kcb-pierre">Aucun ticket trouvé</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-kcb-or hover:text-kcb-or/80 font-medium"
            >
              Créer un ticket →
            </button>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              onClick={() => setSelectedTicket(ticket)}
              className={`p-4 rounded-[4px] border cursor-pointer transition ${
                selectedTicket?._id === ticket._id
                  ? 'bg-kcb-or/10 border-kcb-or'
                  : 'bg-kcb-ardoise/50 border-white/[0.06] hover:border-white/[0.06]'
              }`}
            >
              {/* En-tête du ticket */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-kcb-pierre">
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
              <p className="text-kcb-pierre text-sm mb-3 line-clamp-2">
                {ticket.description}
              </p>

              {/* Métadonnées */}
              <div className="flex items-center justify-between text-xs text-kcb-pierre">
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
