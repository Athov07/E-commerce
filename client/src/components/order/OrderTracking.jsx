import React from "react";
import { ArrowLeft, MapPin, CheckCircle2, Package } from "lucide-react";

const OrderTracking = ({ data, onBack }) => {
  const { order, items } = data;

  const steps = ["CREATED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-6xl mx-auto p-4">
      {/* Back Button - Uses Secondary Color */}
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-secondary hover:text-primary mb-8 font-bold transition-colors group"
      >
        <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
          <ArrowLeft size={20} /> 
        </div>
        Back to History
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Progress & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
            <h3 className="font-bold text-gray-800 text-lg mb-8">Tracking Status</h3>
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div key={step} className="flex flex-col items-center z-10 w-1/5 text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors duration-500 ${
                    index <= currentStepIndex ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {index < currentStepIndex ? <CheckCircle2 size={20}/> : <span className="text-xs font-bold">{index + 1}</span>}
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-tight leading-tight ${index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.replace(/_/g, ' ')}
                  </p>
                </div>
              ))}
              {/* Progress Line Background */}
              <div className="absolute top-5 left-0 h-[3px] bg-gray-100 w-full -z-0"></div>
              {/* Progress Line Active */}
              <div 
                className="absolute top-5 left-0 h-[3px] bg-primary transition-all duration-700 ease-in-out -z-0"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
            <h3 className="font-bold text-gray-800 text-lg mb-6">Items Ordered</h3>
            <div className="divide-y divide-gray-100">
              {items.map(item => (
                <div key={item._id} className="py-5 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 p-2 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.product_name} className="w-full h-full object-contain" />
                      ) : (
                        <Package size={24} className="text-gray-300" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 group-hover:text-primary transition-colors">{item.product_name}</p>
                      <p className="text-sm font-medium text-secondary">Qty: {item.quantity} × Rs.{item.price}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">Rs.{item.quantity * item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Delivery Details */}
        <div className="space-y-6">
          {/* Address Card */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <MapPin size={22} />
              <h3 className="font-bold text-gray-800">Delivery Address</h3>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-gray-900 text-lg">{order.shipping_name}</p>
              <p className="text-sm leading-relaxed text-secondary font-medium">
                {order.address_line_1}{order.address_line_2 ? `, ${order.address_line_2}` : ""}<br />
                {order.city}, {order.state} - {order.pin_code}<br />
                {order.country}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-secondary uppercase font-bold tracking-widest">Contact Number</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{order.shipping_phone}</p>
              </div>
            </div>
          </div>

          {/* Price Summary Card - Uses Primary Background */}
          <div className="bg-primary p-8 rounded-lg text-white shadow-xl shadow-primary/20">
            <h3 className="font-bold text-lg mb-6">Price Summary</h3>
            <div className="space-y-3 text-sm font-medium opacity-90">
              <div className="flex justify-between">
                <span>Items Total</span>
                <span>Rs.{order.items_total}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>Rs.{order.delivery_charges}</span>
              </div>
            </div>
            <div className="border-t border-white/20 mt-6 pt-6 flex justify-between font-bold text-2xl tracking-tighter">
              <span>Total Amount</span>
              <span>Rs.{order.final_amount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;