import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  CreditCard,
  Hash,
  Phone,
  ReceiptText,
  XCircle,
} from "lucide-react";
import { formatNumber } from "../../../utils/numberFormatter";
import { formatDate } from "../../../utils/dateFormatter";
import { Link } from "react-router-dom";
import InventoryBadge from "../inventory/InventoryBadge";
import { ROUTE_PATHS } from "../../../config/paths";

/* ─── Purchase card ───────────────────────────────────────────────────────── */
export function PurchaseCard({ purchase, onPay, onCancel }) {
  const duePercent =
    purchase.totalAmount > 0
      ? Math.round((purchase.paidAmount / purchase.totalAmount) * 100)
      : 0;

  const isCancelled = purchase.status?.toLowerCase() === "cancelled";
  const isPaid = purchase.paymentStatus?.toLowerCase() === "paid";
  const canPay = !isCancelled && !isPaid && purchase.dueAmount > 0;
  const canCancel = !isCancelled;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-200 hover:shadow-md transition-all duration-200 group flex flex-col">
      <div className="px-5 py-4 flex-1">
        {/* Top row: avatar + info + total */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isCancelled ? "bg-slate-200" : "bg-slate-900"}`}
            >
              <span className="text-sm font-bold text-white uppercase">
                {purchase.vendorName?.charAt(0) ?? "V"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-slate-900 truncate mb-1">
                {purchase.vendorName}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <InventoryBadge type="purchase" value={purchase.status} />
                <InventoryBadge type="payment" value={purchase.paymentStatus} />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <p className="text-base font-extrabold text-slate-900 tabular-nums">
              {formatNumber(purchase.totalAmount, true)}
            </p>
            <Link
              to={`${ROUTE_PATHS.PURCHASE_ORDERS_DETAILS}?purchaseId=${purchase.id}`}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-100 px-2 py-1 rounded-lg transition-all"
            >
              View <ArrowUpRight size={10} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
          <div className="flex items-center gap-1">
            <Hash size={10} className="text-slate-400" strokeWidth={2} />
            <span className="text-[11px] font-semibold text-slate-500">
              {purchase.purchaseNumber}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ReceiptText size={10} className="text-slate-400" strokeWidth={2} />
            <span className="text-[11px] font-medium text-slate-400">
              {purchase.invoiceNumber}
            </span>
          </div>
          {purchase.vendorPhone && (
            <div className="flex items-center gap-1">
              <Phone size={10} className="text-slate-400" strokeWidth={2} />
              <span className="text-[11px] font-medium text-slate-400">
                {purchase.vendorPhone}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <CalendarDays
              size={10}
              className="text-slate-400"
              strokeWidth={2}
            />
            <span className="text-[11px] font-medium text-slate-400">
              {formatDate(purchase.purchaseDate, "long")}
            </span>
          </div>
        </div>

        {/* Amount breakdown */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            {
              label: "Subtotal",
              value: formatNumber(purchase.subtotal, true),
              color: "text-slate-700",
            },
            {
              label: "Paid",
              value: formatNumber(purchase.paidAmount, true),
              color: "text-emerald-600",
            },
            {
              label: "Due",
              value: formatNumber(purchase.dueAmount, true),
              color: purchase.dueAmount > 0 ? "text-red-600" : "text-slate-500",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2"
            >
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {label}
              </p>
              <p className={`text-sm font-extrabold tabular-nums ${color}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Payment progress */}
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Payment Progress
            </span>
            <span
              className={`text-[10px] font-bold ${duePercent === 100 ? "text-emerald-600" : "text-amber-600"}`}
            >
              {duePercent}% paid
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${duePercent === 100 ? "bg-emerald-500" : "bg-amber-400"}`}
              style={{ width: `${duePercent}%` }}
            />
          </div>
        </div>

        {/* Items + created by */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Building2 size={10} className="text-slate-400" strokeWidth={2} />
              <span className="text-[11px] font-medium text-slate-400">
                {purchase.itemCount} item{purchase.itemCount !== 1 ? "s" : ""}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              · {purchase.createdByName}
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            {formatDate(purchase.createdAt, "long")}
          </span>
        </div>
      </div>

      {/* ── Action footer ── */}
      {(canPay || canCancel) && (
        <div className="flex border-t border-slate-100">
          {canPay && (
            <button
              onClick={(e) => {
                (e.stopPropagation(), onPay(purchase));
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all duration-150 border-r border-slate-100"
            >
              <CreditCard size={12} strokeWidth={2.5} />
              Record Payment
            </button>
          )}
          {canCancel && (
            <button
              onClick={(e) => {
                (e.stopPropagation(), onCancel(purchase));
              }}
              className={`flex items-center justify-center gap-1.5 py-3 text-[11px] font-bold text-red-500 hover:bg-red-50 hover:text-red-700 transition-all duration-150 ${canPay ? "px-4" : "flex-1"}`}
            >
              <XCircle size={12} strokeWidth={2.5} />
              {canPay ? "" : "Cancel Order"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
