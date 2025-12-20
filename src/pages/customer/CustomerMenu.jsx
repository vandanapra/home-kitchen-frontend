import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Cart from "../../components/Cart";

export default function CustomerMenu() {
  const { sellerId } = useParams();

  const [menu, setMenu] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const res = await api.get(`/seller/customer/menu/${sellerId}/`);
    setMenu(res.data);
  };

  /* ================= CART FUNCTIONS ================= */

  const addToCart = (item) => {
    const exists = cart.find((i) => i.menu_item_id === item.id);

    if (exists) {
      setCart(
        cart.map((i) =>
          i.menu_item_id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((i) => i.menu_item_id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty === 0) {
      removeFromCart(id);
    } else {
      setCart(
        cart.map((i) =>
          i.menu_item_id === id ? { ...i, quantity: qty } : i
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* MENU */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">🍽 Today’s Menu</h2>

          {menu?.items.map((item) => (
            <div
              key={item.id}
              className="border p-4 mb-3 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
                <p className="font-bold">₹{item.price}</p>
              </div>

              <button
                onClick={() => addToCart(item)}
                className="bg-black text-white px-4 py-1 rounded"
              >
                Add +
              </button>
            </div>
          ))}
        </div>

        {/* CART */}
        <Cart
          cart={cart}
          sellerId={sellerId}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
        />
      </div>
    </div>
  );
}
