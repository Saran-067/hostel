const express = require("express");
const router = express.Router();
const {
  createOrUpdateFee,
  getStudentFees,
  getMyFees,
  markFeeAsPaid,
  getAllPendingFees
} = require("../controllers/feeController");

const auth = require("../middleware/authMiddleware");

// Admin routes
router.get("/my", auth, getMyFees);                     // Student
router.post("/update", auth, createOrUpdateFee);        // Admin
router.get("/pending", auth, getAllPendingFees);        // Admin
router.get("/:studentId", auth, getStudentFees);        // Admin

// Student routes
router.put("/pay", auth, markFeeAsPaid);                // Student

module.exports = router;
