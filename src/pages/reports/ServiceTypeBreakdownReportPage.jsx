import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceTypeBreakdownReport } from "../../redux/slices/reportSlice";
import PageHeader from "../../layout/PageHeader";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import {
  Utensils,
  Wine,
  Layers,
  BarChart3,
  Download,
  Tag,
  ReceiptIndianRupee,
  RotateCcw,
} from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";
import ServiceTypeBreakdownReportSkeleton from "../../partial/report/ServiceTypeBreakdownReportSkeleton";
import StatCard from "../../components/StatCard";
import { formatFileDate } from "../../utils/dateFormatter";
import { handleResponse } from "../../utils/helpers";
import { downloadBlob } from "../../utils/blob";
import { exportServiceTypeBreakdownReport } from "../../redux/slices/exportReportSlice";

/* ---------------- Color Mapping (Safe for Tailwind) ---------------- */
const colorMap = {
  emerald: {
    bg: "bg-emerald-500",
    light: "bg-emerald-50",
    text: "text-emerald-600",
  },
  purple: {
    bg: "bg-purple-500",
    light: "bg-purple-50",
    text: "text-purple-600",
  },
  indigo: {
    bg: "bg-indigo-500",
    light: "bg-indigo-50",
    text: "text-indigo-600",
  },
};

/* ---------------- Breakdown Card ---------------- */
const BreakdownCard = ({ title, data, icon: Icon, color }) => {
  const styles = colorMap[color];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold mt-1">
            {formatNumber(data.gross_revenue, true)}
          </p>
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.bg}`}
        >
          <Icon className="text-white w-5 h-5" />
        </div>
      </div>

      {/* Percentage Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Contribution</span>
          <span className={styles.text}>{data.percentage}%</span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`${styles.bg} h-2 rounded-full transition-all duration-700`}
            style={{ width: `${data.percentage}%` }}
          />
        </div>
      </div>

      {/* Premium Stats Section */}
      <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
        <StatRow label="Quantity Sold" value={data.quantity} />
        <StatRow label="Orders" value={data.order_count} />
        <StatRow label="Unique Items" value={data.unique_items} />
        <StatRow label="Tax Collected" value={formatNumber(data.tax, true)} />
      </div>
    </div>
  );
};

/* ---------------- Small Stat Block ---------------- */
const StatRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between text-sm">
      <p className="text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
};

/* ---------------- MAIN PAGE ---------------- */
const ServiceTypeBreakdownReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { isExportingServiceTypeBreakdownReport } = useSelector(
    (state) => state.exportReport,
  );
  const { serviceTypeBreakdownReport, isFetchingServiceTypeBreakdownReport } =
    useSelector((state) => state.report);
  const { summary, breakdown } = serviceTypeBreakdownReport || {};

  const [dateRange, setDateRange] = useState();

  const fetchReport = () => {
    dispatch(fetchServiceTypeBreakdownReport({ outletId, dateRange }));
  };

  useEffect(() => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;
    fetchReport();
  }, [outletId, dateRange]);

  const summaryCards = [
    {
      title: "Gross Revenue",
      value: formatNumber(summary?.gross_revenue, true),
      icon: BarChart3,
      color: "indigo",
    },
    {
      title: "Net Revenue",
      value: formatNumber(summary?.net_revenue, true),
      icon: BarChart3,
      color: "emerald",
    },
    {
      title: "Discount Given",
      value: formatNumber(summary?.discount_amount, true),
      icon: Tag,
      color: "amber",
    },
    {
      title: "Tax Collected",
      value: formatNumber(summary?.tax_amount, true),
      icon: ReceiptIndianRupee,
      color: "purple",
    },
    {
      title: "Total Quantity",
      value: summary?.total_quantity,
      icon: Layers,
      color: "blue",
    },
  ];

  if (isFetchingServiceTypeBreakdownReport) {
    return <ServiceTypeBreakdownReportSkeleton />;
  }

  const handleExportServiceTypeBreakdownReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Service-Type-Breakdown-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportServiceTypeBreakdownReport({ outletId, dateRange })),
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
      onClick: () => handleExportServiceTypeBreakdownReport(),
      loading: isExportingServiceTypeBreakdownReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingServiceTypeBreakdownReport,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Service Type Breakdown"
        showBackButton
        rightContent={
          <CustomDateRangePicker
            value={dateRange}
            onChange={(newRange) => setDateRange(newRange)}
          />
        }
        actions={actions}
      />

      {/* ---------------- SUMMARY SECTION ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {summaryCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            variant="v9"
          />
        ))}
      </div>

      {/* ---------------- BREAKDOWN SECTION ---------------- */}
      {breakdown && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <BreakdownCard
            title="Restaurant"
            data={breakdown.restaurant}
            icon={Utensils}
            color="emerald"
          />

          <BreakdownCard
            title="Bar"
            data={breakdown.bar}
            icon={Wine}
            color="purple"
          />

          <BreakdownCard
            title="Shared Orders"
            data={breakdown.both}
            icon={Layers}
            color="indigo"
          />
        </div>
      )}
    </div>
  );
};

export default ServiceTypeBreakdownReportPage;
