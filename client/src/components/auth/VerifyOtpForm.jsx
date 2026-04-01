import React, { useState } from "react";

const VerifyOtpForm = ({ onSubmit, onResendOtp, phone, isLoading }) => {
  const [otp, setOtp] = useState("");

  const handleResend = (e) => {
    e.preventDefault();
    if (onResendOtp) {
      onResendOtp(phone);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Verify OTP</h2>
      <p className="text-sm text-gray-500 mb-6">
        We sent a 6-digit code to{" "}
        <span className="font-semibold text-gray-700">{phone}</span>
      </p>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(otp);
        }}
      >
        <input
          type="text"
          maxLength="6"
          placeholder="000000"
          required
          className="w-full px-3 py-3 border rounded-md text-center tracking-[1em] text-2xl font-bold focus:ring-2 focus:ring-success/20 focus:border-success outline-none"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          disabled={isLoading}
          className="w-full py-2 bg-success hover:bg-emerald-600 text-white rounded-md transition-colors shadow-sm disabled:bg-emerald-300"
        >
          {isLoading ? "Verifying..." : "Verify & Proceed"}
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-600">
        Didn't receive the code?{" "}
        <button
          type="button" // <--- Add this to prevent accidental form submission
          onClick={handleResend}
          className="text-primary font-semibold hover:underline focus:outline-none"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtpForm;
