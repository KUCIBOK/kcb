import { useState, useEffect } from 'react'
import {
  Plus,
  Link as LinkIcon,
  Unlink,
  RefreshCw,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Calendar,
  Instagram,
  Facebook,
  Twitter,
  Zap,
  X,
} from 'lucide-react'
import { ConfirmDialog, toast } from '../ui'
import {
  getIntegrations,
  connectIntegration,
  updateIntegration,
  syncIntegration,
  disconnectIntegration,
  getIntegrationStats,
} from '../../api/useIntegration'

const INTEGRATION_CONFIGS = {
  logidoo: {
    name: 'Logidoo',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    description: 'Intégration logistique en temps réel',
    fields: [
      { name: 'accessToken', label: 'Access Token', type: 'password' },
      { name: 'refreshToken', label: 'Refresh Token', type: 'password' },
    ],
  },
  gmail: {
    name: 'Gmail',
    icon: Mail,
    color: 'from-red-500 to-pink-500',
    description: 'Gestion des emails',
    fields: [
      { name: 'email', label: 'Adresse email', type: 'email' },
      { name: 'accessToken', label: 'Access Token OAuth', type: 'password' },
    ],
  },
  outlook: {
    name: 'Outlook',
    icon: Mail,
    color: 'from-kcb-or to-kcb-bronze',
    description: 'Email Microsoft',
    fields: [
      { name: 'email', label: 'Adresse Outlook', type: 'email' },
      { name: 'accessToken', label: 'Access Token', type: 'password' },
    ],
  },
  google_calendar: {
    name: 'Google Calendar',
    icon: Calendar,
    color: 'from-kcb-or to-kcb-bronze',
    description: 'Calendrier synchronisé',
    fields: [
      { name: 'accessToken', label: 'Access Token', type: 'password' },
      { name: 'calendarId', label: 'ID du calendrier', type: 'text' },
    ],
  },
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: 'from-kcb-or to-kcb-bronze',
    description: 'Réseau social professionnel',
    fields: [
      { name: 'accessToken', label: 'Access Token', type: 'password' },
      { name: 'businessAccountId', label: 'ID du compte business', type: 'text' },
    ],
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'from-kcb-or to-kcb-or/70',
    description: 'Gestion des pages Facebook',
    fields: [
      { name: 'accessToken', label: 'Access Token', type: 'password' },
      { name: 'pageId', label: 'ID de la page', type: 'text' },
    ],
  },
  twitter: {
    name: 'Twitter/X',
    icon: Twitter,
    color: 'from-gray-700 to-black',
    description: 'Partage sur X/Twitter',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password' },
      { name: 'apiSecret', label: 'API Secret', type: 'password' },
      { name: 'accessToken', label: 'Access Token', type: 'password' },
    ],
  },
  webhook: {
    name: 'Webhooks',
    icon: Zap,
    color: 'from-green-500 to-teal-500',
    description: 'Intégrations personnalisées',
    fields: [
      { name: 'webhookUrl', label: 'URL du webhook', type: 'url' },
      { name: 'webhookSecret', label: 'Secret du webhook', type: 'password' },
    ],
  },
}

