import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordForm = ({ onSubmit, onResendOtp, isLoading }) => {
  const [phone, setPhone] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(phone);
    setIsSent(true); 
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Forgot Password?</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
            type="text" 
            placeholder="e.g. 9876543210" 
            required 
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button 
          disabled={isLoading}
          className="w-full py-2 bg-primary hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm disabled:bg-blue-300"
        >
          {isLoading ? "Sending..." : "Send OTP"}
        </button>
      </form>

      {isSent && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Didn't get the code?{" "}
            <button 
              onClick={() => onResendOtp(phone)}
              className="text-primary font-semibold hover:underline"
            >
              Resend
            </button>
          </p>
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-gray-100 text-center">
        <Link to="/login" className="text-sm text-gray-500 hover:text-primary transition-colors">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;