import { BarChart2, LineChart } from "lucide-react";
import React, { useMemo, useState } from "react";
import { formatDate } from "../../utils/dateFormatter";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "../../utils/numberFormatter";
import Shimmer from "../../layout/Shimmer";

const isSameDay = (a, b) => {
  if (!a || !b) return false;
  const d1 = new Date(a),
    d2 = new Date(b);
  return d1.toDateString() === d2.toDateString();
};

const SERIES = [
  { key: "dineIn", name: "Dine In", color: "#6366f1" },
  { key: "pickup", name: "Pickup", color: "#14b8a6" },
  { key: "delivery", name: "Delivery", color: "#f59e0b" },
];

// ─── Chart Toggle Button ──────────────────────────────────────────────────────
const ChartBtn = ({ icon: Icon, active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-300 ${
      active
        ? "bg-slate-900 text-white"
        : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
    }`}
  >
    <Icon size={13} />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, isStacked }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  const items = isStacked ? [...payload].reverse() : payload;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl px-4 py-3.5 min-w-[165px]">
      <p className="text-xs font-black text-gray-900 mb-2.5 pb-2 border-b border-gray-100">
        {label}
      </p>
      {items.map((p) => (
        <div
          key={p.dataKey}
          className="flex items-center justify-between gap-5 mb-1.5"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-[11px] text-gray-500">{p.name}</span>
          </div>
          <span className="text-[11px] font-black text-gray-900 tabular-nums">
            {formatNumber(p.value, true)}
          </span>
        </div>
      ))}
      {isStacked && (
        <div className="border-t border-gray-100 mt-2 pt-2 flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-400">Total</span>
          <span className="text-xs font-black text-gray-900 tabular-nums">
            {formatNumber(total, true)}
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SalesChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <div className="space-y-2">
          <Shimmer width="140px" height="14px" />
          <Shimmer width="220px" height="10px" />
        </div>
        <div className="flex items-center bg-gray-100 rounded-md p-1 gap-1">
          <Shimmer width="55px" height="26px" rounded="md" />
          <Shimmer width="55px" height="26px" rounded="md" />
        </div>
      </div>
      <div className="flex items-center gap-5 px-5 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Shimmer width="10px" height="10px" rounded="full" />
            <Shimmer width="60px" height="10px" />
          </div>
        ))}
      </div>
      <div className="px-3 pb-5 pt-3">
        <Shimmer width="100%" height="280px" rounded="lg" />
      </div>
    </div>
  );
}

// ─── Custom X Tick — consistent styling ───────────────────────────────────────
const XTick = ({ x, y, payload }) => {
  if (!payload?.value) return null;
  return (
    <text
      x={x}
      y={y + 10}
      textAnchor="middle"
      fill="#94a3b8"
      fontSize={10}
      fontWeight={600}
      fontFamily="inherit"
    >
      {payload.value}
    </text>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SalesChart = ({ chartData = [], dateRange, loading = false }) => {
  const [chartType, setChartType] = useState("bar");

  const isSingleDay = useMemo(() => {
    if (!dateRange?.startDate) return true;
    return isSameDay(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  const isMultiDay = !isSingleDay;

  // minTickGap: Recharts auto-drops ticks that would overlap within this px budget.
  // Single-day hourly labels ("4am") need ~40px; multi-day ("Mar 5") need ~52px.
  // This single prop replaces all manual interval math and works on any screen width.
  const minTickGap = isMultiDay ? 52 : 40;

  const barCategoryGap = isMultiDay ? "8%" : "30%";
  const barGap = isMultiDay ? 1 : 2;

  const yTickFmt = (v) => {
    if (v >= 100000) return `${(v / 100000).toFixed(0)}L`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    return v;
  };

  if (loading) return <SalesChartSkeleton />;

  // Shared axis/grid — identical for both chart types
  const sharedXAxis = (
    <XAxis
      dataKey="label"
      tick={<XTick />}
      tickLine={false}
      axisLine={false}
      minTickGap={minTickGap}
      height={28}
    />
  );

  const sharedYAxis = (
    <YAxis
      tickFormatter={yTickFmt}
      tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
      tickLine={false}
      axisLine={false}
      width={36}
    />
  );

  const sharedGrid = (
    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-black text-gray-900">Sales Overview</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {isSingleDay
              ? `Hourly breakdown · ${
                  dateRange?.startDate
                    ? formatDate(dateRange.startDate, "long")
                    : "Today"
                }`
              : `Daily breakdown · ${formatDate(
                  dateRange?.startDate,
                  "long",
                )} – ${formatDate(dateRange?.endDate, "long")}`}
          </p>
        </div>
        <div className="flex items-center bg-gray-100 rounded-md p-0.5 gap-0.5">
          <ChartBtn
            icon={BarChart2}
            label="Bar"
            active={chartType === "bar"}
            onClick={() => setChartType("bar")}
          />
          <ChartBtn
            icon={LineChart}
            label="Area"
            active={chartType === "area"}
            onClick={() => setChartType("area")}
          />
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-4 px-4 py-3 flex-wrap">
        {SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            {chartType === "area" ? (
              // Line swatch for area mode so legend matches the chart
              <svg width="18" height="10" className="shrink-0">
                <line
                  x1="0"
                  y1="5"
                  x2="18"
                  y2="5"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: s.color }}
              />
            )}
            <span className="text-[11px] font-semibold text-gray-500">
              {s.name}
            </span>
          </div>
        ))}
      </div>

      {/* ── Chart body ── */}
      <div className="px-2 pb-5 pt-2" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            /* ────── STACKED BAR ────── */
            <BarChart
              data={chartData}
              barCategoryGap={barCategoryGap}
              barGap={barGap}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              {sharedGrid}
              {sharedXAxis}
              {sharedYAxis}
              <Tooltip
                content={<CustomTooltip isStacked />}
                cursor={{ fill: "#f8fafc", radius: 4 }}
              />
              {/* Rendered bottom → top: delivery, pickup, dineIn */}
              <Bar
                dataKey="delivery"
                name="Delivery"
                stackId="s"
                fill={SERIES[2].color}
                radius={[0, 0, isMultiDay ? 0 : 3, isMultiDay ? 0 : 3]}
                maxBarSize={isMultiDay ? 18 : 32}
                isAnimationActive={!isMultiDay}
              />
              <Bar
                dataKey="pickup"
                name="Pickup"
                stackId="s"
                fill={SERIES[1].color}
                radius={[0, 0, 0, 0]}
                maxBarSize={isMultiDay ? 18 : 32}
                isAnimationActive={!isMultiDay}
              />
              <Bar
                dataKey="dineIn"
                name="Dine In"
                stackId="s"
                fill={SERIES[0].color}
                radius={[isMultiDay ? 1 : 4, isMultiDay ? 1 : 4, 0, 0]}
                maxBarSize={isMultiDay ? 18 : 32}
                isAnimationActive={!isMultiDay}
              />
            </BarChart>
          ) : (
            /* ────── SEPARATE AREA LINES (no stackId) ────── */
            <AreaChart
              data={chartData}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                {SERIES.map((s) => (
                  <linearGradient
                    key={s.key}
                    id={`g-${s.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              {sharedGrid}
              {sharedXAxis}
              {sharedYAxis}
              <Tooltip content={<CustomTooltip isStacked={false} />} />
              {/* No stackId — each series plots independently on its own scale */}
              {SERIES.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2}
                  fill={`url(#g-${s.key})`}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              ))}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
