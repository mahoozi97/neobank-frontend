import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const uploadKyc = (data) => {
  const res = axios.post(`${BASE_URL / kyc / upload}`, data, authHeader());
};

export { uploadKyc };
