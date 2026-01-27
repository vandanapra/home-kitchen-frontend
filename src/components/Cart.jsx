import React from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function Cart({
  cart,
  sellerId,
  day,                 // 🔥 NEW PROP
  updateQty,
  removeFromCart,
}) {
  const total = cart.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );

  const placeOrder = async () => {
    if (!day) {
      alert("Please select a day");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      await api.post("/orders/place/", {
        seller_id: sellerId,
        day: day,                     // 🔥 VERY IMPORTANT
        items: cart.map((i) => ({
          menu_item_id: i.menu_item_id,
          quantity: i.quantity,
        })),
      });
      toast.success("Order placed successfully 🎉");
      // setTimeout(() => navigate("/customer/dashboard"), 100);
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
      
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-3">
        🛒 Your Cart
      </h3>

      {/* EMPTY CART */}
      {cart.length === 0 && (
        <p className="text-gray-500">
          Cart is empty
        </p>
      )}

      {/* CART ITEMS */}
      {cart.map((item) => (
        <div
          key={item.menu_item_id}
          className="flex justify-between items-center mb-3"
        >
          <div>
            <p className="font-semibold">
              {item.name}
            </p>
            <p className="text-sm">
              ₹{item.price}
            </p>
          </div>

          {/* QTY CONTROLS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateQty(
                  item.menu_item_id,
                  item.quantity - 1
                )
              }
              className="border px-2"
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
              className="border px-2"
            >
              +
            </button>

            <button
              onClick={() =>
                removeFromCart(item.menu_item_id)
              }
              className="text-red-600 ml-2"
              title="Remove item"
            >
              ❌
            </button>
          </div>
        </div>
      ))}

      {/* TOTAL + PLACE ORDER */}
      {cart.length > 0 && (
        <>
          <hr className="my-3" />

          <p className="font-bold mb-2">
            Total: ₹{total}
          </p>

          <p className="text-sm text-gray-600 mb-2">
            📅 For: <strong>{day}</strong>
          </p>

          <button
            onClick={placeOrder}
            className="w-full bg-green-600 text-white py-2 rounded mt-2"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}
