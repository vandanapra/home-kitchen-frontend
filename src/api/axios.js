import axios from "axios";
import { logout } from "../services/auth"; // ya jahan tumne logout rakha ho
import { toast } from "react-hot-toast";
const api = axios.create({
  baseURL: "http://13.233.98.184:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ❌ REMOVE any default Authorization header
api.interceptors.request.use((config) => {
  // OTP / LOGIN APIs ke liye token mat bhejo
  if (
    config.url.includes("send-otp-whatsapp") ||
    config.url.includes("verify-otp")
  ) {
    delete config.headers.Authorization;
  } else {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// export default api;




/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response && error.response.status === 401) {
      // 🔥 TOKEN EXPIRED / INVALID
      logout();

      // alert("⏰ Your session has expired. Please login again.");
      toast.error("Session expired. Please login again.");
      // Redirect to login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;