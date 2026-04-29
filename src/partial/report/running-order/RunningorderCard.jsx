import {
  ArrowUpRight,
  Clock,
  Layers,
  MapPin,
  Phone,
  Receipt,
  Star,
  User,
  Users,
  Utensils,
} from "lucide-react";
import OrderBadge from "../../order/OrderBadge";
import { formatNumber } from "../../../utils/numberFormatter";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/dateFormatter";
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

const readyPct = (ready, total) =>
  total > 0 ? Math.round((ready / total) * 100) : 0;

/* ─── Order Card ─────────────────────────────────────────── */
const RunningorderCard = ({ order }) => {
  const sc = STATUS_CFG[order?.status] || STATUS_CFG.pending;
  const pct = readyPct(order?.ready_count, order?.item_count);
  const hasItems = order?.item_count > 0;
  const hasAmount = parseFloat(order?.total_amount) > 0;

  return (
    <div
      className={`
        relative bg-white rounded-2xl border overflow-hidden flex flex-col
        shadow-sm hover:shadow-lg transition-all duration-200
        ${order?.is_priority ? "border-amber-300 ring-1 ring-amber-200" : "border-slate-200"}
      `}
    >
      {/* Priority ribbon */}
      {order?.is_priority === 1 && (
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-white shadow">
            <Star size={9} fill="white" /> Priority
          </span>
        </div>
      )}

      {/* Status color bar */}
      <div className={`h-1 w-full ${sc.bar}`} />

      <div className="px-5 py-4 flex flex-col flex-1">
        {/* Row 1: Order number + status badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-slate-400 font-mono tracking-wide">
                #{order?.order_number}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <OrderBadge type="status" value={order?.status} />
              <OrderBadge type="type" value={order?.order_type} />
              <OrderBadge type="payment" value={order?.payment_status} />
            </div>
          </div>

          {/* Amount */}
          <div className="text-right flex-shrink-0">
            {hasAmount ? (
              <>
                <div className="text-xl font-black text-slate-900 tracking-tight">
                  {formatNumber(order?.total_amount, true)}
                </div>
                {order?.discount_amount > 0 && (
                  <div className="text-[11px] text-emerald-600 font-semibold">
                    −{formatNumber(order?.discount_amount, true)} off
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm font-semibold text-slate-300">
                No items
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 mb-3" />

        {/* Row 2: Always 2×2 grid — consistent across all order types */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-3">
          {order?.order_type === "takeaway" ? (
            <>
              {/* Row 1 col 1: Captain */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <User size={9} /> Captain
                </span>
                <span className="text-sm font-semibold text-slate-700 truncate">
                  {order?.created_by_name || "—"}
                </span>
              </div>

              {/* Row 1 col 2: Guests */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Users size={9} /> Guests
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {order?.guest_count}
                </span>
              </div>

              {/* Row 2 col 1: Customer name (or empty spacer) */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <User size={9} /> Customer
                </span>
                <span className="text-sm font-semibold text-slate-700 truncate">
                  {order?.customer_name || "—"}
                </span>
              </div>

              {/* Row 2 col 2: Phone (or empty spacer) */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Phone size={9} /> Phone
                </span>
                <span className="text-sm font-semibold text-slate-700 font-mono">
                  {order?.customer_phone || "—"}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Row 1 col 1: Table */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Layers size={9} /> Table
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {order?.table_number && order?.table_number}
                  <span className="text-[11px] text-slate-400 font-mono ml-2">
                    ({order?.table_name || "—"})
                  </span>
                </span>
              </div>

              {/* Row 1 col 2: Floor */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <MapPin size={9} /> Floor
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {order?.floor_name || "—"}
                </span>
              </div>

              {/* Row 2 col 1: Guests */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Users size={9} /> Guests
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {order?.guest_count}
                </span>
              </div>

              {/* Row 2 col 2: Captain */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <User size={9} /> Captain
                </span>
                <span className="text-sm font-semibold text-slate-700 truncate">
                  {order?.created_by_name || "—"}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Row 3: Item Progress */}
        {hasItems ? (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Utensils size={10} /> Item Progress
              </span>
              <span className="text-[11px] font-bold text-slate-600">
                {order?.ready_count}/{order?.item_count} ready
                <span
                  className={`ml-1.5 ${pct === 100 ? "text-emerald-600" : "text-slate-400"}`}
                >
                  ({pct}%)
                </span>
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mb-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-[12px] text-slate-400 font-medium">
              No items added yet
            </span>
          </div>
        )}

        {/* Subtotal row */}
        {hasAmount &&
          parseFloat(order?.subtotal) !== parseFloat(order?.total_amount) && (
            <div className="flex items-center justify-between text-[12px] text-slate-500 mb-2 font-medium">
              <span>Subtotal</span>
              <span>
                ₹{parseFloat(order?.subtotal).toLocaleString("en-IN")}
              </span>
            </div>
          )}

        {/* Special instructions */}
        {order?.special_instructions && (
          <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block mb-0.5">
              Note
            </span>
            <span className="text-xs text-amber-800">
              {order?.special_instructions}
            </span>
          </div>
        )}

        {/* Invoice pill */}
        {order?.invoice_number && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-lg">
            <Receipt size={11} className="text-violet-600" />
            <span className="text-[11px] font-bold text-violet-700 font-mono">
              {order?.invoice_number}
            </span>
          </div>
        )}

        {/* Spacer pushes footer to bottom */}
        <div className="flex-1" />

        {/* Footer: timestamp + View Details */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium min-w-0">
            <Clock size={11} className="flex-shrink-0" />
            <span className="truncate">
              {formatDate(order?.created_at, "time")}
            </span>
            <span className="text-slate-300 flex-shrink-0">·</span>
            <span className="flex-shrink-0 font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
              {formatDate(order?.created_at, "timeAgo")}
            </span>
          </div>

          {/* ── View Details Button ── */}
          <Link
            to={`${ROUTE_PATHS.ORDER_DETAILS}?orderId=${order?.id}`}
            className="
              btn group flex-shrink-0 rounded-xl
              bg-primary-500 hover:bg-primary-600
              text-white text-xs font-semibold"
          >
            View Details
            <ArrowUpRight
              size={13}
              strokeWidth={2.5}
              className="ml-1 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RunningorderCard;
