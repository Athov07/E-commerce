import axios from "axios";

// Using the gateway URL /api/inventory
const API_URL = import.meta.env.VITE_API_BASE_URL + "/inventory";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token || user?.data?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const inventoryService = {
  // Admin: Add or update stock levels

  manageStock: async (inventoryData) => {
    const response = await axios.post(`${API_URL}/manage`, inventoryData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Get current stock for a specific product
  getStock: async (productId) => {
    const response = await axios.get(`${API_URL}/${productId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getAllInventory: async () => {
    const response = await axios.get(`${API_URL}/all`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteInventory: async (productId) => {
    const response = await axios.delete(`${API_URL}/${productId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
};

export default inventoryService;