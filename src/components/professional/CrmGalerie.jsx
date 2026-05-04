import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Filter,
  Download,
  Users,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import {
  getClients,
  getCrmStats,
  syncClientsFromTransactions,
  exportClientsCSV,
} from '../../api/useCrm'
import ClientsList from './ClientsList'
import ClientDetail from './ClientDetail'
import AddClientForm from './AddClientForm'
import CrmStats from './CrmStats'
import { Modal } from '../ui'

export function CrmGalerie() {
  const [view, setView] = useState('list') // list, detail
  const [clients, setClients] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [segment, setSegment] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // Charger les clients
  const loadClients = async () => {
    setLoading(true)
    const data = await getClients({
      search: search || undefined,
      status: status || undefined,
      segment: segment || undefined,
      page,
      limit: 10,
    })
    if (!data.error) {
      setClients(data.clients || [])
      setTotal(data.total || 0)
    }
    setLoading(false)
  }

  // Charger les statistiques
  const loadStats = async () => {
    const data = await getCrmStats()
    if (!data.error) {
      setStats(data)
    }
  }

  useEffect(() => {
    loadClients()
    loadStats()
  }, [search, status, segment, page])

  const handleSync = async () => {
    setSyncing(true)
    const result = await syncClientsFromTransactions()
    if (!result.error) {
      await loadClients()
      await loadStats()
    }
    setSyncing(false)
  }

  const handleExport = async () => {
    await exportClientsCSV()
  }

  const handleClientAdded = async () => {
    setShowAddModal(false)
    setPage(1)
    await loadClients()
    await loadStats()
  }

  const handleClientUpdated = async () => {
    await loadClients()
    await loadStats()
  }

  const handleViewClient = (client) => {
    setSelectedClient(client)
    setView('detail')
  }

  return (
    <div className="space-y-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">CRM Galerie</h1>
          <p className="text-kcb-pierre">
            Gérez vos clients, suivez vos ventes et optimisez les relations
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-kcb-or hover:bg-kcb-or/90 text-kcb-noir px-4 py-2 rounded-[4px] transition disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            {syncing ? 'Synchronisation...' : 'Syncer'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-kcb-ardoise border border-kcb-or/30 hover:bg-kcb-pierre text-white px-4 py-2 rounded-[4px] transition"
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-kcb-or hover:bg-kcb-bronze text-kcb-noir px-4 py-2 rounded-[4px] transition"
          >
            <Plus className="w-4 h-4" />
            Ajouter un client
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && <CrmStats stats={stats} />}

      {/* Vues principales */}
      {view === 'list' && (
        <div className="space-y-4">
          {/* Filtres */}
          <div className="bg-kcb-ardoise rounded-[4px] p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-kcb-pierre" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email ou téléphone..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-kcb-noir border border-white/[0.06] rounded-[4px] text-white placeholder-kcb-pierre focus:outline-none focus:border-kcb-or"
                  />
                </div>
              </div>

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setPage(1)
                }}
                className="px-4 py-2 bg-kcb-noir border border-white/[0.06] rounded-[4px] text-white focus:outline-none focus:border-kcb-or"
              >
                <option value="">Tous les statuts</option>
                <option value="prospect">Prospect</option>
                <option value="client">Client</option>
                <option value="vip">VIP</option>
                <option value="inactive">Inactif</option>
              </select>

              <select
                value={segment}
                onChange={(e) => {
                  setSegment(e.target.value)
                  setPage(1)
                }}
                className="px-4 py-2 bg-kcb-noir border border-white/[0.06] rounded-[4px] text-white focus:outline-none focus:border-kcb-or"
              >
                <option value="">Tous les segments</option>
                <option value="art-collector">Collectionneur</option>
                <option value="corporate">Corporate</option>
                <option value="museum">Musée</option>
                <option value="gallery">Galerie</option>
                <option value="investor">Investisseur</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>

          {/* Liste des clients */}
          <ClientsList
            clients={clients}
            loading={loading}
            total={total}
            page={page}
            onPageChange={setPage}
            onViewClient={handleViewClient}
            onClientsUpdated={loadClients}
          />
        </div>
      )}

      {view === 'detail' && selectedClient && (
        <div>
          <button
            onClick={() => setView('list')}
            className="mb-4 text-kcb-pierre hover:text-white flex items-center gap-2"
          >
            ← Retour
          </button>
          <ClientDetail
            client={selectedClient}
            onClientUpdated={async () => {
              handleClientUpdated()
              setSelectedClient(null)
              setView('list')
            }}
          />
        </div>
      )}

      {/* Add Client Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ajouter un nouveau client"
        size="lg"
      >
        <AddClientForm onSuccess={handleClientAdded} />
      </Modal>
    </div>
  )
}

export default CrmGalerie
