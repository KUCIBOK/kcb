const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const controllers = require('../controllers/supportTicket.controller');

console.log('Auth middleware:', typeof auth);
console.log('Controllers:', Object.keys(controllers));

const {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  addResponse,
  updateTicketStatus,
  assignTicket,
  addTags,
  getTicketStats,
} = controllers;

console.log('createTicket:', typeof createTicket);

// Routes publiques (utilisateur authentifié)
router.post('/create', auth, createTicket);
router.get('/my-tickets', auth, getMyTickets);
router.get('/ticket/:ticketId', auth, getTicketById);
router.post('/ticket/:ticketId/response', auth, addResponse);

// Routes admin
router.get('/admin/all', admin, getAllTickets);
router.put('/admin/ticket/:ticketId/status', admin, updateTicketStatus);
router.put('/admin/ticket/:ticketId/assign', admin, assignTicket);
router.put('/admin/ticket/:ticketId/tags', admin, addTags);
router.get('/admin/stats', admin, getTicketStats);

module.exports = router;
