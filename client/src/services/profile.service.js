import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/profile";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token || user?.data?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const profileService = {
  getProfile: async () => {
    const response = await axios.get(`${API_URL}/me`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateProfile: async (formData) => {
    const response = await axios.put(`${API_URL}/edit`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getAllProfiles: async () => {
    const response = await axios.get(`${API_URL}/admin/all`, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
};

export default profileService;