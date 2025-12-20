// import Navbar from "../../components/Navbar";

// export default function Signup() {
//   return (
//     <>
//       <Navbar />

//       <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
//         <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
//           <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
//             Create Your Account
//           </h2>

//           <form className="space-y-4">
//             <input
//               type="text"
//               placeholder="Full Name"
//               className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />

//             <input
//               type="text"
//               placeholder="Mobile Number"
//               className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />

//             <input
//               type="email"
//               placeholder="Email Address"
//               className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />

//             <textarea
//               placeholder="Full Address"
//               rows="3"
//               className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 placeholder="City"
//                 className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//               />

//               <input
//                 type="text"
//                 placeholder="Pincode"
//                 className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
//               />
//             </div>

//             <select className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400">
//               <option value="">Select Role</option>
//               <option value="customer">Customer</option>
//               <option value="seller">Seller</option>
//             </select>

//             <button
//               type="submit"
//               className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
//             >
//               Register
//             </button>
//           </form>

//           <p className="text-sm text-center text-gray-600 mt-4">
//             Already have an account?{" "}
//             <a href="/login" className="text-orange-500 font-semibold">
//               Login
//             </a>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import api from "../../services/api";
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