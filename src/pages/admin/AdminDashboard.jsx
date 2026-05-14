import React from "react";
import { useState } from "react";
import { getAllUsers } from "../../services/admin";
import { useEffect } from "react";
import { Loading } from "../../components/Loading";
import { useNavigate } from "react-router";

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const fetchAllUsers = async (searchTerm) => {
    try {
      const allUsers = await getAllUsers(searchTerm);

      setUsers(allUsers);
    } catch (error) {
      setErrorMessage(error.response?.data.error || error.message);
    }
  };

  useEffect(() => {
    console.log(searchTerm);

    fetchAllUsers(searchTerm);
  }, [searchTerm]);
  return (
    <>
      <div className="w-full bg-base-100 border border-base-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex justify-center pt-2 pb-2">
          <input
            type="text"
            placeholder="Type here Name or CPR"
            className="input"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="hidden md:grid grid-cols-10 gap-4 px-6 py-4 bg-base-200/40 text-sm font-semibold text-base-content/70 border-b border-base-200">
          <div className="col-span-3">Name</div>
          <div className="col-span-2 text-center">CPR</div>
          <div className="col-span-1 text-center">KYC</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-3 text-center">Actions</div>
        </div>

        {/* Users List */}
        <ul className="divide-y divide-base-200">
          {users ? (
            users.length > 0 ? (
              users.map((user) => (
                <li
                  key={user._id}
                  className="flex flex-col md:grid md:grid-cols-10 md:items-center gap-4 px-4 py-4 md:px-6 transition-colors bg-base-100 odd:bg-base-300 hover:bg-neutral-focus"
                >
                  {/* Name */}
                  <div className="flex items-center gap-4 md:col-span-3">
                    <div className="text-base-content text-sm md:text-base">
                      {user.name}
                    </div>
                  </div>

                  <div className="md:hidden border-t border-base-200/50 my-1"></div>

                  {/* CPR */}
                  <div className="flex items-center justify-between md:justify-center md:col-span-2">
                    <span className="md:hidden text-xs font-semibold opacity-50 uppercase">
                      CPR
                    </span>
                    <span className="text-sm font-medium">{user.cpr}</span>
                  </div>

                  {/* KYC */}
                  <div className="flex items-center justify-between md:justify-center md:col-span-1">
                    <span className="md:hidden text-xs font-semibold opacity-50 uppercase">
                      KYC
                    </span>
                    <span
                      className={`badge badge-soft badge-sm md:badge-md font-medium ${
                        user.kycStatus === "verified"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {user.kycStatus}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between md:justify-center md:col-span-1">
                    <span className="md:hidden text-xs font-semibold opacity-50 uppercase">
                      Status
                    </span>
                    <span
                      className={`badge badge-soft badge-sm md:badge-md font-medium ${
                        user.status === "active" ? "badge-info" : "badge-error"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col md:flex-row items-center justify-between md:justify-center md:col-span-3 mt-2 md:mt-0 gap-2">
                    <span className="md:hidden text-xs font-semibold opacity-50 uppercase w-full text-left mb-1">
                      Actions
                    </span>
                    <div className="flex gap-2 w-full md:w-auto justify-start md:justify-end">
                      <button className="btn btn-xs btn-error text-white">Block</button>
                      <button className="btn btn-xs btn-outline">
                        KYC
                      </button>
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() =>
                          navigate("/admin-account", {
                            state: { userId: user._id },
                          })
                        }
                      >
                        Account
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              /* Empty State */
              <div className="p-10 text-center opacity-60 italic">
                No users found.
              </div>
            )
          ) : (
            /* Loading / Error State */
            <div className="p-10 text-center">
              {errorMessage ? (
                <span className="text-error">{errorMessage}</span>
              ) : (
                <Loading />
              )}
            </div>
          )}
        </ul>
      </div>
    </>
  );
};
