import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

export default function CustomerHome() {
  const navigate = useNavigate();
  const { cart, sellerId } = useCart();

  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sellerRes, profileRes] = await Promise.all([
          api.get("/seller/customer/sellers/"),
          api.get("/auth/profile"),
        ]);

        setSellers(sellerRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  const handleCartClick = () => {
    if (!sellerId) {
      toast.error("🛒 Cart is empty");
      return;
    }

    navigate(`/menu/${sellerId}`);
  };

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1606787366850-de6330128bfc')",
      }}
    >
      <div className="min-h-screen bg-black/40 p-6">

        {/* ================= PROFILE CARD ================= */}
        {profile && (
          <div className="relative bg-white/55 backdrop-blur rounded-2xl shadow-xl p-6 mb-8 max-w-6xl mx-auto">

            {/* 🔝 TOP RIGHT BUTTONS */}
            <div className="absolute top-6 right-6 flex gap-3 items-center">

              {/* 🛒 CART BUTTON */}
              <button
                onClick={handleCartClick}
                className="relative bg-white text-black px-4 py-2 rounded-lg shadow"
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate("/my-orders")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                My Orders
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </div>

            <h2 className="text-2xl text-red-700 font-bold mb-2">
              👋 Welcome, {profile.name}
            </h2>

            <p className="text-sm text-gray-700">📞 {profile.mobile}</p>
            <p className="text-sm text-gray-700">
              📍 {profile.city}, {profile.pincode}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {profile.address}
            </p>

            <button
              onClick={() => navigate("/profile")}
              className="mt-4 text-blue-600 underline text-sm"
            >
              Edit Profile →
            </button>
          </div>
        )}

        {/* ================= SELLERS ================= */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">
            🍽️ Available Home Kitchens
          </h2>

          {sellers.length === 0 && (
            <p className="text-white">
              No kitchens available right now.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-white/55 backdrop-blur rounded-2xl shadow-lg p-5 hover:shadow-2xl transition"
              >
                <h3 className="text-xl text-green-700 font-bold">
                  {seller.kitchen_name}
                </h3>

                {seller.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {seller.description}
                  </p>
                )}

                <p className="text-sm mt-2">
                  ⏰ {seller.opening_time} – {seller.closing_time}
                </p>

                <p className="text-sm mt-1">
                  ⭐ Rating: {seller.avg_rating || "New"}
                </p>

                <button
                  onClick={() =>
                    navigate(`/menu/${seller.seller_id}`)
                  }
                  className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
                >
                  View Menu
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
