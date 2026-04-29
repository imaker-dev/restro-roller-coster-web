import { useNavigate } from "react-router-dom";
import { formatNumber } from "../../../utils/numberFormatter";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Clock,
  Layers,
  Thermometer,
  SlidersHorizontal,
  Package,
  Edit3,
  Trash2,
} from "lucide-react";
import { formatDate } from "../../../utils/dateFormatter";
import { useDispatch } from "react-redux";
import InventoryBadge from "./InventoryBadge";
import { ROUTE_PATHS } from "../../../config/paths";
// import { adjustStock } from "../../../redux/slices/inventorySlice"; // ← wire up

/* ─── Animated stock bar ──────────────────────────────────────────────────── */
function StockBar({ current, min, max }) {
  const [w, setW] = useState(0);
  const pct = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  const isLow = current > 0 && current <= min;
  const isEmpty = current <= 0;

  useEffect(() => {
    const t = setTimeout(() => setW(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${
          isEmpty ? "bg-red-500" : isLow ? "bg-amber-400" : "bg-emerald-500"
        }`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

/* ─── Stock status helper ─────────────────────────────────────────────────── */
function stockStatus(item) {
  if (item.currentStock <= 0)
    return {
      label: "Out of Stock",
      bg: "bg-red-50",
      text: "text-red-700",
      ring: "ring-red-200",
      dot: "bg-red-500",
    };
  if (item.isLowStock)
    return {
      label: "Low Stock",
      bg: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-200",
      dot: "bg-amber-500",
    };
  return {
    label: "In Stock",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    dot: "bg-emerald-500",
  };
}

function StockBadge({ item }) {
  const s = stockStatus(item);
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} ring-1 ${s.ring} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}
    >
      <span className={`w-1 h-1 rounded-full ${s.dot} flex-shrink-0`} />
      {s.label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   INVENTORY ITEM CARD
══════════════════════════════════════════════════════════════════════════ */
export default function InventoryItemCard({ item, onAdjust, onWastage }) {
  const navigate = useNavigate();

  const stockPct =
    item.maximumStock > 0
      ? Math.round((item.currentStock / item.maximumStock) * 100)
      : 0;

  return (
    <>
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-200 hover:shadow-md transition-all duration-200 group flex flex-col">
        <div className="px-5 py-4 flex-1">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.currentStock <= 0
                    ? "bg-red-100"
                    : item.isLowStock
                      ? "bg-amber-100"
                      : "bg-slate-900"
                }`}
              >
                <span
                  className={`text-sm font-extrabold uppercase ${
                    item.currentStock <= 0
                      ? "text-red-600"
                      : item.isLowStock
                        ? "text-amber-700"
                        : "text-white"
                  }`}
                >
                  {item.name?.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-slate-900 truncate">
                  {item.name}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <InventoryBadge
                    type="category"
                    value={item.categoryName}
                    size="sm"
                  />
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.sku}
                  </span>
                </div>
              </div>
            </div>
            <StockBadge item={item} />
          </div>

          {/* Stock level + bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Stock Level
              </span>
              <span
                className={`text-[11px] font-extrabold tabular-nums ${
                  item.currentStock <= 0
                    ? "text-red-600"
                    : item.isLowStock
                      ? "text-amber-600"
                      : "text-emerald-600"
                }`}
              >
                {formatNumber(item.currentStock)} {item.unitAbbreviation}
                <span className="text-slate-400 font-medium">
                  {" "}
                  / {formatNumber(item.maximumStock)} {item.unitAbbreviation}
                </span>
              </span>
            </div>
            <StockBar
              current={item.currentStock}
              min={item.minimumStock}
              max={item.maximumStock}
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] font-medium text-slate-400">
                Min: {formatNumber(item.minimumStock)} {item.unitAbbreviation}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                {stockPct}% full
              </span>
            </div>
          </div>

          {/* Price tiles */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Latest Price
              </p>
              <p className="text-sm font-extrabold text-slate-900 tabular-nums">
                {formatNumber(item.latestPrice, true)} / {item.unitAbbreviation}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Avg Price
              </p>
              <p className="text-sm font-extrabold text-violet-600 tabular-nums">
                {formatNumber(item.averagePrice, true)} /{" "}
                {item.unitAbbreviation}
              </p>
            </div>
          </div>

          {/* Attributes row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
            <div className="flex items-center gap-1.5">
              <Layers size={11} className="text-slate-400" strokeWidth={2} />
              <span className="text-[11px] font-medium text-slate-500">
                {item.activeBatchCount} active batch
                {item.activeBatchCount !== 1 ? "es" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Thermometer
                size={11}
                className={
                  item.isPerishable ? "text-amber-500" : "text-slate-400"
                }
                strokeWidth={2}
              />
              <span
                className={`text-[11px] font-semibold ${item.isPerishable ? "text-amber-600" : "text-slate-400"}`}
              >
                {item.isPerishable ? "Perishable" : "Non-perishable"}
              </span>
            </div>
            {item.isPerishable && item.shelfLifeDays && (
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-slate-400" strokeWidth={2} />
                <span className="text-[11px] font-medium text-slate-500">
                  {item.shelfLifeDays}d shelf life
                </span>
              </div>
            )}
            {item.description && (
              <span className="text-[11px] font-medium text-slate-400 italic truncate max-w-[140px]">
                "{item.description}"
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <span className="text-[11px] font-medium text-slate-400">
              Updated {formatDate(item.updatedAt, "long")}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              #{item.id}
            </span>
          </div>
        </div>

        {/* ── Action footer: 5 actions ── */}
        <div className="grid grid-cols-5 divide-x divide-slate-100 border-t border-slate-100">
          {/* View Details */}
          <button
            onClick={() =>
              navigate(
                `${ROUTE_PATHS.INVENTORY_ITEMS_DETAILS}?itemId=${item.id}`,
              )
            }
            className="flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-150"
            title="View Details"
          >
            <ArrowUpRight size={13} strokeWidth={2.5} />
            Details
          </button>

          {/* List Batches */}
          <button
            onClick={() =>
              navigate(
                `${ROUTE_PATHS.INVENTORY_ITEMS_BATCHES}?itemId=${item.id}`,
              )
            }
            className="flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-150"
            title="View Batches"
          >
            <Package size={13} strokeWidth={2} />
            Batches
          </button>

          {/* Stock Adjust */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdjust(item);
            }}
            className="flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-bold text-violet-600 hover:bg-violet-50 transition-all duration-150"
            title="Adjust Stock"
          >
            <SlidersHorizontal size={13} strokeWidth={2} />
            Adjust
          </button>

          {/* Record Wastage */}
          <button
            onClick={(e) => {
              (e.stopPropagation(), onWastage(item));
            }}
            className="flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-bold text-red-500 hover:bg-red-50 transition-all duration-150"
            title="Record Wastage"
          >
            <Trash2 size={13} strokeWidth={2} />
            Wastage
          </button>

          {/* Edit */}
          <button
            onClick={() =>
              navigate(`${ROUTE_PATHS.INVENTORY_ITEMS_ADD}?itemId=${item.id}`)
            }
            className="flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-bold text-primary-600 hover:bg-primary-50 transition-all duration-150"
            title="Edit Item"
          >
            <Edit3 size={13} strokeWidth={2} />
            Edit
          </button>
        </div>
      </div>
    </>
  );
}
