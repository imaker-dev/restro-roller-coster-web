import { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  Users,
  ReceiptText,
  CreditCard,
  Wallet,
  Smartphone,
  Tag,
  Star,
  BarChart2,
  UserCheck,
  BadgePercent,
  ArrowUpRight,
  CircleDollarSign,
  Activity,
  Store,
  Ban,
  CheckCircle2,
  XCircle,
  Layers,
  ShoppingBag,
  TrendingDown,
  Hash,
  ArrowRight,
  Download,
  SlidersHorizontal,
  IndianRupee,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchDailyEndSummaryDetails } from "../../redux/slices/dashboardSlice";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../layout/PageHeader";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";
import { getOrderTableConfig } from "../../columns/order.columns";
import SmartTable from "../../components/SmartTable";
import { handleResponse } from "../../utils/helpers";
import { exportDayEndSummaryDetails } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import NoDataFound from "../../layout/NoDataFound";
import { ROUTE_PATHS } from "../../config/paths";

// ─── Utils ────────────────────────────────────────────────────────────────────
const pct = (a, b) => (b ? +((a / b) * 100).toFixed(1) : 0);

const BAR_COLORS = [
  "bg-violet-400",
  "bg-rose-400",
  "bg-amber-400",
  "bg-sky-400",
  "bg-emerald-400",
  "bg-orange-400",
  "bg-teal-400",
  "bg-pink-400",
];

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ to, prefix = "" }) {
  const [v, setV] = useState(0);
  const r = useRef();
  useEffect(() => {
    if (!to) return;
    const t0 = performance.now();
    const run = (t) => {
      const p = Math.min((t - t0) / 1000, 1);
      setV(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) r.current = requestAnimationFrame(run);
      else setV(to);
    };
    r.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(r.current);
  }, [to]);
  return (
    <>
      {prefix}
      {Math.floor(v).toLocaleString("en-IN")}
    </>
  );
}

