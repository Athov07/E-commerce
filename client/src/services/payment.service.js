import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/payment";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const paymentService = {
  // Razorpay Flow
  initiateRazorpay: async (orderId, amount) => {
    const res = await axios.post(
      `${API_URL}/razorpay/initiate`,
      { order_id: orderId, amount },
      { headers: getAuthHeader() },
    );
    return res.data;
  },

  verifyRazorpay: async (paymentData) => {
    const res = await axios.post(`${API_URL}/razorpay/verify`, paymentData, {
      headers: getAuthHeader(),
    });
    return res.data;
  },

  // Internal Card Flow
  processCardPayment: async (paymentDetails) => {
    const res = await axios.post(`${API_URL}/internal/card`, paymentDetails, {
      headers: getAuthHeader(),
    });
    return res.data;
  },

  getAllPayments: async (status = "") => {
    const url = status ? `${API_URL}/admin/all?status=${status}` : `${API_URL}/admin/all`;
    const response = await axios.get(url, { headers: getAuthHeader() });
    return response.data;
  },
};

export default paymentService;
