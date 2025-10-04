import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" },
  userId: String, // replace with auth later
  meal: String,
  date: String,
  qrCode: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
