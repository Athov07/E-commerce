import React, { useState, useEffect, useCallback } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Package, ChevronDown } from "lucide-react";
import cartService from "../services/cart.service";
import profileService from "../services/profile.service";

const StoreLayout = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [count, setCount] = useState(0);
  
  // Initialize state from localStorage
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const isLoggedIn = !!user;

  // --- Auth & Profile Logic ---
  
  // Refresh user state from LocalStorage when login/logout happens
  const refreshAuthStatus = useCallback(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);
  }, []);

  const syncProfileData = async () => {
    // Check localStorage directly to ensure we have a token/user before calling API
    if (!localStorage.getItem("user")) return; 
    
    try {
      const res = await profileService.getProfile();
      const profileData = res.data?.data || res.data || res;
      
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser) {
        const updatedUser = { ...currentUser, ...profileData };
        setUser(updatedUser);
        // Optional: Keep localStorage in sync with the latest avatar/name
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Failed to sync profile image", err);
    }
  };

  const updateCount = async () => {
    const userId = user?.id || user?._id || localStorage.getItem("guestId");
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

  // --- Effects ---

  useEffect(() => {
    updateCount();
    syncProfileData();
    
    // Listen for custom events
    window.addEventListener("cartUpdated", updateCount);
    window.addEventListener("profileUpdated", syncProfileData);
    window.addEventListener("authChange", refreshAuthStatus); // Key Fix
    window.addEventListener("storage", refreshAuthStatus); // Sync across tabs
    
    return () => {
      window.removeEventListener("cartUpdated", updateCount);
      window.removeEventListener("profileUpdated", syncProfileData);
      window.removeEventListener("authChange", refreshAuthStatus);
      window.removeEventListener("storage", refreshAuthStatus);
    };
  }, [refreshAuthStatus]);

  // Re-run specific syncs when the user object actually changes
  useEffect(() => {
    if (isLoggedIn) {
      updateCount();
      if (!user?.avatar_url) syncProfileData();
    } else {
      setCount(0);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileOpen(false);
    // Notify the rest of the app that auth state changed
    window.dispatchEvent(new Event("authChange"));
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
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-100 shadow-sm bg-blue-50 flex-shrink-0">
                    <img
                      src={user?.avatar_url || "/default-avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-avatar.png";
                      }}
                    />
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
                          {user?.fullName || user?.phone || "User"}
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