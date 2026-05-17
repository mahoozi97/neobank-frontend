import { useEffect, useState } from "react";
import { getAuditLogs } from "../../services/admin";
import { formatDate } from "../../utils/helper";
import { Loading } from "../../components/Loading";

// Our badge dictionary and action list
const ACTION_BADGES = {
  login: "badge-success",
  failed_login: "badge-error",
  open_account: "badge-info",
  transfer: "badge-primary",
  transfer_failed: "badge-error",
  freeze_account: "badge-warning",
  unfreeze_account: "badge-success",
  kyc_upload: "badge-info",
  kyc_approved: "badge-success",
  kyc_rejected: "badge-error",
  blocked_user: "badge-error",
  activate_user: "badge-success",
  deleted_user: "badge-error",
  close_account: "badge-warning",
};
const ALL_ACTIONS = Object.keys(ACTION_BADGES);

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Filtering and Load More states
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalActions, setTotalActions] = useState(null);

  // Helper to format metadata safely for the DaisyUI data-tip attribute
  const formatTooltip = (metadata) => {
    if (!metadata || Object.keys(metadata).length === 0) return "No details";
    return Object.entries(metadata)
      .map(
        ([key, value]) =>
          `${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`,
      )
      .join("  |  ");
  };

  const fetchLogs = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await getAuditLogs(page, actionFilter);
      setTotalActions(data.total);

      const newLogs = data.logs;

      // If it's page 1, replace the list. If it's page 2+, append to the list.
      if (page === 1) {
        setLogs(newLogs);
      } else {
        setLogs((prev) => [...prev, ...newLogs]);
      }

      // If the backend returned fewer than 10 items, we've hit the end of the database
      setHasMore(newLogs.length === 10);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter]);

  // When changing the filter, reset back to page 1
  const handleFilterChange = (e) => {
    setActionFilter(e.target.value);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div className="w-full bg-base-100 border border-base-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 pb-4 px-6 bg-base-200/20 border-b border-base-200">
        <p className="text-base-content/60 text-sm font-medium order-2 sm:order-1">
          Total Events:{" "}
          <span className="text-base-content font-bold">
            {totalActions?.toLocaleString() ?? 0}
          </span>
        </p>

        <select
          className="select select-bordered w-full sm:max-w-xs order-1 sm:order-2"
          value={actionFilter}
          onChange={handleFilterChange}
        >
          <option value="">All Actions</option>
          {ALL_ACTIONS.map((action) => (
            <option key={action} value={action}>
              {action.replace(/_/g, " ").toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden md:grid grid-cols-10 gap-4 px-6 py-4 bg-base-200/40 text-sm font-semibold text-base-content/70 border-b border-base-200">
        <div className="col-span-2">Date / Time</div>
        <div className="col-span-2">User</div>
        <div className="col-span-2 text-center">Action</div>
        <div className="col-span-2 text-center">IP Address</div>
        <div className="col-span-2 text-center">Metadata</div>
      </div>

      {/* Logs List */}
      <ul className="divide-y divide-base-200">
        {logs?.length > 0
          ? logs.map((log) => {
              const metaCount = log.metadata
                ? Object.keys(log.metadata).length
                : 0;

              return (
                <li
                  key={log._id}
                  className="flex flex-col md:grid md:grid-cols-10 md:items-center gap-4 px-4 py-4 md:px-6 transition-colors bg-base-100 odd:bg-base-300 hover:bg-neutral-focus"
                >
                  {/* Date / Time */}
                  <div className="flex items-center gap-4 md:col-span-2">
                    <div className="text-base-content">
                      <div className="text-sm md:text-base font-medium">
                        {formatDate(log.createdAt).slice(4, 15)}
                      </div>
                      <div className="text-xs opacity-50">
                        {formatDate(log.createdAt).slice(16)}
                      </div>
                    </div>
                  </div>

                  <div className="md:hidden border-t border-base-200/50 my-1"></div>

                  {/* User */}
                  <div className="flex items-center justify-between md:justify-start md:col-span-2">
                    <span className="md:hidden text-xs font-semibold opacity-50 uppercase">
                      User
                    </span>
                    <div>
                      <div className="text-sm font-medium">
                        {log.userId?.name || "System"}
                      </div>
                      <div className="text-xs opacity-50">
                        {log.userId?.email || "—"}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between md:justify-center md:col-span-2">
                    <span className="md:hidden text-xs font-semibold opacity-50 uppercase">
                      Action
                    </span>
                    <span
                      className={`badge badge-soft badge-sm md:badge-md font-medium ${ACTION_BADGES[log.action] || "badge-ghost"}`}
                    >
                      {log.action.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* IP Address */}
                  <div className="flex items-center justify-between md:justify-center md:col-span-2">
                    <span className="md:hidden text-xs font-semibold opacity-50 uppercase">
                      IP Address
                    </span>
                    <span className="font-mono text-sm opacity-70">
                      {log.ipAddress}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between md:justify-center md:col-span-2">
                    <span className="md:hidden text-xs font-semibold opacity-50 uppercase">
                      Details
                    </span>
                    {metaCount > 0 ? (
                      <div
                        className="tooltip audit-tooltip tooltip-left tooltip-primary before:max-w-xs before:whitespace-pre-wrap"
                        data-tip={formatTooltip(log.metadata)}
                      >
                        <div className="badge badge-outline cursor-help hover:bg-base-200 transition-colors">
                          {metaCount} fields
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs opacity-30">—</span>
                    )}
                  </div>
                </li>
              );
            })
          : /* Empty State */
            !loading && (
              <div className="p-10 text-center opacity-60 italic">
                No audit logs found.
              </div>
            )}

        {/* Loading / Error  */}
        {loading && (
          <div className="p-10 text-center">
            <Loading />
          </div>
        )}
        {errorMessage && (
          <div className="p-4 text-center text-error font-medium">
            {errorMessage}
          </div>
        )}
      </ul>

      {/* Load More Button */}
      {hasMore && !loading && logs?.length > 0 && (
        <div className="flex justify-center p-6 bg-base-100 border-t border-base-200">
          <button
            className="btn btn-outline btn-sm w-full max-w-xs"
            onClick={() => setPage((p) => p + 1)}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};
