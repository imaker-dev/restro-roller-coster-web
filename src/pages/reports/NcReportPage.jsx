import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import { fetchNcReport } from "../../redux/slices/reportSlice";
import LoadingOverlay from "../../components/LoadingOverlay";
import NoDataFound from "../../layout/NoDataFound";
import StatCard from "../../components/StatCard";
import { formatNumber, pct } from "../../utils/numberFormatter";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import {
  BadgeIndianRupee,
  CalendarDays,
  MessageCircleWarning,
  UserCog,
  UtensilsCrossed,
  RotateCcw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  Receipt,
  Tag,
  User,
  MapPin,
  Clock,
  Package,
  Download,
} from "lucide-react";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import { exportNcReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";
import { handleResponse } from "../../utils/helpers";

/* ─── constants ───────────────────────────────────────────────────────────── */
const DOT_COLORS = [
  "bg-rose-400",
  "bg-amber-400",
  "bg-violet-400",
  "bg-sky-400",
  "bg-emerald-400",
  "bg-orange-400",
  "bg-teal-400",
  "bg-pink-400",
  "bg-cyan-400",
  "bg-indigo-400",
];
const DOT_COLORS_ALT = [
  "bg-indigo-400",
  "bg-teal-400",
  "bg-orange-400",
  "bg-pink-400",
  "bg-cyan-400",
  "bg-sky-400",
  "bg-violet-400",
  "bg-rose-400",
];

const STATUS_CFG = {
  completed: {
    label: "Completed",
    cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  billed: {
    label: "Billed",
    cls: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  },
  confirmed: {
    label: "Confirmed",
    cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-700 ring-1 ring-red-200",
  },
};

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const statusBadge = (s) => {
  const c = STATUS_CFG[s] ?? {
    label: s,
    cls: "bg-slate-50 text-slate-500 ring-1 ring-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${c.cls}`}
    >
      {c.label}
    </span>
  );
};

const ncLevelBadge = (level) =>
  level === "item" ? (
    <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 ring-1 ring-violet-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
      <Layers size={9} strokeWidth={2.5} />
      Item
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 ring-1 ring-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
      <Receipt size={9} strokeWidth={2.5} />
      Order
    </span>
  );

/* ─── Animated mini-bar ───────────────────────────────────────────────────── */
function MiniBar({ value, max, colorClass = "bg-violet-400" }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(max ? (value / max) * 100 : 0), 150);
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-700 ease-out`}
          style={{ width: `${w}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-slate-400 tabular-nums w-9 text-right flex-shrink-0">
        {pct(value, max)}
      </span>
    </div>
  );
}

/* ─── Sortable Th ─────────────────────────────────────────────────────────── */
function Th({ children, sortKey, activeSort, onSort, align = "left" }) {
  const isActive = activeSort?.key === sortKey;
  const isAsc = isActive && activeSort?.dir === "asc";
  return (
    <th
      onClick={() => sortKey && onSort?.(sortKey)}
      className={`px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap select-none
        ${align === "right" ? "text-right" : "text-left"}
        ${sortKey ? "cursor-pointer hover:text-slate-600 transition-colors" : ""}`}
    >
      <span className="inline-flex items-center gap-1.5">
        {children}
        {sortKey && (
          <span className="text-slate-300">
            {isActive ? (
              isAsc ? (
                <ArrowUp size={10} strokeWidth={2.5} />
              ) : (
                <ArrowDown size={10} strokeWidth={2.5} />
              )
            ) : (
              <ArrowUpDown size={10} strokeWidth={2} />
            )}
          </span>
        )}
      </span>
    </th>
  );
}

