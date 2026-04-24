import React, { useState, useEffect } from "react";
import cartService from "../../services/cart.service";
import inventoryService from "../../services/inventory.service";
import CartView from "../../components/cart/CartView";
import { Loader2 } from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const fetchCart = async () => {
  try {
    setLoading(true);
    const userId = getUserId();
    const res = await cartService.getCart(userId);
    const rawCart = res.data.data || res.data;

    if (rawCart && rawCart.items) {
      const enrichedItems = await Promise.all(
        rawCart.items.map(async (item) => {
          try {
            const invRes = await inventoryService.getStock(item.productId);
            // Check if we actually got a valid response
            const hasData = invRes?.success || invRes?.data !== undefined;
            const stockValue = hasData ? (invRes?.data?.stock ?? invRes?.data) : null;
            
            return { 
              ...item, 
              stock: stockValue, // Can be null if unavailable
              stockMessage: stockValue !== null 
                ? `Only ${stockValue} items available in stock` 
                : "Stock status unavailable"
            };
          } catch (err) {
            console.error(`Inventory service unreachable for ${item.productId}`);
            return { 
              ...item, 
              stock: null, 
              stockMessage: "Stock status unavailable" 
            };
          }
        })
      );
      setCart({ ...rawCart, items: enrichedItems });
    } else {
      setCart(rawCart);
    }
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
    const item = cart.items.find(i => i.productId === productId);
    // Prevent increasing count beyond stock limit
    if (newQuantity > item.stock && newQuantity > item.quantity) {
      return; 
    }

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