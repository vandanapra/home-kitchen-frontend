import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Cart from "../../components/Cart";
import { useCart } from "../../context/CartContext";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function CustomerMenu() {
  const { sellerId } = useParams();

  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  const [selectedDay, setSelectedDay] = useState(today);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [kitchenName, setKitchenName] = useState("");

  const {
    cart,
    cartDay,
    addToCart,
    updateQty,
    removeFromCart,
  } = useCart();

  /* ================= FETCH MENU ================= */
  useEffect(() => {
    if (!sellerId) return;
    fetchMenu(selectedDay);
  }, [sellerId, selectedDay]);

  const fetchMenu = async (day) => {
    try {
      const res = await api.get(
        `/seller/customer/menu/${sellerId}/?day=${day}`
      );

      if (res.data.items?.length > 0) {
        setItems(res.data.items);
        setMessage("");
      } else {
        setItems([]);
        setMessage("No menu available for today");
      }
    } catch {
      setItems([]);
      setMessage("Failed to load menu");
    }
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = (item) => {
    addToCart(
      {
        menu_item_id: item.id,
        name: item.name,
        price: item.price,
      },
      selectedDay,
      sellerId
    );
  };

  /* ================= ITEM QTY ================= */
  const getItemQty = (itemId) => {
    const found = cart.find(
      (i) => i.menu_item_id === itemId
    );
    return found ? found.quantity : 0;
  };

  /* ================= FETCH SELLER ================= */
  useEffect(() => {
    if (!sellerId) return;

    const fetchSellerDetails = async () => {
      try {
        const res = await api.get(
          `/seller/customer/menu/${sellerId}/`
        );
        setKitchenName(res.data.kitchen_name);
      } catch {
        console.error("Failed to load seller details");
      }
    };

    fetchSellerDetails();
  }, [sellerId]);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1606787366850-de6330128bfc')",
      }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ================= MENU ================= */}
        <div className="md:col-span-2 bg-white/85 p-6 mt-20 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              🍽 {kitchenName || "Kitchen"} Menu
            </h2>

            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="border p-2 rounded"
            >
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* 🔒 SHOW LOCKED DAY */}
          {cartDay && (
            <p className="text-xs text-gray-500 mb-3">
              🧾 Cart locked for: <strong>{cartDay}</strong>
            </p>
          )}

          {message && (
            <p className="text-gray-500">{message}</p>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 mb-3 rounded flex justify-between items-center"
            >
              {item.image_url && (
                <img
                  src={`http://13.233.98.184${item.image_url}`}
                  alt={item.name}
                  className="w-20 h-20 rounded object-cover border"
                />
              )}

              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
                <p className="font-bold">₹{item.price}</p>
              </div>

              {getItemQty(item.id) === 0 ? (
                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-black text-white px-4 py-1 rounded"
                >
                  Add +
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQty(
                        item.id,
                        getItemQty(item.id) - 1
                      )
                    }
                    className="bg-gray-200 px-3 py-1 rounded text-lg"
                  >
                    −
                  </button>

                  <span className="font-semibold">
                    {getItemQty(item.id)}
                  </span>

                  <button
                    onClick={() =>
                      updateQty(
                        item.id,
                        getItemQty(item.id) + 1
                      )
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded text-lg"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ================= CART ================= */}
        <Cart
          cart={cart}
          sellerId={sellerId}
          day={selectedDay}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
        />
      </div>
    </div>
  );
}
