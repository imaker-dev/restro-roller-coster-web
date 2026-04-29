import React from "react";

/**
 * TABLE STATUS STYLES
 */
const STATUS_STYLES = {
  available: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Available",
  },

  booked: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    label: "Booked",
  },

  occupied: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
    label: "Occupied",
  },

  running: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-500",
    label: "Running",
  },

  merged: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    label: "Merged",
  },

  inactive: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
    label: "Inactive",
  },

  default: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-500",
    label: "Unknown",
  },

  billing: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
    label: "Billing",
  },
};

/**
 * Size presets
 */
const SIZES = {
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
};

export default function TableStatusBadge({
  status = "available",
  isActive = 1,
  size = "md",
  showDot = true,
  className = "",
}) {
  // inactive override
  const finalStatus = isActive !== 1 ? "inactive" : status;

  const style = STATUS_STYLES[finalStatus] || STATUS_STYLES.default;
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <span
      role="status"
      aria-label={style.label}
      className={`
        inline-flex items-center rounded-md font-medium
        ${sizeClass}
        ${style.bg} ${style.text}
        ${className}
      `}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
          aria-hidden="true"
        />
      )}
      {style.label}
    </span>
  );
}
