export const MetadataViewer = ({ metadata }) => {
  // Guard clause: if empty or missing, show basic placeholder
  if (!metadata || Object.keys(metadata).length === 0) {
    return (
      <span className="text-base-content/40 text-xs italic">No metadata</span>
    );
  }
  return (
    <div className="space-y-1">
      {Object.entries(metadata).map(([key, value]) => (
        <div key={key} className="flex gap-2 text-xs">
          <span className="font-mono text-primary font-semibold shrink-0">
            {key}:
          </span>
          <span className="font-mono text-base-content/70 break-all">
            {/* If nested object, stringify it, otherwise print normal primitive values */}
            {typeof value === "object" ? JSON.stringify(value) : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
};
