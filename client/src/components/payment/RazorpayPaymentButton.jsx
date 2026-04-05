import React from "react";
import paymentService from "../../services/payment.service";
import { CreditCard, Zap } from "lucide-react";

const RazorpayPaymentButton = ({ orderId, amount, onSuccess, onError }) => {
  const handlePayment = async () => {
    try {
      const res = await paymentService.initiateRazorpay(orderId, amount);
      const { rzpOrder } = res; 

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount, 
        currency: "INR",
        name: "SwiftStore",
        description: `Order Payment #${orderId.slice(-6)}`,
        order_id: rzpOrder.id,
        handler: async (response) => {
          // 2. Prepare verification data
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order_id: orderId // IMPORTANT: Pass your MongoDB orderId here
          };

          const verifyRes = await paymentService.verifyRazorpay(verifyData);
          if (verifyRes.success) onSuccess();
        },
        prefill: {
          name: JSON.parse(localStorage.getItem("user"))?.name,
          contact: JSON.parse(localStorage.getItem("user"))?.phone,
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      onError(err);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl"
    >
      Pay Rs.{amount} with Razorpay
    </button>
  );
};

export default RazorpayPaymentButton;
