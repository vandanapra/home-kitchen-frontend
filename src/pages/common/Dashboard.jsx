import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();

  /* ================= AUTH ================= */
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  /* ================= MENU STATES ================= */
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [menu, setMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= FETCH MENU ================= */
  const fetchMenu = async () => {
    try {
      const res = await api.get(`/seller/menu/?date=${date}`);
      if (res.data?.items) {
        setMenu(res.data);
        setItems(res.data.items);
      } else {
        setMenu(null);
        setItems([]);
      }
    } catch {
      setMenu(null);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [date]);

  /* ================= EDIT HANDLERS ================= */
  const handleChange = (i, e) => {
    const updated = [...items];
    updated[i][e.target.name] = e.target.value;
    setItems(updated);
  };

  const saveMenu = async () => {
    try {
      await api.put("/seller/menu/", { date, items });
      setEditMode(false);
      fetchMenu();
    } catch {
      setMessage("Failed to update menu");
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`/seller/menu/item/${id}/`);
      fetchMenu();
    } catch {
      setMessage("Failed to delete item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= HEADER ================= */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">🍛 Home Kitchen</h1>

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
              Manage Today’s Menu
            </button>
            <button
              onClick={() => navigate("/orders")}
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

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        <h2 className="text-2xl font-semibold mb-6">
          Welcome 👋
        </h2>

        {/* ================= DATE PICKER ================= */}
        <div className="mb-4">
          <label className="text-sm font-medium mr-2">
            Select Date:
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {/* ================= TODAY MENU ================= */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              🍱 Menu for {date}
            </h3>

            {menu && !editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-blue-600 hover:underline"
              >
                Edit Menu
              </button>
            )}
          </div>

          {!menu && (
            <p className="text-gray-500">
              No menu added for this date.
            </p>
          )}

          {/* DISPLAY MODE */}
          {menu && !editMode &&
            items.map((item) => (
              <div
                key={item.id}
                className="border p-4 mb-3 rounded flex justify-between"
              >
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                  <p className="font-bold mt-1">₹{item.price}</p>
                </div>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-red-600 text-sm"
                >
                  ❌
                </button>
              </div>
            ))}

          {/* EDIT MODE */}
          {editMode &&
            items.map((item, i) => (
              <div
                key={i}
                className="border p-4 mb-3 rounded"
              >
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
            <p className="text-red-500 mt-3">{message}</p>
          )}
        </div>

        {/* ================= DASHBOARD CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="🥗 Vrat / Fasting Food" desc="Special meals for fasting days" />
          <DashboardCard title="📅 My Subscription" desc="Daily tiffin plans" />
          <DashboardCard title="🧾 My Orders" desc="Track previous orders" />
          <DashboardCard title="⭐ Ratings & Reviews" desc="Share your experience" />
          <DashboardCard title="💬 Support" desc="Need help?" />
        </div>
      </main>
    </div>
  );
}

/* ================= REUSABLE CARD ================= */
function DashboardCard({ title, desc }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition cursor-pointer">
      <h3 className="text-lg font-semibold mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {desc}
      </p>
    </div>
  );
}
