import React from "react";
import { Utensils, ShoppingBag, Truck, XCircle, Hash } from "lucide-react";
import { num } from "../../../utils/numberFormatter";

const ORDER_META = {
  dine_in: {
    icon: Utensils,
    color: "#6366f1",
    label: "Dine-In",
  },
  takeaway: {
    icon: ShoppingBag,
    color: "#f59e0b",
    label: "Takeaway",
  },
  delivery: {
    icon: Truck,
    color: "#06b6d4",
    label: "Delivery",
  },
  cancelled: {
    icon: XCircle,
    color: "#f43f5e",
    label: "Cancelled",
  },
  other: {
    icon: Hash,
    color: "#64748b",
    label: "Other",
  },
};

function OrderTypeBar({ type, value, total }) {
  const safeValue = num(value);
  const safeTotal = num(total);

  if (safeValue === 0) return null;

  const meta = ORDER_META[type] || ORDER_META.other;
  const pct = safeTotal > 0 ? (safeValue / safeTotal) * 100 : 0;
  const Icon = meta.icon;

  return (
    <div className="flex items-center gap-2.5 py-2.5 border-b border-slate-100 last:border-0">
      {/* Icon bubble */}
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: meta.color + "15",
          border: "1px solid " + meta.color + "25",
        }}
      >
        <Icon size={11} strokeWidth={2} style={{ color: meta.color }} />
      </div>

      {/* Label */}
      <span className="text-[11px] font-bold text-slate-600 w-16 flex-shrink-0 capitalize">
        {meta.label}
      </span>

      {/* Progress */}
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: pct + "%", background: meta.color }}
        />
      </div>

      {/* Count */}
      <span className="text-[11px] font-black text-slate-700 tabular-nums w-8 text-right">
        {safeValue}
      </span>

      {/* Percent */}
      <span className="text-[9.5px] text-slate-400 tabular-nums w-8 text-right">
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

export default OrderTypeBar;