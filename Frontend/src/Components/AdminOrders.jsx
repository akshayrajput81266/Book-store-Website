import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE = "http://localhost:4001/api/orders";

const STATUS_CONFIG = {
  Pending:   { color: "#F59E0B", bg: "#FEF3C7", dot: "#D97706", label: "Pending" },
  Delivered: { color: "#10B981", bg: "#D1FAE5", dot: "#059669", label: "Delivered" },
};

export default function AdminOrders() {
  const [orders, setOrders]             = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId]     = useState(null);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await axios.get(`${API_BASE}/admin/all`);
      const data = Array.isArray(res.data) ? res.data : res.data.orders || [];
      setOrders(data);
      setFiltered(data);
    } catch (err) {
      setError(err.response?.data?.message || "Orders fetch karne mein error aaya.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    let result = [...orders];
    if (statusFilter !== "All") result = result.filter((o) => o.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o._id?.toLowerCase().includes(q) ||
          o.userId?.toLowerCase().includes(q) ||
          o.name?.toLowerCase().includes(q) ||
          o.phone?.toLowerCase().includes(q) ||
          o.bookName?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, statusFilter, orders]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.patch(`${API_BASE}/admin/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?._id === orderId)
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      showToast(`Status "${newStatus}" pe update ho gaya!`);
    } catch (err) {
      showToast(err.response?.data?.message || "Status update fail hua.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalOrders    = orders.length;
  const pendingCount   = orders.filter((o) => o.status === "Pending").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const formatPrice = (n) =>
    n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—";

  return (
    <div style={styles.page}>
      {toast && (
        <div style={{ ...styles.toast, background: toast.type === "error" ? "#EF4444" : "#10B981" }}>
          {toast.type === "error" ? "✕ " : "✓ "}{toast.msg}
        </div>
      )}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>Bookstore Admin Panel</p>
        </div>
        <button onClick={fetchOrders} style={styles.refreshBtn}>↻ Refresh</button>
      </div>

      <div style={styles.statsRow}>
        {[
          { label: "Total Orders", value: totalOrders,    color: "#6366F1" },
          { label: "Pending",      value: pendingCount,   color: "#F59E0B" },
          { label: "Delivered",    value: deliveredCount, color: "#10B981" },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={styles.filtersRow}>
        <input
          type="text"
          placeholder="🔍  Search by name, phone, book, order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.statusTabs}>
          {["All", "Pending", "Delivered"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                ...styles.tabBtn,
                background: statusFilter === s ? "#111827" : "#F3F4F6",
                color:      statusFilter === s ? "#fff"     : "#6B7280",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {loading ? (
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <p style={{ color: "#9CA3AF", marginTop: 12 }}>Orders load ho rahe hain...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={{ fontSize: 32 }}>📦</p>
          <p style={{ color: "#9CA3AF", marginTop: 8 }}>Koi order nahi mila</p>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                {["Order ID", "Customer", "Book", "Total", "Date", "Status", "Action"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                //  order.model.js ke exact fields use ho rahe hain
                const cfg          = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                const customerName = order.name || order.userId || "—";
                const customerPhone= order.phone || "—";
                const bookName     = order.bookName || "—";
                const total        = order.price;

                return (
                  <tr
                    key={order._id}
                    style={styles.tr}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                  >
                    <td style={styles.td}>
                      <span style={styles.orderId}>#{order._id?.slice(-8).toUpperCase()}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.customerName}>{customerName}</div>
                      <div style={styles.customerEmail}>{customerPhone}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.itemCount}>📚 {bookName}</span>
                    </td>
                    <td style={styles.td}><strong>{formatPrice(total)}</strong></td>
                    <td style={styles.td}>{formatDate(order.createdAt)}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: cfg.bg, color: cfg.color }}>
                        <span style={{ ...styles.dot, background: cfg.dot }} />
                        {cfg.label}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionBtns}>
                        <button onClick={() => setSelectedOrder(order)} style={styles.viewBtn}>View</button>
                        {order.status === "Pending" ? (
                          <button
                            onClick={() => updateStatus(order._id, "Delivered")}
                            disabled={updatingId === order._id}
                            style={styles.deliverBtn}
                          >
                            {updatingId === order._id ? "..." : "✓ Deliver"}
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(order._id, "Pending")}
                            disabled={updatingId === order._id}
                            style={styles.revertBtn}
                          >
                            {updatingId === order._id ? "..." : "↩ Revert"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <div style={styles.overlay} onClick={() => setSelectedOrder(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Order Details</h2>
                <p style={styles.modalId}>#{selectedOrder._id?.slice(-8).toUpperCase()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={styles.closeBtn}>✕</button>
            </div>
            <div style={styles.modalBody}>

              {/* Customer Info */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>👤 Customer Info</h3>
                <div style={styles.infoGrid}>
                  <InfoRow label="Name"    value={selectedOrder.name    || "—"} />
                  <InfoRow label="Phone"   value={selectedOrder.phone   || "—"} />
                  <InfoRow label="Address" value={selectedOrder.address || "—"} />
                  <InfoRow label="Payment" value={selectedOrder.payment || "—"} />
                </div>
              </div>

              {/* Book Info */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>📚 Book Info</h3>
                <div style={styles.itemRow}>
                  <div>
                    <p style={styles.itemName}>{selectedOrder.bookName || "—"}</p>
                    <p style={styles.itemQty}>Qty: 1</p>
                  </div>
                  <p style={styles.itemPrice}>{formatPrice(selectedOrder.price)}</p>
                </div>
              </div>

              {/* Summary */}
              <div style={styles.summaryBox}>
                <div style={styles.summaryRow}>
                  <span>Order Date</span>
                  <span>{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Payment Method</span>
                  <span>{selectedOrder.payment || "—"}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Status</span>
                  <span style={{ color: STATUS_CONFIG[selectedOrder.status]?.color || "#6B7280", fontWeight: 600 }}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div style={{ ...styles.summaryRow, borderTop: "2px solid #E5E7EB", paddingTop: 12, marginTop: 4 }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ fontWeight: 700, fontSize: 18 }}>
                    {formatPrice(selectedOrder.price)}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div style={styles.modalAction}>
                {selectedOrder.status === "Pending" ? (
                  <button
                    onClick={() => updateStatus(selectedOrder._id, "Delivered")}
                    disabled={updatingId === selectedOrder._id}
                    style={styles.modalDeliverBtn}
                  >
                    {updatingId === selectedOrder._id ? "Update ho raha hai..." : "✓ Mark as Delivered"}
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(selectedOrder._id, "Pending")}
                    disabled={updatingId === selectedOrder._id}
                    style={styles.modalRevertBtn}
                  >
                    {updatingId === selectedOrder._id ? "Update ho raha hai..." : "↩ Revert to Pending"}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <span style={{ fontSize: 12, color: "#9CA3AF", display: "block" }}>{label}</span>
      <span style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

const styles = {
  page:         { minHeight: "100vh", background: "#F9FAFB", padding: "32px 24px", fontFamily: "'Segoe UI', sans-serif", position: "relative" },
  toast:        { position: "fixed", top: 20, right: 20, color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14, zIndex: 9999, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" },
  header:       { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title:        { fontSize: 28, fontWeight: 700, color: "#111827", margin: 0 },
  subtitle:     { fontSize: 14, color: "#9CA3AF", margin: "4px 0 0" },
  refreshBtn:   { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 16px", fontSize: 14, cursor: "pointer", color: "#374151", fontWeight: 500 },
  statsRow:     { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  statCard:     { background: "#fff", borderRadius: 12, padding: "16px 24px", flex: 1, minWidth: 120, display: "flex", flexDirection: "column", gap: 4, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6" },
  statValue:    { fontSize: 28, fontWeight: 700 },
  statLabel:    { fontSize: 13, color: "#9CA3AF" },
  filtersRow:   { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" },
  searchInput:  { flex: 1, minWidth: 220, border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", background: "#fff", color: "#111827" },
  statusTabs:   { display: "flex", gap: 6 },
  tabBtn:       { padding: "8px 16px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  errorBox:     { background: "#FEF2F2", color: "#EF4444", padding: "12px 16px", borderRadius: 8, fontSize: 14, marginBottom: 16, border: "1px solid #FECACA" },
  loadingBox:   { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 },
  spinner:      { width: 36, height: 36, border: "3px solid #E5E7EB", borderTop: "3px solid #6366F1", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  emptyBox:     { textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, border: "1px solid #F3F4F6" },
  tableWrapper: { overflowX: "auto", background: "#fff", borderRadius: 12, border: "1px solid #F3F4F6", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" },
  table:        { width: "100%", borderCollapse: "collapse" },
  thead:        { background: "#F9FAFB" },
  th:           { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #F3F4F6" },
  tr:           { borderBottom: "1px solid #F9FAFB", transition: "background 0.15s" },
  td:           { padding: "14px 16px", fontSize: 14, color: "#374151", verticalAlign: "middle" },
  orderId:      { fontFamily: "monospace", fontSize: 13, color: "#6366F1", fontWeight: 600 },
  customerName: { fontWeight: 500, color: "#111827" },
  customerEmail:{ fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  itemCount:    { background: "#EEF2FF", color: "#6366F1", padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  badge:        { display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  dot:          { width: 7, height: 7, borderRadius: "50%", display: "inline-block" },
  actionBtns:   { display: "flex", gap: 6 },
  viewBtn:      { background: "#EEF2FF", color: "#6366F1", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  deliverBtn:   { background: "#D1FAE5", color: "#059669", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  revertBtn:    { background: "#FEF3C7", color: "#D97706", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  overlay:      { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  modal:        { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  modalHeader:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px 24px", borderBottom: "1px solid #F3F4F6" },
  modalTitle:   { fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 },
  modalId:      { fontSize: 13, color: "#6366F1", fontFamily: "monospace", margin: "4px 0 0", fontWeight: 600 },
  closeBtn:     { background: "#F3F4F6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14, color: "#6B7280" },
  modalBody:    { padding: "20px 24px" },
  section:      { marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" },
  infoGrid:     { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  itemsList:    { display: "flex", flexDirection: "column", gap: 8 },
  itemRow:      { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F9FAFB", padding: "10px 14px", borderRadius: 8, border: "1px solid #F3F4F6" },
  itemName:     { fontSize: 14, fontWeight: 500, color: "#111827", margin: 0 },
  itemQty:      { fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" },
  itemPrice:    { fontSize: 14, fontWeight: 600, color: "#374151", margin: 0 },
  summaryBox:   { background: "#F9FAFB", borderRadius: 10, padding: 16, marginTop: 8, marginBottom: 16 },
  summaryRow:   { display: "flex", justifyContent: "space-between", fontSize: 14, color: "#374151", marginBottom: 8 },
  modalAction:  { marginTop: 4 },
  modalDeliverBtn: { width: "100%", background: "#10B981", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  modalRevertBtn:  { width: "100%", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 600, cursor: "pointer" },
};