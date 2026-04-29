import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import PageHeader from "../../layout/PageHeader";
import { fetchInventoryItemById } from "../../redux/slices/inventorySlice";
import LoadingOverlay from "../../components/LoadingOverlay";
import { formatNumber } from "../../utils/numberFormatter";
import { formatDate } from "../../utils/dateFormatter";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Layers,
  Thermometer,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Building2,
  BadgeIndianRupee,
  BarChart2,
  Pencil,
  TrendingUp,
  Box,
} from "lucide-react";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import ExpiryBadge from "../../layout/ExpiryBadge";
import { ROUTE_PATHS } from "../../config/paths";

/* ─── Animated progress bar ──────────────────────────────────────────────── */
function Bar({ value, max, colorClass = "bg-emerald-500", h = "h-2" }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
    const t = setTimeout(() => setW(pct), 300);
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <div className={`w-full bg-slate-100 rounded-full ${h} overflow-hidden`}>
      <div
        className={`${h} rounded-full ${colorClass} transition-all duration-1000 ease-out`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

/* ─── Animated counter ────────────────────────────────────────────────────── */
function Counter({ to = 0, prefix = "₹" }) {
  const [v, setV] = useState(0);
  const r = useRef();
  useEffect(() => {
    if (!to) {
      setV(0);
      return;
    }
    const t0 = performance.now();
    const run = (t) => {
      const p = Math.min((t - t0) / 900, 1);
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

/* ─── Info row ────────────────────────────────────────────────────────────── */
function Row({ label, value, accent, mono }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">
        {label}
      </span>
      <span
        className={`text-sm font-bold text-right break-all ${accent ?? "text-slate-800"} ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const InventoryItemDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itemId } = useQueryParams();
  const { outletId } = useSelector((state) => state.auth);
  const { isFetchingItemDetails, inventoryItemDetails } = useSelector(
    (state) => state.inventory,
  );

  useEffect(() => {
    if (outletId) dispatch(fetchInventoryItemById(itemId));
  }, [outletId]);

  if (isFetchingItemDetails) return <LoadingOverlay />;

  const d = inventoryItemDetails;

  if (!d)
    return (
      <div className="space-y-4">
        <PageHeader title="Item Details" showBackButton />
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <p className="text-sm font-semibold text-slate-400">
            No item data found.
          </p>
        </div>
      </div>
    );

  const sv = d.stockValue ?? {};
  const ip = d.internalPricing ?? {};
  const batches = d.batches ?? [];

  const stockPct =
    d.maximumStock > 0
      ? Math.min(Math.round((d.currentStock / d.maximumStock) * 100), 100)
      : 0;
  const isOut = d.currentStock <= 0;
  const isLow = d.isLowStock && !isOut;
  const stockColor = isOut
    ? "text-red-600"
    : isLow
      ? "text-amber-600"
      : "text-emerald-600";
  const barColor = isOut
    ? "bg-red-500"
    : isLow
      ? "bg-amber-400"
      : "bg-emerald-500";

  /* ── expiry helpers ── */
  function expiryStatus(dateStr) {
    if (!dateStr) return null;
    const days = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
    if (days < 0)
      return {
        label: `Expired ${Math.abs(days)}d ago`,
        color: "text-red-600",
        bg: "bg-red-50 border-red-100",
      };
    if (days <= 3)
      return {
        label: `Expires in ${days}d`,
        color: "text-red-600",
        bg: "bg-red-50 border-red-100",
      };
    if (days <= 7)
      return {
        label: `Expires in ${days}d`,
        color: "text-amber-600",
        bg: "bg-amber-50 border-amber-100",
      };
    return {
      label: `Expires ${formatDate(dateStr, "long")}`,
      color: "text-slate-500",
      bg: "bg-slate-50 border-slate-100",
    };
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Item Details" showBackButton />

      {/* ══════════════════════════════════════════
          HERO CARD
      ══════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Alerts */}
        {isOut && (
          <div className="flex items-center gap-3 bg-red-50 border-b border-red-100 px-5 py-3">
            <ShieldAlert
              size={14}
              className="text-red-500 flex-shrink-0"
              strokeWidth={2}
            />
            <p className="text-xs font-bold text-red-700">
              This item is out of stock. Reorder immediately.
            </p>
          </div>
        )}
        {isLow && (
          <div className="flex items-center gap-3 bg-amber-50 border-b border-amber-100 px-5 py-3">
            <AlertTriangle
              size={14}
              className="text-amber-500 flex-shrink-0"
              strokeWidth={2}
            />
            <p className="text-xs font-bold text-amber-700">
              Stock is below minimum level ({formatNumber(d.minimumStock)}{" "}
              {d.unitAbbreviation}). Consider restocking soon.
            </p>
          </div>
        )}

        {/* Identity row */}
        <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5 border-b border-slate-50">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isOut ? "bg-red-100" : isLow ? "bg-amber-100" : "bg-slate-900"
              }`}
            >
              <span
                className={`text-base font-extrabold uppercase ${
                  isOut
                    ? "text-red-600"
                    : isLow
                      ? "text-amber-700"
                      : "text-white"
                }`}
              >
                {d.name?.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-lg font-extrabold text-slate-900">{d.name}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-[11px] font-medium text-slate-400">
                  {d.categoryName}
                </span>
                <span className="text-slate-200">·</span>
                <span
                  className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"
                  style={{ fontFamily: "monospace" }}
                >
                  {d.sku}
                </span>
                <span className="text-slate-200">·</span>
                <span className="text-[11px] font-medium text-slate-400">
                  {d.unitName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Stock status */}
            {isOut ? (
              <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 ring-1 ring-red-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                Out of Stock
              </span>
            ) : isLow ? (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 ring-1 ring-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                Low Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                <span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                In Stock
              </span>
            )}
            {d.isPerishable && (
              <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 ring-1 ring-orange-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                <Thermometer size={9} strokeWidth={2.5} />
                Perishable
              </span>
            )}
            {d.isActive && (
              <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 ring-1 ring-sky-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                <CheckCircle2 size={9} strokeWidth={2.5} />
                Active
              </span>
            )}
            {/* Edit button */}
            <button
              onClick={() =>
                navigate(`${ROUTE_PATHS.INVENTORY_ITEMS_ADD}?itemId=${d.id}`)
              }
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 shadow-sm"
            >
              <Pencil size={11} strokeWidth={2.5} />
              Edit Item
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-50">
          {[
            {
              label: "Current Stock",
              to: d.currentStock,
              suffix: ` ${d.unitAbbreviation}`,
              color: stockColor,
              isNum: true,
            },
            {
              label: "Stock Value",
              to: sv.totalValue,
              prefix: "₹",
              color: "text-violet-600",
              isNum: true,
            },
            {
              label: "Latest Price",
              to: d.latestPrice,
              prefix: "₹",
              color: "text-slate-900",
              isNum: true,
              suffix: ` / ${d.unitAbbreviation}`,
            },
            {
              label: "Active Batches",
              raw: sv.activeBatches,
              color: "text-sky-600",
            },
          ].map(
            ({ label, to, raw, prefix = "", suffix = "", color, isNum }) => (
              <div key={label} className="flex flex-col gap-1 px-5 py-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {label}
                </span>
                <p
                  className={`text-2xl font-extrabold tabular-nums tracking-tight ${color}`}
                >
                  {raw !== undefined ? (
                    raw
                  ) : isNum ? (
                    <>
                      <Counter to={to} prefix={prefix} />
                      {suffix}
                    </>
                  ) : (
                    `${prefix}${to}${suffix}`
                  )}
                </p>
              </div>
            ),
          )}
        </div>

        {/* Stock level bar */}
        <div className="px-5 pb-5 pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Stock Level
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-extrabold tabular-nums ${stockColor}`}
              >
                {formatNumber(d.currentStock)} {d.unitAbbreviation}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-[10px] font-bold text-slate-400">
                {stockPct}% of max ({formatNumber(d.maximumStock)}{" "}
                {d.unitAbbreviation})
              </span>
            </div>
          </div>
          <Bar
            value={d.currentStock}
            max={d.maximumStock}
            colorClass={barColor}
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-slate-400 font-medium">
              Min: {formatNumber(d.minimumStock)} {d.unitAbbreviation}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Max: {formatNumber(d.maximumStock)} {d.unitAbbreviation}
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN 2-COL
      ══════════════════════════════════════════ */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* ── LEFT (2/3) ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Batches */}
          <MetricPanel
            title="Stock Batches"
            desc={`${batches.length} batch${batches.length !== 1 ? "es" : ""} · ${sv.activeBatches} active · ${sv.exhaustedBatches} exhausted`}
            icon={Layers}
            noPad
          >
            {batches.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Box
                  size={28}
                  className="text-slate-200 mx-auto mb-2"
                  strokeWidth={1.5}
                />
                <p className="text-sm font-semibold text-slate-400">
                  No batches found.
                </p>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  <div className="col-span-3">Batch</div>
                  <div className="col-span-2 text-center">Qty / Remaining</div>
                  <div className="col-span-2 text-center">Purchase Price</div>
                  <div className="col-span-2 text-center">Purchase Date</div>
                  <div className="col-span-2 text-center">Expiry</div>
                  <div className="col-span-1 text-center">Status</div>
                </div>

                {batches.map((batch) => {
                  const exp = expiryStatus(batch.expiryDate);

                  return (
                    <div
                      key={batch.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Desktop row */}
                      <div className="hidden sm:grid grid-cols-12 gap-2 items-center px-5 py-4">
                        {/* Batch identity */}
                        <div className="col-span-3 min-w-0">
                          <p className="text-xs font-bold text-slate-800 font-mono">
                            {batch.batchCode}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Building2
                              size={9}
                              className="text-slate-400"
                              strokeWidth={2}
                            />
                            <p className="text-[10px] text-slate-400 font-medium">
                              {batch.vendorName}
                            </p>
                          </div>
                        </div>

                        {/* Qty / Remaining */}
                        <div className="col-span-2 text-center">
                          <p className="text-xs font-bold text-slate-700 tabular-nums">
                            {batch.remainingQuantity} / {batch.quantity}{" "}
                            {batch.unitAbbreviation}
                          </p>
                        </div>

                        {/* Purchase price */}
                        <div className="col-span-2 text-center">
                          <p className="text-xs font-bold text-slate-700 tabular-nums">
                            {formatNumber(batch.purchasePrice, true)}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            per {batch.unitAbbreviation}
                          </p>
                        </div>

                        {/* Purchase date */}
                        <div className="col-span-2 text-center">
                          <p className="text-xs font-semibold text-slate-600">
                            {formatDate(batch.purchaseDate, "long")}
                          </p>
                        </div>

                        {/* Expiry */}
                        <div className="col-span-2 text-center">
                          <ExpiryBadge date={batch.expiryDate} size="sm" />
                        </div>

                        {/* Status */}
                        <div className="col-span-1 text-center">
                          {batch.isExhausted ? (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              Done
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 ring-1 ring-emerald-200 px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mobile card */}
                      <div className="sm:hidden px-4 py-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <p className="text-sm font-bold text-slate-800 font-mono">
                              {batch.batchCode}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                              {batch.vendorName}
                            </p>
                          </div>
                          {batch.isExhausted ? (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                              Done
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 ring-1 ring-emerald-200 px-2 py-1 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            {
                              l: "Remaining",
                              v: `${batch.remainingQuantity} / ${batch.quantity} ${batch.unitAbbreviation}`,
                            },
                            {
                              l: "Price",
                              v: `${formatNumber(batch.purchasePrice, true)} / ${batch.unitAbbreviation}`,
                            },
                            {
                              l: "Purchased",
                              v: formatDate(batch.purchaseDate, "long"),
                            },
                            {
                              l: "Expiry",
                              v: (
                                <ExpiryBadge
                                  date={batch.expiryDate}
                                  size="sm"
                                />
                              ),
                            },
                          ].map(({ l, v }) => (
                            <div
                              key={l}
                              className="bg-slate-50 rounded-lg px-3 py-2"
                            >
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                                {l}
                              </p>
                              <p className="text-xs font-bold text-slate-700">
                                {v}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Batch footer */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Total Stock Value
                  </p>
                  <p className="text-base font-extrabold text-violet-600 tabular-nums">
                    {formatNumber(sv.totalValue, true)}
                  </p>
                </div>
              </>
            )}
          </MetricPanel>
        </div>

        {/* ── RIGHT SIDEBAR (1/3) ── */}
        <div className="space-y-4">
          {/* Stock summary */}
          <MetricPanel
            title="Stock Summary"
            desc="Current inventory status"
            icon={BadgeIndianRupee}
          >
            {/* Value highlight */}
            <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest mb-1">
                  Total Stock Value
                </p>
                <p className="text-2xl font-extrabold text-violet-700 tabular-nums">
                  {formatNumber(sv.totalValue, true)}
                </p>
              </div>
              <TrendingUp
                size={26}
                className="text-violet-400"
                strokeWidth={1.5}
              />
            </div>

            <Row
              label="Current Stock"
              value={`${formatNumber(d.currentStock)} ${d.unitAbbreviation}`}
              accent={stockColor}
            />
            <Row
              label="Min Stock"
              value={`${formatNumber(d.minimumStock)} ${d.unitAbbreviation}`}
            />
            <Row
              label="Max Stock"
              value={`${formatNumber(d.maximumStock)} ${d.unitAbbreviation}`}
            />
            <div className="h-px bg-slate-100 my-2" />
            <Row
              label="Latest Price"
              value={`${formatNumber(d.latestPrice, true)} / ${d.unitAbbreviation}`}
              accent="text-slate-700"
            />
            <Row
              label="Average Price"
              value={`${formatNumber(d.averagePrice, true)} / ${d.unitAbbreviation}`}
              accent="text-violet-600"
            />
          </MetricPanel>

          {/* Internal pricing */}
          <MetricPanel
            title="Internal Pricing"
            desc="Base unit costing"
            icon={BarChart2}
          >
            <Row
              label="Base Unit"
              value={`${ip.baseUnitName} (${ip.baseUnitAbbreviation})`}
            />
            <Row
              label="Avg / Base Unit"
              value={`${formatNumber(ip.averagePricePerBaseUnit, true)} / ${ip.baseUnitAbbreviation}`}
              accent="text-violet-600"
            />
            <Row
              label="Latest / Base"
              value={`${formatNumber(ip.latestPricePerBaseUnit, true)} / ${ip.baseUnitAbbreviation}`}
            />
            <Row
              label="Stock in Base"
              value={`${formatNumber(ip.currentStockInBaseUnit)} ${ip.baseUnitAbbreviation}`}
            />
            <Row
              label="Conv. Factor"
              value={`1 ${d.unitAbbreviation} = ${formatNumber(ip.purchaseConversionFactor)} ${ip.baseUnitAbbreviation}`}
            />
          </MetricPanel>

          {/* Item info */}
          <MetricPanel title="Item Info" icon={Package}>
            <Row label="Category" value={d.categoryName} />
            <Row label="SKU" value={d.sku} mono />
            <Row label="Unit" value={d.unitName} />
            <Row
              label="Perishable"
              value={d.isPerishable ? "Yes" : "No"}
              accent={d.isPerishable ? "text-amber-600" : "text-slate-500"}
            />
            {d.isPerishable && d.shelfLifeDays && (
              <Row label="Shelf Life" value={`${d.shelfLifeDays} days`} />
            )}
            <Row label="Active Batches" value={sv.activeBatches} />
            <Row label="Description" value={d.description ?? "—"} />
            <Row
              label="Created"
              value={`${formatDate(d.createdAt, "long")} · ${formatDate(d.createdAt, "time")}`}
            />
            <Row
              label="Updated"
              value={`${formatDate(d.updatedAt, "long")} · ${formatDate(d.updatedAt, "time")}`}
            />
          </MetricPanel>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemDetailsPage;
