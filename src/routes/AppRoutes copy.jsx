import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import SellerDashboard  from "../pages/seller/SellerDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../pages/auth/Profile";
import SellerProfile from "../pages/seller/SellerProfile";
import SellerMenu from "../pages/seller/SellerMenu";
import SellerMenuManage from "../pages/seller/SellerMenuManage";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CustomerMenu from "../pages/customer/CustomerMenu";
import MyOrders from "../pages/customer/MyOrders";
import SellerOrders from "../pages/seller/SellerOrders";
import OrderHistory from "../pages/orders/OrderHistory";

export default function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/seller-profile" element={<SellerProfile />} />
        <Route path="/seller/menu" element={<SellerMenu />} />
        <Route path="/seller/menu/manage" element={<SellerMenuManage />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        {/* <Route path="/customer-dashboard" element={<CustomerHome />} />
        <Route path="/seller-dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
        <Route path="/menu/:sellerId"element={<CustomerMenu />}/>
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Route>

    </Routes>
  );
}
