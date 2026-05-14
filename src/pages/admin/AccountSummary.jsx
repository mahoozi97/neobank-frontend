import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  formatDate,
  formattedAmount,
  getStatusColor,
  ibanFormat,
} from "../../utils/helper";
import { Loading } from "../../components/Loading";
import { getAccountByUserId, getAllTransactions } from "../../services/admin";

export const AccountSummary = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [filter, setFilter] = useState(null);
  const [date, setDate] = useState();
  const status = ["success", "rejected"];

  const fetchAccountSummary = async () => {
    try {
      const accountData = await getAccountByUserId(userId);
      setAccount(accountData);
      return accountData;
    } catch (error) {
      setErrorMessage(error.response?.data.error || error.message);
    }
  };

  const fetchAccountTransactions = async (status, date) => {
    try {
      const accountData = await fetchAccountSummary();
      const transData = await getAllTransactions(accountData._id, status, date);
      setTransactions(transData);
    } catch (error) {
      setErrorMessage(error.response?.data.error || error.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      fetchAccountSummary();
      fetchAccountTransactions(filter, date);
    };

    loadData();
  }, [filter, date]);
  return (
    <>
      <div className="flex flex-col items-center gap-1">
        {account ? (
          <>
            <div className="card bg-success text-neutral-content w-80 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <div className="badge badge-outline">{account.type}</div>
                  <div className="badge badge-success gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {account.status}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-accent-content mb-1">
                    Available balance
                  </p>
                  <p className="text-3xl font-semibold">
                    {formattedAmount(account.balance)}
                  </p>
                  <p className="text-sm text-accent-content mt-1">
                    Bahraini Dinar · BHD
                  </p>
                </div>

                <div className="divider my-0"></div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-accent-content">Nickname</span>
                    <span className="font-medium">{account.nickname}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-accent-content">IBAN</span>
                    <span className="font-mono ">
                      {ibanFormat(account.iban)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center card-actions mt-2">
                  {/* close account action here  */}

                  {errorMessage && (
                    <p className="text-error bg-white pl-1 rounded-2xl">
                      {errorMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <Loading />
        )}

        <div className="divider"></div>

        {/* Transactions....... */}
        <div className="w-full bg-base-100 border border-base-200 rounded-2xl shadow-sm overflow-hidden">
          {transactions ? (
            <div className="flex space-x-2 justify-center">
              <fieldset className="fieldset pl-4 w-30">
                <select
                  defaultValue="sort by"
                  className="select"
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option disabled={true}>sort by</option>
                  <option value="">All</option>
                  {status.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </fieldset>

              <div className="pt-1">
                <input
                  type="date"
                  className="input"
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          ) : null}
          <div className="hidden md:grid grid-cols-9 gap-4 px-6 py-4 bg-base-200/40 text-sm font-semibold text-base-content/70 border-b border-base-200">
            {/* ------------------------------------------------------- */}
            <div className="col-span-3">Transfer Details</div>
            <div className="col-span-3 text-center">Status</div>
            <div className="col-span-3 text-right">Amount</div>
          </div>

          {/* Transaction List */}
          <ul className="divide-y divide-base-200">
            {transactions ? (
              transactions.length > 0 ? (
                transactions.map((trans) => {
                  const isIncoming = trans.toAccount?._id === account._id;

                  return (
                    <li
                      key={trans._id}
                      className="flex flex-col md:grid md:grid-cols-9 md:items-center gap-4 px-4 py-4 md:px-6 transition-colors cursor-pointer bg-base-100 odd:bg-base-300 hover:bg-neutral-focus"
                    >
                      {/* Details */}
                      <div className="flex items-center gap-4 md:col-span-3">
                        <div className="avatar placeholder shrink-0">
                          {isIncoming ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-5 text-info"
                            >
                              <path d="M17 7L7 17" />
                              <polyline points="17 17 7 17 7 7" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-5"
                            >
                              <path d="M7 17L17 7" />
                              <polyline points="7 7 17 7 17 17" />
                            </svg>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="font-bold text-base-content text-sm md:text-base flex items-center gap-2">
                            {trans.fromAccount?.nickname}
                            <span className="text-xs opacity-30">▶</span>
                            {trans.toAccount?.nickname || "Unknown"}
                          </div>

                          <div className="text-xs opacity-60 font-medium mt-0.5 flex items-center gap-2">
                            <span className="md:hidden">
                              {formatDate(trans.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="md:hidden border-t border-base-200/50 my-1"></div>

                      <div className="flex items-center justify-between md:justify-center md:col-span-3">
                        <span className="md:hidden text-xs font-semibold opacity-50 uppercase">
                          Status
                        </span>
                        <span
                          className={`badge tooltip tooltip-left tooltip-error badge-soft badge-sm md:badge-md font-medium ${getStatusColor(
                            trans.status,
                          )}`}
                          data-tip={
                            trans.status === "rejected"
                              ? trans.rejectionReason
                              : null
                          }
                        >
                          {isIncoming ? "Received" : trans.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between md:justify-end md:flex-col md:items-end md:col-span-3">
                        <span className="md:hidden text-xs font-semibold opacity-50 uppercase">
                          Amount
                        </span>
                        <div className="text-right">
                          {/* Apply green text if incoming, otherwise standard text */}
                          <div className={`font-bold text-lg md:text-base `}>
                            {trans.amount}
                          </div>
                          {/* Desktop Date (Hidden on Mobile) */}
                          <div className="hidden md:block text-xs opacity-50 mt-1">
                            {formatDate(trans.createdAt)}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                /* Empty State if Array is 0 */
                <div className="p-10 text-center opacity-60 italic">
                  No transactions found for this account.
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
      </div>
    </>
  );
};
