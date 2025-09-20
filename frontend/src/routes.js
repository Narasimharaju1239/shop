import Landing from './common/Landing';
import Login from './auth/Login';
import Signup from './auth/Signup';
import About from './common/About';
import ContactUs from './common/ContactUs';
import Checkout from './customer/Checkout';
import OrderConfirmation from './customer/OrderConfirmation';
import PaymentPending from './customer/PaymentPending';
import PaymentSuccess from './customer/PaymentSuccess';
import PaymentFailed from './customer/PaymentFailed';
import React, { useContext } from 'react';
import Layout from './common/Layout';
import { Routes, Route } from 'react-router-dom';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import ChangePassword from './auth/ChangePassword';
import CustomerHome from './customer/Home';
import OwnerHome from './owner/Home';
import Companies from './owner/Companies';
import OwnerProducts from './owner/Products';
import CustomerProducts from './customer/Products';
import ProductDetails from './customer/ProductDetails';
import Cart from './customer/Cart';
import GuestCart from './customer/GuestCart';
import Orders from './customer/Orders';
import CustomerProfile from './customer/Profile';
import ManageOrders from './owner/ManageOrders';
import OffersManager from './owner/OffersManager';
import Profile from './owner/Profile';
import PrivateRoute from './utils/PrivateRoute';
import CustomerCompanies from './customer/Companies';
import CompanyProducts from './customer/CompanyProducts';
import { AuthContext } from './context/AuthContext';

const RoutesConfig = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Landing, Login, and Signup pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/contactus" element={<ContactUs />} />
      {/* Auth (keep forgot/reset/change password for direct access) */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/change-password" element={<PrivateRoute><Layout><ChangePassword /></Layout></PrivateRoute>} />

      {/* Role Based Dashboards */}
      <Route path="/customer/home" element={<PrivateRoute role="customer"><Layout><CustomerHome /></Layout></PrivateRoute>} />
      <Route path="/owner/home" element={<PrivateRoute role="owner"><Layout><OwnerHome /></Layout></PrivateRoute>} />
      <Route path="/owner/companies" element={<PrivateRoute role="owner"><Layout><Companies /></Layout></PrivateRoute>} />
      <Route path="/owner/products" element={<PrivateRoute role="owner"><Layout><OwnerProducts /></Layout></PrivateRoute>} />
      <Route path="/customer/products" element={<Layout><CustomerProducts /></Layout>} />
      <Route path="/customer/products/:id" element={<Layout><ProductDetails /></Layout>} />
  <Route path="/customer/cart" element={<Layout><Cart /></Layout>} />
  <Route path="/guest/cart" element={<Layout><GuestCart /></Layout>} />
      <Route path="/customer/orders" element={<PrivateRoute role="customer"><Layout><Orders /></Layout></PrivateRoute>} />
      <Route path="/customer/profile" element={<PrivateRoute role="customer"><Layout><CustomerProfile /></Layout></PrivateRoute>} />
      <Route path="/owner/orders" element={<PrivateRoute role="owner"><Layout><ManageOrders /></Layout></PrivateRoute>} />
      <Route path="/owner/offers" element={<PrivateRoute role="owner"><Layout><OffersManager /></Layout></PrivateRoute>} />
      <Route path="/owner/profile" element={<PrivateRoute role="owner"><Layout><Profile /></Layout></PrivateRoute>} />
      <Route path="/customer/checkout" element={<PrivateRoute role="customer"><Layout><Checkout /></Layout></PrivateRoute>} />
      <Route path="/customer/payment-pending" element={<PrivateRoute role="customer"><Layout><PaymentPending /></Layout></PrivateRoute>} />
      <Route path="/customer/payment-success" element={<PrivateRoute role="customer"><Layout><PaymentSuccess /></Layout></PrivateRoute>} />
      <Route path="/customer/payment-failed" element={<PrivateRoute role="customer"><Layout><PaymentFailed /></Layout></PrivateRoute>} />
      <Route path="/customer/order-confirmation" element={<PrivateRoute role="customer"><Layout><OrderConfirmation /></Layout></PrivateRoute>} />
      <Route path="/customer/companies" element={<Layout><CustomerCompanies /></Layout>} />
      <Route path="/customer/companies/:companyId" element={<Layout><CompanyProducts /></Layout>} />

      {/* Direct /profile route for both roles */}
      <Route path="/profile" element={<PrivateRoute><Layout>{user?.role === 'owner' ? <Profile /> : <CustomerProfile />}</Layout></PrivateRoute>} />
    </Routes>
  );
};

export default RoutesConfig;
