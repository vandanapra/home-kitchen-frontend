// import { Routes, Route } from "react-router-dom";
// import Login from "../pages/auth/Login";
// import Dashboard from "../pages/common/Dashboard";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//     </Routes>
//   );
// }


import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/common/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../pages/auth/Profile";
import SellerProfile from "../pages/seller/SellerProfile";
import SellerMenu from "../pages/seller/SellerMenu";
import SellerMenuManage from "../pages/seller/SellerMenuManage";
import CustomerHome from "../pages/customer/CustomerHome";
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/seller-profile" element={<SellerProfile />} />
        <Route path="/seller/menu" element={<SellerMenu />} />
        <Route path="/seller/menu/manage" element={<SellerMenuManage />} />
        <Route path="/" element={<CustomerHome />} />
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
