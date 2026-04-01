import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL_ADMIN || 'http://localhost:5000/api/admin';

const getDashboardStats = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await axios.get(`${API_URL}/stats`, {
    headers: { Authorization: `Bearer ${user.token}` }
  });
  return response.data;
};

export default { getDashboardStats };