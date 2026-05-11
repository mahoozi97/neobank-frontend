import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/transactions`;

const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Get Transactions By User ID
const getUserTransactions = async (status) => {
  const res = await axios.get(BASE_URL, { ...authHeader(), params: status });
  return res.data;
};

// Transfer
const transferAmount = async (data) => {
  const res = await axios.post(`${BASE_URL}/transfer`, data, authHeader());
  return res.data;
};
