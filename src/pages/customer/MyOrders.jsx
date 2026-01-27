// pages/customer/MyOrders.jsx
import React from "react";

import { useEffect, useState } from "react";
import api from "../../api/axios";
import OrderProgressBar from "../../components/OrderProgressBar";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
  let intervalId;

  const fetchOrders = () => {
    api
      .get(`/orders/customer/?date=${date}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          setOrders([]);
        }
      })
      .catch(() => {
        // ❗ NEVER break UI
        setOrders([]);
      });
  };

  // 🔹 first load
  fetchOrders();

  // 🔁 auto refresh every 5 sec
  intervalId = setInterval(fetchOrders, 5000);

  return () => clearInterval(intervalId);
}, [date]);


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📦 My Orders</h2>

      {/* Date filter */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 mb-6"
      />

      {orders.length === 0 && (
        <p className="text-gray-500">
          No orders for selected date
        </p>
      )}

      {orders.map((o) => (
        <div
          key={o.id}
          className="border rounded-lg p-4 mb-6 bg-white shadow-sm"
        >
          {/* Kitchen */}
          <p className="font-semibold text-lg mb-1">
            🍛 Kitchen: {o.seller_name}
          </p>

          {/* Date */}
          <p className="text-sm text-gray-600 mb-2">
            📅 {o.day} | {o.order_date}
          </p>

          {/* Items */}
          <div className="mb-2">
            {o.items.map((i) => (
              <p key={i.id} className="text-sm">
                {i.item_name} × {i.quantity}
              </p>
            ))}
          </div>

          {/* Total */}
          <p className="font-bold mb-4">
            Total: ₹{o.total_amount}
          </p>

          {/* ✅ Progress bar ALWAYS BELOW */}
          <OrderProgressBar status={o.status} />
        </div>
      ))}
    </div>
  );
}
