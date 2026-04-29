import React from "react";
import { Utensils, Wine } from "lucide-react";
import { SERVICE_TYPES } from "../../constants";

/**
 * Variant Styles
 */
const VARIANTS = {
  default: {
    restaurant: "bg-emerald-50 text-emerald-700 ",
    bar: "bg-amber-50 text-amber-700 ",
    both: "bg-purple-50 text-purple-700 ",
  },
};

/**
 * Size Control
 */
const SIZES = {
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
};

export default function ServiceTypeBadge({
  value = SERVICE_TYPES.BOTH,
  variant = "default",
  size = "md",
  className = "",
}) {
  const sizeClass = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.default;

  const normalized = Array.isArray(value)
    ? value
    : value === SERVICE_TYPES.BOTH
      ? [SERVICE_TYPES.RESTAURANT, SERVICE_TYPES.BAR]
      : [value];

  const isBoth =
    normalized.includes(SERVICE_TYPES.RESTAURANT) &&
    normalized.includes(SERVICE_TYPES.BAR);

  const styles = isBoth
    ? v.both
    : normalized[0] === SERVICE_TYPES.RESTAURANT
      ? v.restaurant
      : v.bar;

  const label = isBoth
    ? "Restaurant + Bar"
    : normalized[0] === SERVICE_TYPES.RESTAURANT
      ? "Restaurant"
      : "Bar";

  return (
    <span
      role="status"
      aria-label={label}
      className={`
        inline-flex items-center rounded-md font-medium
        ${sizeClass}
        ${styles}
        ${className}
      `}
    >
      {normalized.includes(SERVICE_TYPES.RESTAURANT) && <Utensils size={14} />}

      {normalized.includes(SERVICE_TYPES.BAR) && <Wine size={14} />}

      {label}
    </span>
  );
}