/* ─── Section wrapper ─────────────────────────────────────────────────────── */
function Section({ title, subtitle, icon: Icon, badge, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
            <Icon size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-slate-900 leading-none">
              {title}
            </p>
            {subtitle && (
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {badge && <div className="flex-shrink-0">{badge}</div>}
      </div>
      {children}
    </div>
  );
}

/* ─── Order NC table ──────────────────────────────────────────────────────── */
function OrderNCTable({ rows }) {
  const [sort, setSort] = useState({ key: "ncAmount", dir: "desc" });

  const sorted = [...rows].sort((a, b) => {
    const va = sort.key === "ncAmount" ? a.ncAmount : new Date(a.createdAt);
    const vb = sort.key === "ncAmount" ? b.ncAmount : new Date(b.createdAt);
    return sort.dir === "asc" ? va - vb : vb - va;
  });
  const onSort = (key) =>
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "desc" ? "asc" : "desc",
    }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <Th>#</Th>
            <Th sortKey="createdAt" activeSort={sort} onSort={onSort}>
              Order
            </Th>
            <Th>Table</Th>
            <Th>Reason</Th>
            <Th>Approved By</Th>
            <Th align="right">Subtotal</Th>
            <Th
              align="right"
              sortKey="ncAmount"
              activeSort={sort}
              onSort={onSort}
            >
              NC Amount
            </Th>
            <Th align="right">Status</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {sorted.map((order, i) => {
            const isFullNC =
              order.totalAmount === 0 || order.ncAmount >= order.subtotal;
            return (
              <tr
                key={order.orderId}
                className="hover:bg-slate-50/60 transition-colors group"
              >
                <td className="px-4 py-3 w-10">
                  <span className="text-xs font-bold text-slate-300 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-bold text-slate-900 whitespace-nowrap">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {order.ncAt
                      ? `${formatDate(order.ncAt, "long")} · ${formatDate(order.ncAt, "time")}`
                      : formatDate(order.createdAt, "long")}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-sm font-semibold text-slate-700">
                    {order.tableNumber}
                  </p>
                  <p className="text-xs text-slate-400">{order.floorName}</p>
                </td>
                <td className="px-4 py-3">
                  {order.ncReason ? (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 ring-1 ring-amber-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
                      {order.ncReason}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300 italic">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-slate-600">
                    {order.ncApprovedBy ?? (
                      <span className="text-slate-300">—</span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-slate-600 tabular-nums">
                    {formatNumber(order.subtotal, true)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <p className="text-sm font-extrabold text-red-600 tabular-nums">
                    {formatNumber(order.ncAmount, true)}
                  </p>
                  {isFullNC && (
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">
                      Full NC
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {statusBadge(order.status)}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="border-t-2 border-slate-100 bg-slate-50">
          <tr>
            <td
              colSpan={6}
              className="px-4 py-3 text-xs font-bold text-slate-500"
            >
              Total
            </td>
            <td className="px-4 py-3 text-right text-xs font-extrabold text-red-600 tabular-nums">
              {formatNumber(
                rows.reduce((s, r) => s + r.ncAmount, 0),
                true,
              )}
            </td>
            <td className="px-4 py-3" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/* ─── Item NC table ───────────────────────────────────────────────────────── */
function ItemNCTable({ rows }) {
  const [sort, setSort] = useState({ key: "ncAmount", dir: "desc" });

  const sorted = [...rows].sort((a, b) => {
    const va =
      sort.key === "ncAmount"
        ? a.ncAmount
        : new Date(a.ncAt ?? a.createdAt ?? 0);
    const vb =
      sort.key === "ncAmount"
        ? b.ncAmount
        : new Date(b.ncAt ?? b.createdAt ?? 0);
    return sort.dir === "asc" ? va - vb : vb - va;
  });
  const onSort = (key) =>
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "desc" ? "asc" : "desc",
    }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <Th>#</Th>
            <Th>Item Name</Th>
            <Th>Order</Th>
            <Th>Table</Th>
            <Th>Reason</Th>
            <Th>Applied By</Th>
            <Th align="right">Qty</Th>
            <Th
              align="right"
              sortKey="ncAmount"
              activeSort={sort}
              onSort={onSort}
            >
              NC Amount
            </Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {sorted.map((item, i) => (
            <tr
              key={item.orderItemId}
              className="hover:bg-slate-50/60 transition-colors"
            >
              <td className="px-4 py-3 w-10">
                <span className="text-xs font-bold text-slate-300 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm font-bold text-slate-900">
                  {item.itemName}
                </p>
                {item.variantName && (
                  <span className="text-[10px] font-semibold text-slate-400">
                    {item.variantName}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <p className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                  {item.orderNumber}
                </p>
                {item.ncAt && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatDate(item.ncAt, "long")} ·{" "}
                    {formatDate(item.ncAt, "time")}
                  </p>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <p className="text-sm font-semibold text-slate-700">
                  {item.tableNumber}
                </p>
                <p className="text-xs text-slate-400">{item.floorName}</p>
              </td>
              <td className="px-4 py-3">
                {item.ncReason ? (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 ring-1 ring-amber-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {item.ncReason}
                  </span>
                ) : (
                  <span className="text-xs text-slate-300 italic">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="text-sm font-medium text-slate-600">
                  {item.ncBy ?? <span className="text-slate-300">—</span>}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-sm font-semibold text-slate-700 tabular-nums">
                  ×{item.quantity}
                </span>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <p className="text-sm font-extrabold text-red-600 tabular-nums">
                  {formatNumber(item.ncAmount, true)}
                </p>
                <p className="text-[10px] text-slate-400 tabular-nums">
                  @ {formatNumber(item.unitPrice, true)}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t-2 border-slate-100 bg-slate-50">
          <tr>
            <td
              colSpan={7}
              className="px-4 py-3 text-xs font-bold text-slate-500"
            >
              Total
            </td>
            <td className="px-4 py-3 text-right text-xs font-extrabold text-red-600 tabular-nums">
              {formatNumber(
                rows.reduce((s, r) => s + r.ncAmount, 0),
                true,
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/* ─── By Date table ───────────────────────────────────────────────────────── */
function ByDateTable({ rows }) {
  const totals = {
    orderNC: rows.reduce((s, r) => s + (r.orderNCCount ?? 0), 0),
    orderAmt: rows.reduce((s, r) => s + (r.orderNCAmount ?? 0), 0),
    itemNC: rows.reduce((s, r) => s + (r.itemNCCount ?? 0), 0),
    itemAmt: rows.reduce((s, r) => s + (r.itemNCAmount ?? 0), 0),
    total: rows.reduce((s, r) => s + (r.totalNCAmount ?? 0), 0),
  };

  return (
    <MetricPanel
      title="NC by Date"
      desc="Daily no-charge breakdown"
      icon={CalendarDays}
      right={
        <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-3 py-1">
          {rows.length} day{rows.length !== 1 ? "s" : ""}
        </span>
      }
      noPad
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <Th>Date</Th>
              <Th align="right">Order NC</Th>
              <Th align="right">Order NC Amt</Th>
              <Th align="right">Item NC</Th>
              <Th align="right">Item NC Amt</Th>
              <Th align="right">Total NC</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((row) => (
              <tr
                key={row.date}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="text-sm font-bold text-slate-800 whitespace-nowrap">
                    {formatDate(row.date, "long")}
                  </p>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-slate-700 tabular-nums">
                    {row.orderNCCount ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-slate-700 tabular-nums">
                    {formatNumber(row.orderNCAmount, true)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-slate-700 tabular-nums">
                    {row.itemNCCount ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-slate-700 tabular-nums">
                    {formatNumber(row.itemNCAmount, true)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-extrabold text-slate-900 tabular-nums whitespace-nowrap">
                    {formatNumber(row.totalNCAmount, true)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-slate-100 bg-slate-50">
            <tr>
              <td className="px-4 py-3 text-xs font-bold text-slate-500">
                Total
              </td>
              <td className="px-4 py-3 text-right text-xs font-extrabold text-slate-700 tabular-nums">
                {totals.orderNC}
              </td>
              <td className="px-4 py-3 text-right text-xs font-extrabold text-slate-700 tabular-nums">
                {formatNumber(totals.orderAmt, true)}
              </td>
              <td className="px-4 py-3 text-right text-xs font-extrabold text-slate-700 tabular-nums">
                {totals.itemNC}
              </td>
              <td className="px-4 py-3 text-right text-xs font-extrabold text-slate-700 tabular-nums">
                {formatNumber(totals.itemAmt, true)}
              </td>
              <td className="px-4 py-3 text-right text-xs font-extrabold text-slate-900 tabular-nums">
                {formatNumber(totals.total, true)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </MetricPanel>
  );
}

/* ─── Generic breakdown table ─────────────────────────────────────────────── */
function BreakdownTable({
  title,
  subtitle,
  icon,
  rows,
  labelKey,
  dotColors = DOT_COLORS,
}) {
  const [sort, setSort] = useState({ key: "totalAmount", dir: "desc" });

  const getAmt = (r) => parseFloat(r.totalAmount ?? r.totalNCAmount ?? 0);
  const getCount = (r) => r.count ?? r.ncCount ?? 0;

  const sorted = [...rows].sort((a, b) => {
    const va = sort.key === "count" ? getCount(a) : getAmt(a);
    const vb = sort.key === "count" ? getCount(b) : getAmt(b);
    return sort.dir === "asc" ? va - vb : vb - va;
  });

  const onSort = (key) =>
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "desc" ? "asc" : "desc",
    }));

  const totalAmt = rows.reduce((s, r) => s + getAmt(r), 0);
  const maxAmt = Math.max(...rows.map(getAmt));

  return (
    <MetricPanel
      title={title}
      subtitle={subtitle}
      icon={icon}
      right={
        <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-3 py-1">
          {rows.length} {labelKey === "userName" ? "staff" : "entries"}
        </span>
      }
      noPad
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <Th>#</Th>
              <Th>
                {labelKey === "userName"
                  ? "Staff Member"
                  : labelKey === "reason"
                    ? "Reason"
                    : "Item"}
              </Th>
              <Th
                align="right"
                sortKey="count"
                activeSort={sort}
                onSort={onSort}
              >
                Count
              </Th>
              <Th>Share</Th>
              <Th
                align="right"
                sortKey="totalAmount"
                activeSort={sort}
                onSort={onSort}
              >
                NC Amount
              </Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map((row, i) => {
              const dot = dotColors[i % dotColors.length];
              const amt = getAmt(row);
              return (
                <tr
                  key={(row[labelKey] ?? "") + i}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-4 py-3 w-10">
                    <span className="text-xs font-bold text-slate-300 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`}
                      />
                      <span className="text-sm font-semibold text-slate-800 truncate max-w-[180px]">
                        {row[labelKey] ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-slate-700 tabular-nums">
                      {getCount(row)}
                    </span>
                  </td>
                  <td className="px-4 py-3 w-36">
                    <MiniBar value={amt} max={maxAmt} colorClass={dot} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-extrabold text-slate-900 tabular-nums whitespace-nowrap">
                      {formatNumber(amt, true)}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 tabular-nums">
                      {pct(amt, totalAmt)} of total
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t-2 border-slate-100 bg-slate-50">
            <tr>
              <td
                colSpan={2}
                className="px-4 py-3 text-xs font-bold text-slate-500"
              >
                Total
              </td>
              <td className="px-4 py-3 text-right text-xs font-extrabold text-slate-700 tabular-nums">
                {rows.reduce((s, r) => s + getCount(r), 0)}
              </td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-right text-xs font-extrabold text-slate-900 tabular-nums">
                {formatNumber(totalAmt, true)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </MetricPanel>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
const NcReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { ncReport, isFetchingNcReport } = useSelector((state) => state.report);
  const { isExportingNcReport } = useSelector((state) => state.exportReport);
  const [dateRange, setDateRange] = useState();
  const [activeTab, setActiveTab] = useState("order");

  const fetchReport = () => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;
    dispatch(fetchNcReport({ outletId, dateRange }));
  };

  useEffect(() => {
    fetchReport();
  }, [outletId, dateRange]);

  const { summary, orderNC, itemNC, breakdowns } = ncReport || {};
  const orderRows = orderNC?.data ?? [];
  const itemRows = itemNC?.data ?? [];
  const byDate = breakdowns?.byDate ?? [];
  const byReason = breakdowns?.byReason ?? [];
  const byStaff = breakdowns?.byStaff ?? [];
  const topItems = breakdowns?.topNCItems ?? [];

  const stats = [
    {
      label: "Total NC Amount",
      value: formatNumber(summary?.totalNCAmount, true),
      sub: "Combined order + item NC",
      icon: BadgeIndianRupee,
      color: "red",
    },
    {
      label: "Order NC Amount",
      value: formatNumber(summary?.orderNCAmount, true),
      sub: `${summary?.totalOrderNC ?? 0} orders with NC`,
      icon: Receipt,
      color: "amber",
    },
    {
      label: "Item NC Amount",
      value: formatNumber(summary?.itemNCAmount, true),
      sub: `${summary?.totalItemNC ?? 0} items marked NC`,
      icon: UtensilsCrossed,
      color: "violet",
    },
    {
      label: "Total NC Entries",
      value: formatNumber(summary?.totalNCEntries),
      sub: "All NC records",
      icon: Hash,
      color: "sky",
    },
  ];

  const hasData =
    orderRows.length > 0 || itemRows.length > 0 || byDate.length > 0;

  if (isFetchingNcReport) return <LoadingOverlay />;

  const handleExportNcReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `NC-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportNcReport({ outletId, dateRange })),
      (res) => {
        downloadBlob({
          data: res.payload,
          fileName,
        });
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="NC (No Charge) Report"
        showBackButton
        rightContent={
          <CustomDateRangePicker value={dateRange} onChange={setDateRange} />
        }
        actions={[
          {
            label: "Export",
            type: "export",
            icon: Download,
            onClick: () => handleExportNcReport(),
            loading: isExportingNcReport,
            loadingText: "Exporting...",
          },
          {
            label: "Refresh",
            type: "refresh",
            icon: RotateCcw,
            onClick: fetchReport,
            loading: isFetchingNcReport,
            loadingText: "Refreshing...",
          },
        ]}
      />

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <StatCard
            key={i}
            icon={s.icon}
            title={s.label}
            value={s.value}
            subtitle={s.sub}
            color={s.color}
            variant="v9"
          />
        ))}
      </div>

      {/* ── Empty state ── */}
      {!hasData && !isFetchingNcReport && (
        <NoDataFound
          icon={UtensilsCrossed}
          title="No NC records found"
          subtitle={
            dateRange?.startDate
              ? "No no-charge entries in this date range"
              : "Select a date range to view the NC report"
          }
          className="bg-white"
        />
      )}

      {hasData && (
        <div className="space-y-5">
          {/* By Date */}
          {byDate.length > 0 && <ByDateTable rows={byDate} />}

          {/* Order NC + Item NC tabbed */}
          {(orderRows.length > 0 || itemRows.length > 0) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Tab bar */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 pt-0 pb-0">
                <div className="flex">
                  {[
                    {
                      id: "order",
                      label: "Order NC",
                      count: orderRows.length,
                      icon: Receipt,
                    },
                    {
                      id: "item",
                      label: "Item NC",
                      count: itemRows.length,
                      icon: Package,
                    },
                  ].map(({ id, label, count, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 transition-all duration-150 -mb-px
                        ${
                          activeTab === id
                            ? "border-slate-900 text-slate-900"
                            : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200"
                        }`}
                    >
                      <Icon size={14} strokeWidth={2.5} />
                      {label}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                        ${activeTab === id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"}`}
                      >
                        {count}
                      </span>
                    </button>
                  ))}
                </div>
                {activeTab === "order" && (
                  <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-full px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                      {formatNumber(summary?.orderNCAmount, true)} total
                    </span>
                  </div>
                )}
                {activeTab === "item" && (
                  <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-100 rounded-full px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">
                      {formatNumber(summary?.itemNCAmount, true)} total
                    </span>
                  </div>
                )}
              </div>

              {/* Tab content */}
              <div>
                {activeTab === "order" &&
                  (orderRows.length > 0 ? (
                    <OrderNCTable rows={orderRows} />
                  ) : (
                    <p className="text-center text-sm text-slate-400 font-medium py-10">
                      No order NC records
                    </p>
                  ))}
                {activeTab === "item" &&
                  (itemRows.length > 0 ? (
                    <ItemNCTable rows={itemRows} />
                  ) : (
                    <p className="text-center text-sm text-slate-400 font-medium py-10">
                      No item NC records
                    </p>
                  ))}
              </div>
            </div>
          )}

          {/* Reason + Staff breakdowns */}
          {(byReason.length > 0 || byStaff.length > 0) && (
            <div className="grid lg:grid-cols-2 gap-5">
              {byReason.length > 0 && (
                <BreakdownTable
                  title="NC by Reason"
                  subtitle="Why no-charges were applied"
                  icon={MessageCircleWarning}
                  rows={byReason}
                  labelKey="reason"
                  dotColors={[
                    "bg-rose-400",
                    "bg-amber-400",
                    "bg-violet-400",
                    "bg-sky-400",
                    "bg-emerald-400",
                    "bg-orange-400",
                    "bg-pink-400",
                    "bg-cyan-400",
                  ]}
                />
              )}
              {byStaff.length > 0 && (
                <BreakdownTable
                  title="NC by Staff"
                  subtitle="Staff who applied no-charges"
                  icon={UserCog}
                  rows={byStaff}
                  labelKey="userName"
                  dotColors={DOT_COLORS_ALT}
                />
              )}
            </div>
          )}

          {/* Top NC Items */}
          {topItems.length > 0 && (
            <BreakdownTable
              title="Top NC Items"
              subtitle="Menu items most frequently marked no-charge"
              icon={UtensilsCrossed}
              rows={topItems.map((r) => ({
                ...r,
                totalAmount: r.totalNCAmount,
                count: r.ncCount,
              }))}
              labelKey="itemName"
              dotColors={[
                "bg-violet-400",
                "bg-emerald-400",
                "bg-amber-400",
                "bg-rose-400",
                "bg-sky-400",
                "bg-teal-400",
                "bg-indigo-400",
                "bg-orange-400",
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default NcReportPage;
