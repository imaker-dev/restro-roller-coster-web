import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchStockSummary } from "../../redux/slices/inventorySlice";
import PageHeader from "../../layout/PageHeader";
import {
  Package,
  AlertTriangle,
  IndianRupee,
  ChevronRight,
  Clock,
  BarChart2,
} from "lucide-react";
import { formatNumber, num } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import LoadingOverlay from "../../components/LoadingOverlay";

// ─── Item row ──────────────────────────────────────────────────────────────────
function ItemRow({ item, navigate }) {
  const maxPct =
    num(item.maximumStock) > 0
      ? Math.min((num(item.currentStock) / num(item.maximumStock)) * 100, 100)
      : 0;

  const barColor = item.isLowStock
    ? "#dc2626"
    : maxPct >= 50
      ? "#10b981"
      : "#d97706";

  const stockDisplay =
    num(item.currentStock) % 1 === 0
      ? num(item.currentStock)
      : num(item.currentStock).toFixed(2);

  return (
    <div
      onClick={() => navigate(`/inventory-items/details?itemId=${item.id}`)}
      className="group bg-white rounded-2xl border px-3.5 py-3.5 grid items-center gap-3.5 cursor-pointer transition-all duration-150 hover:shadow-md"
      style={{
        borderColor: item.isLowStock ? "#fca5a5" : "#e2e8f0",
        gridTemplateColumns: "1fr 130px 88px 72px 18px",
      }}
    >
      {/* Name + meta */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          <p className="text-[14px] font-bold text-slate-900">{item.name}</p>
          {item.isLowStock && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
              style={{
                color: "#dc2626",
                background: "#fef2f2",
                borderColor: "#fecaca",
              }}
            >
              LOW
            </span>
          )}
          {item.isPerishable && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
              style={{
                color: "#d97706",
                background: "#fffbeb",
                borderColor: "#fde68a",
              }}
            >
              PERISHABLE
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[12px] text-slate-500 font-mono">
            {item.sku}
          </span>
          <span className="text-slate-300 text-[12px]">·</span>
          <span className="text-[12px] text-slate-500">
            {item.categoryName}
          </span>
          <span className="text-slate-300 text-[12px]">·</span>
          <span className="text-[12px] text-slate-500">
            {item.activeBatchCount} batch
            {item.activeBatchCount !== 1 ? "es" : ""}
          </span>
        </div>
      </div>

      {/* Stock bar — hidden on mobile */}
      <div className="hidden sm:block flex-shrink-0">
        <div className="flex items-baseline justify-between mb-1.5">
          <span
            className="text-[13px] font-bold tabular-nums"
            style={{ color: barColor }}
          >
            {stockDisplay} {item.unitAbbreviation}
          </span>
          <span className="text-[12px] text-slate-400">
            / {num(item.maximumStock)}
          </span>
        </div>
        <div className="h-1 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${maxPct}%`, background: barColor }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-slate-400">
            min {num(item.minimumStock)}
          </span>
          <span className="text-[11px] text-slate-400">
            max {num(item.maximumStock)}
          </span>
        </div>
      </div>

      {/* Price — hidden on tablet and below */}
      <div className="hidden md:block text-right flex-shrink-0">
        <p className="text-[13px] font-bold text-slate-800 tabular-nums">
          {formatNumber(item.latestPrice, true)}
          <span className="text-[11px] font-normal text-slate-400">
            /{item.unitAbbreviation}
          </span>
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">latest price</p>
      </div>

      {/* Value — always visible */}
      <div className="text-right flex-shrink-0">
        <p className="text-[14px] font-bold text-slate-900 tabular-nums">
          {formatNumber(item.stockValue, true)}
        </p>
      </div>

      <ChevronRight
        size={14}
        className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
        strokeWidth={2.5}
      />
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
const InventorySummaryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((s) => s.auth);
  const { isFetchingStockSummary, stockSummary } = useSelector(
    (s) => s.inventory,
  );

  useEffect(() => {
    if (outletId) dispatch(fetchStockSummary(outletId));
  }, [outletId]);

  const report = stockSummary?.data || stockSummary || {};
  const { items = [], summary } = report;

  const stats = [
    {
      key: "totalStockValue",
      icon: IndianRupee,
      label: "Total Stock Value",
      value: formatNumber(summary?.totalStockValue, true),
      sub: "Current inventory worth",
      dark: true,
      color: "purple",
    },
    {
      key: "totalItems",
      icon: Package,
      label: "Total Items",
      value: num(summary?.totalItems),
      sub: "Distinct items tracked",
      color: "blue",
    },
    {
      key: "lowStock",
      icon: AlertTriangle,
      label: "Low Stock",
      value: num(summary?.lowStockCount),
      sub: "Below minimum threshold",
      color: "red",
    },
    {
      key: "avgItemValue",
      icon: BarChart2,
      label: "Avg Item Value",
      value:
        num(summary?.totalItems) > 0
          ? formatNumber(
              num(summary?.totalStockValue) / num(summary?.totalItems),
              true,
            )
          : "—",
      sub: "Per item average",
      color: "amber",
    },
  ];

  if (isFetchingStockSummary) return <LoadingOverlay />;

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Stock Summary"
          description="Current inventory levels, values and stock alerts"
        />

        <div className=" grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              title={stat.label}
              value={stat.value}
              subtitle={stat.sub}
              color={stat.color}
              variant="v9"
              mode={stat.dark ? "solid" : "light"}
            />
          ))}
        </div>

        {summary?.lowStockCount > 0 && (
          <div
            className="rounded-2xl border border-slate-200 overflow-hidden bg-white"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <AlertTriangle
                  size={15}
                  className="text-rose-500"
                  strokeWidth={2}
                />
                <span className="text-[13px] font-bold text-slate-800">
                  Low stock alert
                </span>
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  {summary.lowStockCount} items
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Below minimum threshold
              </span>
            </div>

            {/* Grid of items */}
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-slate-100">
              {summary.lowStockItems.map((item) => {
                const pct =
                  num(item.minimumStock) > 0
                    ? Math.min(
                        (num(item.currentStock) / num(item.minimumStock)) * 100,
                        100,
                      )
                    : 0;
                const atExact =
                  num(item.currentStock) === num(item.minimumStock);
                const barColor = atExact ? "#f59e0b" : "#f43f5e";

                return (
                  <div key={item.id} className="px-4 py-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[13px] font-bold text-slate-800 truncate">
                        {item.name}
                      </p>
                      <span
                        className="text-[11px] font-bold tabular-nums ml-2 flex-shrink-0"
                        style={{ color: barColor }}
                      >
                        {num(item.currentStock)} / {num(item.minimumStock)}{" "}
                        {item.unitAbbreviation}
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: barColor }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-slate-400">
                        Current
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Min required
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {summary && !isFetchingStockSummary && (
          <>
            {/* ── Column headers ── */}
            <div
              className="hidden sm:grid px-3.5 gap-3.5 mb-1"
              style={{ gridTemplateColumns: "1fr 130px 88px 72px 18px" }}
            >
              {["Item", "Stock", "Price", "Value", ""].map((h, i) => (
                <span
                  key={i}
                  className={`text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${i >= 2 ? "hidden md:block text-right" : i === 3 ? "text-right" : ""}`}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* ── Items list ── */}
            {items?.length === 0 ? (
              <div className="invu flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                <Package
                  size={28}
                  className="text-slate-300 mb-3"
                  strokeWidth={1.3}
                />
                <p className="text-[13px] font-bold text-slate-400">
                  No items match your search
                </p>
                <p className="text-[11px] text-slate-300 mt-1">
                  Try a different keyword or filter
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {items?.map((item, i) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    navigate={navigate}
                    delay={110 + i * 30}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default InventorySummaryPage;
