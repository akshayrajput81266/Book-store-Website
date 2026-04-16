import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";
import axios from "axios";

function OrderModal({ item, onClose }) {
  const [authUser] = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: authUser?.fullname || "",
    address: "",
    phone: "",
    payment: "COD",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const orderInfo = {
        userId: authUser._id,
        bookId: item._id,
        bookName: item.name,
        price: item.price,
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        payment: formData.payment,
        status: "Pending", // ✅ Capital P
      };
      const res = await axios.post(
        "http://localhost:4001/api/orders", // ✅ URL fix
        orderInfo
      );
      if (res.data) {
        toast.success("Order placed successfully!");
        onClose();
      }
    } catch (error) {
      toast.error("Order failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="order_modal" className="modal modal-open">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >✕</button>

        <h3 className="font-bold text-lg mb-4">Order Details</h3>

        <div className="flex items-center gap-3 mb-4 p-3 bg-base-200 rounded-lg dark:bg-slate-700">
          <img src={item.image} className="w-16 h-16 object-cover rounded" />
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-pink-500 font-bold">
              {item.price === 0 ? "Free" : `$${item.price}`}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="input input-bordered w-full dark:bg-slate-900"
              required
            />
          </div>

          <div>
            <label className="label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="input input-bordered w-full dark:bg-slate-900"
              required
              pattern="[0-9]{10}"
            />
          </div>

          <div>
            <label className="label">Delivery Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your home Address"
              className="textarea textarea-bordered w-full dark:bg-slate-900"
              required
              rows={3}
            />
          </div>

          <div>
            <label className="label">Payment Method</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={formData.payment === "COD"}
                  onChange={handleChange}
                  className="radio radio-primary"
                />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="Online"
                  checked={formData.payment === "Online"}
                  onChange={handleChange}
                  className="radio radio-primary"
                />
                Online Payment
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn bg-pink-500 text-white hover:bg-pink-700 w-full mt-2"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
}

export default OrderModal;