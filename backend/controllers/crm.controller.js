const CrmClient = require("../models/CrmClient");
const Transaction = require("../models/Transaction");
const Artwork = require("../models/Artwork");
const { createError } = require("../middleware/errorHandler");

// ✅ Créer un nouveau client
exports.createClient = async (req, res, next) => {
  try {
    const { name, email, phone, country, city, segment } = req.body;
    const professionalId = req.user._id;

    // Vérifier si le client existe déjà
    const existingClient = await CrmClient.findOne({
      email,
      professionalId,
    });

    if (existingClient && !existingClient.isDeleted) {
      return next(createError.badRequest("Ce client existe déjà"));
    }

    const client = new CrmClient({
      name,
      email,
      phone,
      country,
      city,
      segment,
      professionalId,
    });

    await client.save();
    res.status(201).json(client);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Récupérer tous les clients
exports.getClients = async (req, res, next) => {
  try {
    const { status, segment, search, page = 1, limit = 10 } = req.query;
    const professionalId = req.user._id;

    const filter = { professionalId, isDeleted: false };

    if (status) filter.status = status;
    if (segment) filter.segment = segment;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const clients = await CrmClient.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("purchaseHistory.artworkId");

    const total = await CrmClient.countDocuments(filter);

    res.status(200).json({
      clients,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(createError.internal(error.message));
  }
};

// ✅ Récupérer un client par ID
exports.getClientById = async (req, res, next) => {
  try {
    const client = await CrmClient.findById(req.params.id)
      .populate("purchaseHistory.artworkId")
      .populate("notes.author", "name email")
      .populate("preferences.preferredArtists");

    if (!client) {
      return next(createError.notFound("Client non trouvé"));
    }

    // Vérifier la propriété
    if (client.professionalId.toString() !== req.user._id.toString()) {
      return next(createError.forbidden("Accès refusé"));
    }

    res.status(200).json(client);
  } catch (error) {
    next(createError.internal(error.message));
  }
};

// ✅ Mettre à jour un client
exports.updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const client = await CrmClient.findById(id);

    if (!client) {
      return next(createError.notFound("Client non trouvé"));
    }

    if (client.professionalId.toString() !== req.user._id.toString()) {
      return next(createError.forbidden("Accès refusé"));
    }

    // Mettre à jour les champs autorisés
    const allowedUpdates = [
      "name",
      "email",
      "phone",
      "country",
      "city",
      "address",
      "status",
      "segment",
      "interests",
      "tags",
      "preferences",
      "nextFollowUp",
    ];

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        client[field] = updates[field];
      }
    });

    client.updatedAt = new Date();
    await client.save();

    res.status(200).json(client);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Ajouter une note à un client
exports.addNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const client = await CrmClient.findById(id);

    if (!client) {
      return next(createError.notFound("Client non trouvé"));
    }

    if (client.professionalId.toString() !== req.user._id.toString()) {
      return next(createError.forbidden("Accès refusé"));
    }

    client.notes.push({
      content,
      author: req.user._id,
      createdAt: new Date(),
    });

    await client.save();
    res.status(200).json(client);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Ajouter une interaction
exports.addInteraction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, description, notes } = req.body;

    const client = await CrmClient.findById(id);

    if (!client) {
      return next(createError.notFound("Client non trouvé"));
    }

    if (client.professionalId.toString() !== req.user._id.toString()) {
      return next(createError.forbidden("Accès refusé"));
    }

    client.interactions.push({
      type,
      description,
      notes,
      date: new Date(),
    });

    client.lastInteraction = new Date();
    await client.save();

    res.status(200).json(client);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Supprimer une interaction
