import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const uploadKyc = async (data) => {
  const res = await axios.post(`${BASE_URL}/kyc/upload`, data, authHeader());
  return res.data
};

export { uploadKyc };
