import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,
  bookId: String,
  bookName: String,
  price: Number,
  name: String,      
  address: String,   
  phone: String,     
  payment: String,   
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);