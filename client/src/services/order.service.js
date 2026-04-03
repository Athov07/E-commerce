import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/order";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const orderService = {
  createOrder: async (orderData) => {
    const response = await axios.post(`${API_URL}/create`, orderData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getOrderHistory: async () => {
    const response = await axios.get(`${API_URL}/history`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getOrderSummary: async (orderId) => {
    const response = await axios.get(`${API_URL}/summary/${orderId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
};

export default orderService;