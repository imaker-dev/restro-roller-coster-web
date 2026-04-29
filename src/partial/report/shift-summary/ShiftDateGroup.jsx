import { CalendarDays } from "lucide-react";
import { formatDate } from "../../../utils/dateFormatter";
import { formatNumber, num } from "../../../utils/numberFormatter";
import ShiftCard from "./ShiftCard";

// ─── Date group ───────────────────────────────────────────────────────────────
export default function ShiftDateGroup({ dateStr, shifts }) {
  const sales = shifts.reduce((a, s) => a + num(s.totalSales), 0);
  const orders = shifts.reduce((a, s) => a + num(s.totalOrders), 0);
  const openCount = shifts.filter((s) => s.status === "open").length;

  return (
    <div className="space-y-3">
      {/* Date header row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900">
          <CalendarDays size={13} className="text-slate-400" strokeWidth={2} />
          <span className="text-[12px] font-black text-white">
            {formatDate(dateStr, "long")}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-slate-500 px-2.5 py-1 rounded-lg bg-white border border-slate-200">
            {shifts.length} shift{shifts.length !== 1 ? "s" : ""}
          </span>
          {openCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {openCount} active
            </span>
          )}
          {sales > 0 && (
            <span className="text-[10px] font-bold text-slate-500 px-2.5 py-1 rounded-lg bg-white border border-slate-200">
              {formatNumber(sales, true)} · {orders} orders
            </span>
          )}
        </div>
        <div className="flex-1 h-px bg-slate-200 hidden sm:block" />
      </div>

      {/* Shift cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {shifts?.map((shift, i) => (
          <ShiftCard
            key={shift.id}
            shift={shift}
          />
        ))}
      </div>
    </div>
  );
}
