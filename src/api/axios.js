import axios from "axios";

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
    config.url.includes("send-otp") ||
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

export default api;

