import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminOrders from "./AdminOrders";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  const [activeTab, setActiveTab] = useState("orders");

  if (!token) return <AdminLogin />;

  return (
    <div>
      {/* Top Navigation */}
      <div style={{
        background: "#111827",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16
      }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>
           Bookstore Admin
        </span>
        <button
          onClick={() => setActiveTab("orders")}
          style={{
            background: activeTab === "orders" ? "#6366F1" : "transparent",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600
          }}
        >
           Orders
        </button>
        <button
          onClick={() => setActiveTab("login")}
          style={{
            background: activeTab === "login" ? "#6366F1" : "transparent",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600
          }}
        >
           Login
        </button>
        {/* Logout */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          style={{
            marginLeft: "auto",
            background: "#EF4444",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Logout
        </button>
      </div>

      {/* Content */}
      {activeTab === "orders" ? <AdminOrders /> : <AdminLogin />}
    </div>
  );
}