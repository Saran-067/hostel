const Fee = require("../models/Fee");

// Admin: Create or update a student's fee
exports.createOrUpdateFee = async (req, res) => {
  const { studentId, type, amount, status, dueDate } = req.body;

  try {
    const fee = await Fee.findOneAndUpdate(
      { studentId, type },
      { amount, status, dueDate, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    res.json({ message: "Fee updated successfully", fee });
  } catch (err) {
    res.status(500).json({ error: "Failed to update fee" });
  }
};

// Admin: Get fees for a specific student
exports.getStudentFees = async (req, res) => {
  const { studentId } = req.params;

  try {
    const fees = await Fee.find({ studentId }).populate("studentId", "name email rollNo dept batch");
    res.json(fees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fees" });
  }
};

// Student: View their own fees
exports.getMyFees = async (req, res) => {
  try {
    const studentId = req.user._id;
    const fees = await Fee.find({ studentId });
    res.json(fees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch your fees" });
  }
};

// Student: Mark a fee as paid
exports.markFeeAsPaid = async (req, res) => {
  const { feeId } = req.body;

  try {
    const fee = await Fee.findOne({ _id: feeId, studentId: req.user.id });
    if (!fee) return res.status(404).json({ error: "Fee record not found" });

    fee.status = "paid";
    fee.updatedAt = Date.now();
    await fee.save();

    res.json({ message: "Fee marked as paid", fee });
  } catch (err) {
    res.status(500).json({ error: "Failed to update payment status" });
  }
};

// Admin: View all unpaid fees
exports.getAllPendingFees = async (req, res) => {
  try {
    const pendingFees = await Fee.find({ status: "pending" }).populate("studentId", "name rollNo email dept batch");
    res.json(pendingFees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unpaid fees" });
  }
};
