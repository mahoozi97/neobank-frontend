import { useState } from "react";
import { getAuditLogs } from "../../services/admin";
import { LogRow } from "../../components/LogRow";
import { Pagination } from "../../components/Pagination";
import { ALL_ACTIONS } from "../../components/ActionBadge";
import { useEffect } from "react";

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Flat individual states are much easier to trace than combined object states
  const [actionFilter, setActionFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLogsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getAuditLogs(currentPage, actionFilter);
        // console.log(result);

        // Maps directly to your Backend res.json payload structure
        setLogs(result.data);
        setPagination(result.pagination);
      } catch (err) {
        setError(
          err.response?.data?.error || err.message || "Failed to fetch logs",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLogsData();
  }, [currentPage, actionFilter]); // Triggers API call on changes

  const handleFilterChange = (e) => {
    setActionFilter(e.target.value);
    setCurrentPage(1); // Crucial: Reset to page 1 when filtering down results
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      {/* Header and Filter Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-base-content/50 text-sm mt-0.5">
            {pagination.total?.toLocaleString() ?? 0} total events
          </p>
        </div>

        <select
          className="select select-bordered select-sm w-52"
          value={actionFilter}
          onChange={handleFilterChange}
        >
          <option value="">All actions</option>
          {ALL_ACTIONS.map((action) => (
            <option key={action} value={action}>
              {action.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Network/API Error Alerts */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Table Structure */}
      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead className="bg-base-200/60">
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>IP Address</th>
                <th>Metadata</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <span className="loading loading-spinner loading-md text-primary" />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-16 text-base-content/40"
                  >
                    No logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => <LogRow key={log._id} log={log} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-file isolated pagination component hook-up */}
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.pages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
