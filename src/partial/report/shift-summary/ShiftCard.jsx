import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  Lock,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Unlock,
  User,
  Wallet,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  formatDate,
  formatDurationBetween,
} from "../../../utils/dateFormatter";
import { formatNumber, num } from "../../../utils/numberFormatter";
import StatusBadge from "../../../layout/StatusBadge";
import { ROUTE_PATHS } from "../../../config/paths";

// ─── Cash row ─────────────────────────────────────────────────────────────────
function CashRow({ label, value, dim }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-[11px] text-slate-500 font-medium">{label}</span>
      <span
        className={`text-[12px] font-black tabular-nums ${dim ? "text-slate-400" : "text-slate-800"}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Shift card ───────────────────────────────────────────────────────────────
export default function ShiftCard({ shift }) {
  const isOpen = shift.status === "open";
  const duration = formatDurationBetween(shift.openingTime, shift.closingTime);
  const variance = num(shift.cashVariance);
  const navigate = useNavigate();
  return (
    <div
      onClick={() =>
        navigate(
          `${ROUTE_PATHS.REPORTS_SHIFT_HISTORY_DETAILS}?shiftId=${shift?.id}`,
        )
      }
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.10)]"
      style={{
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        animation: "shUp 0.4s ease both",
      }}
    >
      {/* ── Colored top bar: green = open, slate = closed ── */}
      <div
        className="h-1"
        style={{
          background: isOpen
            ? "linear-gradient(90deg,#16a34a,#15803d)" // green
            : "linear-gradient(90deg,#ef4444,#b91c1c)", // red
        }}
      />

      <div className="p-5">
        {/* ── Header: avatar + name + status ── */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0
              transition-transform duration-200 group-hover:scale-105"
            >
              <User size={18} className="text-white" strokeWidth={1.9} />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-black text-slate-900 truncate leading-tight">
                {shift?.cashierName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Layers size={9} className="text-slate-400" strokeWidth={2} />
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  {shift?.floorName}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* status badge */}
            <StatusBadge value={isOpen} trueText="Open" falseText="Closed" />

            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
              <ChevronRight
                size={12}
                className="text-slate-400"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>

        {/* ── Time block ── */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* opened */}
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Unlock size={9} className="text-emerald-600" strokeWidth={2.5} />
              <p className="text-[8px] font-black text-emerald-600 uppercase tracking-wider">
                Opened
              </p>
            </div>
            <p className="text-[15px] font-black text-emerald-900 tabular-nums leading-none">
              {formatDate(shift?.openingTime, "time") || "—"}
            </p>
            <p className="text-[9px] text-emerald-700 font-medium mt-0.5">
              {formatDate(shift?.openingTime, "long")}
            </p>
          </div>

          {/* closed */}
          <div
            className={`rounded-xl px-3 py-3 border ${
              shift?.closingTime
                ? "bg-rose-50 border-rose-200"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lock
                size={9}
                className={
                  shift?.closingTime ? "text-rose-600" : "text-slate-400"
                }
                strokeWidth={2.5}
              />
              <p
                className={`text-[8px] font-black uppercase tracking-wider ${
                  shift?.closingTime ? "text-rose-600" : "text-slate-400"
                }`}
              >
                Closed
              </p>
            </div>

            {shift?.closingTime ? (
              <>
                <p className="text-[15px] font-black text-rose-900 tabular-nums leading-none">
                  {formatDate(shift?.closingTime, "time")}
                </p>
                <p className="text-[9px] text-rose-700 font-medium mt-0.5">
                  {formatDate(shift?.closingTime, "long")}
                </p>
              </>
            ) : (
              <p className="text-[13px] font-semibold text-slate-400 leading-none mt-1">
                Still open
              </p>
            )}
          </div>
        </div>

        {/* ── Chips: duration · orders · cancellations ── */}
        <div className="flex flex-wrap gap-2 mb-4">
          {duration && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <Clock size={10} className="text-slate-500" strokeWidth={2} />
              <span className="text-[10px] font-black text-slate-600">
                {duration}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            <ShoppingBag size={10} className="text-slate-500" strokeWidth={2} />
            <span className="text-[10px] font-black text-slate-600">
              {num(shift?.totalOrders)} order
              {num(shift?.totalOrders) !== 1 ? "s" : ""}
            </span>
          </div>
          {num(shift?.totalCancellations) > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200">
              <XCircle size={10} className="text-rose-500" strokeWidth={2} />
              <span className="text-[10px] font-black text-rose-600">
                {shift?.totalCancellations} cancelled
              </span>
            </div>
          )}
        </div>

        {/* ── Cash summary ── */}
        <div className="rounded-xl border border-slate-200 overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border-b border-slate-200">
            <Wallet size={11} className="text-slate-500" strokeWidth={2} />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
              Cash Summary
            </span>
          </div>
          <div className="px-3.5 py-1">
            <CashRow
              label="Opening Cash"
              value={formatNumber(shift?.openingCash, true)}
              dim={false}
            />
            <CashRow
              label="Closing Cash"
              value={formatNumber(shift?.closingCash, true)}
              dim={false}
            />
            <CashRow
              label="Expected Cash"
              value={formatNumber(shift?.expectedCash, true)}
              dim={true}
            />
          </div>
        </div>

        {/* ── Total sales + variance ── */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
              Total Sales
            </p>
            <p className="text-[22px] font-black tabular-nums leading-none text-slate-900">
              {formatNumber(shift?.totalSales, true)}
            </p>
          </div>

          {/* variance pill */}
          {shift?.status === "closed" &&
            (variance === 0 ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-slate-100 text-slate-500 border border-slate-200">
                <CheckCircle2 size={11} strokeWidth={2.5} />
                Balanced
              </span>
            ) : variance > 0 ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                <TrendingUp size={11} strokeWidth={2.5} />+
                {formatNumber(variance, true)}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                <TrendingDown size={11} strokeWidth={2.5} />
                {formatNumber(variance, true)}
              </span>
            ))}
        </div>

        {/* ── Closed by ── */}
        {shift?.closedByName && (
          <p className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-3 pt-3 border-t border-slate-100">
            <User size={9} strokeWidth={2} />
            Closed by{" "}
            <span className="font-black text-slate-600 ml-0.5">
              {shift?.closedByName}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
