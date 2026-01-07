// pages/customer/MyOrders.jsx

import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
  //   api.get("/orders/customer/").then((res) => {
  //     setOrders(res.data);
  //   });
  // }, []);
   api
      .get(`/orders/customer/?date=${date}`)
      .then((res) => setOrders(res.data));
  }, [date]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      {/* 🔽 DATE FILTER */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 mb-4"
      />
      {orders.length === 0 && (
        <p className="text-gray-500">
          No orders for selected date
        </p>
      )}

      {orders.map((o) => (
        <div key={o.id} className="border p-4 mb-3">
          <p className="font-semibold">
            🍛 Kitchen: {o.seller_name}
          </p>
          <p>Status: {o.status}</p>
          <p className="font-bold">
            Total: ₹{o.total_amount}
          </p>

          {o.items.map((i) => (
            <p key={i.id}>
              {i.item_name} × {i.quantity}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
