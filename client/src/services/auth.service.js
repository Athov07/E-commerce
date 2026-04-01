import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/auth';


const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  if (response.data.success) {
    const userData = {
      ...response.data.user,
      token: response.data.accessToken 
    };
    localStorage.setItem('user', JSON.stringify(userData));
  }
  
  return response.data; 
};

const register = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

const verifyOtp = async (data) => {
  return await axios.post(`${API_URL}/verify`, data);
};

const forgetPassword = async (data) => {
  return await axios.post(`${API_URL}/forget-password`, data);
};

const resetPassword = async (data) => {
  return await axios.post(`${API_URL}/reset-password`, data);
};

const resendOtp = async (data) => {
  return await axios.post(`${API_URL}/resend-otp`, data);
};

const logout = () => {
  localStorage.removeItem('user');
};

export default { login, register, verifyOtp, forgetPassword, resetPassword, resendOtp,logout };