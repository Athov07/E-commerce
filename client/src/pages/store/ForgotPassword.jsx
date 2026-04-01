import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import authService from '../../services/auth.service';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleForgotRequest = async (phone) => {
    try {
      await authService.forgetPassword({ phone });
      // Move to reset page and pass the phone number
      navigate('/reset-password', { state: { phone } });
    } catch (err) {
      alert("Error: User not found or service unavailable");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <ForgotPasswordForm onSubmit={handleForgotRequest} />
    </div>
  );
};

export default ForgotPassword;