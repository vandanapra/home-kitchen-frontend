import { useState } from "react";
import api from "../../api/axios";

export default function SellerMenuManage() {
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
      await api.put("/seller/menu/", { items });
      setMessage("Menu saved successfully");
    } catch {
      setMessage("Failed to save menu");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">📝 Manage Today’s Menu</h2>

      {message && <p className="mb-3">{message}</p>}

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

      <button onClick={addItem} className="mr-2">
        + Add Item
      </button>

      <button onClick={submitMenu} className="bg-black text-white px-4 py-2 rounded">
        Save Menu
      </button>
    </div>
  );
}
