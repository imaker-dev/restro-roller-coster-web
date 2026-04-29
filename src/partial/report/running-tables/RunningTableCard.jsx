import {
  ArrowUpRight,
  Clock,
  Hash,
  Timer,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/dateFormatter";
import { formatNumber } from "../../../utils/numberFormatter";
import OrderBadge from "../../order/OrderBadge";
import { ROUTE_PATHS } from "../../../config/paths";

/* ─── Config ─────────────────────────────────────────────── */
const STATUS_CFG = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-50 border-amber-200 text-amber-700",
    bar: "bg-amber-400",
    glow: "shadow-amber-100",
  },
  confirmed: {
    label: "Confirmed",
    dot: "bg-blue-500",
    badge: "bg-blue-50 border-blue-200 text-blue-700",
    bar: "bg-blue-500",
    glow: "shadow-blue-100",
  },
  preparing: {
    label: "Preparing",
    dot: "bg-violet-500",
    badge: "bg-violet-50 border-violet-200 text-violet-700",
    bar: "bg-violet-500",
    glow: "shadow-violet-100",
  },
  ready: {
    label: "Ready",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 border-emerald-200 text-emerald-700",
    bar: "bg-emerald-500",
    glow: "shadow-emerald-100",
  },
  billed: {
    label: "Billed",
    dot: "bg-slate-400",
    badge: "bg-slate-50 border-slate-200 text-slate-600",
    bar: "bg-slate-400",
    glow: "shadow-slate-100",
  },
};

const urgencyColor = (mins) => {
  if (mins >= 90)
    return {
      ring: "ring-rose-300",
      bg: "bg-rose-50",
      text: "text-rose-600",
      label: "Long wait",
      bar: "bg-rose-400",
    };
  if (mins >= 60)
    return {
      ring: "ring-amber-300",
      bg: "bg-amber-50",
      text: "text-amber-600",
      label: "Active",
      bar: "bg-amber-400",
    };
  return {
    ring: "ring-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    label: "Recent",
    bar: "bg-emerald-400",
  };
};

const RunningTableCard = ({ table }) => {
  const sc = STATUS_CFG[table?.order?.status] || STATUS_CFG.pending;
  const urg = urgencyColor(table?.order?.durationMinutes || 0);

  return (
    <div
      className={`
        relative bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col
        shadow-sm hover:shadow-xl transition-all duration-200 cursor-default
      `}
    >
      {/* Top status bar */}
      <div className={`h-1 w-full ${sc?.bar}`} />

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Header row: table name + badges */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-400 leading-none">
                {table?.tableNumber}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                Table ID #{table?.tableId}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <OrderBadge type="status" value={table?.order?.status} />
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${urg?.bg} ${urg?.text}`}
            >
              <Timer size={9} /> {urg?.label}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 mb-4" />

        {/* Info grid: 2x2 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
              <Users size={9} /> Guests
            </div>
            <div className="text-sm font-bold text-slate-800">
              {table?.guestCount}
              <span className="text-xs font-medium text-slate-400 ml-1">
                / {table?.capacity} cap
              </span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
              <Wallet size={9} /> Amount
            </div>
            <div className="text-sm font-bold text-slate-800">
              {table?.order?.totalAmount > 0 ? (
                formatNumber(table?.order?.totalAmount, true)
              ) : (
                <span className="text-slate-300 font-medium text-xs">
                  No items
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
              <Clock size={9} /> Started
            </div>
            <div className="text-sm font-semibold text-slate-700">
              {formatDate(table?.order?.startedAt, "time")}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
              <Timer size={9} /> Duration
            </div>
            <div className={`text-sm font-bold ${urg?.text}`}>
              {table?.order?.durationFormatted}
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer: order number + captain + view button */}
        <div className="pt-3.5 border-t border-slate-100 space-y-3">
          {/* Order # + Captain row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <Hash size={11} className="text-slate-300 flex-shrink-0" />
              <span className="text-[11px] font-mono font-bold text-slate-400 truncate">
                {table?.order?.orderNumber}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                <User size={10} color="white" strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-semibold text-slate-500 max-w-[110px] truncate">
                {table?.captain?.name}
              </span>
            </div>
          </div>

          {/* View Order Details button */}
          <Link
            to={`${ROUTE_PATHS.ORDER_DETAILS}?orderId=${table?.order?.id}`}
            className="btn group w-full rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold"
          >
            View Order Details
            <ArrowUpRight
              size={13}
              strokeWidth={2.5}
              className="ml-2 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default RunningTableCard;
