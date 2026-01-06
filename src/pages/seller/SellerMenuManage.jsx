import { useState } from "react";

import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const DAYS = [
  "MONDAY","TUESDAY","WEDNESDAY",
  "THURSDAY","FRIDAY","SATURDAY","SUNDAY"
];

export default function SellerMenuManage() {
  const navigate = useNavigate(); // 🔥 added
  const [day, setDay] = useState(DAYS[0]);
  const [items, setItems] = useState([
    { name: "", description: "", price: "" }
  ]);
  const [message, setMessage] = useState("");

  const handleChange = (i, e) => {
    const updated = [...items];
    updated[i][e.target.name] = e.target.value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { name: "", description: "", price: "" }]);
  };

  const submitMenu = async () => {
    try {
      await api.put("/seller/menu/", { day, items });
      setMessage("Menu saved successfully");
    } catch {
      setMessage("Failed to save menu");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate("/seller/dashboard")}
        className="text-blue-600 mb-4 hover:underline"
      >
        ← Back to Dashboard
      </button>
      
      <h2 className="text-xl font-bold mb-4">📝 Manage Menu</h2>

      <select
        value={day}
        onChange={(e) => setDay(e.target.value)}
        className="border p-2 mb-4 w-full"
      >
        {DAYS.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {items.map((item, i) => (
        <div key={i} className="border p-3 mb-3 rounded">
          <input
            placeholder="Item name"
            name="name"
            value={item.name}
            onChange={(e) => handleChange(i, e)}
            className="w-full border p-2 mb-2"
          />
          <textarea
            placeholder="Description"
            name="description"
            value={item.description}
            onChange={(e) => handleChange(i, e)}
            className="w-full border p-2 mb-2"
          />
          <input
            placeholder="Price"
            name="price"
            value={item.price}
            onChange={(e) => handleChange(i, e)}
            className="w-full border p-2"
          />
        </div>
      ))}

      <button onClick={addItem} className="mr-3">
        + Add Item
      </button>

      <button
        onClick={submitMenu}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Save Menu
      </button>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
