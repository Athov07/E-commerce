import React, { useState } from "react";
import { Link } from 'react-router-dom';
import cartService from "../../services/cart.service";
import { Loader2, Check } from "lucide-react";

const ProductCard = ({ product }) => {
  const [adding, setAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // FIXED: Prioritize logged-in user and check for both .id and ._id
  const getUserId = () => {
    const userData = localStorage.getItem("user");
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Check for .id (which your login data uses) or ._id as fallback
        const loggedInId = user?.id || user?._id;
        if (loggedInId) return loggedInId;
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }

    // Fallback to guest logic if no logged-in user is found
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guestId", guestId);
    }
    return guestId;
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const cartData = {
        user_id: getUserId(),
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1, 
      };

      await cartService.addToCart(cartData);
      
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert(error.response?.data?.message || "Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.main_image} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          {product.category?.name}
        </span>
        <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">Rs.{product.price}</span>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isSuccess 
                ? "bg-green-600 text-white" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            } disabled:opacity-70`}
          >
            {adding ? (
              <Loader2 className="animate-spin" size={16} />
            ) : isSuccess ? (
              <>
                <Check size={16} /> Added
              </>
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;