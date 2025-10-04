import mongoose from "mongoose";

const dailyStockSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem", required: true },
      stockRemaining: { type: Number, default: 50 },
    },
  ],
});

export const DailyStock = mongoose.models.DailyStock || mongoose.model("DailyStock", dailyStockSchema);
