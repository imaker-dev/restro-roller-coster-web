import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuperAdminDashboard } from "../../redux/slices/superAdminDashboardSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import {
  RotateCcw,
  Store,
  ShoppingBag,
  Activity,
  MapPin,
  Phone,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../layout/StatusBadge";
import { formatDate } from "../../utils/dateFormatter";
import NoDataFound from "../../layout/NoDataFound";
import { formatNumber } from "../../utils/numberFormatter";
import CurrencyIcon from "../../components/CurrencyIcon";
import { CURRENCY } from "../../constants";

// ─── Outlet Card ──────────────────────────────────────────────────────────────
function OutletCard({ outlet }) {
  const hasActivity = outlet.totalOrders > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="px-5 py-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shrink-0">
              <Store size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-900 leading-none truncate">
                {outlet.outletName}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">
                #{outlet.outletId}
              </p>
            </div>
          </div>
          <StatusBadge value={outlet.isActive} size="sm" />
        </div>

        {/* Meta */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <MapPin size={11} className="text-slate-400 shrink-0" />
            <p className="text-[11px] text-slate-500 font-medium">
              {outlet.city}, {outlet.state}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={11} className="text-slate-400 shrink-0" />
            <p className="text-[11px] text-slate-500 font-medium">
              {outlet.outletPhone}
            </p>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`rounded-xl px-3.5 py-3 ${hasActivity ? "bg-orange-50 border border-orange-100" : "bg-slate-50 border border-slate-100"}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <ShoppingBag
                size={11}
                className={hasActivity ? "text-orange-500" : "text-slate-400"}
              />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Orders
              </p>
            </div>
            <p
              className={`text-lg font-black leading-none ${hasActivity ? "text-orange-600" : "text-slate-400"}`}
            >
              {formatNumber(outlet.totalOrders)}
            </p>
          </div>
          <div
            className={`rounded-xl px-3.5 py-3 ${hasActivity ? "bg-blue-50 border border-blue-100" : "bg-slate-50 border border-slate-100"}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <CurrencyIcon
                size={11}
                className={hasActivity ? "text-blue-500" : "text-slate-400"}
              />

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Sales
              </p>
            </div>
            <p
              className={`text-lg font-black leading-none ${hasActivity ? "text-blue-600" : "text-slate-400"}`}
            >
              {formatNumber(outlet.totalSale || 0, true)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-1 bg-slate-100" />
      <div className="px-5 py-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-100 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-100 rounded-full w-3/4" />
            <div className="h-2.5 bg-slate-100 rounded-full w-1/3" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2.5 bg-slate-100 rounded-full w-2/3" />
          <div className="h-2.5 bg-slate-100 rounded-full w-1/2" />
        </div>
        <div className="h-px bg-slate-100" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 bg-slate-100 rounded-xl" />
          <div className="h-16 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 px-5 py-5 flex items-center gap-4 animate-pulse">
      <div className="w-11 h-11 bg-slate-100 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-slate-100 rounded-full w-16" />
        <div className="h-2.5 bg-slate-100 rounded-full w-24" />
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState(null);

  const [sortBy, setSortBy] = useState("total_sale"); // default sort

  const { isfetchingSuperAdminDashboard, superAdminDashboardData } =
    useSelector((state) => state.superAdminDashboard);

  const data = superAdminDashboardData;
  const summary = data?.summary;
  const outlets = data?.outlets ?? [];

  const fetchDashboard = () => dispatch(fetchSuperAdminDashboard({ sortBy }));

  useEffect(() => {
    fetchDashboard();
  }, [sortBy]);

  const stats = [
    {
      icon: Store,
      label: "Total Outlets",
      value: summary ? formatNumber(summary.totalOutlets) : "—",
      color: "violet",
    },
    {
      icon: Activity,
      label: "Active Outlets",
      value: summary ? formatNumber(summary.activeOutlets) : "—",
      color: "emerald",
    },
    {
      icon: ShoppingBag,
      label: "Total Orders",
      value: summary ? formatNumber(summary.grandTotalOrders) : "—",
      color: "orange",
    },
    {
      icon: CURRENCY.ICON,
      label: "Total Sales",
      value: summary ? formatNumber(summary.grandTotalSale, true) : "—",
      color: "blue",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Super Admin Dashboard"
        description="Overview of sales, orders, and performance."
        onRefresh={fetchDashboard}
        isRefreshing={isfetchingSuperAdminDashboard}
      />

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {isfetchingSuperAdminDashboard && !data
          ? [...Array(4)].map((_, i) => <StatSkeleton key={i} />)
          : stats.map((s) => (
              <StatCard
                key={s.label}
                icon={s.icon}
                title={s.label}
                value={s.value}
                variant="v9"
                color={s.color}
                mode="solid"
              />
            ))}
      </div>

      {/* ── Period + Cache info ── */}
      {data && (
        <div className="bg-white rounded-2xl border border-slate-200 px-5 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <p className="text-xs font-semibold text-slate-500">
              Business Date:{" "}
              <span className="text-slate-800 font-bold">
                {formatDate(data.businessDate, "long")}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={11} className="text-slate-400" />
            <p className="text-xs font-semibold text-slate-500">
              Cached at:{" "}
              <span className="text-slate-800 font-bold">
                {formatDate(data.cachedAt, "time")}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw size={11} className="text-slate-400" />
            <p className="text-xs font-semibold text-slate-500">
              Next refresh:{" "}
              <span className="text-slate-800 font-bold">
                {formatDate(data.nextRefreshAt, "time")}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ── Outlets ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-black text-slate-800">Outlets</h2>
            {outlets.length > 0 && (
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {outlets.length} outlet{outlets.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select text-xs font-semibold bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 cursor-pointer hover:border-slate-300 "
            >
              <option value="total_sale">Sort by: Total Sale</option>
              <option value="total_orders">Sort by: Total Orders</option>
              <option value="outlet_name">Sort by: Outlet Name</option>
            </select>
            {isfetchingSuperAdminDashboard && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Loader2 size={12} className="animate-spin" /> Updating…
              </div>
            )}
          </div>
        </div>

        {isfetchingSuperAdminDashboard && !data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : outlets.length === 0 ? (
          <NoDataFound
            icon={Package}
            title="No outlets found"
            description="No data for the selected range."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {outlets.map((outlet) => (
              <OutletCard key={outlet.outletId} outlet={outlet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
