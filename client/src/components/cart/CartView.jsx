import React from "react";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartView = ({ items, onUpdateCount, onRemove, total }) => {
  const navigate = useNavigate();

  // Redirect logic for checkout
  const handleCheckoutRedirect = () => {
    const userData = localStorage.getItem("user");
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // If user object exists and has data, they are logged in
        if (user) {
          navigate("/address");
          return;
        }
      } catch (e) {
        console.error("Error parsing user session", e);
      }
    }

    // If no user found, redirect to login with a back-reference
    navigate("/login", { state: { from: "/address" } });
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
        <h3 className="text-xl font-bold text-gray-800">Your cart is empty</h3>
        <p className="text-gray-500 mt-2">Add some healthy products to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Items List */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            
            {/* PRODUCT IMAGE */}
            <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-gray-50">
              <img 
                src={item.image || item.main_image} 
                alt={item.name} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=No+Image'; }}
              />
            </div>

            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{item.name}</h4>
              <p className="text-blue-600 font-bold text-sm">Rs.{item.price}</p>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border">
              <button 
                onClick={() => onUpdateCount(item.productId, item.quantity - 1)}
                className="p-1 hover:bg-white rounded-md transition-all text-gray-600 disabled:opacity-30"
                disabled={item.quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="font-bold w-8 text-center">{item.quantity}</span>
              <button 
                onClick={() => onUpdateCount(item.productId, item.quantity + 1)}
                className="p-1 hover:bg-white rounded-md transition-all text-gray-600"
              >
                <Plus size={16} />
              </button>
            </div>

            <button 
              onClick={() => onRemove(item.productId)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3 pb-4 border-b border-gray-50">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>Rs.{total}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 mb-6">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-2xl font-black text-blue-600">Rs.{total}</span>
          </div>
          
          {/* UPDATED BUTTON WITH ONCLICK */}
          <button 
            onClick={handleCheckoutRedirect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;