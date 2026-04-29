import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentModeReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import SmartTable from "../../components/SmartTable";
import { formatNumber } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import {
  AlertCircle,
  Ban,
  CreditCard,
  Download,
  HandCoins,
  IndianRupee,
  Percent,
  Receipt,
  ReceiptIndianRupee,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { handleResponse } from "../../utils/helpers";
import { formatFileDate } from "../../utils/dateFormatter";
import { exportPaymentModeReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";

const PaymentModeReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { isExportingPaymentModeReport } = useSelector(
    (state) => state.exportReport,
  );
  const { paymentModeReport, isFetchingPaymentModeReport } = useSelector(
    (state) => state.report,
  );
  const { modes, summary } = paymentModeReport || {};

  const [dateRange, setDateRange] = useState();

  const fetchReport = () => {
    dispatch(fetchPaymentModeReport({ outletId, dateRange }));
  };
  useEffect(() => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    fetchReport();
  }, [outletId, dateRange]);

  const stats = [
    {
      title: "Total Sales",
      value: formatNumber(summary?.total_sale, true),
      subtitle: "Gross amount",
      icon: IndianRupee,
      color: "green",
    },

    {
      title: "Total Collected",
      value: formatNumber(summary?.total_collected, true),
      subtitle: "Received amount",
      icon: Wallet,
      color: "emerald",
    },

    {
      title: "Due Amount",
      value: formatNumber(summary?.due_amount, true),
      subtitle: "Pending collection",
      icon: IndianRupee,
      color: "red",
    },

    {
      title: "Total Transactions",
      value: summary?.total_transactions,
      subtitle: `${summary?.total_orders} orders`,
      icon: Receipt,
      color: "blue",
    },

    {
      title: "Avg Transaction",
      value: formatNumber(summary?.average_transaction, true),
      subtitle: "Per transaction",
      icon: TrendingUp,
      color: "indigo",
    },
  ];

  const columns = [
    {
      key: "payment_mode",
      label: "Payment Mode",
      render: (row) => (
        <span className="font-medium text-slate-800 capitalize">
          {row.payment_mode}
        </span>
      ),
    },

    {
      key: "transaction_count",
      label: "Transactions",
      render: (row) => (
        <span className="text-slate-700 font-medium">
          {row.transaction_count}
        </span>
      ),
    },

    {
      key: "base_amount",
      label: "Base Amount",
      render: (row) => formatNumber(row.base_amount, true),
    },

    {
      key: "total_amount",
      label: "Total",
      render: (row) => (
        <span className="font-semibold text-indigo-700">
          {formatNumber(row.total_amount, true)}
        </span>
      ),
    },

    {
      key: "percentage_share",
      label: "Share",
      render: (row) => {
        const percent = parseFloat(row.percentage_share) || 0;

        return (
          <div className="w-[120px]">
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>{percent}%</span>
            </div>

            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  const handleExportPaymentModeReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Payment-Mode-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportPaymentModeReport({ outletId, dateRange })),
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
      onClick: () => handleExportPaymentModeReport(),
      loading: isExportingPaymentModeReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingPaymentModeReport,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <PageHeader
          title={"Payment Mode Report"}
          showBackButton
          rightContent={
            <CustomDateRangePicker
              value={dateRange}
              onChange={(newRange) => {
                setDateRange(newRange);
              }}
            />
          }
          actions={actions}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        {stats?.map((stat, index) => (
          <StatCard
            key={index}
            title={stat?.title}
            value={stat?.value}
            subtitle={stat?.subtitle}
            icon={stat?.icon}
            color={stat?.color}
            variant="v9"
            mode="solid"
            loading={isFetchingPaymentModeReport}
          />
        ))}
      </div>

      <SmartTable
        title={"Payment Mode"}
        totalcount={modes?.length}
        data={modes}
        columns={columns}
        rowKey="payment_mode"
        loading={isFetchingPaymentModeReport}
        //   actions={rowActions}
      />
    </div>
  );
};

export default PaymentModeReportPage;
