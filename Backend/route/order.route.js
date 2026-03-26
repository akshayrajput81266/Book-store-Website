import express from "express";
import Order from "../model/order.model.js";

const router = express.Router();

// Order place karo
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "Order placed!", order });
  } catch (error) {
    res.status(500).json({ message: "Error placing order" });
  }
});

// User ke orders dekho
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

export default router;