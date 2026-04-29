import {
  Banknote,
  CreditCard,
  Smartphone,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "../../utils/numberFormatter";
import Shimmer from "../../layout/Shimmer";
import { formatDate } from "../../utils/dateFormatter";
import StatusBadge from "../../layout/StatusBadge";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ShiftSummarySkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <Shimmer width="100px" height="12px" />
          <Shimmer width="70px" height="9px" className="mt-1" />
        </div>
        <Shimmer width="50px" height="22px" rounded="lg" />
      </div>
      <div className="p-4 space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="space-y-2.5 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-2">
              <Shimmer width="70px" height="12px" />
              <Shimmer width="35px" height="9px" />
              <Shimmer width="50px" height="9px" />
              <Shimmer
                width="35px"
                height="16px"
                rounded="full"
                className="ml-auto"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Shimmer width="100%" height="52px" rounded="lg" />
              <Shimmer width="100%" height="52px" rounded="lg" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((j) => (
                <Shimmer key={j} width="100%" height="28px" rounded="lg" />
              ))}
            </div>
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
      {/* Date range header */}
      <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500">
        <Calendar size={12} className="text-green-600" strokeWidth={2} />
        <span>
          {formatDate(dateRange?.startDate, "long")} –{" "}
          {formatDate(dateRange?.endDate, "long")}
        </span>
      </div>

      {/* Shift count cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xl font-extrabold text-gray-900">
            {shifts.length}
          </p>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
            Total
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-xl font-extrabold text-green-700">{closedCount}</p>
          <p className="text-[9px] font-bold text-green-400 uppercase tracking-wider mt-0.5">
            Closed
          </p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <p className="text-xl font-extrabold text-amber-600">{openCount}</p>
          <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider mt-0.5">
            Open
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/shift-history", { state: { dateRange } })}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 rounded-xl transition-all group"
      >
        <span className="text-[12px] font-bold text-white">
          View All {shifts.length} Shifts
        </span>
        <ArrowUpRight
          size={13}
          className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          strokeWidth={2.5}
        />
      </button>
    </div>
  );
}

// ─── Single Shift Row ─────────────────────────────────────────────────────────
function ShiftRow({ shift }) {
  const navigate = useNavigate();
  if (!shift) return null;

  const isOpen = shift.status === "open";
  const { orderStats, collection } = shift;

  return (
    <div className="space-y-2.5 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
      {/* Shift Header */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-0.5 shrink-0">
          {isOpen ? (
            <Circle size={7} className="text-amber-500 fill-amber-400" />
          ) : (
            <CheckCircle2
              size={9}
              className="text-green-500"
              strokeWidth={2.5}
            />
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <p className="text-[13px] font-extrabold text-gray-900">
            {shift.floorName}
          </p>
          <span className="text-[10px] font-medium text-gray-400">
            #{shift.id}
          </span>
          <span className="text-[10px] font-medium text-gray-400">
            · {shift.cashierName}
          </span>
        </div>
        <StatusBadge
          value={isOpen}
          trueText="OPEN"
          falseText="CLOSED"
          size="sm"
        />
        <button
          onClick={() => navigate(`/shift-history/details?shiftId=${shift.id}`)}
          className="flex items-center gap-0.5 text-[10px] font-bold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-all px-2 py-1 rounded-md"
        >
          View
          <ArrowUpRight size={10} strokeWidth={2.5} />
        </button>
      </div>

      {/* Stats Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-2">
        {/* Sales Card */}
        <div className="bg-gray-50 rounded-xl p-2.5">
          <div className="sm:flex sm:items-center sm:justify-between">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              Sales
            </p>
            <div className="sm:text-right">
              <span className="text-sm font-extrabold text-emerald-600">
                {formatNumber(shift.totalSales, true)}
              </span>
              <span className="text-[9px] font-medium text-gray-400 ml-1.5">
                {orderStats?.completedOrders || 0} orders
              </span>
            </div>
          </div>
        </div>

        {/* Adjustments Card */}
        <div className="bg-gray-50 rounded-xl p-2.5">
          <div className="sm:flex sm:items-center sm:justify-between">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              Adjustments
            </p>
            <div className="sm:text-right">
              <span className="text-sm font-extrabold text-gray-600">
                {formatNumber(collection?.totalAdjustment || 0, true)}
              </span>
              <span className="text-[9px] font-medium text-gray-400 ml-1.5">
                {collection?.adjustmentCount || 0} adj
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Row */}
      <div className="grid grid-cols-3 gap-2">
        {/* Cash */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 bg-amber-50 rounded-xl px-2.5 py-2 border border-amber-100/50">
          <span className="flex items-center gap-1 text-[9px] font-bold text-amber-500 uppercase tracking-wider">
            <Banknote size={10} strokeWidth={2} /> Cash
          </span>
          <span className="text-[12px] font-extrabold text-gray-700">
            {formatNumber(collection?.paymentBreakdown?.cash || 0, true)}
          </span>
        </div>

        {/* Card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 bg-teal-50 rounded-xl px-2.5 py-2 border border-teal-100/50">
          <span className="flex items-center gap-1 text-[9px] font-bold text-teal-500 uppercase tracking-wider">
            <CreditCard size={10} strokeWidth={2} /> Card
          </span>
          <span className="text-[12px] font-extrabold text-gray-700">
            {formatNumber(collection?.paymentBreakdown?.card || 0, true)}
          </span>
        </div>

        {/* UPI */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 bg-indigo-50 rounded-xl px-2.5 py-2 border border-indigo-100/50">
          <span className="flex items-center gap-1 text-[9px] font-bold text-indigo-400 uppercase tracking-wider">
            <Smartphone size={10} strokeWidth={2} /> UPI
          </span>
          <span className="text-[12px] font-extrabold text-gray-700">
            {formatNumber(collection?.paymentBreakdown?.upi || 0, true)}
          </span>
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

  const isRangeView = useMemo(() => {
    if (!shifts?.length) return false;
    const dates = shifts.map((s) => s.sessionDate);
    return new Set(dates).size > 1;
  }, [shifts]);

  if (loading) return <ShiftSummarySkeleton />;
  if (!shifts?.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-gray-100">
        <div>
          <p className="text-[13px] font-black text-gray-900">Shift Summary</p>
          {!isRangeView && shifts[0]?.sessionDate && (
            <p className="text-[10px] font-medium text-gray-400 mt-0.5">
              {formatDate(shifts[0].sessionDate, "long")}
            </p>
          )}
          {isRangeView && (
            <p className="text-[10px] font-medium text-gray-400 mt-0.5">
              {shifts.length} shifts · date range
            </p>
          )}
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
      <div className="p-4">
        {isRangeView ? (
          <RangeSummaryBanner shifts={shifts} dateRange={dateRange} />
        ) : (
          <div className="space-y-3">
            {shifts.map((shift) => (
              <ShiftRow key={shift.id} shift={shift} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
