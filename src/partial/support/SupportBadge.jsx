import React from "react";
import Tooltip from "../../components/Tooltip";

/**
 * Status Config
 */
const STATUS_CONFIG = {
  urgent: {
    label: "Urgent",
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  open: {
    label: "Open",
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  resolved: {
    label: "Resolved",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  closed: {
    label: "Closed",
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
    dot: "bg-gray-400",
  },
};

/**
 * Sizes (md = your current exact UI)
 */
const SIZES = {
  xs: {
    text: "text-[8px]",
    padding: "px-1 py-[2px]",
    gap: "gap-0.5",
    dot: "w-1 h-1",
  },
  sm: {
    text: "text-[9px]",
    padding: "px-1.5 py-0.5",
    gap: "gap-1",
    dot: "w-1 h-1",
  },
  md: {
    text: "text-[10px]",
    padding: "px-2 py-0.5",
    gap: "gap-1",
    dot: "w-1.5 h-1.5",
  },
  lg: {
    text: "text-xs",
    padding: "px-2.5 py-1",
    gap: "gap-1.5",
    dot: "w-2 h-2",
  },
};

/**
 * Tooltip Labels
 */
const TOOLTIP = {
  urgent: "Needs immediate attention",
  open: "Currently active ticket",
  resolved: "Issue resolved",
  closed: "Ticket closed",
};

/**
 * Component
 */
const SupportBadge = ({
  status = "open",
  size = "md",
  className = "",
}) => {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  const sz = SIZES[size] || SIZES.md;

  return (
    <Tooltip content={TOOLTIP[status] || "Ticket Status"}>
      <span
        className={`
          inline-flex items-center rounded-full border capitalize font-bold
          ${sz.text} ${sz.padding} ${sz.gap}
          ${s.bg} ${s.text} ${s.border}
          ${className}
        `}
      >
        {/* Dot */}
        <span
          className={`${sz.dot} rounded-full ${s.dot}`}
          aria-hidden="true"
        />

        {/* Label */}
        {s.label}
      </span>
    </Tooltip>
  );
};

export default SupportBadge;