const express = require("express");
const router = express.Router();
const crmController = require("../controllers/crm.controller");
const { auth } = require("../middleware/auth");

// ✅ Clients CRUD
router.post("/clients", auth, crmController.createClient);
router.get("/clients", auth, crmController.getClients);
router.get("/clients/:id", auth, crmController.getClientById);
router.put("/clients/:id", auth, crmController.updateClient);
router.delete("/clients/:id", auth, crmController.deleteClient);

// ✅ Notes
router.post("/clients/:id/notes", auth, crmController.addNote);
router.delete("/clients/:id/notes/:noteId", auth, crmController.deleteNote);

// ✅ Interactions
router.post("/clients/:id/interactions", auth, crmController.addInteraction);
router.delete(
  "/clients/:id/interactions/:interactionId",
  auth,
  crmController.deleteInteraction
);

// ✅ Statistiques et exports
router.get("/stats", auth, crmController.getCrmStats);
router.post("/sync-from-transactions", auth, crmController.syncClientsFromTransactions);
router.get("/export/csv", auth, crmController.exportClientsCSV);

module.exports = router;
