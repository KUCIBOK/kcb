const express = require("express");
const router = express.Router();
const crmController = require("../controllers/crm.controller");
const { verifyToken } = require("../middleware/auth");

// ✅ Clients CRUD
router.post("/clients", crmController.createClient);
router.get("/clients", crmController.getClients);
router.get("/clients/:id", crmController.getClientById);
router.put("/clients/:id", crmController.updateClient);
router.delete("/clients/:id", crmController.deleteClient);

// ✅ Notes
router.post("/clients/:id/notes", crmController.addNote);
router.delete("/clients/:id/notes/:noteId", crmController.deleteNote);

// ✅ Interactions
router.post("/clients/:id/interactions", crmController.addInteraction);
router.delete(
  "/clients/:id/interactions/:interactionId",
  crmController.deleteInteraction
);

// ✅ Statistiques et exports
router.get("/stats", crmController.getCrmStats);
router.post("/sync-from-transactions", crmController.syncClientsFromTransactions);
router.get("/export/csv", crmController.exportClientsCSV);

module.exports = router;
