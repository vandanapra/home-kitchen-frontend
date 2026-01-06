import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../services/auth";

export default function ProtectedRoute({ allowedRoles }) {
  const token = getAccessToken();
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
