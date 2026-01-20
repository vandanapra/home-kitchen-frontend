import React from "react";

import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import SellerDashboard from "../pages/seller/SellerDashboard";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../pages/auth/Profile";
import SellerProfile from "../pages/seller/SellerProfile";
import SellerMenu from "../pages/seller/SellerMenu";
import SellerMenuManage from "../pages/seller/SellerMenuManage";
import CustomerMenu from "../pages/customer/CustomerMenu";
import MyOrders from "../pages/customer/MyOrders";
import SellerOrders from "../pages/seller/SellerOrders";
import OrderHistory from "../pages/orders/OrderHistory";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute allowedRoles={["SELLER"]} />}>
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller-profile" element={<SellerProfile />} />
        <Route path="/seller/menu" element={<SellerMenu />} />
        <Route path="/seller/menu/manage" element={<SellerMenuManage />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
        <Route path="/customer/dashboard" element={<CustomerDashboard/>} />
        <Route path="/menu/:sellerId" element={<CustomerMenu />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
