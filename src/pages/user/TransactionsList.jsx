import { useEffect, useState } from "react";
import { getUserTransactions } from "../../services/transaction";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "success":
      return "badge-success";
    case "pending":
      return "badge-warning";
    case "rejected":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleString("en-GB", {
    timeZone: "Asia/Bahrain",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const TransactionsList = ({ accountId }) => {
  const [transactions, setTransactions] = useState(null);
  const [filter, setFilter] = useState(null);
  const [date, setDate] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const status = ["success", "rejected"];

  const fetchTransactions = async (status, date) => {
    try {
      const data = await getUserTransactions(accountId, status, date);
      setTransactions(data);
    } catch (error) {
      console.log(error.response?.data.error || error.message);
      setErrorMessage(error.response?.data.error || error.message);
    }
  };

  useEffect(() => {
    if (!accountId || accountId === "null") return;
    fetchTransactions(filter, date);
  }, [accountId, filter, date]);

  return (
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
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-base-200/40 text-sm font-semibold text-base-content/70 border-b border-base-200">
        <div className="col-span-6">Transfer Details</div>
        <div className="col-span-3 text-center">Status</div>
        <div className="col-span-3 text-right">Amount</div>
      </div>

      {/* Transaction List */}
      <ul className="divide-y divide-base-200">
        {transactions ? (
          transactions.length > 0 ? (
            transactions.map((trans) => {
              const isIncoming = trans.toAccount?._id === accountId;

              return (
                <li
                  key={trans._id}
                  className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 px-4 py-4 md:px-6 hover:bg-base-200/30 transition-colors cursor-pointer"
                >
                  {/* Details */}
                  <div className="flex items-center gap-4 md:col-span-6">
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
              <span className="loading loading-infinity loading-xl"></span>
            )}
          </div>
        )}
      </ul>
    </div>
  );
};
