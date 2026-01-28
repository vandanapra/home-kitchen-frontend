import React from "react";

import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function SellerMenu() {
  const [menu, setMenu] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/seller/menu/");
        if (res.data.items?.length) {
          setMenu(res.data);
        } else {
          setMessage("No menu added for today");
        }
      } catch {
        setMessage("Failed to load menu");
      }
    };
    fetchMenu();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">📋 Today’s Menu</h2>

      {message && <p>{message}</p>}

      {menu &&
        menu.items.map((item) => (
          <div key={item.id} className="border p-3 mb-2 rounded">
            <h3 className="font-semibold">{item.name}</h3>
            <p>{item.description}</p>
            <p className="font-bold">₹{item.price}</p>
          </div>
        ))}
    </div>
  );
}
