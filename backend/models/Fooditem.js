import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ["Vegetarian", "Non-Vegetarian"], required: true },
  image: { type: String, default: "/placeholder.svg" },
  defaultMeal: { type: String, enum: ["breakfast", "lunch", "dinner"], default: "lunch" },
  dailyStock: { type: Number, default: 50 }, // max stock per day
});

export const FoodItem = mongoose.models.FoodItem || mongoose.model("FoodItem", foodItemSchema);
