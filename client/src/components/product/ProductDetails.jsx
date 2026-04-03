import React, { useState } from "react";
import { ShoppingCart, CheckCircle, AlertCircle, Loader2, Check } from "lucide-react";
import cartService from "../../services/cart.service";

const ProductDetails = ({ product }) => {
  const [adding, setAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Helper to get current user_id (Synchronized with ProductCard and Cart)
  const getUserId = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const loggedInId = user?.id || user?._id;
        if (loggedInId) return loggedInId;
      } catch (e) {
        console.error("Error parsing user", e);
      }
    }

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
        image: product.main_image,
        quantity: 1,
      };

      await cartService.addToCart(cartData);

      // Success feedback
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
    <div className="space-y-6">
      <div>
        <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">
          {product.category?.name}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          {product.name}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-4xl font-black text-gray-900">
          Rs. {product.price}
        </span>
        {product.stock > 0 ? (
          <span className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle size={14} /> In Stock ({product.stock})
          </span>
        ) : (
          <span className="flex items-center gap-1 text-red-600 text-sm font-medium bg-red-50 px-3 py-1 rounded-full">
            <AlertCircle size={14} /> Out of Stock
          </span>
        )}
      </div>

      <p className="text-gray-600 leading-relaxed">{product.description}</p>

      {/* Dynamic Attributes Mapping */}
      {product.attributes && Object.keys(product.attributes).length > 0 && (
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
          {Object.entries(product.attributes).map(([key, value]) => (
            <div key={key}>
              <span className="text-xs text-gray-400 uppercase font-bold">
                {key}
              </span>
              <p className="text-gray-900 font-medium">{value}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0 || adding}
        className={`w-full md:w-auto flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
          isSuccess 
            ? "bg-green-600 text-white shadow-green-100" 
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
        } disabled:bg-gray-300 disabled:shadow-none`}
      >
        {adding ? (
          <Loader2 className="animate-spin" size={20} />
        ) : isSuccess ? (
          <>
            <Check size={20} /> Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart size={20} /> Add to Cart
          </>
        )}
      </button>
    </div>
  );
};

export default ProductDetails;