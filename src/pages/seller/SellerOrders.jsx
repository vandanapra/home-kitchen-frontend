// pages/seller/SellerOrders.jsx

import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/seller/").then((res) => {
      setOrders(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Customer Orders
      </h2>

      {orders.map((o) => (
        <div key={o.id} className="border p-4 mb-3">
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
