import React, { useState, useEffect } from "react";
import cartService from "../../services/cart.service";
import CartView from "../../components/cart/CartView";
import { Loader2 } from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to get current user_id (handles guest UUID or Login ID)
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) return user._id;
    
    // Check for guest ID, create one if not exists
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guestId", guestId);
    }
    return guestId;
  };

  const fetchCart = async () => {
    try {
      const userId = getUserId();
      const res = await cartService.getCart(userId);
      setCart(res.data);
    } catch (err) {
      console.error("Cart load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateCount = async (productId, newQuantity) => {
    try {
      await cartService.updateCount({
        user_id: getUserId(),
        productId,
        quantity: newQuantity,
      });
      fetchCart();
    } catch (err) {
      alert("Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await cartService.removeFromCart(getUserId(), productId);
      fetchCart();
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  const calculateTotal = () => {
    return cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-black text-gray-900 mb-8">My Shopping Cart</h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <CartView 
          items={cart?.items || []} 
          onUpdateCount={handleUpdateCount}
          onRemove={handleRemove}
          total={calculateTotal()}
        />
      )}
    </div>
  );
};

export default Cart;