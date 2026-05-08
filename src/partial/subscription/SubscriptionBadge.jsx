import React from "react";
import {
  CheckCircle2,
  Clock3,
  Ban,
  PauseCircle,
  AlertTriangle,
} from "lucide-react";
import Tooltip from "../../components/Tooltip";
import { formatText } from "../../utils/utils";

/**
 * Subscription Status Variant Configuration
 */
export const SUBSCRIPTION_VARIANTS = {
  active: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
    bar: "from-emerald-400 to-teal-400",
  },

  expired: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    icon: Ban,
    bar: "from-red-400 to-rose-400",
  },

  grace_period: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    icon: AlertTriangle,
    bar: "from-amber-400 to-orange-400",
  },

  inactive: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
    icon: Clock3,
    bar: "from-slate-300 to-slate-400",
  },

  suspended: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
    icon: PauseCircle,
    bar: "from-orange-400 to-red-400",
  },

  default: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
    icon: Clock3,
    bar: "from-slate-300 to-slate-400",
  },
};

/**
 * Size Variants
 */
const SIZES = {
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
};

export default function SubscriptionBadge({
  status,
  size = "md",
  showDot = false,
  showIcon = true,
  className = "",
}) {
  if (!status) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  const normalized = status.toLowerCase();
  const config =
    SUBSCRIPTION_VARIANTS[normalized] ||
    SUBSCRIPTION_VARIANTS.default;

  const sizeClass = SIZES[size] || SIZES.md;
  const Icon = config.icon;

  return (
    <Tooltip content={`Subscription ${formatText(status)}`}>
      <span
        role="status"
        aria-label={formatText(status)}
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
            aria-hidden="true"
          />
        )}

        {showIcon && (
          <Icon className="w-3.5 h-3.5 opacity-80" />
        )}

        {formatText(status)}
      </span>
    </Tooltip>
  );
}