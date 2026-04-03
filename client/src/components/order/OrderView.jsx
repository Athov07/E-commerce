import React from "react";
import { Package, ChevronRight, Calendar } from "lucide-react";

const OrderView = ({ orders, onSelect }) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div 
          key={order._id} 
          onClick={() => onSelect(order._id)}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">Order #{order._id.slice(-6).toUpperCase()}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Calendar size={14} />
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="mx-1">•</span>
                <span className="font-bold text-blue-600">Rs.{order.final_amount}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              order.status === 'DELIVERED' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {order.status}
            </span>
            <ChevronRight className="text-gray-300" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderView;