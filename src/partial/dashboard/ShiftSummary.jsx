import {
  Banknote,
  CreditCard,
  Smartphone,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  ClipboardList,
  ChevronDown,
  User,
  SlidersHorizontal,
  Clock,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "../../utils/numberFormatter";
import Shimmer from "../../layout/Shimmer";
import { formatDate } from "../../utils/dateFormatter";
import NoDataFound from "../../layout/NoDataFound";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ShiftSummarySkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <Shimmer width="100px" height="13px" />
        <Shimmer width="48px" height="22px" rounded="md" />
      </div>
      <div className="p-3 space-y-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-100 px-3 py-2.5 flex items-center gap-3"
          >
            <Shimmer width="8px" height="8px" rounded="full" />
            <div className="flex-1 space-y-1">
              <Shimmer width="90px" height="12px" />
              <Shimmer width="120px" height="10px" />
            </div>
            <div className="text-right space-y-1">
              <Shimmer width="64px" height="13px" />
              <Shimmer width="40px" height="10px" />
            </div>
            <Shimmer width="14px" height="14px" rounded="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Range Summary Banner ─────────────────────────────────────────────────────
function RangeSummaryBanner({ shifts, dateRange }) {
  const navigate = useNavigate();
  const openCount = shifts.filter((s) => s.status === "open").length;
  const closedCount = shifts.length - openCount;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
        <Calendar size={11} className="text-green-600" strokeWidth={2} />
        <span>
          {formatDate(dateRange?.startDate, "long")} –{" "}
          {formatDate(dateRange?.endDate, "long")}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            label: "Total",
            value: shifts.length,
            cls: "bg-gray-50 text-gray-900",
          },
          {
            label: "Closed",
            value: closedCount,
            cls: "bg-green-50 text-green-700",
          },
          {
            label: "Open",
            value: openCount,
            cls: "bg-amber-50 text-amber-600",
          },
        ].map(({ label, value, cls }) => (
          <div
            key={label}
            className={`rounded-xl p-2.5 text-center ${cls.split(" ")[0]}`}
          >
            <p className={`text-lg font-extrabold ${cls.split(" ")[1]}`}>
              {value}
            </p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
              {label}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate("/shift-history", { state: { dateRange } })}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-primary-500 hover:bg-primary-600 rounded-xl transition-all group"
      >
        <span className="text-xs font-bold text-white">
          View All {shifts.length} Shifts
        </span>
        <ArrowUpRight
          size={12}
          className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          strokeWidth={2.5}
        />
      </button>
    </div>
  );
}

