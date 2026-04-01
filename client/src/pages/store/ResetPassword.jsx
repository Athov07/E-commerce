import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';
import authService from '../../services/auth.service';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const phone = location.state?.phone;

  const handleReset = async (formData) => {
    try {
      await authService.resetPassword({ 
        phone, 
        otp: formData.otp, 
        newPassword: formData.password 
      });
      alert("Password updated successfully!");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong during reset.");
    }
  };

  const handleResend = async (phoneNumber) => {
    try {
      await authService.resendOtp({ phone: phoneNumber });
      alert("OTP Resent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to resend OTP. Make sure the backend route /resend-otp exists.");
    }
  };

  if (!phone) {
    return (
      <div className="flex flex-col items-center mt-20">
        <p className="text-red-500 font-semibold">Session expired or invalid access.</p>
        <button 
          onClick={() => navigate('/forgot-password')}
          className="mt-4 text-primary underline"
        >
          Go back to Forgot Password
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <ResetPasswordForm 
        onSubmit={handleReset} 
        onResendOtp={handleResend} 
        phone={phone} 
      />
    </div>
  );
};

export default ResetPassword;