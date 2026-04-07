import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardForm from "../../components/payment/CardForm";
import RazorpayPaymentButton from "../../components/payment/RazorpayPaymentButton";
import paymentService from "../../services/payment.service";
import { ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total } = location.state || {}; // Passed from Order.jsx

  const [method, setMethod] = useState("RAZORPAY"); // RAZORPAY or CARD
  const [loading, setLoading] = useState(false);

  if (!orderId) {
    return (
      <div className="text-center py-20">
        <p>No active order session found.</p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 font-bold"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleCardSubmit = async (cardData) => {
    setLoading(true);
    try {
      const payload = {
        order_id: orderId,
        amount: total,
        card_info: {
          number: cardData.number,
          name: cardData.name,
          expiry: cardData.expiry,
          cvc: cardData.cvc,
          network: cardData.network,
          type: cardData.type,
        },
      };

      await paymentService.processCardPayment(payload);

      navigate("/orders", { state: { success: true } });
    } catch (err) {
      console.error("Payment Error Response:", err.response?.data);
      alert(err.response?.data?.message || "Card Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Method</h1>
      <p className="text-gray-500 mb-8">
        Choose how you'd like to pay for Order #{orderId.slice(-6)}
      </p>

      <div className="space-y-6">
        {/* Method Toggle */}
        <div className="flex p-1 bg-gray-200 rounded-2xl">
          <button
            onClick={() => setMethod("RAZORPAY")}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${method === "RAZORPAY" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
          >
            Razorpay / UPI
          </button>
          <button
            onClick={() => setMethod("CARD")}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${method === "CARD" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
          >
            Debit/Credit Card
          </button>
        </div>

        {/* Dynamic Payment Option */}
        <div className="bg-white p-2 min-h-[300px]">
          {method === "RAZORPAY" ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 ">
              <div className="bg-gray-200 p-6 rounded-3xl border border-blue-100 text-center">
                <p className="text-blue-600 text-xs font-black uppercase tracking-widest mb-2">
                  Secure Gateway
                </p>
                <p className="text-3xl font-black text-blue-900">Rs.{total}</p>
              </div>
              <RazorpayPaymentButton
                orderId={orderId}
                amount={total}
                onSuccess={() => navigate("/orders")}
                onError={() => alert("Razorpay Error")}
              />
              <p className="text-center text-xs text-gray-400">
                Supports UPI, Netbanking, and Wallets
              </p>
            </div>
          ) : (
            <CardForm
              onSubmit={handleCardSubmit}
              loading={loading}
              total={total}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
