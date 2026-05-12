import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/accounts`;

const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// New Account
const openAccount = async (data) => {
  data.type = "savings";
  const res = await axios.post(BASE_URL, data, authHeader());
  return res.data;
};

// Get Account By User ID
const getAccountsSummary = async () => {
  const res = await axios.get(BASE_URL, authHeader());
  return res.data;
};

// Get Reciver Account (For Trnsfer Flow)
const getTargetAccountIds = async (data) => {
  const res = await axios.post(`${BASE_URL}/lookup`, data, authHeader());
  return res.data;
};

// Freeze Account
const freezeAccount = async (accountId) => {
  const res = await axios.patch(
    `${BASE_URL}/${accountId}/freeze`,
    {},
    authHeader(),
  );
  return res.data;
};

// Activate Account
const activateAccount = async (accountId) => {
  const res = await axios.patch(
    `${BASE_URL}/${accountId}/activate`,
    {},
    authHeader(),
  );
};

// close Account
const closeAccount = async (accountId) => {
  const res = await axios.patch(
    `${BASE_URL}/${accountId}/close`,
    {},
    authHeader(),
  );
};

export {
  openAccount,
  getAccountsSummary,
  getTargetAccountIds,
  freezeAccount,
  activateAccount,
  closeAccount,
};
