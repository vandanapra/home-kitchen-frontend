// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/axios";

// export default function Login() {
//   const navigate = useNavigate();

//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState("send");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     localStorage.clear();
//   }, []);

//   const handleSendOtp = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       await api.post("/auth/send-otp-whatsapp/", { mobile });
//       setStep("verify");
//     } catch {
//       setError("Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await api.post("/auth/verify-otp/", {
//         mobile,
//         otp,
//       });

//       localStorage.setItem("access", res.data.access);
//       localStorage.setItem("refresh", res.data.refresh);
//       localStorage.setItem("role", res.data.role);

//       if (res.data.is_new_user) {
//         navigate("/signup");
//       } else {
//         if (res.data.role === "SELLER") {
//           navigate("/seller/dashboard");
//         } else if (res.data.role === "CUSTOMER") {
//           navigate("/customer/dashboard");
//         } else {
//           navigate("/login");
//         }
//       }
//     } catch {
//       setError("Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow">
//         <h1 className="text-2xl font-bold text-center mb-2">🍛 Home Kitchen</h1>
//         <p className="text-center text-gray-500 mb-6">Login with OTP</p>

//         {error && <p className="text-red-600 text-center mb-4">{error}</p>}

//         {step === "send" && (
//           <>
//             <input
//               type="tel"
//               placeholder="Enter mobile number"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               className="w-full border p-2 rounded mb-4"
//             />
//             <button
//               onClick={handleSendOtp}
//               disabled={loading || mobile.length < 10}
//               className="w-full bg-black text-white py-2 rounded"
//             >
//               {loading ? "Sending OTP..." : "Send OTP"}
//             </button>
//           </>
//         )}

//         {step === "verify" && (
//           <form onSubmit={handleVerifyOtp}>
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full border p-2 rounded mb-4"
//             />
//             <button
//               type="submit"
//               disabled={loading || otp.length !== 6}
//               className="w-full bg-black text-white py-2 rounded"
//             >
//               {loading ? "Verifying..." : "Verify & Continue"}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
import React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("send"); // send | verify
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Clear old tokens when login page opens
  useEffect(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }, []);

  // 📤 SEND OTP
  const handleSendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/send-otp-whatsapp/", {
        mobile,
      });
      setStep("verify");
    } catch (err) {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/verify-otp/", {
        mobile,
        otp,
      });

      // Save tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("role", res.data.role);

      if (res.data.is_new_user) {
        navigate("/signup");
      } else {
        if (res.data.role === "SELLER") {
          navigate("/seller/dashboard");
        } else if (res.data.role === "CUSTOMER") {
          navigate("/customer/dashboard");
        } else {
          navigate("/");
        }
      }

    } catch (err) {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold text-center mb-2">
          🍛 Home Kitchen Website
        </h1>
        <p className="text-center text-red-500 mb-6">
          Login with OTP
        </p>

        {error && (
          <p className="text-red-600 text-center mb-4">
            {error}
          </p>
        )}

        {/* STEP 1: SEND OTP */}
        {step === "send" && (
          <>
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading || mobile.length < 10}
              className="w-full bg-black text-white py-2 rounded"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === "verify" && (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-black text-white py-2 rounded"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
