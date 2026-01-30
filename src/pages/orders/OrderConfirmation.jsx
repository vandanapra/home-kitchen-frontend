import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/orders/${orderId}/`);
      setOrder(res.data);
    } catch {
      navigate("/customer/dashboard");
    }
  };


    const downloadInvoice = async (orderId) => {
  try {
    const res = await api.get(
      `/orders/invoice/${orderId}/`,
      {
        responseType: "blob", // 🔥 IMPORTANT
      }
    );
    const blob = new Blob([res.data], {
      type: "application/pdf",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice_${orderId}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error(err);
    toast.error("Failed to download invoice");
  }
};


  if (!order) {
    return <p className="p-6">Loading order details...</p>;
  }

  return (
    <div 
    className="min-h-screen bg-cover flex justify-center bg-center items-center"
    style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1606787366850-de6330128bfc')",
      }}
    >
      <div className="bg-white/85 rounded-xl shadow p-6 max-w-xl w-full">

        <h2 className="text-2xl font-bold text-green-600 mb-3">
          ✅ Order Confirmed
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Order ID: <strong>#{order.id}</strong>
        </p>

        <div className="space-y-2 text-sm">
          <p>🍛 Kitchen: <strong>{order.seller_name}</strong></p>
          <p>📅 {order.day} | {order.order_date}</p>
          <p>💳 Payment: {order.payment_method}</p>
          <p>💰 Paid: ₹{order.paid_amount}</p>
        </div>

        <hr className="my-4" />

        <h4 className="font-semibold mb-2">📦 Items</h4>
        {order.items.map((i) => (
          <p key={i.id} className="text-sm">
            {i.item_name} × {i.quantity}
          </p>
        ))}

        <p className="font-bold mt-3">
          Total: ₹{order.total_amount}
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate("/my-orders")}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
          >
            My Orders
          </button>

          {/* <button
            onClick={() => downloadInvoice(order.id)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            📄 Download Invoice
          </button> */}

          <button
            onClick={() => navigate("/customer/dashboard")}
            className="flex-1 border py-2 rounded"
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}
