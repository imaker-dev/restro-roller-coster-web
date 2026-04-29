import React from "react";
import {
  Crown,
  Shield,
  User,
  CreditCard,
  UserCog,
  ChefHat,
  Martini,
} from "lucide-react";
import Tooltip from "../../components/Tooltip";

/**
 * Role Variant Configuration
 */
const ROLE_VARIANTS = {
  admin: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    icon: Crown,
  },

  manager: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
    icon: Shield,
  },

  captain: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
    icon: UserCog,
  },

  cashier: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    icon: CreditCard,
  },

  kitchen: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    icon: ChefHat,
  },

  bartender: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-500",
    icon: Martini,
  },

  staff: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
    icon: User,
  },

  default: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
    icon: User,
  },
};

/**
 * Size Variants
 */
const SIZES = {
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5", // default
  lg: "text-sm px-3 py-1.5 gap-2",
};

export default function RoleBadge({
  role,
  size = "md",
  showDot = false,
  showIcon = true,
  className = "",
}) {
  if (!role) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  const normalized = role.toLowerCase();
  const config = ROLE_VARIANTS[normalized] || ROLE_VARIANTS.default;

  const sizeClass = SIZES[size] || SIZES.md;
  const Icon = config.icon;

  const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);

  return (
    <Tooltip content={`Assigned role ${label}`}> 
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
          aria-hidden="true"
        />
      )}

      {showIcon && <Icon className="w-3.5 h-3.5 opacity-80" />}

      {label}
    </span>
    </Tooltip>
  );
}
