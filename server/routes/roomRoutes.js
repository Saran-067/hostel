const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createRoom, allocateRoom, getMyRoom } = require("../controllers/roomController");

router.post("/create", authMiddleware, createRoom); // Optionally wrap with admin check
router.post("/allocate", authMiddleware, allocateRoom);
router.get("/my", authMiddleware, getMyRoom);

module.exports = router;
