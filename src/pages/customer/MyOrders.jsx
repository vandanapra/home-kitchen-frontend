// pages/customer/MyOrders.jsx

import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/customer/").then((res) => {
      setOrders(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>

      {orders.map((o) => (
        <div key={o.id} className="border p-4 mb-3">
          <p>Kitchen: {o.seller_name}</p>
          <p>Status: {o.status}</p>
          <p>Total: ₹{o.total_amount}</p>

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
