import React from "react";
import Tooltip from "./Tooltip";

/**
 * Color presets
 */
const COLORS = {
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  orange: "bg-orange-50 text-orange-600",
  emerald: "bg-emerald-50 text-emerald-600",
  red: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
  slate: "bg-slate-100 text-slate-600",
};

/**
 * Sizes (match your pill style)
 */
const SIZES = {
  sm: "text-[11px] px-2 py-1 gap-1",
  md: "text-xs px-2.5 py-1.5 gap-1.5",
  lg: "text-sm px-3 py-2 gap-2",
};

export default function StatusPill({
  icon: Icon,
  label,
  value,
  count,
  color = "slate",
  size = "md",
  tooltip,
  className = "",
}) {
  const colorClass = COLORS[color] || COLORS.slate;
  const sizeClass = SIZES[size] || SIZES.md;

  const content = (
    <div
      className={`flex items-center rounded-xl ${sizeClass} ${colorClass} ${className}`}
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-2">
        {Icon && <Icon size={size === "lg" ? 14 : 12} />}

        <span className="font-medium capitalize">
          {label || value?.replace("_", " ") || "Unknown"}
        </span>
      </div>

      {/* RIGHT SIDE (COUNT) */}
      {count !== undefined && (
        <span className="ml-auto font-bold tabular-nums">{count}</span>
      )}
    </div>
  );

  return tooltip ? <Tooltip content={tooltip}>{content}</Tooltip> : content;
}
