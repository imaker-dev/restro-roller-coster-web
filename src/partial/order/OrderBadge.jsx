import React from "react";
import Tooltip from "../../components/Tooltip";

/**
 * Color + Label Config
 */
const CONFIG = {
  status: {
    completed: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "Completed",
    },
    billed: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "Billed",
    },
    served: {
      // ✅ NEW
      bg: "bg-teal-50",
      text: "text-teal-700",
      dot: "bg-teal-500",
      label: "Served",
    },
    preparing: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      dot: "bg-orange-500",
      label: "Preparing",
    },
    ready: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-500",
      label: "Ready",
    },

    sent_to_kitchen: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      dot: "bg-indigo-500",
      label: "Sent to Kitchen",
    },
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
      label: "Pending",
    },
    confirmed: {
      bg: "bg-sky-50",
      text: "text-sky-700",
      dot: "bg-sky-500",
      label: "Confirmed",
    },
    cancelled: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      dot: "bg-rose-500",
      label: "Cancelled",
    },
  },

  payment: {
    completed: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "Paid",
    },
    pending: {
      bg: "bg-amber-50", // optional tweak
      text: "text-amber-700",
      dot: "bg-amber-500",
      label: "Pending",
    },
    partial: {
      bg: "bg-blue-50", // changed
      text: "text-blue-700",
      dot: "bg-blue-500",
      label: "Partial",
    },

    unpaid: {
      // ✅ NEW
      bg: "bg-rose-50",
      text: "text-rose-700",
      dot: "bg-rose-500",
      label: "Unpaid",
    },
  },

  type: {
    dine_in: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      dot: "bg-indigo-500",
      label: "Dine In",
    },
    takeaway: {
      bg: "bg-teal-50",
      text: "text-teal-700",
      dot: "bg-teal-500",
      label: "Takeaway",
    },
    zomato: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      dot: "bg-rose-500",
      label: "Zomato",
    },
    swiggy: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      dot: "bg-orange-500",
      label: "Swiggy",
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

export default function OrderBadge({
  type = "status", // status | payment | type
  value = "",
  size = "md",
  showDot = true,
  className = "",
}) {
  const group = CONFIG[type] || CONFIG.status;
  const item = group[value] || {
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
    label: value?.replace("_", " ") || "Unknown",
  };

  const sizeClass = SIZES[size] || SIZES.md;

  const TYPE_LABELS = {
    status: "Order Status",
    payment: "Payment Status",
    type: "Order Type",
  };

  return (
    <Tooltip content={TYPE_LABELS[type] || "Badge"}>
      {" "}
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
