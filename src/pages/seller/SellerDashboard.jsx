import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

/* ================= CONSTANTS ================= */
const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function SellerDashboard() {
  const navigate = useNavigate();

  /* ================= AUDIO ================= */
  const audioRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3.wav");
    audioRef.current.volume = 1;
  }, []);

  const enableSound = () => {
    audioRef.current
      .play()
      .then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setSoundEnabled(true);
      })
      .catch(() => {});
  };

  /* ================= SELLER ================= */
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    api.get("/auth/profile/")
      .then(res => {
        setSellerId(res.data.seller_profile.id);
      })
      .catch(() => {});
  }, []);

  /* ================= MENU ================= */
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  const [selectedDay, setSelectedDay] = useState(today);
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  const fetchMenu = async (day) => {
    try {
      const res = await api.get(`/seller/menu/?day=${day}`);
      setItems(res.data?.items || []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    fetchMenu(selectedDay);
  }, [selectedDay]);

  const handleChange = (i, e) => {
    const updated = [...items];
    updated[i][e.target.name] = e.target.value;
    setItems(updated);
  };

  const saveMenu = async () => {
    try {
      await api.put("/seller/menu/", {
        day: selectedDay,
        items,
      });
      setEditMode(false);
      setMessage("Menu updated successfully");
      fetchMenu(selectedDay);
    } catch {
      setMessage("Failed to save menu");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await api.delete(`/seller/menu/item/${id}/`);
      fetchMenu(selectedDay);
    } catch {
      setMessage("Failed to delete item");
    }
  };

  /* ================= ORDERS (POLLING) ================= */
  const [orders, setOrders] = useState([]);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const lastOrderId = useRef(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/seller/");
      const data = res.data || [];

      if (data.length > 0) {
        if (
          lastOrderId.current &&
          data[0].id !== lastOrderId.current
        ) {
          setNewOrderCount(c => c + 1);

          if (soundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }

          alert(
            `🛎️ New Order!\nCustomer: ${data[0].customer_name}\n₹${data[0].total_amount}\n${data[0].day} (${data[0].order_date})`
          );
        }
        lastOrderId.current = data[0].id;
      }

      setOrders(data);
    } catch {}
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= HEADER ================= */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            🍛 Seller Dashboard
          </h1>

          <div className="flex items-center gap-4">
            {!soundEnabled && (
              <button
                onClick={enableSound}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Enable Sound 🔔
              </button>
            )}

            <button onClick={() => navigate("/profile")} className="text-blue-600">
              Edit Profile →
            </button>

            <button onClick={() => navigate("/seller-profile")} className="text-green-600">
              My Kitchen →
            </button>

            <button
              onClick={() => navigate("/seller/menu/manage")}
              className="bg-black text-white px-3 py-2 rounded"
            >
              Manage Menu
            </button>

            <button
              onClick={() => navigate("/seller/orders")}
              className="relative text-blue-600"
            >
              View Orders →
              {newOrderCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 rounded-full">
                  {newOrderCount}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ================= MENU ================= */}
      <div className="p-6">
        <div className="bg-white p-6 rounded-xl shadow max-w-4xl mx-auto">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              🍱 Menu for {selectedDay}
            </h2>

            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="border p-2 rounded"
            >
              {DAYS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {!editMode && items.length > 0 && (
            <button
              onClick={() => setEditMode(true)}
              className="mb-4 text-blue-600"
            >
              Edit Menu
            </button>
          )}

          {items.length === 0 && (
            <p className="text-gray-500">
              No menu for {selectedDay}
            </p>
          )}

          {/* VIEW MODE */}
          {!editMode && items.map(item => (
            <div
              key={item.id}
              className="border p-3 mb-3 rounded flex justify-between"
            >
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="font-bold">₹{item.price}</p>
              </div>

              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-600 text-xl"
              >
                ❌
              </button>
            </div>
          ))}

          {/* EDIT MODE */}
          {editMode && items.map((item, i) => (
            <div key={item.id || i} className="border p-3 mb-3 rounded">
              <input
                name="name"
                value={item.name}
                onChange={(e) => handleChange(i, e)}
                className="w-full border p-2 mb-2"
              />
              <textarea
                name="description"
                value={item.description}
                onChange={(e) => handleChange(i, e)}
                className="w-full border p-2 mb-2"
              />
              <input
                name="price"
                value={item.price}
                onChange={(e) => handleChange(i, e)}
                className="w-full border p-2"
              />
            </div>
          ))}

          {editMode && (
            <button
              onClick={saveMenu}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          )}

          {message && (
            <p className="mt-3 text-green-600">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
