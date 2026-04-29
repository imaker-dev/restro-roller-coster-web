import {
  Banknote,
  CreditCard,
  IndianRupee,
  Smartphone,
  Wallet,
} from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";

const PAY_META = {
  cash: { icon: Banknote, color: "#f59e0b", label: "Cash" },
  card: { icon: CreditCard, color: "#14b8a6", label: "Card" },
  upi: { icon: Smartphone, color: "#6366f1", label: "UPI" },
  wallet: { icon: Wallet, color: "#06b6d4", label: "Wallet" },
  split: { icon: Wallet, color: "#8b5cf6", label: "Split" },
  other: { icon: IndianRupee, color: "#64748b", label: "Other" },
};

function PaymentBar({ type, amount, count, total }) {
  const meta = PAY_META[type] || PAY_META.other;
  const ratio = total > 0 ? (amount / total) * 100 : 0;
  const Icon = meta.icon;

  return (
    <div className="flex items-center gap-3 py-1 lg:py-2 border-b border-gray-50 last:border-0">
      {/* Icon */}
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: meta.color + "15",
          border: "1px solid " + meta.color + "25",
        }}
      >
        <Icon size={12} style={{ color: meta.color }} />
      </div>

      {/* Label */}
      <span className="text-xs text-gray-600 w-12 shrink-0">{meta.label}</span>

      {/* Bar */}
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${ratio}%`,
            background: meta.color,
          }}
        />
      </div>

      {/* Percent */}
      <span className="text-[10px] text-gray-400 w-6 text-right shrink-0">
        {ratio.toFixed(0)}%
      </span>

      {/* Count */}
      {count !== undefined && (
        <span className="text-xs text-gray-400 shrink-0">({count})</span>
      )}

      {/* Amount */}
      <span className="text-xs font-semibold text-gray-800 w-[68px] text-right shrink-0">
        {formatNumber(amount, true)}
      </span>
    </div>
  );
}

export default PaymentBar;
