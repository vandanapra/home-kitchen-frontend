import React from "react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function SellerOrders() {
  const navigate = useNavigate(); // 🔥 added
  const [orders, setOrders] = useState([]);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [date]);

  const fetchOrders = async () => {
    try {
      // const res = await api.get("/orders/seller/");
      const res = await api.get(`/orders/seller/?date=${date}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
  const handleAction = async (orderId, action) => {
    try {
      await api.post(`/orders/orders/${orderId}/action/`, {
        action,
      });
      fetchOrders(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const markDelivered = async (orderId) => {
  try {
    await api.post(`/orders/orders/${orderId}/deliver/`);
    fetchOrders();
  } catch (err) {
    alert(
      err.response?.data?.message ||
      "Failed to mark delivered"
    );
  }
};


  if (loading) {
    return <p className="p-6">Loading orders...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate("/seller/dashboard")}
        className="text-blue-600 mb-4 hover:underline"
      >
        ← Back to Dashboard
      </button>
      <h2 className="text-2xl font-bold mb-6">
        📦 Orders Received
      </h2>

      {/* 🔽 DATE FILTER */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 mb-4"
      />

      {orders.length === 0 && (
        <p>No orders for selected date</p>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white p-5 mb-4 rounded shadow"
        >
          <p className="font-semibold">
            Customer: {order.customer_name}
          </p>
          <p>
            🗓 Day: <strong>{order.day}</strong>
          </p>

          <p>
            📅 Date:{" "}
            <strong>
              {new Date(order.order_date).toLocaleDateString()}
            </strong>
          </p>

          
          <p>Total: ₹{order.total_amount}</p>

          <div className="mt-2">
            <p className="font-semibold">Items:</p>
            {order.items.map((i, idx) => (
              <p key={idx}>
                {i.item_name} × {i.quantity}
              </p>
            ))}
          </div>

          {/* 🔥 ACTION BUTTONS */}
          {order.status === "PENDING" && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={() =>
                  handleAction(order.id, "ACCEPT")
                }
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                Accept
              </button>

              <button
                onClick={() =>
                  handleAction(order.id, "REJECT")
                }
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}

          {/* 🔥 MARK DELIVERED */}
          {order.status === "ACCEPTED" && (
            <button
              onClick={() => markDelivered(order.id)}
              className="mt-4 bg-blue-600 text-white px-4 py-1 rounded"
            >
              Mark as Delivered
            </button>
          )}

          {/* FINAL STATE */}
          {order.status === "DELIVERED" && (
            <p className="mt-3 text-green-600 font-semibold">
              ✅ Delivered
            </p>
          )}

          {/* FINAL STATE */}
          {order.status !== "PENDING" && (
            <p className="mt-3 text-gray-600">
              Order {order.status.toLowerCase()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
