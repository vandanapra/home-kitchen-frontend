import { useEffect, useState } from "react";
// import api from "../../services/api";
import api from "../../api/axios";


export default function Profile() {
//   const navigate = useNavigate();   // ✅ ADD THIS
  const [form, setForm] = useState({
    mobile: "",
    name: "",
    city: "",
    address: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 📥 Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile/");
        setForm(res.data);
      } catch (err) {
        setError("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  // ✏️ Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 💾 Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.put("/auth/profile/", {
        name: form.name,
        city: form.city,
        address: form.address,
        pincode: form.pincode,
      });
    //   setMessage("Profile updated successfully");
            // ✅ DIRECT REDIRECT AFTER SUCCESS
    //   navigate("/dashboard");

    } catch (err) {
      setError("Failed to update profile");
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
        <h2 className="text-xl font-bold mb-4">My Profile</h2>

        {message && (
          <p className="text-green-600 mb-3">{message}</p>
        )}
        {error && (
          <p className="text-red-600 mb-3">{error}</p>
        )}

        <label className="block mb-1 text-sm font-medium">
          Mobile (readonly)
        </label>
        <input
          value={form.mobile}
          disabled
          className="w-full border p-2 mb-3 rounded bg-gray-100"
        />

        <label className="block mb-1 text-sm font-medium">
          Full Name
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <label className="block mb-1 text-sm font-medium">
          City
        </label>
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <label className="block mb-1 text-sm font-medium">
          Address
        </label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <label className="block mb-1 text-sm font-medium">
          Pincode
        </label>
        <input
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
