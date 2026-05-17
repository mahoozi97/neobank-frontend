import React, { useRef } from "react";
import { useState } from "react";
import { activateUser, blockUser, getAllUsers } from "../../services/admin";
import { useEffect } from "react";
import { Loading } from "../../components/Loading";
import { useNavigate } from "react-router";
import { capitalize } from "../../utils/helper";

export const AdminDashboard = () => {
  const [users, setUsers] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const fetchAllUsers = async (searchTerm) => {
    try {
      const allUsers = await getAllUsers(searchTerm);

      setUsers(allUsers);
    } catch (error) {
      setErrorMessage(error.response?.data.error || error.message);
    }
  };

  const handleUserStatus = async (userId, btn) => {
    try {
      if (btn === "active") {
        await activateUser(userId);
      } else {
        await blockUser(userId);
      }
      window.location.reload();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          `Failed to ${btn} user statues`,
      );
    }
  };

  useEffect(() => {
    fetchAllUsers(searchTerm);

    // Keybord shortcut ⌘+K
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchTerm]);
  return (
    <>
      <div className="w-full bg-base-100 border border-base-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex justify-center pt-2 pb-2">
          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              ref={searchRef}
              type="search"
              className="grow"
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <kbd className="kbd kbd-sm">⌘</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </label>
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
                      {capitalize(user.kycStatus)}
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
                      {capitalize(user.status)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col md:flex-row items-center justify-between md:justify-center md:col-span-3 mt-2 md:mt-0 gap-2">
                    <span className="md:hidden text-xs font-semibold opacity-50 uppercase w-full text-left mb-1">
                      Actions
                    </span>
                    <div className="flex gap-2 w-full md:w-auto justify-start md:justify-end">
                      {user.status === "active" ? (
                        <button
                          className="btn btn-xs btn-error text-white"
                          onClick={() => handleUserStatus(user._id, "block")}
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          className="btn btn-xs btn-info text-white"
                          onClick={() => handleUserStatus(user._id, "active")}
                        >
                          Active
                        </button>
                      )}
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() =>
                          navigate("/admin/kyc", {
                            state: {
                              userId: user._id,
                              name: user.name,
                              cpr: user.cpr,
                            },
                          })
                        }
                      >
                        KYC
                      </button>
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() =>
                          navigate("/admin/account-summary", {
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