// ─── Shift Accordion Row ──────────────────────────────────────────────────────
function ShiftAccordionRow({ shift, isOpen, onToggle }) {
  const navigate = useNavigate();
  if (!shift) return null;

  const isShiftOpen = shift.status === "open";
  const { orderStats, collection } = shift;
  const pb = collection?.paymentBreakdown || {};

  const openTime = formatTime(shift.openingTime);
  const closeTime = formatTime(shift.closingTime);
  const timeStr = closeTime
    ? `${openTime} – ${closeTime}`
    : `${openTime} · ongoing`;

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all duration-200 ${isOpen ? "border-gray-200 shadow-xs" : "border-gray-100"}`}
    >
      {/* ── Collapsed Row ── */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-gray-50/60 transition-colors"
      >
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            {/* Status dot */}
            <div className="shrink-0">
              {isShiftOpen ? (
                <Circle size={7} className="text-amber-400 fill-amber-400" />
              ) : (
                <CheckCircle2
                  size={9}
                  className="text-green-500"
                  strokeWidth={2.5}
                />
              )}
            </div>
            <p className="text-[12.5px] font-bold text-gray-900 truncate leading-none">
              {shift.floorName}
            </p>
            <span className="text-[10px] text-gray-400 shrink-0">
              #{shift.id}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <User size={8} className="text-gray-400 shrink-0" strokeWidth={2} />
            <span className="text-[10.5px] text-gray-400 truncate">
              {shift.cashierName}
            </span>
            <span className="text-gray-300 shrink-0">·</span>
            <span className="text-[10px] text-gray-400 shrink-0 truncate">
              {timeStr}
            </span>
          </div>
        </div>

        {/* Sales */}
        <div className="text-right shrink-0">
          <p className="text-[13px] font-extrabold text-emerald-600 tabular-nums leading-none">
            {formatNumber(shift.totalSales, true)}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {orderStats?.completedOrders || 0} orders
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={13}
          strokeWidth={2.5}
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`
    overflow-hidden transition-all duration-300 ease-in-out
    ${
      isOpen
        ? "max-h-[500px] opacity-100 border-t border-gray-100 mt-2"
        : "max-h-0 opacity-0"
    }
  `}
      >
        <div className="px-3 pt-3 pb-3 space-y-2.5">
          {/* Payment breakdown — 3 cols */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              {
                icon: Banknote,
                label: "Cash",
                amount: pb.cash || 0,
                bg: "bg-amber-50",
                color: "text-amber-600",
              },
              {
                icon: CreditCard,
                label: "Card",
                amount: pb.card || 0,
                bg: "bg-teal-50",
                color: "text-teal-600",
              },
              {
                icon: Smartphone,
                label: "UPI",
                amount: pb.upi || 0,
                bg: "bg-indigo-50",
                color: "text-indigo-500",
              },
            ].map(({ icon: Icon, label, amount, bg, color }) => (
              <div key={label} className={`rounded-xl px-2 py-2 ${bg}`}>
                <div className={`flex items-center gap-1 ${color}`}>
                  <Icon size={9} strokeWidth={2} />
                  <span className="text-[9.5px] font-bold uppercase tracking-wide">
                    {label}
                  </span>
                </div>

                <p className="text-[12px] font-extrabold text-gray-800 tabular-nums mt-1">
                  {formatNumber(amount, true)}
                </p>
              </div>
            ))}
          </div>

          {/* Adjustment + Due — only when non-zero */}
          {(collection?.totalAdjustment > 0 || collection?.totalDue > 0) && (
            <div className="flex items-center gap-1.5">
              {collection?.totalAdjustment > 0 && (
                <div className="flex-1 flex items-center justify-between bg-orange-50 rounded-xl px-2.5 py-2">
                  <div className="flex items-center gap-1">
                    <SlidersHorizontal
                      size={9}
                      className="text-orange-400"
                      strokeWidth={2}
                    />
                    <span className="text-[9.5px] font-bold text-orange-500 uppercase tracking-wide">
                      Adj.
                    </span>
                    {collection?.adjustmentCount > 0 && (
                      <span className="text-[9px] text-orange-400">
                        ×{collection.adjustmentCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] font-extrabold text-gray-800 tabular-nums">
                    {formatNumber(collection.totalAdjustment, true)}
                  </span>
                </div>
              )}

              {collection?.totalDue > 0 && (
                <div className="flex-1 flex items-center justify-between bg-rose-50 rounded-xl px-2.5 py-2">
                  <div className="flex items-center gap-1">
                    <Clock size={9} className="text-rose-400" strokeWidth={2} />
                    <span className="text-[9.5px] font-bold text-rose-500 uppercase tracking-wide">
                      Due
                    </span>
                  </div>
                  <span className="text-[12px] font-extrabold text-gray-800 tabular-nums">
                    {formatNumber(collection.totalDue, true)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Order types */}
          {orderStats?.dineInOrders ||
          orderStats?.takeawayOrders ||
          orderStats?.deliveryOrders ? (
            <div className="flex items-center gap-1.5">
              {[
                { label: "Dine-in", value: orderStats?.dineInOrders || 0 },
                { label: "Takeaway", value: orderStats?.takeawayOrders || 0 },
                { label: "Delivery", value: orderStats?.deliveryOrders || 0 },
              ]
                .filter(({ value }) => value > 0)
                .map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex-1 bg-gray-50 rounded-xl px-2 py-1.5 text-center"
                  >
                    <p className="text-[12px] font-extrabold text-gray-800">
                      {value}
                    </p>

                    <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">
                      {label}
                    </p>
                  </div>
                ))}
            </div>
          ) : null}

          {/* View report */}
          <button
            onClick={() =>
              navigate(`/shift-history/details?shiftId=${shift.id}`)
            }
            className="w-full flex items-center justify-center gap-1 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all group"
          >
            <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-800 transition-colors">
              View Full Report
            </span>

            <ArrowUpRight
              size={10}
              strokeWidth={2.5}
              className="text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ShiftSummary({
  shifts = [],
  loading = false,
  dateRange,
}) {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const isRangeView = useMemo(() => {
    if (!shifts?.length) return false;
    return new Set(shifts.map((s) => s.sessionDate)).size > 1;
  }, [shifts]);

  const handleToggle = (index) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  if (loading) return <ShiftSummarySkeleton />;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-100">
        <div>
          <p className="text-[13px] font-black text-gray-900">Shift Summary</p>
          <p className="text-[10.5px] font-medium text-gray-400 mt-0.5">
            {isRangeView
              ? `${shifts.length} shifts · date range`
              : shifts[0]?.sessionDate
                ? formatDate(shifts[0].sessionDate, "long")
                : ""}
          </p>
        </div>
        <button
          onClick={() =>
            navigate(
              "/shift-history",
              isRangeView ? { state: { dateRange } } : undefined,
            )
          }
          className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 hover:bg-green-100 transition-all px-2.5 py-1 rounded-md shrink-0"
        >
          History
          <ArrowUpRight size={10} strokeWidth={2.5} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {!shifts?.length ? (
          <NoDataFound
            icon={ClipboardList}
            title="No shift data"
            description="No shifts recorded for this period"
            size="sm"
          />
        ) : isRangeView ? (
          <RangeSummaryBanner shifts={shifts} dateRange={dateRange} />
        ) : (
          <div className="space-y-1.5">
            {shifts.map((shift, index) => (
              <ShiftAccordionRow
                key={shift.id}
                shift={shift}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
