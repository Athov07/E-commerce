import { useLocation, useNavigate } from "react-router-dom";
import VerifyOtpForm from "../../components/auth/VerifyOtpForm";
import authService from "../../services/auth.service";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const phone = location.state?.phone || "";

  const handleVerify = async (otp) => {
    try {
      await authService.verifyOtp({ phone, otp });
      alert("Verification Successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  // ADD THIS FUNCTION
  const handleResend = async (phoneNumber) => {
    try {
      await authService.resendOtp({ phone: phoneNumber });
      alert("OTP Resent successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      {/* ADD onResendOtp PROP HERE */}
      <VerifyOtpForm 
        onSubmit={handleVerify} 
        onResendOtp={handleResend} 
        phone={phone} 
      />
    </div>
  );
};

export default VerifyOtp;