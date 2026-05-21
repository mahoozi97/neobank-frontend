import { useEffect, useState } from "react";
import { getUserTransactions } from "../../services/transaction";
import { Loading } from "../../components/Loading";
import { capitalize, formatDate, getStatusColor } from "../../utils/helper";
import { LoadMore } from "../../components/LoadMore";
import { Error } from "../../components/Error";

export const TransactionsList = ({ accountId }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState(null);
  const [date, setDate] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const status = ["success", "rejected"];
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await getUserTransactions(accountId, page, filter, date);
      const newTransactions = data.transactions;

      if (page === 1) {
        setTransactions(newTransactions);
      } else {
        setTransactions((prev) => [...prev, ...newTransactions]);
      }

      // equal 10 -> true else false
      setHasMore(newTransactions.length === 10);
    } catch (error) {
      console.log(error.response?.data.error || error.message);
      setErrorMessage(error.response?.data.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!accountId || accountId === "null") return;
    fetchTransactions();
  }, [page, filter, date]);

  const handleFilterChange = (e) => {
    if (e.target.id === "filter") {
      setFilter(e.target.value);
    } else {
      setDate(e.target.value);
    }
    setPage(1);
    setHasMore(true);
  };

  return (
    <>
      <div className="w-full bg-base-100 border border-base-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex space-x-2 justify-center p-4">
          <fieldset className="fieldset pl-4 w-30">
            <select
              defaultValue=""
              className="select"
              id="filter"
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              {status.map((s) => (
                <option key={s} value={s}>
                  {capitalize(s)}
                </option>
              ))}
            </select>
          </fieldset>

          <div className="pt-1">
            <input
              type="date"
              className="input"
              id="date"
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {transactions.length === 0 && !isLoading ? (
          <div className="p-10 text-center opacity-60 italic">
            No transactions found.
          </div>
        ) : (
          <>
            {/* Table Headers */}
            <div className="hidden md:grid grid-cols-9 gap-4 px-6 py-4 bg-base-200/40 text-sm font-semibold text-base-content/70 border-b border-base-200">
              <div className="col-span-3">Transfer Details</div>
              <div className="col-span-3 text-center">Status</div>
              <div className="col-span-3 text-right">Amount</div>
            </div>

            {/* Transaction List */}
            <ul className="divide-y divide-base-200">
              {transactions.map((trans) => {
                const isIncoming = trans.toAccount?._id === accountId;
                return (
                  <li
                    key={trans._id}
                    className="flex flex-col md:grid md:grid-cols-9 md:items-center gap-4 px-4 py-4 md:px-6 transition-colors bg-base-100 odd:bg-base-300 hover:bg-neutral-focus"
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
                        className={`badge tooltip tooltip-left tooltip-error badge-soft ${trans.status === "rejected" && "cursor-help"} badge-sm md:badge-md font-medium ${getStatusColor(
                          trans.status,
                        )}`}
                        data-tip={
                          trans.status === "rejected"
                            ? trans.rejectionReason
                            : null
                        }
                      >
                        {isIncoming ? "Received" : capitalize(trans.status)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between md:justify-end md:flex-col md:items-end md:col-span-3">
                      <span className="md:hidden text-xs font-semibold opacity-50 uppercase">
                        Amount
                      </span>
                      <div className="text-right">
                        <div className={`font-bold text-lg md:text-base`}>
                          {trans.amount}
                        </div>
                        <div className="hidden md:block text-xs opacity-50 mt-1">
                          {formatDate(trans.createdAt)}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}

              {/* Loading / Error  */}
              {isLoading && (
                <div className="p-10 text-center">
                  <Loading />
                </div>
              )}
              {errorMessage && <Error errorMessage={errorMessage} />}
            </ul>
          </>
        )}

        {/* Load More Button */}
        {hasMore && !isLoading && transactions?.length > 0 && (
          <LoadMore setPage={setPage} />
        )}
      </div>
    </>
  );
};
