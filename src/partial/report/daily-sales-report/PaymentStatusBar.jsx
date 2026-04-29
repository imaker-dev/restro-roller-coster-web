import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  IndianRupee,
} from "lucide-react";
import { formatNumber, num } from "../../../utils/numberFormatter";

const STATUS_META = {
  completed: { icon: CheckCircle2, color: "#10b981", label: "Completed" },
  pending: { icon: Clock, color: "#f59e0b", label: "Pending" },
  partial: { icon: AlertCircle, color: "#3b82f6", label: "Partial" }, // added
  failed: { icon: XCircle, color: "#ef4444", label: "Failed" },
  refunded: { icon: AlertCircle, color: "#6366f1", label: "Refunded" },
  other: { icon: IndianRupee, color: "#64748b", label: "Other" },
};

function PaymentStatusBar({ status, amount, count, total }) {
  const safeAmount = num(amount);
  const safeCount = num(count);
  const safeTotal = num(total);

  if (safeAmount === 0 && safeCount === 0) return null;

  const meta = STATUS_META[status] || STATUS_META.other;
  const pct = safeTotal > 0 ? (safeAmount / safeTotal) * 100 : 0;
  const Icon = meta.icon;

  return (
    <div className="flex items-center gap-2.5 py-2.5 border-b border-slate-100 last:border-0">
      {/* Icon */}
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

      {/* Amount */}
      <span className="text-[11px] font-black text-slate-700 tabular-nums w-20 text-right">
        {formatNumber(safeAmount, true)}
      </span>

      {/* Count */}
      <span className="text-[9.5px] text-slate-400 tabular-nums w-10 text-right">
        {safeCount}
      </span>
    </div>
  );
}

export default PaymentStatusBar;
