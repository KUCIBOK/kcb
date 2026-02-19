const express = require("express");
const router = express.Router();
const entityController = require("../controllers/entity.controller");
const { auth } = require("../middleware/auth");

// ✅ Entity CRUD
router.post("/", auth, entityController.createEntity);
router.get("/", auth, entityController.getEntities);
router.get("/:id", auth, entityController.getEntityById);
router.put("/:id", auth, entityController.updateEntity);
router.delete("/:id", auth, entityController.deleteEntity);

// ✅ Switch entity context
router.post("/:id/switch", auth, entityController.switchEntity);

// ✅ Members management
router.post("/:id/members", auth, entityController.addMember);
router.put("/:id/members/:memberId", auth, entityController.updateMemberRole);
router.delete("/:id/members/:memberId", auth, entityController.removeMember);

module.exports = router;
