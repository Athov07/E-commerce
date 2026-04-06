import LoginForm from '../../components/auth/LoginForm';
import authService from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      const user = response.data?.user || response.user;

      if (!user) {
        throw new Error("User data not found in response");
      }

      window.dispatchEvent(new Event("authChange"));

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/'); 
      }

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed. Please check your credentials.";
      console.error(errorMsg);
      alert(errorMsg); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};
export default Login;