import { useState } from 'react';
import axios from 'axios';
import { utils } from '../api/useAPI';

export const useSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.category) params.append('category', filters.category);
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(
        `${utils.api}/support-tickets/admin/all?${params}`,
        { headers: utils.options.headers },
      );

      setTickets(response.data.tickets);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération');
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    try {
      const response = await axios.get(
        `${utils.api}/support-tickets/admin/stats`,
        { headers: utils.options.headers },
      );
      setStats(response.data.stats);
    } catch (err) {
      // non bloquant
    }
  };

  const getTicketById = async (ticketId) => {
    try {
      const response = await axios.get(
        `${utils.api}/support-tickets/ticket/${ticketId}`,
        { headers: utils.options.headers },
      );
      return response.data.ticket;
    } catch (err) {
      throw err;
    }
  };

  const updateStatus = async (ticketId, status) => {
    try {
      const response = await axios.put(
        `${utils.api}/support-tickets/admin/ticket/${ticketId}/status`,
        { status },
        { headers: utils.options.headers },
      );
      return response.data.ticket;
    } catch (err) {
      throw err;
    }
  };

  const assignTicket = async (ticketId, adminId) => {
    try {
      const response = await axios.put(
        `${utils.api}/support-tickets/admin/ticket/${ticketId}/assign`,
        { assignedTo: adminId },
        { headers: utils.options.headers },
      );
      return response.data.ticket;
    } catch (err) {
      throw err;
    }
  };

  const addResponse = async (ticketId, message, attachments = []) => {
    try {
      const response = await axios.post(
        `${utils.api}/support-tickets/ticket/${ticketId}/response`,
        { message, attachments },
        { headers: utils.options.headers },
      );
      return response.data.ticket;
    } catch (err) {
      throw err;
    }
  };

  const addTags = async (ticketId, tags) => {
    try {
      const response = await axios.put(
        `${utils.api}/support-tickets/admin/ticket/${ticketId}/tags`,
        { tags },
        { headers: utils.options.headers },
      );
      return response.data.ticket;
    } catch (err) {
      throw err;
    }
  };

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
  };
};
