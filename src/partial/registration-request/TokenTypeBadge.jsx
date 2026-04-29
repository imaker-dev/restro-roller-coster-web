import React from "react";
import { ArrowUpCircle, Zap, Clock } from "lucide-react";
import Tooltip from "../../components/Tooltip";

/**
 * Token Type Variants
 */
const TOKEN_VARIANTS = {
  activation: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    icon: Zap,
    label: "Activation",
  },

  upgrade: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    icon: ArrowUpCircle,
    label: "Upgrade",
  },

  default: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
    icon: Clock,
    label: "Unknown",
  },
};

/**
 * Size Variants (same as your existing system)
 */
const SIZES = {
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
};

const TokenTypeBadge = ({
  type,
  size = "md",
  showDot = false,
  showIcon = true,
  className = "",
}) => {
  if (!type) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  const normalized = type.toLowerCase();
  const config = TOKEN_VARIANTS[normalized] || TOKEN_VARIANTS.default;

  const sizeClass = SIZES[size] || SIZES.md;
  const Icon = config.icon;

  return (
    <Tooltip content={`Token Type: ${config.label}`}>
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

export default TokenTypeBadge;