const SupportTicket = require('../models/SupportTicket');

// Créer un ticket support
const createTicket = async (req, res) => {
  try {
    const { category, priority, subject, description } = req.body;
    const userId = req.user._id;

    const ticket = new SupportTicket({
      userId,
      userName: req.user.name,
      userEmail: req.user.email,
      category,
      priority: priority || 'normale',
      subject,
      description,
    });

    await ticket.save();

    res.status(201).json({
      success: true,
      message: 'Ticket créé avec succès',
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du ticket',
      error: error.message,
    });
  }
};

// Récupérer tous les tickets (admin)
const getAllTickets = async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (category) filters.category = category;

    if (search) {
      filters.$or = [
        { ticketId: new RegExp(search, 'i') },
        { subject: new RegExp(search, 'i') },
        { userName: new RegExp(search, 'i') },
      ];
    }

    const tickets = await SupportTicket.find(filters)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tickets',
      error: error.message,
    });
  }
};

// Récupérer mes tickets (user)
const getMyTickets = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;
    const filters = { userId };

    if (status) filters.status = status;

    const tickets = await SupportTicket.find(filters)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de vos tickets',
      error: error.message,
    });
  }
};

// Récupérer les détails d'un ticket
const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await SupportTicket.findOne({ ticketId });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé',
      });
    }

    res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du ticket',
      error: error.message,
    });
  }
};

// Ajouter une réponse au ticket
const addResponse = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;
    const responder = req.user;

    const ticket = await SupportTicket.findOne({ ticketId });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé',
      });
    }

    const response = {
      responderType: responder.role === 'admin' ? 'admin' : 'user',
      responderName: responder.name,
      responderId: responder._id,
      message,
    };

    ticket.responses.push(response);
    ticket.updatedAt = new Date();

    await ticket.save();

    res.json({
      success: true,
      message: 'Réponse ajoutée avec succès',
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de la réponse',
      error: error.message,
    });
  }
};

// Mettre à jour le statut du ticket
const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const validStatuses = ['ouvert', 'en_cours', 'en_attente', 'resolu', 'ferme'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide',
      });
    }

    const ticket = await SupportTicket.findOneAndUpdate(
      { ticketId },
      {
        status,
        closedAt: status === 'ferme' ? new Date() : null,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé',
      });
    }

    res.json({
      success: true,
      message: 'Statut du ticket mis à jour',
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message,
    });
  }
};

// Assigner un ticket à un admin
const assignTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { assignedTo } = req.body;

    const ticket = await SupportTicket.findOneAndUpdate(
      { ticketId },
      {
        assignedTo,
        assignedToName: 'Admin',
        status: 'en_cours',
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé',
      });
    }

    res.json({
      success: true,
      message: 'Ticket assigné avec succès',
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'assignation du ticket',
      error: error.message,
    });
  }
};

// Ajouter des tags
const addTags = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { tags } = req.body;

    const ticket = await SupportTicket.findOneAndUpdate(
      { ticketId },
      { tags, updatedAt: new Date() },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé',
      });
    }

    res.json({
      success: true,
      message: 'Tags ajoutés avec succès',
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout des tags',
      error: error.message,
    });
  }
};

// Récupérer les statistiques des tickets
const getTicketStats = async (req, res) => {
  try {
    const stats = {
      total: await SupportTicket.countDocuments(),
      ouvert: await SupportTicket.countDocuments({ status: 'ouvert' }),
      en_cours: await SupportTicket.countDocuments({ status: 'en_cours' }),
      en_attente: await SupportTicket.countDocuments({ status: 'en_attente' }),
      resolu: await SupportTicket.countDocuments({ status: 'resolu' }),
      ferme: await SupportTicket.countDocuments({ status: 'ferme' }),
      parPriorite: {
        basse: await SupportTicket.countDocuments({ priority: 'basse' }),
        normale: await SupportTicket.countDocuments({ priority: 'normale' }),
        haute: await SupportTicket.countDocuments({ priority: 'haute' }),
        critique: await SupportTicket.countDocuments({ priority: 'critique' }),
      },
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message,
    });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  addResponse,
  updateTicketStatus,
  assignTicket,
  addTags,
  getTicketStats,
};
