import React from "react";
import { Crown, Gift, HelpCircle } from "lucide-react";
import Tooltip from "../../components/Tooltip";

/**
 * Plan Variants
 */
const PLAN_VARIANTS = {
  free: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-500",
    icon: Gift,
    label: "Free",
  },

  pro: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
    icon: Crown,
    label: "Pro",
  },

  default: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
    icon: HelpCircle,
    label: "Unknown",
  },
};

/**
 * Size Variants (keep same system)
 */
const SIZES = {
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
};

const PlanBadge = ({
  plan,
  size = "md",
  showDot = false,
  showIcon = true,
  className = "",
}) => {
  if (!plan) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  const normalized = plan.toLowerCase();
  const config = PLAN_VARIANTS[normalized] || PLAN_VARIANTS.default;

  const sizeClass = SIZES[size] || SIZES.md;
  const Icon = config.icon;

  return (
    <Tooltip content={`Plan: ${config.label}`}>
      <span
        className={`
          inline-flex items-center rounded-md font-medium
          ${sizeClass}
          ${config.bg} ${config.text}
          ${className}
        `}
      >
        {showDot && (
          <span
            className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
          />
        )}

        {showIcon && <Icon className="w-3.5 h-3.5 opacity-80" />}

        {config.label}
      </span>
    </Tooltip>
  );
};

export default PlanBadge;