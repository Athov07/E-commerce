import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cartService from "../../services/cart.service";
import orderService from "../../services/order.service";
import {
  MapPin,
  CreditCard,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedAddress = location.state?.selectedAddress;

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);

  useEffect(() => {
    // Redirect if no address is passed from the address page
    if (!selectedAddress) {
      navigate("/address");
      return;
    }

    const loadData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id || user?._id;
        const res = await cartService.getCart(userId);

        // Handle different API response structures
        const cartData = res.data?.data || res.data || res;
        setCart(cartData);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedAddress, navigate]);

  // --- SAFE MATH CALCULATIONS ---
  const getSubtotal = () => {
    // If totalPrice exists in API, use it. Otherwise, calculate from items.
    if (cart?.totalPrice) return Number(cart.totalPrice);
    if (cart?.items) {
      return cart.items.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.quantity),
        0,
      );
    }
    return 0;
  };

  const subtotal = getSubtotal();
  const deliveryCharges = subtotal < 500 && subtotal > 0 ? 50 : 0;
  const finalTotal = subtotal + deliveryCharges;

  const handlePlaceOrder = async () => {
    if (subtotal === 0) return alert("Your cart is empty");

    setIsPlacing(true);
    try {
      const payload = {
        items: cart.items,
        shipping_address: selectedAddress,
        items_total: subtotal,
      };

      // FIX 1: Assign the result to 'res'
      const res = await orderService.createOrder(payload);

      // FIX 2: Ensure we extract the orderId correctly from your API response
      const orderId = res.data?._id || res._id;

      // Update global cart count
      window.dispatchEvent(new Event("cartUpdated"));

      // FIX 3: Navigate using the extracted ID and the calculated finalTotal
      navigate("/payment", {
        state: {
          orderId: orderId,
          total: finalTotal,
        },
      });
    } catch (err) {
      console.error("Full Error Object:", err.response?.data);
      alert("Order placement failed. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Preparing your summary...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <button
        onClick={() => navigate("/address")}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 font-medium transition-colors"
      >
        <ArrowLeft size={18} /> Change Address
      </button>

      <h1 className="text-4xl font-black text-gray-900 mb-10">
        Checkout Summary
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Address Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 text-blue-600">
              <MapPin size={24} />
              <h3 className="text-xl font-bold text-gray-900">
                Shipping Details
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Recipient
                </p>
                <p className="font-bold text-gray-800 text-lg">
                  {selectedAddress.full_name}
                </p>
                <p className="text-gray-500">{selectedAddress.phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Address
                </p>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {selectedAddress.address_line_1},{" "}
                  {selectedAddress.address_line_2 &&
                    `${selectedAddress.address_line_2}, `}
                  <br />
                  {selectedAddress.city}, {selectedAddress.state} -{" "}
                  {selectedAddress.pin_code}
                </p>
              </div>
            </div>
          </div>

          {/* Items Review */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
              <h3 className="font-bold text-gray-900">
                Review Items ({cart?.items?.length || 0})
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {cart?.items?.length > 0 ? (
                cart.items.map((item) => (
                  <div
                    key={item.productId || item._id}
                    className="p-6 flex items-center gap-6 group"
                  >
                    <div className="w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                      <img
                        src={
                          item.image ||
                          item.main_image ||
                          "https://via.placeholder.com/150"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-blue-600 font-bold text-sm">
                        Rs.{item.price}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Quantity:{" "}
                        <span className="font-bold text-gray-700">
                          {item.quantity}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900">
                        Rs.{Number(item.price) * Number(item.quantity)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-400">
                  No items found in cart.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-xl sticky top-24">
            <h3 className="text-2xl font-black text-gray-900 mb-8">
              Order Total
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900 font-bold">Rs.{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Delivery Charges</span>
                <span
                  className={
                    deliveryCharges === 0
                      ? "text-green-600 font-bold"
                      : "text-gray-900 font-bold"
                  }
                >
                  {deliveryCharges === 0 ? "FREE" : `Rs.${deliveryCharges}`}
                </span>
              </div>

              <div className="pt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-900 text-lg">To Pay</span>
                <span className="text-4xl font-black text-blue-600">
                  Rs.{finalTotal}
                </span>
              </div>
            </div>

            <button
              disabled={isPlacing || subtotal === 0}
              onClick={handlePlaceOrder}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
            >
              {isPlacing ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <CreditCard size={24} /> PLACE ORDER
                </>
              )}
            </button>

            {subtotal < 500 && subtotal > 0 && (
              <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 rounded-xl text-amber-700 text-[11px] font-medium border border-amber-100">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>
                  Add Rs.{500 - subtotal} more to your cart to unlock{" "}
                  <b>FREE Delivery</b>!
                </span>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-green-600 bg-green-50 py-3 rounded-xl border border-green-100">
              <ShieldCheck size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">
                100% Secure Payment
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
