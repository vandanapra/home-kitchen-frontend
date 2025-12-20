import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../services/auth";



export default function ProtectedRoute() {
  const token = getAccessToken();

  // 🔴 No token → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Token exists → allow route
  return <Outlet />;
}
