import { useState, useEffect } from "react";
import {
  Users, Mail, Tag, Plus, Search, Filter, Upload, Download,
  Edit2, Trash2, UserPlus, List, Calendar, CheckCircle, XCircle, Clock, RefreshCw
} from "lucide-react";
import {
  getContacts, createContact, updateContact, deleteContact, importContacts,
  getLists, createList, getContactStats, syncFromCRM, bulkSyncFromCRM
} from "../../api/useContacts";
import { KPICard, Button, Badge, toast, ConfirmDialog, Modal, Input, Select } from "../ui";

export function ContactsLists() {
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' or 'lists'
  const [contacts, setContacts] = useState([]);
  const [lists, setLists] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showCRMSyncModal, setShowCRMSyncModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab, selectedStatus, selectedType]);

  const loadData = async () => {
    setLoading(true);
    
    if (activeTab === 'contacts') {
      const filters = {};
      if (selectedStatus !== 'all') filters.status = selectedStatus;
      if (selectedType !== 'all') filters.type = selectedType;
      if (searchQuery) filters.search = searchQuery;

      const [contactsData, statsData] = await Promise.all([
        getContacts(filters),
        getContactStats()
      ]);

      if (!contactsData.error) setContacts(contactsData.contacts || []);
      if (!statsData.error) setStats(statsData);
    } else {
      const listsData = await getLists();
      if (!listsData.error) setLists(listsData);
    }

    setLoading(false);
  };

  const handleAddContact = async (contactData) => {
    const result = await createContact(contactData);
    if (!result.error) {
      toast.success('✓ Contact ajouté avec succès');
      setShowAddModal(false);
      loadData();
    } else {
      toast.error('× Erreur lors de l\'ajout du contact');
    }
  };

  const handleDeleteContact = async (id) => {
    setContactToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteContact = async () => {
    const result = await deleteContact(contactToDelete);
    if (!result.error) {
      toast.success('✓ Contact supprimé');
      loadData();
    } else {
      toast.error('× Erreur lors de la suppression');
    }
    setShowDeleteConfirm(false);
    setContactToDelete(null);
  };

  const handleCreateList = async (listData) => {
    const result = await createList(listData);
    if (!result.error) {
      toast.success('✓ Liste créée avec succès');
      setShowListModal(false);
      loadData();
    } else {
      toast.error('× Erreur lors de la création de la liste');
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Contacts & Listes</h1>
            <p className="text-gray-400">Gérez vos destinataires et segmentez votre audience</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowCRMSyncModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-kcb-pierre hover:bg-kcb-ardoise rounded-lg text-white transition"
            >
              <RefreshCw className="w-4 h-4" />
              Synchroniser CRM
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-kcb-or hover:bg-kcb-bronze text-kcb-noir rounded-lg text-white transition"
            >
              <UserPlus className="w-4 h-4" />
              Nouveau Contact
            </button>
            <button
              onClick={() => setShowListModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-800 hover:bg-green-700 rounded-lg text-white transition"
            >
              <List className="w-4 h-4" />
              Nouvelle Liste
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <KPICard
              icon={Users}
              label="Total Contacts"
              value={stats.total}
              trend={{ value: '+12%', direction: 'up' }}
              iconColor="text-indigo-400"
              iconBgColor="bg-indigo-900/20"
              loading={loading}
            />
            <KPICard
              icon={CheckCircle}
              label="Actifs"
              value={stats.active}
              trend={{ value: '+8%', direction: 'up' }}
              iconColor="text-green-400"
              iconBgColor="bg-green-900/20"
              loading={loading}
            />
            <KPICard
              icon={XCircle}
              label="Désabonnés"
              value={stats.unsubscribed}
              trend={{ value: '-3%', direction: 'down' }}
              iconColor="text-orange-400"
              iconBgColor="bg-orange-900/20"
              loading={loading}
            />
            <KPICard
              icon={Mail}
              label="Bounced"
              value={stats.bounced}
              trend={{ value: '0%', direction: 'neutral' }}
              iconColor="text-red-400"
              iconBgColor="bg-red-900/20"
              loading={loading}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'contacts'
                ? 'text-kcb-or border-b-2 border-kcb-or'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Contacts
          </button>
          <button
            onClick={() => setActiveTab('lists')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'lists'
                ? 'text-kcb-or border-b-2 border-kcb-or'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4 inline mr-2" />
            Listes
          </button>
        </div>

        {/* Filters */}
        <div className="bg-card border border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && loadData()}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-kcb-or focus:outline-none"
                />
              </div>
            </div>

            {activeTab === 'contacts' && (
              <>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-kcb-or focus:outline-none"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="unsubscribed">Désabonnés</option>
                  <option value="bounced">Bounced</option>
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-kcb-or focus:outline-none"
                >
                  <option value="all">Tous les types</option>
                  <option value="collector">Collectionneurs</option>
                  <option value="gallery">Galeries</option>
                  <option value="artist">Artistes</option>
                  <option value="press">Presse</option>
                  <option value="other">Autre</option>
                </select>
              </>
            )}

            <button
              onClick={loadData}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'contacts' ? (
          <ContactsTable
            contacts={contacts}
            loading={loading}
            onEdit={setEditingContact}
            onDelete={handleDeleteContact}
          />
        ) : (
          <ListsGrid
            lists={lists}
            loading={loading}
          />
        )}

        {/* Add Contact Modal */}
        {showAddModal && (
          <AddContactModal
            onClose={() => setShowAddModal(false)}
            onSave={handleAddContact}
            lists={lists}
          />
        )}

        {/* Create List Modal */}
        {showListModal && (
          <CreateListModal
            onClose={() => setShowListModal(false)}
            onSave={handleCreateList}
          />
        )}

        {/* CRM Sync Modal */}
        {showCRMSyncModal && (
          <CRMSyncModal
            onClose={() => setShowCRMSyncModal(false)}
            onSync={loadData}
            lists={lists}
          />
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-card border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
}

// Contacts Table Component
function ContactsTable({ contacts, loading, onEdit, onDelete }) {
  if (loading) {
    return <div className="text-center py-12 text-gray-400">Chargement...</div>;
  }

  if (contacts.length === 0) {
    return (
      <div className="bg-card border border-gray-700 rounded-lg p-12 text-center">
        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 mb-2">Aucun contact</p>
        <p className="text-gray-500 text-sm">Ajoutez votre premier contact pour commencer</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-gray-700 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Contact</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Type</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Statut</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Tags</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Engagement</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {contacts.map((contact) => (
            <tr key={contact._id} className="hover:bg-gray-800/50 transition">
              <td className="px-4 py-3">
                <div>
                  <p className="text-white font-medium">{contact.firstName} {contact.lastName}</p>
                  <p className="text-gray-400 text-sm">{contact.email}</p>
                  {contact.company && <p className="text-gray-500 text-xs">{contact.company}</p>}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-kcb-or/10 text-kcb-or text-xs rounded capitalize">
                  {contact.type}
                </span>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={contact.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {contact.tags?.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {contact.tags?.length > 2 && (
                    <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">
                      +{contact.tags.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-400">
                  {contact.stats?.emailsOpened || 0} opens / {contact.stats?.emailsClicked || 0} clicks
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(contact)}
                    className="p-2 text-gray-400 hover:text-kcb-or transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(contact._id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Status Badge
function StatusBadge({ status }) {
  const colors = {
    active: 'bg-green-900/50 text-green-300',
    unsubscribed: 'bg-orange-900/50 text-orange-300',
    bounced: 'bg-red-900/50 text-red-300',
    spam: 'bg-red-900/50 text-red-300'
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${colors[status] || colors.active}`}>
      {status}
    </span>
  );
}

// Lists Grid Component
function ListsGrid({ lists, loading }) {
  if (loading) {
    return <div className="text-center py-12 text-gray-400">Chargement...</div>;
  }

  if (lists.length === 0) {
    return (
      <div className="bg-card border border-gray-700 rounded-lg p-12 text-center">
        <List className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 mb-2">Aucune liste</p>
        <p className="text-gray-500 text-sm">Créez votre première liste pour organiser vos contacts</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lists.map((list) => (
        <div key={list._id} className="bg-card border border-gray-700 rounded-lg p-6 hover:border-kcb-or transition">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                list.type === 'event' ? 'bg-orange-500' : 
                list.type === 'dynamic' ? 'bg-purple-500' : 'bg-indigo-500'
              }`}>
                {list.type === 'event' ? <Calendar className="w-5 h-5 text-white" /> : <List className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h3 className="text-white font-semibold">{list.name}</h3>
                <p className="text-gray-400 text-sm capitalize">{list.type}</p>
              </div>
            </div>
          </div>

          {list.description && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{list.description}</p>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              <span className="text-white font-medium">{list.stats?.totalContacts || 0}</span> contacts
            </div>
            {list.type === 'event' && list.event?.date && (
              <div className="text-gray-400">
                <Clock className="w-4 h-4 inline mr-1" />
                {new Date(list.event.date).toLocaleDateString()}
              </div>
            )}
          </div>

          {list.type === 'event' && list.rsvps && list.rsvps.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex gap-4 text-sm">
                <div className="text-green-400">
                  ✓ {list.rsvps.filter(r => r.status === 'confirmed').length} confirmés
                </div>
                <div className="text-orange-400">
                  ? {list.rsvps.filter(r => r.status === 'pending').length} en attente
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Add Contact Modal (simplified)
function AddContactModal({ onClose, onSave, lists }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    type: 'collector',
    tags: [],
    lists: []
  });

  const typeOptions = [
    { value: 'collector', label: 'Collectionneur' },
    { value: 'gallery', label: 'Galerie' },
    { value: 'artist', label: 'Artiste' },
    { value: 'press', label: 'Presse' },
    { value: 'other', label: 'Autre' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Nouveau Contact"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Prénom"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            placeholder="Prénom"
            required
          />
          <Input
            label="Nom"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            placeholder="Nom"
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="email@example.com"
          required
        />

        <Input
          label="Téléphone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="+33 1 23 45 67 89"
        />

        <Input
          label="Entreprise"
          value={formData.company}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
          placeholder="Nom de l'entreprise"
        />

        <Select
          label="Type"
          options={typeOptions}
          value={formData.type}
          onChange={(value) => setFormData({...formData, type: value})}
        />

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
          >
            Ajouter
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Create List Modal (simplified)
function CreateListModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'static'
  });

  const typeOptions = [
    { value: 'static', label: 'Liste statique' },
    { value: 'dynamic', label: 'Liste dynamique' },
    { value: 'event', label: 'Liste événement' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Nouvelle Liste"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom de la liste"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Nom de la liste"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-kcb-or focus:outline-none"
            rows={3}
            placeholder="Description de la liste"
          />
        </div>

        <Select
          label="Type"
          options={typeOptions}
          value={formData.type}
          onChange={(value) => setFormData({...formData, type: value})}
        />

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
          >
            Créer
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// CRM Sync Modal
function CRMSyncModal({ onClose, onSync, lists }) {
  const [loading, setLoading] = useState(false);
  const [selectedList, setSelectedList] = useState('');
  const [syncResults, setSyncResults] = useState(null);

  const handleSync = async () => {
    setLoading(true);
    
    // Note: This is a placeholder - you'll need to get CRM contacts first
    // For now, show instructions
    setSyncResults({
      message: 'Synchronisation CRM configurée',
      info: 'Cette fonctionnalité synchronisera automatiquement vos clients CRM vers vos contacts marketing'
    });
    
    setLoading(false);
    
    // In real implementation:
    // const crmContacts = await getCRMContacts();
    // const result = await bulkSyncFromCRM(crmContacts.map(c => c._id), selectedList, ['crm']);
    // setSyncResults(result);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-gray-700 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">Synchroniser depuis CRM Galerie</h3>
        
        {!syncResults ? (
          <div className="space-y-4">
            <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
              <p className="text-purple-300 text-sm mb-2">
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Cette fonction va:
              </p>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Importer vos clients CRM</li>
                <li>• Les ajouter aux contacts marketing</li>
                <li>• Éviter les doublons par email</li>
                <li>• Marquer comme "consentement CRM"</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Ajouter à la liste (optionnel)</label>
              <select
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option value="">Aucune liste</option>
                {lists.map(list => (
                  <option key={list._id} value={list._id}>{list.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSync}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-kcb-pierre hover:bg-kcb-ardoise rounded text-white transition disabled:opacity-50"
              >
                {loading ? 'Synchronisation...' : 'Synchroniser'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <p className="text-green-300 font-medium mb-2">✓ {syncResults.message}</p>
              <p className="text-gray-400 text-sm">{syncResults.info}</p>
              
              {syncResults.created !== undefined && (
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-gray-300">• Créés: {syncResults.created}</p>
                  <p className="text-gray-300">• Mis à jour: {syncResults.updated}</p>
                  <p className="text-gray-300">• Ignorés: {syncResults.skipped}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => { onClose(); onSync(); }}
              className="w-full px-4 py-2 bg-kcb-pierre hover:bg-kcb-ardoise rounded text-white transition"
            >
              Fermer
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteContact}
        title="Supprimer le contact"
        message="Êtes-vous sûr de vouloir supprimer ce contact? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}

export default ContactsLists;
