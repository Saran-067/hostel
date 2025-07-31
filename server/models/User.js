const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  rollNo: { type: String,  unique: true },
  password: String,
  role: { type: String, enum: ["admin", "student"], default: "student" },
  isVerified: { type: Boolean, default: false },

  // College Info
  dept: { type: String },                     // e.g., "CSE", "EEE"
  batch: { type: String },                    // e.g., "2022-2026"
  academicYear: { type: String, enum: ["1", "2", "3", "4"] },  // Current year

  // Contact Info
  address: String,
  phone: String,
  fatherName: String,
  fatherPhoneNo: String,
});

module.exports = mongoose.model("User", userSchema);
