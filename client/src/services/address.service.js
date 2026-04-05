import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/address";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const addressService = {
  getAddresses: async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
  },

  addAddress: async (data) => {
    const response = await axios.post(API_URL, data, { headers: getAuthHeader() });
    return response.data;
  },

  updateAddress: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() });
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  getAllUserAddresses: async () => {
    const response = await axios.get(`${API_URL}/admin/all`, { 
      headers: getAuthHeader() 
    });
    return response.data;
  }
};

export default addressService;