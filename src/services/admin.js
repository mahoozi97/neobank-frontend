import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/admin`;

const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

//  - - - -  - -  - - -  - - - - ↓ Accounts ↓ - - - - -  - -  - - - - -  - - - -

// BY USER ID
const getAccountByUserId = async (userId) => {
  const res = await axios.get(
    `${BASE_URL}/account/user/${userId}`,
    authHeader(),
  );
  return res.data;
};

//  - - - -  - -  - - -  - - - - ↓ USERS ↓ - - - - -  - -  - - - - -  - - - -

// GET ALL USERS
const getAllUsers = async (searchTerm) => {
  const res = await axios.get(`${BASE_URL}/users`, {
    ...authHeader(),
    params: {
      searchTerm: searchTerm,
    },
  });
  return res.data;
};
// BLOCK USER
const blockUser = async (userId) => {
  const res = await axios.patch(
    `${BASE_URL}/users/${userId}/block`,
    {},
    authHeader(),
  );
  return res.data;
};

// ACTIVATE USER
const activateUser = async (userId) => {
  const res = await axios.patch(
    `${BASE_URL}/users/${userId}/active`,
    {},
    authHeader(),
  );
  return res.data;
};

//  - - - -  - -  - - -  - - - - ↓ KYC ↓ - - - - -  - -  - - - - -  - - - -

// BY USER ID
const getKycByUserId = async (userId) => {
  const res = await axios.get(`${BASE_URL}/kyc/user/${userId}`, authHeader());
  return res.data;
};

// Approve
const approveKyc = async (kycId) => {
  const res = await axios.patch(
    `${BASE_URL}/kyc/${kycId}/approve`,
    {},
    authHeader(),
  );
  return res.data;
};

// Reject (with commment)
const rejectKyc = async (kycId, data) => {
  const res = await axios.patch(
    `${BASE_URL}/kyc/${kycId}/reject`,
    data,
    authHeader(),
  );
  return res.data;
};

//  - - - -  - -  - - -  - - - - ↓ AUDIT LOGS ↓ - - - - -  - -  - - - - -  - - - -

const getAuditLogs = async (page, action) => {
  const res = await axios.get(`${BASE_URL}/audit-logs`, {
    ...authHeader(),
    params: {
      page,
      limit: 10,
      action: action,
    },
  });
  return res.data;
};

export {
  getAccountByUserId,
  getAllUsers,
  blockUser,
  activateUser,
  getKycByUserId,
  approveKyc,
  rejectKyc,
  getAuditLogs,
};
