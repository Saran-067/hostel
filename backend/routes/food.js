import express from "express";
import { FoodItem } from "../models/Fooditem.js";
import { DailyStock } from "../models/DailyStock.js";
import Order from "../models/Order.js";
import QRCode from "qrcode";
import auth from "../middleware/auth.js";
const router = express.Router();

router.get("/daily-menu", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // check if stock for today exists
    let dailyStock = await DailyStock.findOne({ date: today }).populate("items.item");

    if (!dailyStock) {
      // fixed 4 items
      const items = await FoodItem.find(); // get exactly your 4 items

      dailyStock = new DailyStock({
        date: today,
        items: items.map((item) => ({ item: item._id, stockRemaining: item.dailyStock })),
      });

      await dailyStock.save();
      await dailyStock.populate("items.item");
    }

    res.json({
      success: true,
      items: dailyStock.items.map((i) => ({
        id: i.item._id,
        name: i.item.name,
        price: i.item.price,
        category: i.item.category,
        image: i.item.image,
        defaultMeal: i.item.defaultMeal,
        stockRemaining: i.stockRemaining,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await FoodItem.find({});
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});


router.post("/buy",auth, async (req, res) => {
  try {
    const { itemId, meal, date } = req.body;
    const userId = req.user.id; // Get userId from auth middleware
    const item = await FoodItem.findById(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (item.dailyStock <= 0) {
      return res.status(400).json({ error: "Item out of stock" });
    }

    // generate QR code as Data URL
    const qrCodeData = await QRCode.toDataURL(
      `user:${userId}|item:${itemId}|meal:${meal}|date:${date}`
    );

    const order = await Order.create({
      item: item._id,
      userId,
      meal,
      date,
      qrCode: qrCodeData,
    });

    // reduce stock
    item.dailyStock -= 1;
    await item.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

export default router;
