import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import roomRoutes from "./routes/room.js";
import foodRoutes from "./routes/food.js";
import orderRoutes from "./routes/order.js";
// import { FoodItem } from "./models/Fooditem.js";
dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // set exact domain in production
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes)
app.use("/api/room", roomRoutes)
app.use("/api/food", foodRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
