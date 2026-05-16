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

// Exported list so our main dropdown filter can generate options dynamically
export const ALL_ACTIONS = Object.keys(ACTION_BADGES);

export const ActionBadge = ({ action }) => {
  const badgeClass = ACTION_BADGES[action] || "badge-ghost";
  const cleanText = action.replace(/_/g, " "); // Swaps underscores for spaces
  return (
    <span className={`badge badge-sm font-mono ${badgeClass}`}>
      {cleanText}
    </span>
  );
};