// ─── Animated Bar ─────────────────────────────────────────────────────────────
function Bar({ value, max, h = "h-1.5" }) {
  const [w, setW] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setW(pct(value, max)), 300);
    return () => clearTimeout(t);
  }, [value, max]);

  return (
    <div className={`w-full bg-slate-100 rounded-full ${h} overflow-hidden`}>
      <div
        className={`${h} rounded-full bg-primary-500 transition-all duration-1000 ease-out`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

// ─── Radial Ring (FIXED) ──────────────────────────────────────────────────────
function Ring({
  value = 0,
  max = 1,
  size = 86,
  sw = 7,
  stroke,
  label,
  sub,
  textColor = "text-slate-900",
}) {
  const radius = (size - sw * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const [dashOffset, setDashOffset] = useState(circumference); // start fully hidden

  useEffect(() => {
    // reset first so animation re-triggers if value changes
    setDashOffset(circumference);
    const t = setTimeout(() => {
      const filled = Math.min(pct(value, max), 100) / 100;
      setDashOffset(circumference * (1 - filled));
    }, 300);
    return () => clearTimeout(t);
  }, [value, max, circumference]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={sw}
          />
          {/* Fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </svg>
        {/* Centre label — no rotation needed since we rotate SVG not the container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p
            className={`text-xl font-extrabold leading-none tabular-nums ${textColor}`}
          >
            {value}
          </p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-slate-700">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ─── View All Button (Navigation Style) ───────────────────────────────────────
function ShowMoreBtn({ total, showing, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all group"
    >
      <div className="flex flex-col items-start">
        <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
          View All Items
        </span>
        <span className="text-xs text-slate-400">
          {showing} shown of {total}
        </span>
      </div>

      <ArrowRight
        size={16}
        className="text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-1"
        strokeWidth={2.5}
      />
    </button>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function Empty({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Icon size={22} className="text-slate-300" strokeWidth={1.5} />
      </div>
      <p className="text-xs font-semibold text-slate-300">{message}</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function DayEndSummaryDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { date } = useQueryParams();
  const { outletId } = useSelector((state) => state.auth);
  const { isExportingDayEndSummaryDetails } = useSelector(
    (state) => state.exportReport,
  );
  const { dailyEndSummaryDetails: d, isFetchingDailyEndSummaryDetails } =
    useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDailyEndSummaryDetails({ outletId, date }));
  }, [outletId, date]);

  const { columns, actions: rowActions } = getOrderTableConfig(navigate);

  // Show-more states
  const [showAllCats, setShowAllCats] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllStaff, setShowAllStaff] = useState(false);

  const CAT_LIMIT = 5;
  const ITEM_LIMIT = 5;
  const ORDER_LIMIT = 8;
  const STAFF_LIMIT = 2;

  if (isFetchingDailyEndSummaryDetails) return <LoadingOverlay />;

  const s = d?.summary;
  const totalCollected =
    (d?.paymentBreakdown?.cash?.amount ?? 0) +
    (d?.paymentBreakdown?.card?.amount ?? 0) +
    (d?.paymentBreakdown?.upi?.amount ?? 0);
  const maxCat = d?.categoryBreakdown?.length
    ? Math.max(...d.categoryBreakdown.map((c) => c.totalSales))
    : 1;
  const maxItem = d?.topSellingItems?.length
    ? Math.max(...d.topSellingItems.map((i) => i.totalSales))
    : 1;
  const billedCount =
    d?.orders?.filter((o) => o.status === "billed").length ?? 0;

  const visibleCats = showAllCats
    ? d?.categoryBreakdown
    : d?.categoryBreakdown?.slice(0, CAT_LIMIT);
  const visibleItems = showAllItems
    ? d?.topSellingItems
    : d?.topSellingItems?.slice(0, ITEM_LIMIT);
  const visibleStaff = showAllStaff
    ? d?.staffPerformance
    : d?.staffPerformance?.slice(0, STAFF_LIMIT);

  const handleExportDayEndSummaryDetailsReport = async () => {
    if (!d?.date) return;

    const fileName = `Day-End-Summary-Report_${formatFileDate(d?.date)}`;

    await handleResponse(
      dispatch(exportDayEndSummaryDetails({ outletId, date })),
      (res) => {
        downloadBlob({
          data: res.payload,
          fileName,
        });
      },
    );
  };

  const actions = [
    {
      label: "Export",
      type: "export",
      icon: Download,
      onClick: () => handleExportDayEndSummaryDetailsReport(),
      loading: isExportingDayEndSummaryDetails,
      loadingText: "Exporting...",
    },
  ];

  return (
    <div className="space-y-5 pb-10">
      <PageHeader
        title={`Day End Summary - ${formatDate(d?.date, "long")}`}
        actions={actions}
        showBackButton
      />

      {/* ── ROW 1: Hero + Order Distribution ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hero */}
        <div className="lg:col-span-8 bg-primary-500 relative rounded-3xl overflow-hidden shadow-lg">
          {/* highlight line */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            }}
          />

          {/* glow */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />

          <div className="relative z-10 p-5 sm:p-6 text-white">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-[9px] font-semibold text-white/70 uppercase tracking-[0.14em] mb-2">
                  Today's Net Revenue
                </p>

                <p className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none tabular-nums">
                  <Counter to={s?.netSales ?? 0} prefix={"\u20B9"} />
                </p>

                {/* chips */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <div className="flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-1">
                    <CheckCircle2 size={10} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">
                      {s?.completedOrders ?? 0} completed
                    </span>
                  </div>

                  {(s?.cancelledOrders ?? 0) > 0 && (
                    <div className="flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-1">
                      <XCircle size={10} strokeWidth={2.5} />
                      <span className="text-[10px] font-bold">
                        {s.cancelledOrders} cancelled
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-1">
                    <Users size={10} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">
                      {s?.totalGuests ?? 0} guests
                    </span>
                  </div>
                </div>
              </div>

              {/* icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 border border-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <TrendingUp size={24} strokeWidth={2} />
              </div>
            </div>

            {/* KPI tiles */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                {
                  label: "Total Orders",
                  val: s?.totalOrders,
                  Icon: ReceiptText,
                  prefix: "",
                },
                {
                  label: "Total Guests",
                  val: s?.totalGuests,
                  Icon: Users,
                  prefix: "",
                },
                {
                  label: "Avg Order",
                  val: Math.round(s?.avgOrderValue ?? 0),
                  Icon: CircleDollarSign,
                  prefix: "\u20B9",
                },
                {
                  label: "Max Bill",
                  val: s?.maxOrderValue,
                  Icon: ArrowUpRight,
                  prefix: "\u20B9",
                },
                {
                  label: "Min Bill",
                  val: s?.minOrderValue,
                  Icon: TrendingDown,
                  prefix: "\u20B9",
                },
              ].map(({ label, val, Icon, prefix }) => (
                <div
                  key={label}
                  className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl px-3 py-3 text-center"
                >
                  <Icon size={13} className="mx-auto mb-1.5 opacity-80" />

                  <p className="text-base sm:text-lg font-extrabold leading-none tabular-nums">
                    {prefix}
                    {typeof val === "number"
                      ? val.toLocaleString("en-IN")
                      : (val ?? "—")}
                  </p>

                  <p className="text-[9px] font-semibold text-white/70 mt-1 tracking-wide">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Distribution */}
        <div className="lg:col-span-4">
          <MetricPanel icon={Activity} title={"Order Distribution"}>
            <div className="flex justify-around items-center mb-5">
              {[
                {
                  label: "Completed",
                  count: s?.completedOrders ?? 0,
                  stroke: "#10b981",
                  textColor: "text-emerald-600",
                },
                {
                  label: "Dine-In",
                  count: s?.ordersByType?.dineIn ?? 0,
                  stroke: "#6366f1",
                  textColor: "text-indigo-600",
                },
                {
                  label: "Takeaway",
                  count: s?.ordersByType?.takeaway ?? 0,
                  stroke: "#f97316",
                  textColor: "text-orange-600",
                },
              ].map((ring) => (
                <Ring
                  key={ring.label}
                  value={ring.count}
                  max={s?.totalOrders ?? 1}
                  size={86}
                  sw={7}
                  stroke={ring.stroke}
                  label={ring.label}
                  sub={`${pct(ring.count, s?.totalOrders ?? 1)}%`}
                  textColor={ring.textColor}
                />
              ))}
            </div>
            <div className="space-y-2.5 pt-4 border-t border-slate-50">
              {[
                {
                  label: "Total Orders",
                  val: s?.totalOrders ?? 0,
                  dot: "bg-slate-400",
                },
                {
                  label: "Delivery Orders",
                  val: s?.ordersByType?.delivery ?? 0,
                  dot: "bg-teal-400",
                },
                {
                  label: "Cancelled",
                  val: s?.cancelledOrders ?? 0,
                  dot: "bg-red-400",
                },
              ].map(({ label, val, dot }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`}
                    />
                    <span className="text-xs text-slate-500 font-medium">
                      {label}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-800 tabular-nums">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </MetricPanel>
        </div>
      </div>

      {/* ── ROW 2: Sales + Payments + Floor & Discounts ──────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* Sales Breakdown */}
        <div className="md:col-span-1 lg:col-span-4">
          <MetricPanel icon={BarChart2} title="Sales Breakdown">
            <div>
              {[
                {
                  label: "Gross Sales",
                  val: s?.grossSales,
                  note: "before deductions",
                  type: "pos",
                },
                {
                  label: "Total Discounts",
                  val: s?.totalDiscount,
                  note: "applied today",
                  type: "neg",
                },
                {
                  label: "Tax Collected",
                  val: s?.totalTax,
                  note: "GST / service tax",
                  type: "neu",
                },
                {
                  label: "Service Charge",
                  val: s?.totalServiceCharge ?? 0,
                  note: "on orders",
                  type: "neu",
                },
              ].map(({ label, val, note, type }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {label}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {note}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-extrabold tabular-nums ${type === "neg" ? "text-red-500" : "text-slate-700"}`}
                  >
                    {type === "neg" ? "-" : ""}
                    {formatNumber(val ?? 0, true)}
                  </span>
                </div>
              ))}
            </div>

            {/* Net sales + Paid + Due summary */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3 ring-1 ring-emerald-100">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">
                    Net Sales
                  </p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                    after all deductions
                  </p>
                </div>
                <p className="text-xl font-extrabold text-emerald-600 tabular-nums">
                  {formatNumber(s?.netSales ?? 0, true)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col px-3.5 py-2.5 rounded-xl bg-blue-50 ring-1 ring-blue-100">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wide mb-0.5">
                    Collected
                  </span>
                  <span className="text-sm font-extrabold text-blue-700 tabular-nums">
                    {formatNumber(s?.paidAmount ?? 0, true)}
                  </span>
                </div>
                <div className="flex flex-col px-3.5 py-2.5 rounded-xl bg-amber-50 ring-1 ring-amber-100">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide mb-0.5">
                    Outstanding
                  </span>
                  <span className="text-sm font-extrabold text-amber-700 tabular-nums">
                    {formatNumber(s?.dueAmount ?? 0, true)}
                  </span>
                </div>
              </div>
            </div>
          </MetricPanel>
        </div>

        {/* Payment Breakdown */}
        <div className="md:col-span-1 lg:col-span-4 overflow-hidden bg-white rounded-2xl shadow">
          {/* Header */}
          <div className="relative bg-primary-500 px-5 pt-5 pb-4 overflow-hidden">
            {/* highlight line */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              }}
            />

            {/* glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />

            <div className="relative z-10 text-white">
              <p className="text-[9px] font-extrabold text-white/70 uppercase tracking-[0.14em] mb-1.5">
                Total Collected
              </p>

              <p className="text-3xl font-extrabold text-white tracking-tight tabular-nums mb-4">
                <Counter to={totalCollected} prefix={"\u20B9"} />
              </p>

              {/* KPI strip */}
              <div className="grid grid-cols-3 gap-1">
                {[
                  {
                    label: "Txns",
                    val:
                      (d?.paymentBreakdown?.cash?.count ?? 0) +
                      (d?.paymentBreakdown?.card?.count ?? 0) +
                      (d?.paymentBreakdown?.upi?.count ?? 0),
                  },
                  {
                    label: "Tax",
                    val: formatNumber(Math.round(s?.totalTax ?? 0), true),
                  },
                  {
                    label: "Disc",
                    val: formatNumber(Math.round(s?.totalDiscount ?? 0), true),
                  },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl px-2 py-2 text-center"
                  >
                    <p className="text-sm font-extrabold text-white tabular-nums">
                      {val}
                    </p>
                    <p className="text-[9px] text-white/70 font-semibold mt-0.5 uppercase tracking-wide">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="p-4 space-y-2.5">
            {d?.paymentBreakdown ? (
              [
                {
                  mode: "Cash",
                  key: "cash",
                  Icon: Wallet,
                  iconBg: "bg-emerald-100",
                  iconCl: "text-emerald-600",
                  bar: "bg-emerald-400",
                  ring: "ring-emerald-100",
                  bg: "bg-emerald-50/50",
                  valCl: "text-emerald-700",
                },
                {
                  mode: "Card",
                  key: "card",
                  Icon: CreditCard,
                  iconBg: "bg-sky-100",
                  iconCl: "text-sky-600",
                  bar: "bg-sky-400",
                  ring: "ring-sky-100",
                  bg: "bg-sky-50/50",
                  valCl: "text-sky-700",
                },
                {
                  mode: "UPI",
                  key: "upi",
                  Icon: Smartphone,
                  iconBg: "bg-violet-100",
                  iconCl: "text-violet-600",
                  bar: "bg-violet-400",
                  ring: "ring-violet-100",
                  bg: "bg-violet-50/50",
                  valCl: "text-violet-700",
                },
              ].map(
                ({ mode, key, Icon, iconBg, iconCl, bar, ring, bg, valCl }) => {
                  const info = d.paymentBreakdown[key];
                  if (!info) return null;

                  return (
                    <div
                      key={mode}
                      className={`rounded-xl ring-1 ${ring} ${bg} px-3.5 py-3`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon size={14} className={iconCl} strokeWidth={2} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800">
                            {mode}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {info.count} txn{info.count !== 1 ? "s" : ""}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p
                            className={`text-sm font-extrabold tabular-nums ${valCl}`}
                          >
                            {formatNumber(info.amount, true)}
                          </p>
                          <p className="text-[10px] text-slate-400 tabular-nums">
                            {pct(info.amount, totalCollected)}%
                          </p>
                        </div>
                      </div>

                      <Bar
                        value={info.amount}
                        max={totalCollected}
                        colorClass={bar}
                        h="h-1.5"
                      />
                    </div>
                  );
                },
              )
            ) : (
              <Empty icon={CreditCard} message="No payment data" />
            )}
          </div>
        </div>

        {/* Floor + Discounts stacked */}
        <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-5">
          <MetricPanel icon={Store} title={"Floor Performance"}>
            {d?.floorBreakdown?.length > 0 ? (
              <div className="space-y-4">
                {d.floorBreakdown.map((f, i) => (
                  <div key={f.floorName}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-1.5 h-8 rounded-full flex-shrink-0 ${i === 0 ? "bg-indigo-400" : "bg-orange-400"}`}
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-none">
                            {f.floorName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {f.orderCount} orders
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-slate-900 tabular-nums">
                          {formatNumber(f.sales, true)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 tabular-nums">
                          {/* {pct(f.sales, s?.netSales ?? 1)}% of net */}
                        </p>
                      </div>
                    </div>
                    {/* <Bar
                      value={f.sales}
                      max={s?.netSales ?? 1}
                      colorClass={i === 0 ? "bg-indigo-400" : "bg-orange-400"}
                      h="h-2"
                    /> */}
                  </div>
                ))}
              </div>
            ) : (
              <NoDataFound icon={Store} title="No floor data available" />
            )}
          </MetricPanel>

          {/* Adjustment & Due Summary */}
          {s &&
            (s.adjustmentCount > 0 || s.dueAmount > 0 || s.ncOrders > 0) && (
              <MetricPanel icon={SlidersHorizontal} title="Adjustments & Dues">
                <div className="space-y-0">
                  {[
                    s.adjustmentCount > 0 && {
                      label: "Adjustments Made",
                      value: s.adjustmentCount,
                      cls: "text-slate-800",
                    },
                    s.adjustmentCount > 0 && {
                      label: "Adjustment Amount",
                      value: formatNumber(s.adjustmentAmount, true),
                      cls: "text-red-600",
                    },
                    s.ncOrders > 0 && {
                      label: "NC Orders",
                      value: s.ncOrders,
                      cls: "text-slate-800",
                    },
                    s.ncAmount > 0 && {
                      label: "NC Amount Waived",
                      value: formatNumber(s.ncAmount, true),
                      cls: "text-amber-600",
                    },
                    s.dueAmount > 0 && {
                      label: "Total Due Amount",
                      value: formatNumber(s.dueAmount, true),
                      cls: "text-red-700",
                    },
                    s.paidAmount > 0 && {
                      label: "Total Paid Amount",
                      value: formatNumber(s.paidAmount, true),
                      cls: "text-emerald-700",
                    },
                  ]
                    .filter(Boolean)
                    .map(({ label, value, cls }, i, arr) => (
                      <div
                        key={label}
                        className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? "border-b border-slate-50" : ""}`}
                      >
                        <span className="text-[11.5px] text-slate-500 font-medium">
                          {label}
                        </span>
                        <span
                          className={`text-[12px] font-bold tabular-nums ${cls}`}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                </div>
              </MetricPanel>
            )}
        </div>
      </div>

      {/* ── ROW 3: Categories + Top Items ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Breakdown */}
        <MetricPanel icon={Layers} title={"Revenue by Category"}>
          {d?.categoryBreakdown?.length > 0 ? (
            <>
              <div className="space-y-4">
                {visibleCats.map((cat, i) => (
                  <div
                    key={cat.categoryName}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-slate-800 truncate pr-3">
                          {cat.categoryName}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <span className="hidden sm:block text-[10px] text-slate-400 font-medium tabular-nums">
                            {cat.totalQuantity} sold
                          </span>
                          <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                            {formatNumber(cat.totalSales, true)}
                          </span>
                        </div>
                      </div>
                      <Bar
                        value={cat.totalSales}
                        max={maxCat}
                        colorClass={BAR_COLORS[i % BAR_COLORS.length]}
                        h="h-1.5"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {d.categoryBreakdown.length > CAT_LIMIT && (
                <ShowMoreBtn
                  expanded={showAllCats}
                  onClick={() =>
                    navigate(
                      `${ROUTE_PATHS.REPORTS_CATEGORY_SALES}?date=${date}`,
                    )
                  }
                  total={d.categoryBreakdown.length}
                  showing={CAT_LIMIT}
                />
              )}
            </>
          ) : (
            <NoDataFound icon={Layers} title="No category data for this day" />
          )}
        </MetricPanel>

        {/* Top Selling Items */}
        <MetricPanel icon={Star} title={"Top Selling Items"}>
          {d?.topSellingItems?.length > 0 ? (
            <>
              <div className="space-y-4">
                {visibleItems.map((item, i) => (
                  <div key={item.itemName} className="flex items-center gap-3">

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Row header */}
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-slate-800 truncate pr-3">
                          {item.itemName}
                        </p>

                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          {/* <span
                            className={`hidden sm:inline text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                              BADGE_STYLES[i % BADGE_STYLES.length]
                            }`}
                          >
                            {item.categoryName}
                          </span> */}

                          <span className="hidden sm:block text-[10px] text-slate-400 font-medium tabular-nums">
                            {item.quantitySold} sold
                          </span>

                          <span className="hidden sm:block text-[10px] text-slate-400 font-medium tabular-nums">
                            {item.orderCount} orders
                          </span>

                          <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                            {formatNumber(item.totalSales, true)}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <Bar
                        value={item.totalSales}
                        max={maxItem}
                        colorClass={BAR_COLORS[i % BAR_COLORS.length]}
                        h="h-1.5"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {d.topSellingItems.length > ITEM_LIMIT && (
                <ShowMoreBtn
                  expanded={showAllItems}
                  onClick={() =>
                    navigate(`${ROUTE_PATHS.REPORTS_ITEM_SALES}?date=${date}`)
                  }
                  total={d.topSellingItems.length}
                  showing={ITEM_LIMIT}
                />
              )}
            </>
          ) : (
            <NoDataFound icon={ShoppingBag} title="No items sold today" />
          )}
        </MetricPanel>
      </div>

      {/* ── ROW 4: Staff Performance ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        <MetricPanel icon={BadgePercent} title={"Discounts Applied"}>
          {d?.discountsApplied?.length > 0 ? (
            <>
              <div className="space-y-2">
                {d.discountsApplied.map((disc) => (
                  <div
                    key={disc.discountName}
                    className="flex items-center justify-between bg-amber-50 ring-1 ring-amber-100 rounded-xl px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Tag
                          size={12}
                          className="text-amber-600"
                          strokeWidth={2}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {disc.discountName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {disc.discountType} &middot; {disc.timesApplied}x
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-extrabold text-red-500 tabular-nums">
                      -{formatNumber(disc.totalAmount, true)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-500">
                  Total Discounts
                </span>
                <span className="text-sm font-extrabold text-red-500 tabular-nums">
                  -{formatNumber(s?.totalDiscount ?? 0, true)}
                </span>
              </div>
            </>
          ) : (
            <NoDataFound icon={Tag} title="No discounts applied today" />
          )}
        </MetricPanel>

        <div>
          {d?.staffPerformance?.length > 0 ? (
            <>
              <div className="space-y-4">
                {visibleStaff.map((staff) => (
                  <div
                    key={staff.userName}
                    className="overflow-hidden bg-white rounded-2xl shadow"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-slate-50">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-base font-extrabold text-slate-900">
                            {staff.userName ?? "Unknown"}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <UserCheck
                              size={10}
                              className="text-indigo-500"
                              strokeWidth={2.5}
                            />
                            <span className="text-xs font-bold text-indigo-600">
                              {staff.roleName ?? "Staff"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        {[
                          { label: "Orders Handled", val: staff.ordersHandled },
                          {
                            label: "Total Sales",
                            val: formatNumber(staff.totalSales, true),
                          },
                          {
                            label: "Avg Order",
                            val: formatNumber(
                              Math.round(staff.avgOrderValue, true),
                            ),
                          },
                          {
                            label: "Completion",
                            val: `${pct(s?.completedOrders, staff.ordersHandled)}%`,
                          },
                        ].map(({ label, val }) => (
                          <div key={label} className="text-center">
                            <p className="text-lg font-extrabold text-slate-900 tabular-nums">
                              {val}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">
                              {label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-5 py-4 grid grid-cols-1 gap-4 sm:gap-5">
                      {[
                        {
                          label: "Order Completion Rate",
                          value: s?.completedOrders ?? 0,
                          total: staff.ordersHandled,
                          bar: "bg-emerald-400",
                        },
                        {
                          label: "Share of Total Orders",
                          value: staff.ordersHandled,
                          total: s?.totalOrders ?? 1,
                          bar: "bg-indigo-400",
                        },
                      ].map(({ label, value, total, bar }) => (
                        <div key={label}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500">
                              {label}
                            </span>
                            <span className="text-xs font-extrabold text-slate-800 tabular-nums">
                              {pct(value, total)}%
                            </span>
                          </div>
                          <Bar
                            value={value}
                            max={total}
                            colorClass={bar}
                            h="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {d.staffPerformance.length > STAFF_LIMIT && (
                <ShowMoreBtn
                  expanded={showAllStaff}
                  onClick={() =>
                    navigate(`${ROUTE_PATHS.REPORTS_STAFF_SALES}?date=${date}`)
                  }
                  total={d.staffPerformance.length}
                  showing={STAFF_LIMIT}
                />
              )}
            </>
          ) : (
            <NoDataFound
              icon={UserCheck}
              title="No staff data available"
              className="bg-white"
            />
          )}
        </div>
      </div>

      {d?.dueCollections?.orders?.length > 0 && (
        <MetricPanel
          icon={IndianRupee}
          title="Due Collections"
          desc="Payments collected against outstanding dues today"
          right={
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400 mb-0.5">
                  Collected
                </span>
                <span className="text-[15px] font-extrabold text-emerald-600 tabular-nums leading-none">
                  {formatNumber(d.dueCollections.totalCollected, true)}
                </span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400 mb-0.5">
                  Orders
                </span>
                <span className="text-[15px] font-extrabold text-slate-700 tabular-nums leading-none">
                  {d.dueCollections.count}
                </span>
              </div>
            </div>
          }
        >
          <div className="space-y-2">
            {d.dueCollections.orders.map((due, idx) => (
              <button
                key={due.paymentId}
                onClick={() =>
                  navigate(
                    `${ROUTE_PATHS.ORDER_DETAILS}?orderId=${due.orderId}`,
                  )
                }
                className="w-full text-left group flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all duration-150 bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm active:scale-[0.99]"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center flex-shrink-0 transition-colors">
                  <span className="text-[10px] font-black text-slate-500">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md leading-none">
                      {due.orderNumber}
                    </span>
                    {due.customerName && (
                      <span className="text-[12px] font-semibold text-slate-700 truncate leading-none">
                        {due.customerName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-400">
                      Bill:{" "}
                      <span className="font-semibold text-slate-600">
                        {formatNumber(due.orderTotal, true)}
                      </span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                    <span className="text-[10px] text-slate-400">
                      {formatDate(due.createdAt, "longTime")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md bg-slate-100 text-slate-500 capitalize">
                    {due.paymentMode}
                  </span>
                  <p className="text-[14px] font-extrabold text-emerald-600 tabular-nums leading-none">
                    +{formatNumber(due.collectedAmount, true)}
                  </p>
                  <ChevronRight
                    size={15}
                    className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-700">
              Total Due Recovered Today
            </span>
            <span className="text-[14px] font-extrabold text-emerald-700 tabular-nums">
              {formatNumber(d.dueCollections.totalCollected, true)}
            </span>
          </div>
        </MetricPanel>
      )}

      {/* ── ROW 5: Order Log ────────────────────────────────────────────── */}
      <div>
        {/* Order stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            {
              label: "Total Orders",
              val: s?.totalOrders ?? 0,
              Icon: Hash,
              color: "slate",
            },
            {
              label: "Completed",
              val: s?.completedOrders ?? 0,
              Icon: CheckCircle2,
              color: "emerald",
            },
            {
              label: "Billed",
              val: billedCount,
              Icon: ReceiptText,
              color: "sky",
            },
            {
              label: "Cancelled",
              val: s?.cancelledOrders ?? 0,
              Icon: Ban,
              color: "red",
            },
          ].map(({ label, val, color, Icon }) => (
            <StatCard
              icon={Icon}
              title={label}
              value={val}
              color={color}
              variant="v5"
            />
          ))}
        </div>

        <SmartTable
          title="All Orders"
          totalcount={d?.orders?.length}
          data={d?.orders}
          columns={columns}
          actions={rowActions}
        />
      </div>
    </div>
  );
}
