import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartDay, setCartDay] = useState(null);
  const [sellerId, setSellerId] = useState(null);

  /* 🔥 LOAD FROM LOCALSTORAGE */
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedDay = localStorage.getItem("cartDay");
    const storedSeller = localStorage.getItem("sellerId");

    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedDay) setCartDay(storedDay);
    if (storedSeller) setSellerId(storedSeller);
  }, []);

  /* 🔥 SAVE TO LOCALSTORAGE */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartDay", cartDay || "");
    localStorage.setItem("sellerId", sellerId || "");
  }, [cart, cartDay, sellerId]);

  /* ================= ADD TO CART ================= */
  const addToCart = (item, selectedDay, seller) => {

    // ❌ Different seller protection
    if (sellerId && sellerId !== seller) {
      toast.error("❌ You can order from one kitchen at a time");
      return;
    }

    // ❌ Different day protection
    if (cartDay && cartDay !== selectedDay) {
      toast.error("❌ Dish should be of same day");
      return;
    }

    // 🔒 Lock seller + day
    if (!sellerId) setSellerId(seller);
    if (!cartDay) setCartDay(selectedDay);

    const exists = cart.find(
      (i) => i.menu_item_id === item.menu_item_id
    );

    if (exists) {
      setCart(
        cart.map((i) =>
          i.menu_item_id === item.menu_item_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...item,
          seller_id: seller, // 🔥 IMPORTANT
          quantity: 1,
        },
      ]);
    }
  };

  /* ================= UPDATE ================= */
  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(
        cart.map((i) =>
          i.menu_item_id === id
            ? { ...i, quantity: qty }
            : i
        )
      );
    }
  };

  /* ================= REMOVE ================= */
  const removeFromCart = (id) => {
    const updated = cart.filter(
      (i) => i.menu_item_id !== id
    );

    setCart(updated);

    if (updated.length === 0) {
      setCartDay(null);
      setSellerId(null);
    }
  };

  /* ================= CLEAR ================= */
  const clearCart = () => {
    setCart([]);
    setCartDay(null);
    setSellerId(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartDay,
        sellerId,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
