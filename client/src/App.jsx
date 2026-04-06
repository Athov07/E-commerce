import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import StoreLayout from './layout/storeLayout';
import AdminLayout from './layout/adminLayout';

// Store Pages
import Home from './pages/store/Product'; 
import Login from './pages/store/Login';
import Register from './pages/store/Register';
import VerifyOtp from './pages/store/VerifyOtp';
import ForgotPassword from './pages/store/ForgotPassword';
import ResetPassword from './pages/store/ResetPassword';
import ProductDetailsPage from './pages/store/ProductDetailsPage';
import Cart from './pages/store/Cart'
import Address from './pages/store/Address';
import Order from './pages/store/Order';
import Payment from './pages/store/Payment';
import OrdersHistory from './pages/store/OrdersHistory';
import OrderDetailsPage from './pages/store/OrderDetailsPage';
import Profile from './pages/store/Profile';

// Admin Pages
import UserManager from './pages/admin/UserManager';
import ProductManager from './pages/admin/ProductManager';
import CategoryManager from './pages/admin/CategoryManager';
import OrderManager from './pages/admin/OrderManager';
import AddressManager from './pages/admin/AddressManager';
import PaymentManager from './pages/admin/PaymentManager';
import ProfileManager from './pages/admin/ProfileManager';

// Protection
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Store Routes --- */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/address" element={<Address />} />
          <Route path="/order" element={<Order />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orders" element={<OrdersHistory />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/profile" element={<Profile />} />

        </Route>

        {/* --- Protected Admin Routes --- */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<div className="text-2xl font-bold">Admin Stats Overview</div>} />
            <Route path="/admin/users" element={<UserManager />} />
            <Route path="/admin/products" element={<ProductManager />} />
            <Route path="/admin/category" element={<CategoryManager />} />
            <Route path="/admin/orders" element={<OrderManager />} />
            <Route path="/admin/addresses" element={<AddressManager />} />
            <Route path="/admin/payments" element={<PaymentManager />} />
            <Route path="/admin/profiles" element={<ProfileManager />} />
            {/* Add other admin routes here */}
          </Route>
        </Route>


        <Route path="*" element={<div className="p-20 text-center">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;