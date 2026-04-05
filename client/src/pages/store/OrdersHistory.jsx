import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderService from "../../services/order.service";
import OrderView from "../../components/order/OrderView"; 
import { ShoppingBag, Loader2, AlertCircle } from "lucide-react";

const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await orderService.getOrderHistory();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      {/* Primary blue loader to match theme */}
      <Loader2 className="animate-spin text-primary mb-4" size={40} />
      <p className="text-secondary font-medium tracking-tight">Retrieving your purchase history...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 min-h-screen font-sans bg-background">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          {/* Background changed to primary with shadow */}
          <div className="p-3 bg-primary rounded-lg text-white shadow-md">
            <ShoppingBag size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">My Orders</h1>
            <p className="text-sm text-secondary font-medium">Manage and track your recent purchases</p>
          </div>
        </div>
        <button 
          onClick={fetchOrders} 
          className="text-sm font-bold text-primary hover:bg-primary/5 px-5 py-2.5 rounded-lg transition-all border border-primary/20 hover:border-primary/40"
        >
          Refresh Status
        </button>
      </div>

      {/* Conditional Rendering */}
      {orders.length > 0 ? (
        <OrderView orders={orders} onSelect={(id) => navigate(`/orders/${id}`)} />
      ) : (
        /* Empty State aligned with Register/Login card styles */
        <div className="text-center py-24 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">No orders found</h3>
          <p className="text-secondary font-medium mb-8">It looks like you haven't made a purchase yet.</p>
          <button 
            onClick={() => navigate("/")} 
            className="bg-primary text-white px-10 py-4 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            DISCOVER PRODUCTS
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersHistory;