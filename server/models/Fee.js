const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["hostel", "mess", "other"], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["paid", "pending"], default: "pending" },
  dueDate: { type: Date, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Fee", feeSchema);
