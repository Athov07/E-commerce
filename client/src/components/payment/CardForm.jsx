import React, { useState } from "react";
import { CreditCard, Lock, Loader2 } from "lucide-react";

const CardForm = ({ onSubmit, loading, total }) => {
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvc: "", name: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(cardData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Amount to Pay</p>
        <p className="text-2xl font-black text-blue-600">Rs.{total}</p>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Cardholder Name"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
        />
        <div className="relative">
          <input
            type="text"
            placeholder="Card Number (16 Digits)"
            maxLength="16"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none pr-10"
            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
          />
          <CreditCard className="absolute right-3 top-3.5 text-gray-400" size={20} />
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="MM/YY"
            maxLength="5"
            className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
          />
          <input
            type="password"
            placeholder="CVC"
            maxLength="3"
            className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
          />
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : <><Lock size={18} /> Pay Securely</>}
      </button>
    </form>
  );
};

export default CardForm;