import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  ChevronDown,
} from "lucide-react";
import cartService from "../services/cart.service";

const StoreLayout = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [count, setCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  const getUserId = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user?.id || user?._id;
      } catch (e) {
        return null;
      }
    }
    return localStorage.getItem("guestId");
  };

  const updateCount = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await cartService.getCart(userId);
      const items = res.data?.data?.items || res.data?.items || [];
      const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
      setCount(totalQuantity);
    } catch (err) {
      console.error("Failed to fetch cart count", err);
    }
  };

  useEffect(() => {
    updateCount();
    window.addEventListener("cartUpdated", updateCount);
    return () => window.removeEventListener("cartUpdated", updateCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsProfileOpen(false);
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <nav className="fixed top-0 w-full h-16 bg-white border-b border-gray-100 z-[100] px-4 md:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              SwiftStore
            </span>
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            {/* CART ICON - MOVED OUTSIDE isLoggedIn TO SHOW FOR GUESTS */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
            >
              <ShoppingCart size={24} />
              {count > 0 && (
                <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 animate-in zoom-in">
                  {count}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pr-2 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-200"
                >
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {user.phone?.charAt(0) || "U"}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-500">Logged in as</p>
                        <p className="text-sm font-semibold truncate">
                          {user.phone}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User size={16} /> My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Package size={16} /> My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow mt-16 px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 py-5">
        <div className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} SwiftStore. Built for shoppers.
        </div>
      </footer>
    </div>
  );
};

export default StoreLayout;