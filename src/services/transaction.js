import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/transactions`;

const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// GET TRANSACTIONS — SHARED ENDPOINT (USER + ADMIN) ********
// Get Transactions By Account ID
const getUserTransactions = async (accountId, page, status, date) => {
  const res = await axios.get(`${BASE_URL}/${accountId}`, {
    ...authHeader(),
    params: { page, limit: 10, status: status, date: date },
  });
  return res.data;
};

// Transfer
const transferAmount = async (data) => {
  const res = await axios.post(`${BASE_URL}/transfer`, data, authHeader());
  return res.data;
};

export { getUserTransactions, transferAmount };
