import React from "react";
import {
  Banknote,
  CreditCard,
  Smartphone,
  Wallet,
  HelpCircle,
} from "lucide-react";
import Tooltip from "../../components/Tooltip";

/**
 * Payment Variants
 */
const PAYMENT_VARIANTS = {
  cash: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    icon: Banknote,
  },

  card: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    icon: CreditCard,
  },

  upi: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
    icon: Smartphone,
  },

  wallet: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    icon: Wallet,
  },

  default: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
    icon: HelpCircle,
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

const ICON_SIZES = {
  sm: "w-3 h-3",      // smaller
  md: "w-3.5 h-3.5",  // current
  lg: "w-4 h-4",      // bigger
};

export default function PaymentTypeBadge({
  type,
  size = "md",
  showDot = false,
  showIcon = true,
  className = "",
}) {
  if (!type) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  const normalized = type.toLowerCase();

  const config =
    PAYMENT_VARIANTS[normalized] || PAYMENT_VARIANTS.default;

  const sizeClass = SIZES[size] || SIZES.md;
  const iconSizeClass = ICON_SIZES[size] || ICON_SIZES.md;
  const Icon = config.icon;

  const label =
    normalized === "upi"
      ? "UPI"
      : normalized.charAt(0).toUpperCase() + normalized.slice(1);

  return (
    <Tooltip content={`Payment via ${label}`}>
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

        {showIcon && (
          <Icon className={`${iconSizeClass} opacity-80`} />
        )}

        {label}
      </span>
    </Tooltip>
  );
}