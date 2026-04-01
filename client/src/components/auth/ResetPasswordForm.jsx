import React, { useState } from "react";

const ResetPasswordForm = ({ onSubmit, onResendOtp, phone, isLoading }) => {
  const [data, setData] = useState({ 
    otp: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  // Regex: 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Complexity Validation
    if (!passwordRegex.test(data.newPassword)) {
      alert("Password must be 8+ characters with uppercase, lowercase, number, and symbol.");
      return;
    }

    // 2. Match Validation
    if (data.newPassword !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // 3. Submit
    onSubmit({ 
      otp: data.otp, 
      password: data.newPassword 
    });
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">Set New Password</h2>
      {/* <p className="text-sm text-gray-500 mb-6 text-center">
        Enter the OTP sent to your phone and choose a strong new password.
      </p> */}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* OTP Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Verification OTP</label>
          <input 
            type="text" 
            placeholder="Enter 6-digit OTP" 
            required 
            maxLength="6"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-center tracking-widest font-bold"
            onChange={(e) => setData({ ...data, otp: e.target.value })}
          />
        </div>

        {/* New Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input 
            type="password" 
            placeholder="New Password" 
            required 
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            onChange={(e) => setData({ ...data, newPassword: e.target.value })}
          />
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input 
            type="password" 
            placeholder="Confirm New Password" 
            required 
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
          />
        </div>

        <button 
          disabled={isLoading}
          className="w-full py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-300"
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      {/* Resend OTP Section */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Didn't receive the code?{" "}
        <button 
          type="button"
          onClick={() => onResendOtp(phone)}
          className="text-primary font-semibold hover:underline focus:outline-none"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordForm;