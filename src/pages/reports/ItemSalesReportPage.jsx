import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemSalesReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";
import {
  Download,
  IndianRupee,
  Package,
  RotateCcw,
  ShoppingCart,
  Star,
  TrendingUp,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import { useReportDateRange } from "../../hooks/useReportDateRange";
import { formatFileDate } from "../../utils/dateFormatter";
import { handleResponse } from "../../utils/helpers";
import { exportItemSalesReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";

const ItemSalesReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { isExportingItemSalesReport } = useSelector(
    (state) => state.exportReport,
  );
  const { itemSalesReport, isFetchingItemSalesReport } = useSelector(
    (state) => state.report,
  );
  const { items, summary } = itemSalesReport || {};
  // const [dateRange, setDateRange] = useState();
  const { dateRange, setDateRange } = useReportDateRange();

  const fetchReport = () => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(fetchItemSalesReport({ outletId, dateRange }));
  };

  useEffect(() => {
    fetchReport();
  }, [outletId, dateRange]);

  const columns = [
    {
      key: "item",
      label: "Item",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">{row.item_name}</span>
          <span className="text-xs text-slate-500">
            {row.variant_name || "—"}
          </span>
        </div>
      ),
    },

    {
      key: "category",
      label: "Category",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-slate-700">{row.category_name}</span>
          <span className="text-xs text-slate-500 capitalize">
            {row.category_service_type}
          </span>
        </div>
      ),
    },

    {
      key: "total_quantity",
      label: "Qty Sold",
      render: (row) => (
        <span className="font-medium">
          {parseFloat(row.total_quantity).toFixed(0)}
        </span>
      ),
    },

    {
      key: "order_count",
      label: "Orders",
      render: (row) => (
        <span className="text-slate-600">{row.order_count}</span>
      ),
    },

    {
      key: "avg_price",
      label: "Avg Price",
      render: (row) => formatNumber(row.avg_price, true),
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

    // Correct field
    {
      key: "total_sale",
      label: "Sales",
      render: (row) => formatNumber(row.total_sale, true),
    },
  ];

  const stats = [
    {
      title: "Total Sales",
      value: formatNumber(summary?.total_sale, true),
      subtitle: "Gross revenue",
      icon: IndianRupee,
      color: "green",
    },
    {
      title: "Total Items",
      value: summary?.total_items,
      subtitle: "Unique items sold",
      icon: Package,
      color: "amber",
    },
    {
      title: "Total Quantity",
      value: summary?.total_quantity,
      subtitle: "Units sold",
      icon: ShoppingCart,
      color: "blue",
    },
    {
      title: "Avg Item Revenue",
      value: formatNumber(summary?.average_item_revenue, true),
      subtitle: "Per item avg",
      icon: TrendingUp,
      color: "indigo",
    },
  ];

  const handleExportItemSalesReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Item-Sales-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportItemSalesReport({ outletId, dateRange })),
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
      onClick: () => handleExportItemSalesReport(),
      loading: isExportingItemSalesReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingItemSalesReport,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <PageHeader
        title={"Item Sales Report"}
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
            loading={isFetchingItemSalesReport}
          />
        ))}
      </div>

      {summary?.top_seller && (
        <div
          className="bg-emerald-50 border border-emerald-200 
                     rounded-lg px-4 py-2 
                     flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-2 truncate">
            <Star className="w-4 h-4 text-emerald-600 shrink-0" />

            <span className="text-emerald-700 font-medium">Top Seller:</span>

            <span className="text-slate-800 font-semibold truncate max-w-[220px]">
              {summary?.top_seller}
            </span>
          </div>

          <span className="text-emerald-700 font-semibold">
            {formatNumber(summary?.top_seller_quantity)} sold
          </span>
        </div>
      )}

      <SmartTable
        title={"Item Sales"}
        totalcount={items?.length}
        data={items}
        columns={columns}
        rowKey="item_id"
        loading={isFetchingItemSalesReport}
        //   actions={rowActions}
      />
    </div>
  );
};

export default ItemSalesReportPage;
