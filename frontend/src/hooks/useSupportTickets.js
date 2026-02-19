import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/support-tickets';

export const useSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = async (filters = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();

      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.category) params.append('category', filters.category);
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`${API_BASE}/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTickets(response.data.tickets);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data.stats);
    } catch (err) {
      console.error('Erreur stats:', err);
    }
  };

  const getTicketById = async (ticketId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/ticket/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.ticket;
    } catch (err) {
      console.error('Erreur:', err);
      throw err;
    }
  };

  const updateStatus = async (ticketId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE}/admin/ticket/${ticketId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.ticket;
    } catch (err) {
      throw err;
    }
  };

  const assignTicket = async (ticketId, adminId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE}/admin/ticket/${ticketId}/assign`,
        { assignedTo: adminId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.ticket;
    } catch (err) {
      throw err;
    }
  };

  const addResponse = async (ticketId, message, attachments = []) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE}/ticket/${ticketId}/response`,
        { message, attachments },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.ticket;
    } catch (err) {
      throw err;
    }
  };

  const addTags = async (ticketId, tags) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE}/admin/ticket/${ticketId}/tags`,
        { tags },
        { headers: { Authorization: `Bearer ${token}` } }
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