export function Integrations() {
  const [integrations, setIntegrations] = useState([])
  const [stats, setStats] = useState({ total: 0, connected: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState(null)
  const [formData, setFormData] = useState({})
  const [syncing, setSyncing] = useState(null)
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false)
  const [integrationToDisconnect, setIntegrationToDisconnect] = useState(null)

  useEffect(() => {
    loadIntegrations()
    loadStats()
  }, [])

  const loadIntegrations = async () => {
    setLoading(true)
    setError('')
    const data = await getIntegrations()
    if (!data.error) {
      setIntegrations(data)
    } else {
      setError(data.error)
    }
    setLoading(false)
  }

  const loadStats = async () => {
    const data = await getIntegrationStats()
    if (!data.error) {
      setStats(data)
    }
  }

  const handleConnect = async (integrationName) => {
    setSelectedIntegration(integrationName)
    setFormData({})
    setShowModal(true)
  }

  const handleSaveIntegration = async (e) => {
    e.preventDefault()
    setError('')

    const result = await connectIntegration(selectedIntegration, formData)

    if (!result.error) {
      await loadIntegrations()
      await loadStats()
      setShowModal(false)
      setFormData({})
    } else {
      setError(result.error)
    }
  }

  const handleSync = async (id) => {
    setSyncing(id)
    setError('')
    const result = await syncIntegration(id)
    setSyncing(null)

    if (result.error) {
      setError(result.error)
    } else {
      await loadIntegrations()
    }
  }

  const handleDisconnect = async (id) => {
    setIntegrationToDisconnect(id)
    setShowDisconnectConfirm(true)
  }

  const confirmDisconnect = async () => {
    setError('')
    const result = await disconnectIntegration(integrationToDisconnect)

    if (!result.error) {
      toast.success('✓ Intégration déconnectée')
      await loadIntegrations()
      await loadStats()
    } else {
      setError(result.error)
      toast.error('× Erreur lors de la déconnexion')
    }
    setShowDisconnectConfirm(false)
    setIntegrationToDisconnect(null)
  }

  const getConnectedIntegration = (name) => {
    return integrations.find((i) => i.name === name && i.isConnected)
  }

  const config = selectedIntegration ? INTEGRATION_CONFIGS[selectedIntegration] : null
  const isConnected = getConnectedIntegration(selectedIntegration)

  return (
    <div className="space-y-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Intégrations</h1>
          <p className="text-kcb-pierre">
            Connectez vos services préférés pour optimiser votre workflow
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-[4px] p-4 text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Stats */}
      {stats.total > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
            <p className="text-kcb-pierre text-sm">Total</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
            <p className="text-kcb-pierre text-sm">Connectées</p>
            <p className="text-2xl font-bold text-green-400">{stats.connected}</p>
          </div>
        </div>
      )}

      {/* Integration Grid */}
      {!loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(INTEGRATION_CONFIGS).map(([key, config]) => {
            const connected = getConnectedIntegration(key)
            const Icon = config.icon

            return (
              <div
                key={key}
                className="bg-kcb-ardoise rounded-[4px] p-6 border border-white/[0.06] hover:border-kcb-or/50 transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-[4px] bg-gradient-to-br ${config.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {connected && <CheckCircle className="w-5 h-5 text-green-400" />}
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold text-white mb-1">{config.name}</h3>
                <p className="text-sm text-kcb-pierre mb-4">{config.description}</p>

                {/* Status */}
                {connected && (
                  <div className="mb-4 text-xs text-kcb-pierre">
                    <p>
                      Connectée depuis {new Date(connected.connectedAt).toLocaleDateString('fr-FR')}
                    </p>
                    {connected.lastSync && (
                      <p>
                        Dernière sync: {new Date(connected.lastSync).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                )}

                {/* Sync Status */}
                {connected?.syncStatus && (
                  <div
                    className={`mb-4 text-xs p-2 rounded ${
                      connected.syncStatus === 'success'
                        ? 'bg-green-500/20 text-green-300'
                        : connected.syncStatus === 'error'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                    }`}
                  >
                    {connected.syncStatus === 'syncing' && (
                      <div className="flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Synchronisation en cours...
                      </div>
                    )}
                    {connected.syncStatus === 'success' && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Synchronisé avec succès
                      </div>
                    )}
                    {connected.syncStatus === 'error' && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {connected.syncErrorMessage || 'Erreur de synchronisation'}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {!connected ? (
                    <button
                      onClick={() => handleConnect(key)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-kcb-or hover:bg-kcb-bronze text-kcb-noir rounded-[4px] transition text-sm"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Connecter
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSync(connected._id)}
                        disabled={syncing === connected._id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-700/80 hover:bg-green-600 text-white rounded-[4px] transition text-sm disabled:opacity-50"
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${syncing === connected._id ? 'animate-spin' : ''}`}
                        />
                        Synchroniser
                      </button>
                      <button
                        onClick={() => handleDisconnect(connected._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-900/80 hover:bg-red-800 text-white rounded-[4px] transition text-sm"
                      >
                        <Unlink className="w-4 h-4" />
                        Déconnecter
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kcb-or"></div>
        </div>
      )}

      {/* Modal */}
      {showModal && config && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-kcb-ardoise rounded-[4px] max-w-md w-full p-6 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-[4px] bg-gradient-to-br ${config.color}`}>
                  {<config.icon className="w-5 h-5 text-white" />}
                </div>
                <h2 className="text-2xl font-bold text-white">Connecter {config.name}</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-white/[0.08] rounded transition"
              >
                <X className="w-5 h-5 text-kcb-pierre" />
              </button>
            </div>

            <form onSubmit={handleSaveIntegration} className="space-y-4">
              {config.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-kcb-sable mb-2">
                    {field.label} *
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.name]: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2 bg-kcb-noir border border-white/[0.06] rounded-[4px] text-white focus:border-kcb-or focus:outline-none"
                  />
                </div>
              ))}

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-kcb-or hover:bg-kcb-bronze text-kcb-noir rounded-[4px] transition font-medium"
                >
                  Connecter
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-kcb-ardoise hover:bg-white/[0.08] text-white rounded-[4px] transition font-medium"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disconnect Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDisconnectConfirm}
        onClose={() => setShowDisconnectConfirm(false)}
        onConfirm={confirmDisconnect}
        title="Déconnecter l'intégration"
        message="Êtes-vous sûr de vouloir déconnecter cette intégration? Vous devrez la reconfigurer pour la reconnecter."
        confirmText="Déconnecter"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  )
}

export default Integrations
