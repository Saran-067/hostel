import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  studentId: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },

  // Optional room assignment
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" }, // optional

  // Password
  password: { type: String, required: true },

  // Financial info
  financial: {
    establishment: { type: Number, default: 60000 },
    deposit: { type: Number, default: 0 },
    balance: { type: Number, default: 60000 },
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
