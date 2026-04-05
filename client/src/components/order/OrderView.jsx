import React from "react";
import {
  Package,
  ChevronRight,
  Calendar,
  CreditCard,
  ShoppingCart,
} from "lucide-react";

const OrderView = ({ orders, onSelect }) => {
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          onClick={() => onSelect(order._id)}
          // Applied 'bg-white' and 'shadow-md' to match your form containers
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              {/* Uses your 'primary' color with opacity for the icon background */}
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <ShoppingCart size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-secondary uppercase tracking-wider">
                  Order ID
                </p>
                <h3 className="font-bold text-gray-800 text-lg tracking-tight">
                  #{order._id.slice(-8).toUpperCase()}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-xs font-medium text-secondary uppercase tracking-wider mb-1">
                  Placed On
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar size={14} />
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                  })}
                </div>
              </div>
              {/* Status Badge using your 'success' and 'accent' (amber) tokens */}
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                  ["SUCCESS", "CONFIRMED", "DELIVERED"].includes(order.status)
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-accent/10 text-accent border-accent/20"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Product Items Section */}
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-t border-gray-100 first:border-t-0"
              >
                <div className="flex items-center gap-4">
                  {/* Product Thumbnail container matching form input border styles */}
                  <div className="w-16 h-16 bg-background rounded-md overflow-hidden border border-gray-200 p-1 flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.product_name || item.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package size={24} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-md leading-tight">
                      {item.product_name || item.name || "Unknown Product"}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs font-medium text-secondary">
                        Qty: <span className="text-gray-900">{item.quantity}</span>
                      </p>
                      <span className="text-gray-300">•</span>
                      <p className="text-xs font-medium text-secondary">
                        Price: <span className="text-primary font-semibold">Rs.{item.price}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Section */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icon circle using 'primary' to match the Login button feel */}
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                <CreditCard size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                  Total Paid
                </p>
                <p className="text-xl font-bold text-gray-900 tracking-tight">
                  Rs.{order.final_amount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-primary font-bold text-sm group-hover:gap-2 transition-all">
              View Details <ChevronRight size={18} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderView;