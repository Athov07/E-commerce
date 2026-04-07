import React, { useState } from "react";
import { CreditCard, Lock, Loader2, Globe, CreditCard as TypeIcon } from "lucide-react";

const CardForm = ({ onSubmit, loading, total }) => {
  const [cardData, setCardData] = useState({ 
    number: "", 
    expiry: "", 
    cvc: "", 
    name: "",
    network: "VISA", // Default value to match Schema enum
    type: "CREDIT"   // Default value to match Schema enum
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wrap card details into the card_info object required by the controller
    const payload = {
      ...cardData
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-6">
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
          {/* Network Selection */}
          <div className="relative w-1/2">
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
              value={cardData.network}
              onChange={(e) => setCardData({ ...cardData, network: e.target.value })}
            >
              <option value="VISA">VISA</option>
              <option value="MASTERCARD">MASTERCARD</option>
            </select>
            <Globe className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
          </div>

          {/* Type Selection */}
          <div className="relative w-1/2">
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
              value={cardData.type}
              onChange={(e) => setCardData({ ...cardData, type: e.target.value })}
            >
              <option value="CREDIT">CREDIT</option>
              <option value="DEBIT">DEBIT</option>
            </select>
            <TypeIcon className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="MM/YY"
            maxLength="5"
            required
            className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
          />
          <input
            type="password"
            placeholder="CVC"
            maxLength="3"
            required
            className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : <><Lock size={18} /> Pay Securely</>}
      </button>
    </form>
  );
};

export default CardForm;