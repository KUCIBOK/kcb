import { useState } from 'react'
import { utils } from '../api/useAPI'

/**
 * Hook de gestion des tickets de support (admin).
 * Fournit CRUD + stats + assignation + tags.
 * @returns {object} State et fonctions de gestion des tickets
 */
export const useSupportTickets = () => {
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getAll = async (filters = {}) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (filters.status) params.append('status', filters.status)
      if (filters.priority) params.append('priority', filters.priority)
      if (filters.category) params.append('category', filters.category)
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo)
      if (filters.search) params.append('search', filters.search)

      const response = await fetch(`${utils.api}/support-tickets/admin/all?${params}`, {
        headers: utils.options.headers,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || 'Erreur lors de la recuperation')
      }

      const data = await response.json()
      setTickets(data.tickets)
      setError(null)
    } catch (err) {
      setError(err.message || 'Erreur lors de la recuperation')
    } finally {
      setLoading(false)
    }
  }

  const getStats = async () => {
    try {
      const response = await fetch(`${utils.api}/support-tickets/admin/stats`, {
        headers: utils.options.headers,
      })

      if (!response.ok) return

      const data = await response.json()
      setStats(data.stats)
    } catch (err) {
      // non bloquant
    }
  }

  const getTicketById = async (ticketId) => {
    const response = await fetch(`${utils.api}/support-tickets/ticket/${ticketId}`, {
      headers: utils.options.headers,
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.message || 'Erreur lors de la recuperation du ticket')
    }

    const data = await response.json()
    return data.ticket
  }

  const updateStatus = async (ticketId, status) => {
    const response = await fetch(`${utils.api}/support-tickets/admin/ticket/${ticketId}/status`, {
      method: 'PUT',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.message || 'Erreur lors de la mise a jour du statut')
    }

    const data = await response.json()
    return data.ticket
  }

  const assignTicket = async (ticketId, adminId) => {
    const response = await fetch(`${utils.api}/support-tickets/admin/ticket/${ticketId}/assign`, {
      method: 'PUT',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedTo: adminId }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.message || "Erreur lors de l'assignation")
    }

    const data = await response.json()
    return data.ticket
  }

  const addResponse = async (ticketId, message, attachments = []) => {
    const response = await fetch(`${utils.api}/support-tickets/ticket/${ticketId}/response`, {
      method: 'POST',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, attachments }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.message || "Erreur lors de l'ajout de la reponse")
    }

    const data = await response.json()
    return data.ticket
  }

  const addTags = async (ticketId, tags) => {
    const response = await fetch(`${utils.api}/support-tickets/admin/ticket/${ticketId}/tags`, {
      method: 'PUT',
      headers: { ...utils.options.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.message || "Erreur lors de l'ajout des tags")
    }

    const data = await response.json()
    return data.ticket
  }

  return {
    tickets,
    stats,
    loading,
    error,
    getAll,
    getStats,
    getTicketById,
    updateStatus,
    assignTicket,
    addResponse,
    addTags,
  }
}
