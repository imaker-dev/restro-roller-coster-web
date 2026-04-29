import React from "react";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

/**
 * Variants
 */
const VARIANTS = {
  info: {
    icon: Info,
    border: "border-sky-200",
    bg: "bg-sky-50/60",
    iconColor: "text-sky-600",
    accent: "from-sky-400 to-sky-600",
  },

  success: {
    icon: CheckCircle2,
    border: "border-emerald-200",
    bg: "bg-emerald-50/60",
    iconColor: "text-emerald-600",
    accent: "from-emerald-400 to-emerald-600",
  },

  warning: {
    icon: AlertTriangle,
    border: "border-amber-200",
    bg: "bg-amber-50/60",
    iconColor: "text-amber-600",
    accent: "from-amber-400 to-amber-600",
  },

  error: {
    icon: XCircle,
    border: "border-rose-200",
    bg: "bg-rose-50/60",
    iconColor: "text-rose-600",
    accent: "from-rose-400 to-rose-600",
  },
};

/**
 * Size Configurations
 */
const SIZES = {
  sm: {
    padding: "p-3",
    gap: "gap-3",
    icon: "w-4 h-4",
    title: "text-sm",
    description: "text-xs",
  },
  md: {
    padding: "p-4 sm:p-5",
    gap: "gap-4",
    icon: "w-5 h-5 sm:w-6 sm:h-6",
    title: "text-sm sm:text-base",
    description: "text-xs sm:text-sm",
  },
  lg: {
    padding: "p-6",
    gap: "gap-5",
    icon: "w-6 h-6 sm:w-7 sm:h-7",
    title: "text-base sm:text-lg",
    description: "text-sm sm:text-base",
  },
};

export default function InfoCard({
  title,
  description,
  type = "info",
  size = "md",
  className = "",
}) {
  const config = VARIANTS[type] || VARIANTS.info;
  const sizeConfig = SIZES[size] || SIZES.md;
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`
        relative overflow-hidden
        rounded-xl
        border ${config.border}
        ${config.bg}
        backdrop-blur-sm
        ${sizeConfig.padding}
        flex ${sizeConfig.gap}
        transition-all duration-200
        hover:shadow-md
        ${className}
      `}
    >
      {/* Accent Line */}
      <div
        className={`
          absolute left-0 top-0 h-full w-1
          bg-gradient-to-b ${config.accent}
        `}
      />

      {/* Icon */}
      <div className={`shrink-0 ${config.iconColor}`}>
        <Icon className={sizeConfig.icon} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4
            className={`
              font-semibold text-slate-900
              ${sizeConfig.title}
            `}
          >
            {title}
          </h4>
        )}

        {description && (
          <p
            className={`
              mt-1 text-slate-600 leading-relaxed
              ${sizeConfig.description}
            `}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}