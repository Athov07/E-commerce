import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/admin';


const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  } else if (user && user.accessToken) {
    return { Authorization: `Bearer ${user.accessToken}` };
  }
  return {};
};

const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, {
    headers: getAuthHeader()
  });
  return response.data;
};


const getAllUsers = async () => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error("No authentication token found. Please log in again.");
  }
  const response = await axios.get(`${API_URL}/users`, { headers });
  return response.data; 
};


const deleteUser = async (userId) => {
  const config = {
    headers: getAuthHeader()
  };
  const response = await axios.delete(`${API_URL}/users/${userId}`, config);
  return response.data;
};

export default { 
  getDashboardStats, 
  getAllUsers,
  deleteUser 
};