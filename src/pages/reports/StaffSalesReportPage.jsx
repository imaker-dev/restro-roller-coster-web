import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaffSalesReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import SmartTable from "../../components/SmartTable";
import { formatNumber } from "../../utils/numberFormatter";
import {
  Download,
  IndianRupee,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import { formatFileDate } from "../../utils/dateFormatter";
import { handleResponse } from "../../utils/helpers";
import { exportStaffSalesReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";

const StaffSalesReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { isExportingStaffSalesReport } = useSelector(
    (state) => state.exportReport,
  );
  const { staffSalesReport, isFetchingStaffSalesReport } = useSelector(
    (state) => state.report,
  );
  const { staff, summary } = staffSalesReport || {};

  const [dateRange, setDateRange] = useState();

  const fetchReport = () => {
    dispatch(fetchStaffSalesReport({ outletId, dateRange }));
  };
  useEffect(() => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;
    fetchReport();
  }, [outletId, dateRange]);

  const stats = [
    {
      title: "Total Sales",
      value: formatNumber(summary?.total_sale, true),
      subtitle: "Gross revenue",
      icon: IndianRupee,
      color: "green",
    },
    {
      title: "Total Staff",
      value: summary?.total_staff,
      subtitle: "Active staff",
      icon: Users,
      color: "indigo",
    },
    {
      title: "Avg per Staff",
      value: formatNumber(summary?.average_per_staff, true),
      subtitle: "Average sales",
      icon: TrendingUp,
      color: "blue",
    },

    {
      title: "Total Orders",
      value: summary?.total_orders,
      subtitle: `${summary?.total_guests} guests`,
      icon: ShoppingCart,
      color: "amber",
    },
  ];

  const columns = [
    {
      key: "user",
      label: "Staff",
      render: (row) => (
        <p className="font-medium text-slate-800">{row.user_name}</p>
      ),
    },

    {
      key: "total_orders",
      label: "Orders",
      render: (row) => <span className="font-medium">{row.total_orders}</span>,
    },

    {
      key: "avg_order_value",
      label: "Avg Order",
      render: (row) => formatNumber(row.avg_order_value, true),
    },

    {
      key: "total_discounts",
      label: "Discount",
      render: (row) => (
        <span className="text-rose-600">
          {formatNumber(row.total_discounts, true)}
        </span>
      ),
    },

    //  Correct field
    {
      key: "total_sale",
      label: "Sales",
      render: (row) => (
        <span className="font-semibold text-emerald-700">
          {formatNumber(row.total_sale, true)}
        </span>
      ),
    },

    //  Payments (important)
    {
      key: "paid_amount",
      label: "Paid",
      render: (row) => formatNumber(row.paid_amount, true),
    },

    {
      key: "due_amount",
      label: "Due",
      render: (row) => (
        <span className="text-red-600">
          {formatNumber(row.due_amount, true)}
        </span>
      ),
    },
  ];

  const handleExportStaffSalesReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Staff-Sales-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportStaffSalesReport({ outletId, dateRange })),
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
      onClick: () => handleExportStaffSalesReport(),
      loading: isExportingStaffSalesReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingStaffSalesReport,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={"Staff Sales Report"}
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
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
            loading={isFetchingStaffSalesReport}
          />
        ))}
      </div>

      {summary?.top_performer && (
        <div
          className="bg-amber-50 border border-amber-200 
               rounded-lg px-4 py-2 
               flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-2 truncate">
            <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />

            <span className="text-amber-700 font-medium">Top Performer:</span>

            <span className="text-slate-800 font-semibold truncate max-w-[220px]">
              {summary?.top_performer}
            </span>
          </div>

          <span className="text-amber-700 font-semibold">
            {formatNumber(summary?.top_performer_sales, true)}{" "}
            <span className="text-slate-500 font-normal text-xs">sales</span>
          </span>
        </div>
      )}

      <SmartTable
        title={"Staff Sales"}
        totalcount={staff?.length}
        data={staff}
        columns={columns}
        rowKey="user_id"
        loading={isFetchingStaffSalesReport}
        //   actions={rowActions}
      />
    </div>
  );
};

export default StaffSalesReportPage;
