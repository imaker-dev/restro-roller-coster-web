import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchDailySalesReportByDate } from "../../redux/slices/reportSlice";
import {
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  Tag,
  BarChart2,
  Wallet,
  CalendarDays,
  Download,
  Receipt,
  BarChart3,
} from "lucide-react";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import { formatNumber, num } from "../../utils/numberFormatter";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import PayRow from "../../partial/report/daily-sales-report/PayRow";
import OrderTypeBar from "../../partial/report/daily-sales-report/OrderTypeBar";
import StatCard from "../../components/StatCard";
import SmartTable from "../../components/SmartTable";
import Pagination from "../../components/Pagination";
import { getOrderTableConfig } from "../../columns/order.columns";
import PageHeader from "../../layout/PageHeader";
import { handleResponse } from "../../utils/helpers";
import { exportDailySalesReportDetails } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";
import DailySalesDetailsPageSkeleton from "../../partial/report/daily-sales-report/DailySalesDetailsPageSkeleton";

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const DailySalesReportDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { date } = useQueryParams();
  const { outletId } = useSelector((s) => s.auth);
  const { isExportingDailySalesReportDetails } = useSelector(
    (s) => s.exportReport,
  );
  const { dailySalesReportDetails, isFetchingDailyReportDetails } = useSelector(
    (s) => s.report,
  );
  const { summary, orders = [], pagination } = dailySalesReportDetails || {};

  const { columns, actions: rowActions } = getOrderTableConfig(navigate);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (date)
      dispatch(
        fetchDailySalesReportByDate({
          outletId,
          date,
          page: currentPage,
          limit: itemsPerPage,
        }),
      );
  }, [outletId, date, itemsPerPage,currentPage]);

  const totalPay = Object.values(summary?.paymentModeBreakdown || {}).reduce(
    (s, v) => s + num(v),
    0,
  );

  const displayDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  const kpiStats = [
    {
      label: "Gross Sales",
      value: formatNumber(summary?.grossSales, true),
      sub: "Before discounts",
      icon: IndianRupee,
      color: "slate",
    },
    {
      label: "Discount",
      value: formatNumber(summary?.totalDiscount, true),
      sub: "Total discount given",
      icon: Tag,
      color: "orange",
    },
    {
      label: "Net Sales",
      value: formatNumber(summary?.netSales, true),
      sub: "After discounts",
      icon: TrendingUp,
      color: "green",
      highlight: true, // ⭐ important
    },
    {
      label: "Tax",
      value: formatNumber(summary?.totalTax, true),
      sub: "Tax collected",
      icon: Receipt,
      color: "amber",
    },
    {
      label: "Total Paid",
      value: formatNumber(summary?.totalPaid, true),
      sub: "Payments received",
      icon: CheckCircle2,
      color: "blue",
    },
    {
      label: "Avg Order",
      value: formatNumber(summary?.averageOrderValue, true),
      sub: "Per order",
      icon: BarChart3,
      color: "purple",
    },
  ];

  if (isFetchingDailyReportDetails) {
    return <DailySalesDetailsPageSkeleton />;
  }

  const handleExportDailySalesReportDetails = async () => {
    if (!date) return;

    const fileName = `Daily-Sales-Report_${formatFileDate(date)}`;

    await handleResponse(
      dispatch(exportDailySalesReportDetails({ outletId, date })),
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
      onClick: () => handleExportDailySalesReportDetails(),
      loading: isExportingDailySalesReportDetails,
      loadingText: "Exporting...",
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Daily Sales Report Details - ${formatDate(date, "long")}`}
        actions={actions}
        showBackButton
      />

      {/* ── UNIVERSAL HERO (ORDER STYLE) ── */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-primary-500">
        {/* Top highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
        />

        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative z-10 px-6 py-5 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* LEFT SIDE */}
            <div className="space-y-3 min-w-0">
              <p className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
                <CalendarDays size={12} />
                Daily Sales Report
              </p>

              <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight leading-none truncate">
                {displayDate}
              </h1>

              {/* META ROW */}
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/70">
                <span>Orders: {summary?.totalOrders || 0}</span>
                <span>Completed: {summary?.completedOrders || 0}</span>
                <span>Active: {summary?.activeOrders}</span>
                {summary?.cancelledOrders > 0 && (
                  <span>Cancelled: {summary?.cancelledOrders}</span>
                )}
              </div>
            </div>

            {/* RIGHT SIDE (like Grand Total) */}
            <div className="flex-shrink-0 lg:text-right">
              <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">
                Net Sales
              </p>

              <p className="text-[36px] font-bold tabular-nums leading-none">
                {formatNumber(summary?.netSales, true)}
              </p>

              <p className="text-[11px] text-white/70 mt-1">
                Gross: {formatNumber(summary?.grossSales, true)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 KPI TILES ── */}
      {/* <div
        className="grid grid-cols-2 lg:grid-cols-6 gap-3"
        style={{ animationDelay: "80ms" }}
      >
        {kpiStats.map((stat, index) => (
          <StatCard
            key={stat.label}
            dark={stat.dark}
            icon={stat.icon}
            title={stat.label}
            value={stat.value}
            subtitle={stat.sub}
            color={stat.color}
            mode={stat.dark ? "solid" : ""}
            variant="v9"
          />
        ))}
      </div> */}

      {/* ── PAYMENT + ORDER TYPE ── */}
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment breakdown */}
        <MetricPanel
          icon={Wallet}
          title="Payment Collection"
          right={
            <span className="text-[13px] font-black text-slate-900 tabular-nums">
              {formatNumber(totalPay, true)}
            </span>
          }
        >
          {Object.entries(summary?.paymentModeBreakdown || {})
            .sort((a, b) => num(b[1]) - num(a[1]))
            .map(([mode, amount]) => (
              <PayRow key={mode} type={mode} amount={amount} total={totalPay} />
            ))}

          {Object.keys(summary?.paymentModeBreakdown || {}).length === 0 && (
            <p className="text-[12px] text-slate-400 text-center py-6">
              No payment data
            </p>
          )}
        </MetricPanel>

        {/* Order type breakdown */}
        <MetricPanel
          icon={BarChart2}
          title="Orders by Type"
          right={
            <span className="text-[13px] font-black text-slate-900 tabular-nums">
              {num(summary?.totalOrders)} total
            </span>
          }
        >
          {Object.entries(summary?.orderTypeBreakdown || {})
            .filter(([_, count]) => num(count) > 0)
            .map(([type, count]) => (
              <OrderTypeBar
                key={type}
                type={type}
                value={count}
                total={summary?.totalOrders}
              />
            ))}

          {num(summary?.cancelledOrders) > 0 && (
            <OrderTypeBar
              type="cancelled"
              value={summary?.cancelledOrders}
              total={summary?.totalOrders}
            />
          )}

          {Object.keys(summary?.orderTypeBreakdown || {}).length === 0 && (
            <p className="text-[12px] text-slate-400 text-center py-6">
              No order type data
            </p>
          )}
        </MetricPanel>
      </div>

      <SmartTable
        title="Orders"
        totalcount={pagination?.totalCount}
        data={orders}
        columns={columns}
        loading={isFetchingDailyReportDetails}
        actions={rowActions}
      />

      <Pagination
        totalItems={pagination?.totalCount}
        currentPage={currentPage}
        pageSize={itemsPerPage}
        totalPages={pagination?.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        maxPageNumbers={5}
        showPageSizeSelector={true}
        onPageSizeChange={(size) => {
          setCurrentPage(1);
          setItemsPerPage(size);
        }}
      />
    </div>
  );
};

export default DailySalesReportDetailsPage;