exports.deleteInteraction = async (req, res, next) => {
  try {
    const { id, interactionId } = req.params;

    const client = await CrmClient.findById(id);

    if (!client) {
      return next(createError.notFound("Client non trouvé"));
    }

    if (client.professionalId.toString() !== req.user._id.toString()) {
      return next(createError.forbidden("Accès refusé"));
    }

    client.interactions = client.interactions.filter(
      (interaction) => interaction._id.toString() !== interactionId
    );

    await client.save();
    res.status(200).json(client);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Supprimer une note
exports.deleteNote = async (req, res, next) => {
  try {
    const { id, noteId } = req.params;

    const client = await CrmClient.findById(id);

    if (!client) {
      return next(createError.notFound("Client non trouvé"));
    }

    if (client.professionalId.toString() !== req.user._id.toString()) {
      return next(createError.forbidden("Accès refusé"));
    }

    client.notes = client.notes.filter((note) => note._id.toString() !== noteId);

    await client.save();
    res.status(200).json(client);
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Supprimer un client (soft delete)
exports.deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await CrmClient.findById(id);

    if (!client) {
      return next(createError.notFound("Client non trouvé"));
    }

    if (client.professionalId.toString() !== req.user._id.toString()) {
      return next(createError.forbidden("Accès refusé"));
    }

    client.isDeleted = true;
    client.isActive = false;
    await client.save();

    res.status(200).json({ message: "Client supprimé" });
  } catch (error) {
    next(createError.badRequest(error.message));
  }
};

// ✅ Obtenir les statistiques CRM
exports.getCrmStats = async (req, res, next) => {
  try {
    const professionalId = req.user._id;

    const stats = {
      totalClients: await CrmClient.countDocuments({
        professionalId,
        isDeleted: false,
      }),

      clientsByStatus: await CrmClient.aggregate([
        { $match: { professionalId, isDeleted: false } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      clientsBySegment: await CrmClient.aggregate([
        { $match: { professionalId, isDeleted: false } },
        { $group: { _id: "$segment", count: { $sum: 1 } } },
      ]),

      topClients: await CrmClient.find({ professionalId, isDeleted: false })
        .sort({ totalSpent: -1 })
        .limit(5),

      totalRevenue: await CrmClient.aggregate([
        { $match: { professionalId, isDeleted: false } },
        { $group: { _id: null, total: { $sum: "$totalSpent" } } },
      ]),

      vipClients: await CrmClient.countDocuments({
        professionalId,
        status: "vip",
        isDeleted: false,
      }),
    };

    res.status(200).json(stats);
  } catch (error) {
    next(createError.internal(error.message));
  }
};

// ✅ Synchroniser les clients depuis les transactions
exports.syncClientsFromTransactions = async (req, res, next) => {
  try {
    const professionalId = req.user._id;

    // Récupérer toutes les transactions où cet utilisateur est vendeur
    const transactions = await Transaction.find({
      sellerId: professionalId,
      paymentStatus: "completed",
    })
      .populate("buyerId", "name email telephone country")
      .populate("artworkId", "title soldPrice");

    let syncedCount = 0;

    for (const transaction of transactions) {
      const buyer = transaction.buyerId;

      // Vérifier si le client existe
      let client = await CrmClient.findOne({
        email: buyer.email,
        professionalId,
      });

      if (!client) {
        // Créer un nouveau client
        client = new CrmClient({
          name: buyer.name,
          email: buyer.email,
          phone: buyer.telephone,
          country: buyer.country,
          professionalId,
          status: "client",
        });
        syncedCount++;
      }

      // Mettre à jour l'historique d'achat
      const purchaseExists = client.purchaseHistory.some(
        (purchase) => purchase.artworkId?.toString() === transaction.artworkId._id.toString()
      );

      if (!purchaseExists) {
        client.purchaseHistory.push({
          artworkId: transaction.artworkId._id,
          amount: transaction.amount,
          date: transaction.createdAt,
          title: transaction.artworkId.title,
        });

        client.totalPurchases += 1;
        client.totalSpent += transaction.amount;

        // Mettre à jour le statut
        if (client.totalPurchases >= 3) {
          client.status = "vip";
        } else if (client.totalPurchases > 0) {
          client.status = "client";
        }
      }

      await client.save();
    }

    res.status(200).json({
      message: "Synchronisation terminée",
      syncedCount,
    });
  } catch (error) {
    next(createError.internal(error.message));
  }
};

// ✅ Exporter les clients en CSV
exports.exportClientsCSV = async (req, res, next) => {
  try {
    const professionalId = req.user._id;

    const clients = await CrmClient.find({
      professionalId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    const csvHeader =
      "Nom,Email,Téléphone,Pays,Ville,Statut,Segment,Total Achats,Dépenses Totales,Dernier Contact\n";

    const csvRows = clients.map((client) => {
      return [
        client.name,
        client.email || "",
        client.phone || "",
        client.country || "",
        client.city || "",
        client.status,
        client.segment,
        client.totalPurchases,
        client.totalSpent,
        client.lastInteraction
          ? new Date(client.lastInteraction).toLocaleDateString()
          : "N/A",
      ].join(",");
    });

    const csv = csvHeader + csvRows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=clients.csv");
    res.send(csv);
  } catch (error) {
    next(createError.internal(error.message));
  }
};

