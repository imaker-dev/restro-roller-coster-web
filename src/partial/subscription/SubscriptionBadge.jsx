import React from "react";
import {
  Crown,
  Database,
  Gift,
  HelpCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Tooltip from "../../components/Tooltip";

const CONFIG = {
  status: {
    active: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      icon: CheckCircle,
      label: "Active",
    },

    trial: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-500",
      icon: Clock,
      label: "Trial",
    },

    expired: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      dot: "bg-rose-500",
      icon: XCircle,
      label: "Expired",
    },

    grace_period: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
      icon: Clock,
      label: "Grace Period",
    },

    cancelled: {
      bg: "bg-slate-100",
      text: "text-slate-700",
      dot: "bg-slate-500",
      icon: XCircle,
      label: "Cancelled",
    },
  },

  plan: {
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

    offline_annual: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      dot: "bg-orange-500",
      icon: Database,
      label: "Offline Annual",
    },
  },
};

const SIZES = {
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
};

export default function SubscriptionBadge({
  type = "status", // status | plan
  value = "",
  size = "md",
  showDot = false,
  showIcon = true,
  className = "",
}) {
  const group = CONFIG[type] || CONFIG.status;

  const item = group[value?.toLowerCase()] || {
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
    icon: HelpCircle,
    label: value || "Unknown",
  };

  const Icon = item.icon;
  const sizeClass = SIZES[size] || SIZES.md;

  const TYPE_LABELS = {
    status: "Subscription Status",
    plan: "Subscription Plan",
  };

  return (
    <Tooltip content={TYPE_LABELS[type]}>
      <span
        className={`
          inline-flex items-center rounded-md font-medium
          ${sizeClass}
          ${item.bg}
          ${item.text}
          ${className}
        `}
      >
        {showDot && (
          <span
            className={`h-1.5 w-1.5 rounded-full ${item.dot}`}
            aria-hidden="true"
          />
        )}

        {showIcon && <Icon className="h-3.5 w-3.5 opacity-80" />}

        {item.label}
      </span>
    </Tooltip>
  );
}
