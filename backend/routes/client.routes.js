const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller");
const upload = require("../middleware/multerExcelFiles");
const { auth } = require("../middleware/auth");
const { artist, admin } = require("../middleware/auth");

// router.post("/upload-test", upload, clientController.uploadClients);

router.post("/upload", auth, upload, clientController.uploadClients);
router.post("/add", auth, artist, clientController.addClient);
router.get("/", auth, admin, clientController.getAllClients);
router.get("/all", auth, clientController.getClientsByArtist);
router.put("/update/:id", auth, artist, clientController.updateClient);
router.delete("/delete/:id", auth, artist, clientController.deleteClient);
module.exports = router;
