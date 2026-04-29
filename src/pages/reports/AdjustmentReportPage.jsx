import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdjustmentReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import {
  Download,
  Eye,
  Receipt,
  RotateCcw,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import { handleResponse } from "../../utils/helpers";
import { exportAdjustmentReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";
import OrderBadge from "../../partial/order/OrderBadge";
import StatCard from "../../components/StatCard";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/paths";

const AdjustmentReportPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState();

  const { outletId } = useSelector((state) => state.auth);

  const { isFetchingAdjustmentReport, adjustmentReport } = useSelector(
    (state) => state.report,
  );
  const { isExportingAdjustmentReport } = useSelector(
    (state) => state.exportReport,
  );
  const { summary, items, pagination } = adjustmentReport || {};

  const fetchReport = () => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(fetchAdjustmentReport({ outletId, dateRange }));
  };

  useEffect(() => {
    fetchReport();
  }, [outletId, dateRange]);

  const handleExport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Adjustment-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportAdjustmentReport({ outletId, dateRange })),
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
      label: "Export Report",
      type: "export",
      icon: Download,
      onClick: () => handleExport(),
      loading: isExportingAdjustmentReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingAdjustmentReport,
      loadingText: "Refreshing...",
    },
  ];

  const columns = [
    {
      key: "order",
      label: "Order",
      render: (row) => (
        <div className="flex flex-col gap-0.5 min-w-[140px]">
          {/* Order Number */}
          <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md w-fit">
            {row.orderNumber}
          </span>

          {/* Date + Time */}
          {row.createdAt ? (
            <div className="text-[10px] text-gray-400 ">
              {formatDate(row.createdAt, "longTime")}
            </div>
          ) : (
            <span className="text-gray-300 text-xs">—</span>
          )}
        </div>
      ),
    },

    {
      key: "orderType",
      label: "Type",
      render: (row) => <OrderBadge type="type" value={row.orderType} />,
    },

    {
      key: "customer",
      label: "Customer",
      render: (row) => (
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-none mb-0.5 truncate max-w-[140px]">
            {row.customerName || (
              <span className="text-gray-300 font-normal">—</span>
            )}
          </p>

          {row.customerPhone && (
            <p className="text-[10px] text-gray-400 font-mono">
              {row.customerPhone}
            </p>
          )}
        </div>
      ),
    },

    {
      key: "table",
      label: "Table / Floor",
      render: (row) =>
        row.tableNumber ? (
          <div>
            <p className="text-sm font-semibold text-gray-700 leading-none mb-0.5">
              {row.tableNumber}
            </p>
            {row.floorName && (
              <p className="text-[10px] text-gray-400 truncate max-w-[120px]">
                {row.floorName}
              </p>
            )}
          </div>
        ) : (
          <span className="text-gray-300 text-sm">—</span>
        ),
    },

    {
      key: "totalAmount",
      label: "Total",
      render: (row) => (
        <div className="">
          <span className="text-sm font-semibold text-gray-800 tabular-nums">
            {formatNumber(row.totalAmount, true)}
          </span>
        </div>
      ),
    },

    {
      key: "paidAmount",
      label: "Paid",
      render: (row) => (
        <div className="">
          <span className="text-sm font-semibold text-emerald-700 tabular-nums">
            {formatNumber(row.paidAmount, true)}
          </span>
        </div>
      ),
    },

    {
      key: "adjustmentAmount",
      label: "Adjustment",
      render: (row) => (
        <div className="">
          <span
            className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg tabular-nums
            ${
              row.adjustmentAmount > 0
                ? "bg-red-50 text-red-600"
                : row.adjustmentAmount < 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            {formatNumber(row.adjustmentAmount, true)}
          </span>
        </div>
      ),
    },

    {
      key: "reason",
      label: "Reason",
      render: (row) => (
        <p
          className="text-xs text-gray-600 truncate max-w-[140px]"
          title={row.reason}
        >
          {row.reason || <span className="text-gray-300">—</span>}
        </p>
      ),
    },

    {
      key: "adjustedBy",
      label: "Adjusted By",
      render: (row) => (
        <span className="text-xs font-medium text-gray-700 truncate max-w-[90px]">
          {row.adjustedByName}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "Eye",
      icon: Eye,
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.ORDER_DETAILS}?orderId=${row.orderId}`),
    },
  ];

  const stats = [
    {
      label: "Total Bill",
      value: `${formatNumber(summary?.totalBillAmount, true)}`,
      sub: "Total billed amount",
      icon: Receipt,
      color: "blue",
    },
    {
      label: "Total Paid",
      value: `${formatNumber(summary?.totalPaidAmount, true)}`,
      sub: "Amount received",
      icon: Wallet, // or CreditCard
      color: "green",
    },
    {
      label: "Total Adjustments",
      value: formatNumber(summary?.adjustmentCount),
      sub: "Total adjustment entries",
      icon: SlidersHorizontal,
      color: "purple",
    },

    {
      label: "Adjustment Amount",
      value: `${formatNumber(summary?.totalAdjustmentAmount, true)}`,
      sub: "Net adjustment value",
      icon: TrendingUp,
      color: "red",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={"Adjustment Report"}
        showBackButton
        actions={actions}
        rightContent={
          <CustomDateRangePicker value={dateRange} onChange={setDateRange} />
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4  gap-3">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            icon={stat.icon}
            title={stat.label}
            value={stat.value}
            subtitle={stat.sub}
            color={stat.color}
            mode={"solid"}
            variant="v9"
            loading={isFetchingAdjustmentReport}
          />
        ))}
      </div>

      <SmartTable
        title="Adjustment"
        totalcount={pagination?.total}
        data={items}
        columns={columns}
        actions={rowActions}
        loading={isFetchingAdjustmentReport}
      />
    </div>
  );
};

export default AdjustmentReportPage;
