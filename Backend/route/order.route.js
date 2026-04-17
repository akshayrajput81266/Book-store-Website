import express from "express";
import Order from "../model/order.model.js";

const router = express.Router();

// ─── Admin Routes PEHLE ────────────────────────────────────

router.get("/admin/all", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all orders" });
  }
});

router.patch("/admin/:id/status", async (req, res) => {3
  try {
    const { status } = req.body;
    if (!["Pending", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order nahi mila" });
    res.json({ message: "Status update ho gaya!", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
});

// ─── User Routes BAAD MEIN ─────────────────────────────────

router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "Order placed!", order });
  } catch (error) {
    res.status(500).json({ message: "Error placing order" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

export default router;