const express = require("express");
const router = express.Router();
const MemoriesController = require("../controllers/memoriesController");
const { authenticateUser } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router
  .get("/", authenticateUser, MemoriesController.getMemories)
  .post(
    "/",
    authenticateUser,
    upload.single("image"),
    MemoriesController.createMemory
  )
  .delete("/:id", authenticateUser, MemoriesController.deleteMemory);

module.exports = router;
