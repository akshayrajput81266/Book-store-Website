import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";
import axios from "axios";

function Order({ item }) {
  const [authUser] = useAuth();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    payment: "COD",
  });

  const deliveryCharge = item.price > 0 ? 10 : 0;
  const totalAmount = item.price + deliveryCharge;

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showForm]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const orderInfo = {
        userId: authUser._id,
        bookId: item._id,
        bookName: item.name,
        price: item.price,
        deliveryCharge: deliveryCharge,
        totalAmount: totalAmount,
        ...formData,
      };
      const res = await axios.post("http://localhost:4001/api/orders", orderInfo);
      if (res.data) {
        toast.success("Order placed successfully! 🎉");
        setShowForm(false);
        setFormData({ name: "", address: "", phone: "", payment: "COD" });
      }
    } catch (error) {
      toast.error("Order failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          if (!authUser) {
            toast.error("login First!");
            document.getElementById("my_modal_3").showModal();
            return;
          }
          setShowForm(true);
        }}
        className="cursor-pointer px-2 py-1 rounded-full border-[2px] hover:bg-pink-500 hover:text-white duration-200"
      >
        Buy Now
      </button>

      {showForm &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              zIndex: 2147483647,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowForm(false)}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "24px",
                width: "400px",
                maxHeight: "90vh",
                overflowY: "auto",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
                  Order Details
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    fontSize: "22px",
                    cursor: "pointer",
                    color: "red",
                    background: "none",
                    border: "none",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Book Info */}
              <div
                style={{
                  backgroundColor: "#f3f4f6",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "16px",
                }}
              >
                <p style={{ fontWeight: "600", marginBottom: "4px" }}>
                  {item.name}
                </p>
                <p style={{ color: "#ec4899", fontWeight: "bold" }}>
                  {item.price === 0 ? "Free" : `₹${item.price}`}
                </p>

                {/* Delivery Charge & Total — sirf paid books ke liye */}
                {item.price > 0 && (
                  <div
                    style={{
                      borderTop: "1px dashed #d1d5db",
                      marginTop: "8px",
                      paddingTop: "8px",
                    }}
                  >
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "13px",
                        marginBottom: "4px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Book Price</span>
                      <span>₹{item.price}</span>
                    </p>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "13px",
                        marginBottom: "4px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span> Delivery Charge</span>
                      <span>₹{deliveryCharge}</span>
                    </p>
                    <p
                      style={{
                        fontWeight: "700",
                        fontSize: "15px",
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: "1px solid #d1d5db",
                        paddingTop: "6px",
                        marginTop: "4px",
                      }}
                    >
                      <span>Total</span>
                      <span style={{ color: "#ec4899" }}>₹{totalAmount}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleOrder}>
                {/* Name */}
                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      outline: "none",
                      boxSizing: "border-box",
                      fontSize: "14px",
                    }}
                  />
                </div>

                {/* Phone */}
                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your number"
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      outline: "none",
                      boxSizing: "border-box",
                      fontSize: "14px",
                    }}
                  />
                </div>

                {/* Address */}
                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter complete home Address"
                    required
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      outline: "none",
                      boxSizing: "border-box",
                      fontSize: "14px",
                      resize: "none",
                    }}
                  />
                </div>

                {item.price > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "4px",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Payment Method
                    </label>
                    <select
                      name="payment"
                      value={formData.payment}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        outline: "none",
                        boxSizing: "border-box",
                        fontSize: "14px",
                      }}
                    >
                      <option value="COD">Cash on Delivery</option>
                    </select>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    backgroundColor: loading ? "#f9a8d4" : "#ec4899",
                    color: "white",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  {loading
                    ? "Placing Order..."
                    : item.price === 0
                    ? "Get Free Book "
                    : `Place Order ₹${totalAmount} `}
                </button>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Order;