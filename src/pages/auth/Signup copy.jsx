
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // 🔍 FRONTEND VALIDATION
  const validate = () => {
    const newErrors = {};

    if (!form.name || form.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!form.city || form.city.length < 2) {
      newErrors.city = "City must be at least 2 characters";
    }

    if (!form.address || form.address.length < 10) {
      newErrors.address = "Address must be at least 10 characters";
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Clear error on typing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);

    try {
      await api.post("/auth/signup/", form);
      navigate("/dashboard");
    } catch (err) {
      setServerError("Signup failed. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md"
      >
        <h2 className="text-xl font-bold text-center mb-4">
          Complete Your Profile
        </h2>

        {serverError && (
          <p className="text-red-600 text-center mb-4">
            {serverError}
          </p>
        )}

        {/* NAME */}
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full border p-2 mb-1 rounded"
        />
        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

        {/* CITY */}
        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          className="w-full border p-2 mb-1 rounded"
        />
        {errors.city && <p className="text-red-500 text-sm mb-2">{errors.city}</p>}

        {/* ADDRESS */}
        <textarea
          name="address"
          placeholder="Address"
          onChange={handleChange}
          className="w-full border p-2 mb-1 rounded"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mb-2">{errors.address}</p>
        )}

        {/* PINCODE */}
        <input
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
          className="w-full border p-2 mb-1 rounded"
        />
        {errors.pincode && (
          <p className="text-red-500 text-sm mb-3">{errors.pincode}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Finish Signup"}
        </button>
      </form>
    </div>
  );
}