import express from "express";
import Order from "../models/Order.js";
import {FoodItem} from "../models/Fooditem.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET order history
router.get("/", auth,async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("item");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

export default router;
