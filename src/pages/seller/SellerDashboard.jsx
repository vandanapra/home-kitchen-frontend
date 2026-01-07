import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const DAYS = [
  "MONDAY","TUESDAY","WEDNESDAY",
  "THURSDAY","FRIDAY","SATURDAY","SUNDAY"
];

export default function SellerDashboard() {
  const navigate = useNavigate();

  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  const [selectedDay, setSelectedDay] = useState(today);
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  /* ================= FETCH MENU ================= */
  const fetchMenu = async (day) => {
    try {
      const res = await api.get(`/seller/menu/?day=${day}`);

      if (res.data && res.data.items) {
        setItems(res.data.items);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    fetchMenu(selectedDay);
  }, [selectedDay]);

  /* ================= EDIT ================= */
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

  /* ================= DELETE ================= */
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await api.delete(`/seller/menu/item/${id}/`);
      fetchMenu(selectedDay);
    } catch {
      setMessage("Failed to delete item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= TOP HEADER ================= */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-xl font-bold">
            🍛 Seller Dashboard
          </h1>

          {/* 🔥 RESTORED ACTION BUTTONS */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit Profile →
            </button>

            <button
              onClick={() => navigate("/seller-profile")}
              className="text-sm text-green-600 hover:underline"
            >
              My Kitchen
            </button>

            <button
              onClick={() => navigate("/seller/menu/manage")}
              className="bg-black text-white px-3 py-2 rounded"
            >
              Manage Menu
            </button>
            <button
              onClick={() => navigate("/seller/orders")}
              className="text-blue-600 hover:underline"
            >
              View Orders →
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>

        </div>
      </header>

      {/* ================= DASHBOARD ================= */}
      <div className="p-6">
        <div className="bg-white p-6 rounded-xl shadow max-w-4xl mx-auto">

          {/* DAY SELECT */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              🍱 Menu for {selectedDay}
            </h2>

            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="border p-2 rounded"
            >
              {DAYS.map(day => (
                <option key={day} value={day}>
                  {day}
                </option>
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
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
                <p className="font-bold">₹{item.price}</p>
              </div>

              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-600 text-xl"
                title="Delete item"
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
            <p className="mt-3 text-green-600">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
