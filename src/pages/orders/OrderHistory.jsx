
  import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/history/");
      setOrders(res.data);
    } catch {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading orders...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-2xl font-bold mb-6">
          🧾 My Orders
        </h2>

        {orders.length === 0 && (
          <p className="text-gray-500">
            No orders found.
          </p>
        )}

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-5 rounded-xl shadow mb-5"
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">
                🍛 {order.seller_name}
              </h3>
              <span className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm mb-2">
              Status:
              <span className="font-semibold ml-1">
                {order.status}
              </span>
            </p>

            {/* ITEMS */}
            <div className="border-t pt-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm mb-1"
                >
                  <span>
                    {item.item_name} × {item.quantity}
                  </span>
                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-3" />

            <p className="font-bold text-right">
              Total: ₹{order.total_amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
