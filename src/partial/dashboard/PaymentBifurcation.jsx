import React, { useMemo } from "react";
import { formatNumber } from "../../utils/numberFormatter";
import Shimmer from "../../layout/Shimmer";
import { formatDate } from "../../utils/dateFormatter";

function PaymentBifurcationSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <Shimmer width="180px" height="16px" /> {/* match title size */}
        <Shimmer width="64px" height="26px" rounded="xl" /> {/* match pill */}
      </div>

      {/* Segmented bar (realistic proportions) */}
      <div className="flex h-5 rounded-full overflow-hidden gap-[2px] mb-5">
        {[42, 28, 18, 12].map((w, i) => (
          <Shimmer key={i} width={`${w}%`} height="100%" rounded="full" />
        ))}
      </div>

      {/* Legend rows */}
      <div className="space-y-2.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Icon (exact size match) */}
            <Shimmer width="28px" height="28px" rounded="lg" />

            {/* Label (flex-1 like real) */}
            <div className="flex-1">
              <Shimmer width={`${60 + i * 10}px`} height="12px" />
            </div>

            {/* Amount (fixed width like real UI) */}
            <Shimmer width="112px" height="14px" />
          </div>
        ))}
      </div>
    </div>
  );
}

const isSameDay = (a, b) => {
  if (!a || !b) return false;
  const d1 = new Date(a),
    d2 = new Date(b);
  return d1.toDateString() === d2.toDateString();
};

const PaymentBifurcation = ({ data, loading = false, dateRange }) => {
  const total = data?.reduce((s, p) => s + p?.amount, 0) || 0;
  if (loading) return <PaymentBifurcationSkeleton />;

  const isSingleDay = useMemo(() => {
    if (!dateRange?.startDate) return true;
    return isSameDay(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-black text-gray-900">Payment Breakdown</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {isSingleDay
              ? `Day breakdown · ${
                  dateRange?.startDate
                    ? formatDate(dateRange.startDate, "long")
                    : "Today"
                }`
              : `Day breakdown · ${formatDate(
                  dateRange?.startDate,
                  "long",
                )} – ${formatDate(dateRange?.endDate, "long")}`}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1.5 rounded-xl">
          {formatNumber(total, true)}
        </div>
      </div>

      <div className=" p-4">
        {/* Segmented bar */}
        <div className="flex h-5 rounded-full overflow-hidden gap-0.5 mb-5 ">
          {data
            ?.filter((p) => p.amount > 0)
            ?.map((p) => (
              <div
                key={p.name}
                className="transition-all duration-700 flex items-center justify-center"
                style={{
                  width: `${(p.amount / total) * 100}%`,
                  backgroundColor: p.color,
                }}
                title={`${p.name}: ${p.percentage}%`}
              >
                {p.percentage > 8 && (
                  <span className="text-[9px] font-black text-white">
                    {p.percentage}%
                  </span>
                )}
              </div>
            ))}
        </div>

        {/* Legend rows */}
        <div className="space-y-2.5">
          {data?.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.name} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${p.color}18` }}
                >
                  <Icon
                    size={13}
                    style={{ color: p.color }}
                    strokeWidth={1.75}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700 flex-1">
                  {p.name}
                </span>
                <div className="flex items-center gap-3">
                  {/* <span className="text-[10px] font-bold text-gray-400 w-10 text-right tabular-nums">
                  {p.percentage > 0 ? `${p.percentage}%` : "—"}
                </span> */}
                  <span className="text-xs font-black text-gray-900 w-28 text-right tabular-nums">
                    {p.amount > 0 ? formatNumber(p.amount, true) : "₹0"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentBifurcation;
