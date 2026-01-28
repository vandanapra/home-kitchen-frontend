import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import AddressModal from "./AddressModal";
import { useNavigate } from "react-router-dom";

/* ================= LOAD RAZORPAY ================= */
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Cart({
  cart,
  sellerId,
  day,
  updateQty,
  removeFromCart,
}) {
  const navigate = useNavigate();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [partialAmount, setPartialAmount] = useState("");

  const total = cart.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );

  /* ================= PLACE ORDER (UNCHANGED NAME) ================= */
  const placeOrder = async (address) => {
    if (!day) {
      toast.error("Please select a day");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (!address) {
      toast.error("Please select delivery address");
      return;
    }

    if (paymentMethod === "PARTIAL") {
      if (!partialAmount || Number(partialAmount) <= 0) {
        toast.error("Enter valid partial amount");
        return;
      }
      if (Number(partialAmount) >= total) {
        toast.error("Partial amount must be less than total");
        return;
      }
    }

    // 🔥 COD FLOW (NO CHANGE)
    if (paymentMethod === "COD") {
      setPlacing(true);
      try {
        await api.post("/orders/place/", {
          seller_id: sellerId,
          day,
          payment_method: "COD",
          paid_amount: 0,
          address_id: address.id,
          items: cart.map((i) => ({
            menu_item_id: i.menu_item_id,
            quantity: i.quantity,
          })),
        });

        toast.success("Order placed successfully 🎉");
        setTimeout(() => navigate("/customer/dashboard"), 500);
      } catch (err) {
        toast.error(err.response?.data?.message || "Order failed");
      } finally {
        setPlacing(false);
      }
      return;
    }

    /* ================= RAZORPAY FLOW ================= */
    const amountToPay =
      paymentMethod === "PARTIAL"
        ? Number(partialAmount)
        : total;

    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    try {
      const orderRes = await api.post("/orders/razorpay/create/", {
        amount: amountToPay,
      });

      const options = {
        key: orderRes.data.key,
        amount: amountToPay * 100,
        currency: "INR",
        name: "Home Kitchen",
        description: "Food Order",
        order_id: orderRes.data.razorpay_order_id,

        handler: async (response) => {
          try {
            await api.post("/orders/place/", {
              seller_id: sellerId,
              day,
              payment_method: paymentMethod,
              paid_amount: amountToPay,
              address_id: address.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: cart.map((i) => ({
                menu_item_id: i.menu_item_id,
                quantity: i.quantity,
              })),
            });

            toast.success("Payment successful 🎉");
            setTimeout(
              () => navigate("/customer/dashboard"),
              500
            );
          } catch {
            toast.error("Order creation failed after payment");
          }
        },

        theme: {
          color: "#16a34a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Payment initiation failed");
    }
  };

  /* ================= ADDRESS FLOW (UNCHANGED NAME) ================= */
  const handlePlaceClick = () => {
    setShowAddressModal(true);
  };

  return (
    <div className="bg-white/85 p-5 rounded-xl mt-20 shadow sticky top-6">
      <h3 className="text-lg font-bold mb-3">
        🛒 Your Cart
      </h3>

      {cart.length === 0 && (
        <p className="text-gray-500">Cart is empty</p>
      )}

      {cart.map((item) => (
        <div
          key={item.menu_item_id}
          className="flex justify-between items-center mb-3"
        >
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-600">
              ₹{item.price}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateQty(
                  item.menu_item_id,
                  item.quantity - 1
                )
              }
              className="border px-2 rounded"
            >
              −
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() =>
                updateQty(
                  item.menu_item_id,
                  item.quantity + 1
                )
              }
              className="border px-2 rounded"
            >
              +
            </button>

            <button
              onClick={() =>
                removeFromCart(item.menu_item_id)
              }
              className="text-red-600 ml-2"
            >
              ❌
            </button>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <hr className="my-3" />

          <p className="font-bold mb-2">
            Total: ₹{total}
          </p>

          <p className="text-sm text-gray-600 mb-2">
            📅 For: <strong>{day}</strong>
          </p>

          {/* PAYMENT METHOD */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
              className="w-full border p-2 rounded"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="ONLINE">Online Payment</option>
              <option value="PARTIAL">Partial Payment</option>
            </select>

            {paymentMethod === "PARTIAL" && (
              <input
                type="number"
                placeholder="Enter amount to pay now"
                value={partialAmount}
                onChange={(e) =>
                  setPartialAmount(e.target.value)
                }
                className="w-full border p-2 rounded mt-2"
              />
            )}
          </div>

          <button
            onClick={handlePlaceClick}
            disabled={placing}
            className="w-full bg-green-600 text-white py-2 rounded mt-2 hover:bg-green-700 disabled:bg-gray-400"
          >
            {placing ? "Placing order..." : "Place Order"}
          </button>
        </>
      )}

      {showAddressModal && (
        <AddressModal
          onClose={() => setShowAddressModal(false)}
          onConfirm={(addr) => {
            setSelectedAddress(addr);
            setShowAddressModal(false);
            placeOrder(addr);
          }}
        />
      )}
    </div>
  );
}
