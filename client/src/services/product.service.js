import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/products";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const getAllProducts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const getProductById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

const addProduct = async (formData) => {
  const res = await axios.post(`${API_URL}/admin/add`, formData, {
    headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

const updateProduct = async (id, formData) => {
  const res = await axios.patch(`${API_URL}/admin/edit/${id}`, formData, {
    headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

const deleteProduct = async (id) => {
  const res = await axios.delete(`${API_URL}/admin/remove/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

const getAllCategories = async () => {
    const response = await axios.get(`${API_URL}/categories/all`);
    return response.data; 
};


const createCategory = async (categoryData) => {
    try {
      const response = await axios.post(
        `${API_URL}/admin/category`, 
        categoryData, 
        {
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };


const deleteCategory = async (id) => {
    const response = await axios.delete(
        `${API_URL}/admin/category/${id}`,
        { headers: getAuthHeader() }
    );
    return response.data;
};

export default {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createCategory,
  deleteCategory
};
