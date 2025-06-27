const express = require("express");
const router = express.Router();
const MemoriesController = require("../controllers/memoriesController");
const { authenticateUser } = require("../middleware/authMiddleware");

router
  .get("/", authenticateUser, MemoriesController.getMemories)
  .post("/", authenticateUser, MemoriesController.createMemory)
  .delete("/:id", authenticateUser, MemoriesController.deleteMemory)
  .put("/:id", authenticateUser, MemoriesController.updateMemory);

module.exports = router;
