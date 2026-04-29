import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategorySalesReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";
import {
  Download,
  IndianRupee,
  Layers,
  Package,
  RotateCcw,
  Star,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import { useReportDateRange } from "../../hooks/useReportDateRange";
import { exportCategorySalesReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";
import { handleResponse } from "../../utils/helpers";
import { formatFileDate } from "../../utils/dateFormatter";

const CategorySalesReportPage = () => {
  const dispatch = useDispatch();
  // const [dateRange, setDateRange] = useState();
  const { dateRange, setDateRange } = useReportDateRange();

  const { categorySalesReport, isFetchingCategorySalesReport } = useSelector(
    (state) => state.report,
  );
  const { categories, summary } = categorySalesReport || {};
  const { outletId } = useSelector((state) => state.auth);
  const { isExportingCategorySalesReport } = useSelector(
    (state) => state.exportReport,
  );

  const fetchReport = () => {
    dispatch(fetchCategorySalesReport({ outletId, dateRange }));
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
      color: "emerald",
    },
    {
      title: "Total Categories",
      value: summary?.total_categories,
      subtitle: "Menu categories",
      icon: Layers,
      color: "indigo",
    },
    {
      title: "Total Quantity",
      value: summary?.total_quantity,
      subtitle: "Items sold",
      icon: Package,
      color: "blue",
    },
  ];

  const columns = [
    {
      key: "category",
      label: "Category",

      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">
            {row.category_name}
          </span>
          <span className="text-xs text-slate-500 capitalize">
            {row.category_service_type}
          </span>
        </div>
      ),
    },
    {
      key: "item_count",
      label: "Items",
      render: (row) => <span className="text-slate-600">{row.item_count}</span>,
    },
    {
      key: "order_count",
      label: "Orders",
      render: (row) => (
        <span className="text-slate-600">{row.order_count}</span>
      ),
    },
    {
      key: "total_quantity",
      label: "Qty Sold",
      render: (row) => (
        <span className="font-medium">{parseFloat(row.total_quantity)}</span>
      ),
    },
    {
      key: "discount_amount",
      label: "Discount",
      render: (row) => (
        <span className="text-rose-600">
          {formatNumber(row.discount_amount, true)}
        </span>
      ),
    },
    {
      key: "total_sale",
      label: "Sales",
      render: (row) => formatNumber(row.total_sale, true),
    },

    {
      key: "contribution_percent",
      label: "Contribution",
      render: (row) => {
        const percent = parseFloat(row.contribution_percent) || 0;

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

  const handleExportCategorySalesReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Category-Sales-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportCategorySalesReport({ outletId, dateRange })),
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
      onClick: () => handleExportCategorySalesReport(),
      loading: isExportingCategorySalesReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingCategorySalesReport,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <PageHeader
          title={"Category Sales Report"}
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
            loading={isFetchingCategorySalesReport}
          />
        ))}
      </div>

      {summary?.top_category && (
        <div
          className="bg-indigo-50 border border-indigo-200 
               rounded-lg px-4 py-2 
               flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-2 truncate">
            <Star className="w-4 h-4 text-indigo-600 shrink-0" />

            <span className="text-indigo-700 font-medium">Top Category:</span>

            <span className="text-slate-800 font-semibold truncate max-w-[220px]">
              {summary?.top_category}
            </span>
          </div>

          <span className="text-indigo-700 font-semibold">
            {formatNumber(summary?.top_category_revenue, true)}
          </span>
        </div>
      )}

      <SmartTable
        title={"Category Sales"}
        totalcount={categories?.length}
        data={categories}
        columns={columns}
        rowKey="category_id"
        loading={isFetchingCategorySalesReport}
        //   actions={rowActions}
      />
    </div>
  );
};

export default CategorySalesReportPage;
