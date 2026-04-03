import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/cart";

// Helper to get headers if user is logged in
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const cartService = {
  getCart: async (userId) => {
    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  addToCart: async (cartData) => {
    const response = await axios.post(`${API_URL}/add`, cartData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateCount: async (updateData) => {
    const response = await axios.patch(`${API_URL}/update-count`, updateData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  removeFromCart: async (userId, productId) => {
    const response = await axios.delete(`${API_URL}/remove/${userId}/${productId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default cartService;