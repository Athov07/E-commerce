import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import cartService from "../../services/cart.service";
import inventoryService from "../../services/inventory.service";
import { Loader2, Check, ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const [adding, setAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStock, setCurrentStock] = useState(product?.stock || 0);

  // Fetch live stock from inventory service
  useEffect(() => {
    const fetchLiveStock = async () => {
      try {
        const response = await inventoryService.getStock(product._id);
        if (response?.success && response?.data) {
          setCurrentStock(response.data.stock);
        } else if (typeof response?.data === 'number') {
          setCurrentStock(response.data);
        }
      } catch (error) {
        console.error("Stock fetch failed:", error);
        setCurrentStock(product.stock || 0);
      }
    };

    if (product?._id) {
      fetchLiveStock();
    }
  }, [product._id, product.stock]);

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
      window.dispatchEvent(new Event("cartUpdated"));
      
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative">
      {/* Top Right Out of Stock Badge */}
      {currentStock <= 0 && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase">
            Out of Stock
          </span>
        </div>
      )}

      <Link to={`/product/${product._id}`}>
        <img 
          src={product.main_image} 
          alt={product.name} 
          className="w-full h-48 object-cover" // Clear image with no filters
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
            // Still disabled if stock is 0 to protect the backend Saga
            disabled={adding || currentStock <= 0}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
              isSuccess 
                ? "bg-green-600 text-white" 
                : currentStock <= 0 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Gray style for out of stock
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
            } disabled:opacity-80`}
          >
            {adding ? (
              <Loader2 className="animate-spin" size={16} />
            ) : isSuccess ? (
              <>
                <Check size={16} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={16} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;