import React from "react";
import Tooltip from "../components/Tooltip";

/**
 * Variants control colors
 */
const VARIANTS = {
  success: {
    trueBg: "bg-emerald-50",
    trueText: "text-emerald-700",
    trueDot: "bg-emerald-500",

    falseBg: "bg-rose-50",
    falseText: "text-rose-700",
    falseDot: "bg-rose-500",
  },

  neutral: {
    trueBg: "bg-slate-100",
    trueText: "text-slate-700",
    trueDot: "bg-slate-500",

    falseBg: "bg-slate-100",
    falseText: "text-slate-500",
    falseDot: "bg-slate-400",
  },

  warning: {
    trueBg: "bg-amber-50",
    trueText: "text-amber-700",
    trueDot: "bg-amber-500",

    falseBg: "bg-slate-100",
    falseText: "text-slate-500",
    falseDot: "bg-slate-400",
  },
};

/**
 * Size control
 * md = DEFAULT (matches your section_type badge)
 */
const SIZES = {
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5", // DEFAULT
  lg: "text-sm px-3 py-1.5 gap-2",
};

export default function StatusBadge({
  value = false,
  trueText = "Active",
  falseText = "Inactive",
  variant = "success",
  size = "md", // DEFAULT
  showDot = true,
  className = "",
}) {
  const v = VARIANTS[variant] || VARIANTS.success;
  const sizeClass = SIZES[size] || SIZES.md;

  const bg = value ? v.trueBg : v.falseBg;
  const text = value ? v.trueText : v.falseText;
  const dot = value ? v.trueDot : v.falseDot;

  const label = value ? trueText : falseText;

  return (
    <Tooltip content={`Currently ${label.toLowerCase()}`}>
    <span
      role="status"
      aria-label={label}
      className={`
        inline-flex items-center rounded-md font-medium
        ${sizeClass}
        ${bg} ${text}
        ${className}
      `}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dot}`}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
    </Tooltip>
  );
}
