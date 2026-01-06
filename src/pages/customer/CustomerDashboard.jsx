import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";


export default function CustomerHome() {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await api.get("/seller/customer/sellers/");
        setSellers(res.data);
      } catch (err) {
        console.error("Failed to load sellers");
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  if (loading) {
    return <p className="p-6">Loading kitchens...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">
        🍽️ Available Home Kitchens
      </h2>

      {sellers.length === 0 && (
        <p>No kitchens available right now.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className="bg-white rounded-xl shadow p-5"
          >
            <h3 className="text-lg font-semibold">
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

            {/* 🔥 DYNAMIC VIEW MENU */}
            <button
              // onClick={() => navigate(`/menu/${seller.id}`)}
              onClick={() => navigate(`/menu/${seller.seller_id}`)}
              className="mt-4 bg-black text-white px-4 py-2 rounded"
            >
              View Menu
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


