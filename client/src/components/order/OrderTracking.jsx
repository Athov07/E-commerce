import React from "react";
import { ArrowLeft, MapPin, Truck, CheckCircle2, PackageCheck } from "lucide-react";

const OrderTracking = ({ data, onBack }) => {
  const { order, items } = data;

  const steps = ["CREATED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to History
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress & Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Tracking Status</h3>
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div key={step} className="flex flex-col items-center z-10 w-1/5 text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    index <= currentStepIndex ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {index < currentStepIndex ? <CheckCircle2 size={16}/> : <span className="text-xs font-bold">{index + 1}</span>}
                  </div>
                  <p className={`text-[10px] font-bold uppercase ${index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.replace(/_/g, ' ')}
                  </p>
                </div>
              ))}
              <div className="absolute top-4 left-0 h-[2px] bg-gray-100 w-full -z-0"></div>
              <div 
                className="absolute top-4 left-0 h-[2px] bg-blue-600 transition-all duration-500 -z-0"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Items Ordered</h3>
            <div className="divide-y divide-gray-50">
              {items.map(item => (
                <div key={item._id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × Rs.{item.price}</p>
                  </div>
                  <p className="font-bold text-gray-900">Rs.{item.quantity * item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <MapPin size={20} />
              <h3 className="font-bold text-gray-900">Delivery Address</h3>
            </div>
            <p className="font-bold text-gray-800">{order.shipping_name}</p>
            <p className="text-sm text-gray-600 mt-1">
              {order.address_line_1}, {order.address_line_2}<br />
              {order.city}, {order.state} - {order.pin_code}
            </p>
            <p className="text-sm text-gray-600 mt-2 font-medium">Phone: {order.shipping_phone}</p>
          </div>

          <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-100">
            <h3 className="font-bold mb-4">Price Summary</h3>
            <div className="space-y-2 text-sm opacity-90">
              <div className="flex justify-between"><span>Items Total</span><span>Rs.{order.items_total}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>Rs.{order.delivery_charges}</span></div>
            </div>
            <div className="border-t border-white/20 mt-4 pt-4 flex justify-between font-black text-xl">
              <span>Total</span><span>Rs.{order.final_amount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;