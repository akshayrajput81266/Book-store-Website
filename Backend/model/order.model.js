import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,
  bookId: String,
  bookName: String,
  price: Number,
  name: String,      // ✅ Add karo
  address: String,   // ✅ Add karo
  phone: String,     // ✅ Add karo
  payment: String,   // ✅ Add karo
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);