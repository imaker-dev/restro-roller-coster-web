import React from "react";
import {
  Banknote,
  CreditCard,
  Smartphone,
  IndianRupee,
  Wallet,
} from "lucide-react";
import { formatNumber, num } from "../../../utils/numberFormatter";

const PAY_META = {
  cash: { icon: Banknote, color: "#10b981", label: "Cash" },
  card: { icon: CreditCard, color: "#f59e0b", label: "Card" },
  upi: { icon: Smartphone, color: "#6366f1", label: "UPI" },
  wallet: { icon: Wallet, color: "#06b6d4", label: "Wallet" },
  split: { icon: Wallet, color: "#8b5cf6", label: "Split" },
  other:  { icon: IndianRupee, color: "#64748b", label: "Other" },
};

function PayRow({ type, amount, total }) {
  if (num(amount) === 0) return null;

  const meta = PAY_META[type] || PAY_META.other;
  const pct = total > 0 ? (num(amount) / total) * 100 : 0;
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
      <span className="text-[11px] font-bold text-slate-600 w-14 flex-shrink-0">
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
        {formatNumber(amount, true)}
      </span>

      {/* Percent */}
      <span className="text-[9.5px] text-slate-400 tabular-nums w-8 text-right">
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

export default PayRow;
