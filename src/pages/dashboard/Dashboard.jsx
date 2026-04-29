import { useState, useMemo, useEffect } from "react";
import {
  ShoppingBag,
  RotateCcw,
  CreditCard,
  Banknote,
  Smartphone,
  XCircle,
  Users,
  IndianRupee,
  Truck,
  AlertTriangle,
  SlidersHorizontal,
  Wallet,
  Tag,
} from "lucide-react";

import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../layout/PageHeader";
import { fetchAllDahboardStats } from "../../redux/slices/dashboardSlice";
import { formatNumber } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import PaymentBifurcation from "../../partial/dashboard/PaymentBifurcation";
import SalesChart from "../../partial/dashboard/SalesChart";
import { DATE_RANGES } from "../../constants";
import { useNavigate } from "react-router-dom";
import { fetchShiftHistory } from "../../redux/slices/shiftSlice";
import ShiftSummary from "../../partial/dashboard/ShiftSummary";

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState(null);

  const { outletId } = useSelector((state) => state.auth);
  const { isFetchingShiftHistory, shiftHistory } = useSelector(
    (state) => state.shift,
  );
  const { shifts } = shiftHistory || {};

  const { dahbordStats, isfetchingDashboardStats } = useSelector(
    (state) => state.dashboard,
  );

  const { summary, sales, payments, collection } = dahbordStats || {};

  const fetchStats = () => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;
    dispatch(fetchAllDahboardStats({ outletId, dateRange }));
    dispatch(fetchShiftHistory({ outletId, dateRange }));
  };

  useEffect(() => {
    fetchStats();
  }, [outletId, dateRange]);

  // Build chart data
  const chartData = useMemo(() => {
    if (!sales?.length) return [];

    return sales.map((item) => ({
      label: item.label,
      dineIn: item.dine_in || 0,
      pickup: item.takeaway || 0,
      delivery: item.delivery || 0,
    }));
  }, [sales]);

  const actions = [
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchStats,
      loading: isfetchingDashboardStats,
      loadingText: "Refreshing...",
    },
  ];

  const stats = [
    {
      title: "Total Sales",
      value: formatNumber(summary?.total_sale, true),
      subtitle: `${formatNumber(summary?.total_orders)} orders • ${formatNumber(summary?.outside_collection, true)} outside`,
      icon: IndianRupee,
      color: "green",
      path: "/reports/daily-sales",
    },
    {
      title: "Dine-in",
      value: formatNumber(
        summary?.channels?.find((c) => c.type === "dine_in")?.amount,
        true,
      ),
      subtitle: `${formatNumber(
        summary?.channels?.find((c) => c.type === "dine_in")?.count,
      )} orders`,
      icon: Users,
      color: "purple",
      path: "/reports/daily-sales",
    },
    {
      title: "Takeaway",
      value: formatNumber(
        summary?.channels?.find((c) => c.type === "takeaway")?.amount,
        true,
      ),
      subtitle: `${formatNumber(
        summary?.channels?.find((c) => c.type === "takeaway")?.count,
      )} orders`,
      icon: ShoppingBag,
      color: "amber",
      path: "/reports/daily-sales",
    },
    {
      title: "Delivery",
      value: formatNumber(
        summary?.channels?.find((c) => c.type === "delivery")?.amount,
        true,
      ),
      subtitle: `${formatNumber(
        summary?.channels?.find((c) => c.type === "delivery")?.count,
      )} orders`,
      icon: Truck,
      color: "indigo",
      path: "/reports/daily-sales",
    },
    {
      title: "Outside Collection",
      value: formatNumber(summary?.outside_collection, true),
      subtitle: `${formatNumber(summary?.outside_collection_count)} entries`,
      icon: Wallet,
      color: "blue",
      path: "/reports/outside-collections",
    },
    {
      title: "Discount",
      value: formatNumber(summary?.discount_amount, true),
      subtitle: "Total discount given",
      icon: Tag,
      color: "red",
      path: "/reports/discount-report",
    },
  ];

  const PAYMENTS = payments?.map((item) => {
    let icon;
    let color;

    switch (item.name) {
      case "Cash":
        icon = Banknote;
        color = "#f59e0b";
        break;

      case "Card":
        icon = CreditCard;
        color = "#14b8a6";
        break;

      case "UPI":
        icon = Smartphone;
        color = "#6366f1";
        break;

      case "Unpaid":
        icon = XCircle;
        color = "#e2e8f0";
        break;

      case "Due":
        icon = AlertTriangle;
        color = "#ef4444";
        break;

      case "Adjustment":
        icon = SlidersHorizontal;
        color = "#84cc16";
        break;

      default:
        icon = Smartphone;
        color = "#94a3b8";
    }

    return {
      ...item,
      icon,
      color,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={"Dashboard"}
        description="Overview of sales, orders, and performance."
        rightContent={
          <CustomDateRangePicker
            value={dateRange}
            onChange={(newRange) => setDateRange(newRange)}
            defaultRange={DATE_RANGES.TODAY}
          />
        }
        actions={actions}
      />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
            variant="v9"
            mode="solid"
            loading={isfetchingDashboardStats}
            onClick={() => navigate(stat.path)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PaymentBifurcation
          data={PAYMENTS}
          loading={isfetchingDashboardStats}
          dateRange={dateRange}
        />
        <ShiftSummary
          shifts={shifts}
          loading={isFetchingShiftHistory}
          dateRange={dateRange}
        />
      </div>

      {/* ── Chart ── */}
      <SalesChart
        chartData={chartData}
        dateRange={dateRange}
        loading={isfetchingDashboardStats}
      />
    </div>
  );
}
