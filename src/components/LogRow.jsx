import { useState } from "react";
import { ActionBadge } from "./ActionBadge";
import { MetadataViewer } from "./MetadataViewer";
import { formatDate } from "../utils/helper";

export const LogRow = ({log}) => {
  // Localized state: only this specific row opens/closes when clicked
  const [expanded, setExpanded] = useState(false);
  const hasMetadata = log.metadata && Object.keys(log.metadata).length > 0;
  return (
    <>
      {/* Clickable Data Row */}
      <tr
        className={`hover:bg-base-200 transition-colors cursor-pointer ${expanded ? "bg-base-200" : ""}`}
        onClick={() => hasMetadata && setExpanded(!expanded)}
      >
        {/* Date formatting */}
        <td className="whitespace-nowrap">
          <div className="text-sm font-medium">
            {formatDate(log.createdAt).slice(4,15)}
          </div>
          <div className="text-xs text-base-content/50">
            {formatDate(log.createdAt).slice(16)}
          </div>
        </td>

        {/* User profile section */}
        <td>
          <div className="flex items-center gap-2">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-7">
                <span className="text-xs">
                  {log.userId?.name?.charAt(0)?.toUpperCase() ?? "?"}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">
                {log.userId?.name ?? "Unknown"}
              </div>
              <div className="text-xs text-base-content/50">
                {log.userId?.email ?? "—"}
              </div>
            </div>
          </div>
        </td>

        {/* Action Column */}
        <td>
          <ActionBadge action={log.action} />
        </td>

        {/* IP Address */}
        <td className="font-mono text-xs text-base-content/70">
          {log.ipAddress}
        </td>

        {/* Metadata Toggle Badge */}
        <td>
          {hasMetadata ? (
            <button
              className="btn btn-xs btn-ghost"
              onClick={(e) => {
                e.stopPropagation(); // Prevents clicking the button from firing the row's click handler twice
                setExpanded(!expanded);
              }}
            >
              {Object.keys(log.metadata).length} fields
            </button>
          ) : (
            <span className="text-xs text-base-content/30">—</span>
          )}
        </td>
      </tr>

      {/* Conditional Extra Row for Metadata details */}
      {expanded && hasMetadata && (
        <tr className="bg-base-300/40">
          <td colSpan={5} className="py-3 px-6">
            <div className="flex items-start gap-3">
              <span className="badge badge-xs badge-outline mt-0.5 shrink-0">
                metadata
              </span>
              <MetadataViewer metadata={log.metadata} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
