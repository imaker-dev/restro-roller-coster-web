import React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import Tooltip from "../../components/Tooltip";

/**
 * Status Variants
 */
const STATUS_VARIANTS = {
  approved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    icon: CheckCircle,
  },

  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    icon: Clock,
  },

  rejected: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    icon: XCircle,
  },

  default: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
    icon: Clock,
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

const RegistrationStatusBadge = ({
  status,
  size = "md",
  showDot = false,
  showIcon = true,
  className = "",
}) => {
  if (!status) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  const normalized = status.toLowerCase();
  const config = STATUS_VARIANTS[normalized] || STATUS_VARIANTS.default;

  const sizeClass = SIZES[size] || SIZES.md;
  const Icon = config.icon;

  const label =
    normalized.charAt(0).toUpperCase() + normalized.slice(1);

  return (
    <Tooltip content={`Status: ${label}`}>
      <span
        role="status"
        aria-label={label}
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

        {label}
      </span>
    </Tooltip>
  );
};

export default RegistrationStatusBadge;