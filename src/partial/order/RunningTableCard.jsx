import { Clock, User, ShoppingBag } from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";

function RunningTableCard({ table, onView }) {
  const min =
    table?.durationMinutes ??
    Math.floor((Date.now() - new Date(table.startedAt).getTime()) / 60000);

  const isCrit = min >= 45;
  const isWarn = min >= 30 && !isCrit;

  return (
    <div
      onClick={() => onView(table)}
      className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-slate-300 hover:shadow-md active:scale-[0.99] transition-all duration-150 flex flex-col"
    >
      <div className="px-4 py-3.5 flex flex-col gap-2.5">

        {/* table number + timer */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-black text-slate-900 font-mono leading-none tracking-tight">
            {table?.tableNumber}
          </span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${
            isCrit
              ? "bg-rose-50 border-rose-200 text-rose-600"
              : isWarn
                ? "bg-amber-50 border-amber-200 text-amber-600"
                : "bg-slate-50 border-slate-200 text-slate-500"
          }`}>
            <Clock size={9} className={isCrit ? "text-rose-500" : isWarn ? "text-amber-500" : "text-slate-400"} />
            {table?.durationFormatted ?? `${min}m`}
          </div>
        </div>

        {/* amount */}
        <div>
          <p className="text-[9px] uppercase tracking-widest font-semibold text-slate-400 mb-0.5">Amount</p>
          <p className="text-base font-black text-slate-900 font-mono leading-none">
            {formatNumber(table?.totalAmount ?? table?.orderAmount, true)}
          </p>
        </div>

        {/* divider */}
        <div className="h-px bg-slate-100" />

        {/* meta row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 min-w-0">
            <User size={10} className="text-slate-400 shrink-0" />
            <span className="text-[11px] text-slate-500 font-medium truncate">
              {table?.customerName || "Walk-in"}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <ShoppingBag size={10} className="text-slate-400" />
            <span className="text-[11px] text-slate-500 font-medium">
              {table?.itemCount ?? table?.items?.length ?? 0} items
            </span>
          </div>
        </div>

      </div>

      {/* view button */}
      <button
        onClick={(e) => { e.stopPropagation(); onView(table); }}
        className={`w-full py-2 text-[11px] font-bold tracking-wide flex items-center justify-center gap-1.5 transition-colors ${
          isCrit
            ? "bg-rose-500 hover:bg-rose-600 text-white"
            : "bg-primary-500 hover:bg-primary-600 text-white"
        }`}
      >
        View order
      </button>
    </div>
  );
}

export default RunningTableCard;