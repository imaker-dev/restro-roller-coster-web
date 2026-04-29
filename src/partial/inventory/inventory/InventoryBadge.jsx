import React from "react";
import Tooltip from "../../../components/Tooltip";

/**
 * Config for inventory badges (fixed colors)
 */
const INVENTORY_CONFIG = {
  purchase: {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
      label: "Pending",
    },
    approved: {
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
      label: "Approved",
    },
    confirmed: {
      bg: "bg-green-100",
      text: "text-green-800",
      dot: "bg-green-600",
      label: "Confirmed",
    }, // slightly different green
    rejected: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      dot: "bg-rose-500",
      label: "Rejected",
    },
    received: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-500",
      label: "Received",
    },
    cancelled: {
      bg: "bg-red-50",
      text: "text-red-700",
      dot: "bg-red-500",
      label: "Cancelled",
    },
  },
  payment: {
    paid: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "Paid",
    },
    partial: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-500",
      label: "Partial",
    },
    unpaid: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      dot: "bg-rose-500",
      label: "Unpaid",
    },
  },
  movement: {
    purchase: {
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
      label: "Purchase",
    },
    wastage: {
      bg: "bg-red-50",
      text: "text-red-700",
      dot: "bg-red-500",
      label: "Wastage",
    },
    adjustment: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      dot: "bg-yellow-500",
      label: "Adjustment",
    },
    sale: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-500",
      label: "Sale",
    },
    sale_reversal: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      dot: "bg-purple-500",
      label: "Sale Reversal",
    },
  },
};

/**
 * Sizes
 */
const SIZES = {
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
};

/**
 * Generates a pastel color dynamically based on a string (category)
 */
function getDynamicCategoryColor(category) {
  const colors = [
    "bg-sky-50 text-sky-700 dot:bg-sky-500",
    "bg-purple-50 text-purple-700 dot:bg-purple-500",
    "bg-pink-50 text-pink-700 dot:bg-pink-500",
    "bg-teal-50 text-teal-700 dot:bg-teal-500",
    "bg-orange-50 text-orange-700 dot:bg-orange-500",
  ];
  // simple hash to pick color based on category string
  const hash = category
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length].split(" ");
}

export default function InventoryBadge({
  type = "category", // category | purchase | payment | movement
  value = "",
  size = "md",
  showDot = true,
  className = "",
}) {
  let item;

if (type === "category") {
  item = {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
    label: value || "Unknown",
  };
} else {
    // fixed color from config
    const group = INVENTORY_CONFIG[type] || {};
    item = group[value?.toLowerCase()] || {
      bg: "bg-slate-100",
      text: "text-slate-600",
      dot: "bg-slate-400",
      label: value || "Unknown",
    };
  }

  const sizeClass = SIZES[size] || SIZES.md;

  const TYPE_LABELS = {
    category: "Inventory Category",
    purchase: "Purchase Order Status",
    payment: "Payment Status",
    movement: "Movement Type",
  };

  return (
    <Tooltip content={TYPE_LABELS[type] || "Badge"}>
      <span
        className={`
          inline-flex items-center rounded-md font-semibold capitalize
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
        {item.label}
      </span>
    </Tooltip>
  );
}
