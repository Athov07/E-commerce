import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderService from "../../services/order.service";
import { Package, ChevronRight, Loader2, ShoppingBag, CheckCircle2, Clock, AlertCircle } from "lucide-react";

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
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-gray-500 font-medium tracking-tight">Retrieving your purchase history...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
            <ShoppingBag size={28} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Orders</h1>
        </div>
        <button onClick={fetchOrders} className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">
          Refresh Status
        </button>
      </div>

      {orders.length > 0 ? (
        <div className="grid gap-6">
          {orders.map((order) => {
            // Helper to check if order is successful
            const isPaid = ["SUCCESS", "CONFIRMED", "DELIVERED"].includes(order.status);
            
            return (
              <div 
                key={order._id}
                onClick={() => navigate(`/orders/${order._id}`)}
                className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform ${isPaid ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                      <Package size={36} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">Order</span>
                        <p className="font-black text-gray-900 text-xl tracking-tight">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <p className="text-sm text-gray-400 font-bold">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-12 border-t lg:border-t-0 pt-4 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                      <p className="text-2xl font-black text-gray-900">Rs.{order.final_amount}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${
                        isPaid ? "bg-green-50 text-green-600 border border-green-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {isPaid ? <CheckCircle2 size={14}/> : <Clock size={14}/>}
                        {order.status}
                      </span>
                      <span className="text-blue-600 font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Details <ChevronRight size={18} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
          <AlertCircle size={40} className="mx-auto mb-6 text-gray-300" />
          <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No orders found</h3>
          <button onClick={() => navigate("/")} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-black transition-all">
            DISCOVER PRODUCTS
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersHistory;