import RegisterForm from '../../components/auth/RegisterForm';
import authService from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    try {
      await authService.register(data);
      // After registration, move to OTP verification
      navigate('/verify-otp', { state: { phone: data.phone } });
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
};
export default Register;