import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function SellerProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    kitchen_name: "",
    description: "",
    opening_time: "",
    closing_time: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 📥 Load existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/seller/profile/");
        if (res.data) {
          setForm(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/seller/profile/", form);
      setMessage("Kitchen profile saved successfully");

      // Optional redirect
      setTimeout(() => navigate("/seller/dashboard"), 1500);
    } catch (err) {
      alert("Failed to save kitchen profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mb-4">
          🍳 Kitchen Profile
        </h2>

        {message && (
          <p className="text-green-600 mb-3">{message}</p>
        )}

        <input
          name="kitchen_name"
          placeholder="Kitchen Name"
          value={form.kitchen_name}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Kitchen description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <div className="grid grid-cols-2 gap-4 mb-3">
          <input
            type="time"
            name="opening_time"
            value={form.opening_time}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="time"
            name="closing_time"
            value={form.closing_time}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          Kitchen is open for orders
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Save Kitchen Profile"}
        </button>
      </form>
    </div>
  );
}
