import React from "react";
import Tooltip from "../../../components/Tooltip";

const CONFIG = {
  percentage: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
    tooltip: "Percentage Discount",
  },
  flat: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    tooltip: "Flat Discount",
  },
};

/**
 * Sizes (same as OrderBadge for consistency)
 */
const SIZES = {
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
};

export default function DiscountBadge({
  type = "percentage", // percentage | flat
  value = 0,
  size = "md", // ✅ NEW
  showDot = true,
  className = "",
}) {
  const item = CONFIG[type] || CONFIG.percentage;
  const sizeClass = SIZES[size] || SIZES.md;

  const label =
    type === "percentage"
      ? `${value}% OFF`
      : `₹${value} FLAT`;

  return (
    <Tooltip content={item.tooltip}>
      <span
        className={`
          inline-flex items-center rounded-md font-semibold
          ${sizeClass}
          ${item.bg} ${item.text}
          ${className}
        `}
      >
        {showDot && (
          <span
            className={`h-1.5 w-1.5 rounded-full ${item.dot}`}
            aria-hidden="true"
          />
        )}

        {label}
      </span>
    </Tooltip>
  );
}