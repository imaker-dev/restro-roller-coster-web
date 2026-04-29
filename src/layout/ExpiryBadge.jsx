import React from "react";
import Tooltip from "../components/Tooltip";

const EXPIRY_CONFIG = {
  expired: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    label: "Expired",
  },
  near: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    label: "Expiring Soon",
  },
  safe: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Fresh",
  },
  no_expiry: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
    label: "No Expiry",
  },
};

const SIZES = {
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
};

/**
 * Helper to calculate expiry status
 */
function getExpiryStatus(date, warningDays = 3) {
  if (!date) return "no_expiry";

  const expiry = new Date(date);
  if (isNaN(expiry.getTime())) return "no_expiry"; // invalid date safety

  const today = new Date();

  const diffTime = expiry - today;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "expired";
  if (diffDays <= warningDays) return "near";
  return "safe";
}

export default function ExpiryBadge({
  date,
  size = "md",
  showDot = true,
  warningDays = 3,
  className = "",
}) {
  const status = getExpiryStatus(date, warningDays);
  const item = EXPIRY_CONFIG[status];
  const sizeClass = SIZES[size] || SIZES.md;

  const tooltipText =
    status === "no_expiry"
      ? "No expiry date"
      : `Expiry Date: ${new Date(date).toLocaleDateString()}`;

  return (
    <Tooltip content={tooltipText}>
      <span
        className={`
          inline-flex items-center rounded-md font-semibold
          ${sizeClass}
          ${item.bg} ${item.text}
          ${className}
        `}
      >
        {showDot && (
          <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
        )}
        {item.label}
      </span>
    </Tooltip>
  );
}