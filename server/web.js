// server.js or app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/AuthRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ Enable this when ready
const feeRoutes = require("./routes/feeRoutes");

const roomRoutes = require("./routes/roomRoutes");
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // set exact domain in production
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); // ✅ Uncommented
app.use("/api/fees", feeRoutes);
app.use("/api/rooms", roomRoutes);

// 404 Fallback
app.use((req, res, next) => {
  res.status(404).json({ error: "API route not found" });
});

// Global Error Handler (Optional but useful)
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

// MongoDB Connection & Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
