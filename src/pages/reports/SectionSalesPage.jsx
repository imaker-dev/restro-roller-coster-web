import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectionSalesReport } from "../../redux/slices/reportSlice";
import PageHeader from "../../layout/PageHeader";
import {
  Download,
  IndianRupee,
  LayoutGrid,
  RotateCcw,
  ShoppingBag,
  Star,
} from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import FloorBlock from "../../partial/report/section-report/FloorBlock";
import LoadingOverlay from "../../components/LoadingOverlay";
import NoDataFound from "../../layout/NoDataFound";
import { formatFileDate } from "../../utils/dateFormatter";
import { handleResponse } from "../../utils/helpers";
import { exportSectionSalesReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";

const SectionSalesPage = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState();

  const { outletId } = useSelector((state) => state.auth);
  const { isExportingSectionSalesReport } = useSelector(
    (state) => state.exportReport,
  );
  const { sectionSalesReport, isFetchingSectionSalesReport } = useSelector(
    (state) => state.report,
  );
  const { summary, floors } = sectionSalesReport || {};

  const fetchReport = () => {
    dispatch(fetchSectionSalesReport({ outletId, dateRange }));
  };

  useEffect(() => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;
    fetchReport();
  }, [outletId, dateRange]);

  const totalSales = summary?.total_sales;

  const kpis = [
    {
      icon: LayoutGrid,
      title: "Total Floors",
      value: formatNumber(summary?.total_floors || 0),
      subtitle: `${formatNumber(summary?.total_sections || 0)} sections`,
      color: "indigo",
    },
    {
      icon: ShoppingBag,
      title: "Total Orders",
      value: formatNumber(summary?.total_orders || 0),
      subtitle: `${formatNumber(summary?.cancelled_orders || 0)} cancelled`,
      color: "amber",
    },
    {
      icon: IndianRupee,
      title: "Total Sales",
      value: formatNumber(summary?.total_sales),
      subtitle: `Avg ${formatNumber(summary?.average_order_value)}/order`,
      color: "emerald",
    },
    {
      icon: Star,
      title: "Total Guests",
      value: formatNumber(summary?.total_guests),
      subtitle: "Across all sections",
      color: "rose",
    },
  ];

  if (isFetchingSectionSalesReport) {
    return <LoadingOverlay text="Loading Floor Report..." />;
  }

  const handleExportSectionSalesReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Section-Sales-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportSectionSalesReport({ outletId, dateRange })),
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
      onClick: () => handleExportSectionSalesReport(),
      loading: isExportingSectionSalesReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingSectionSalesReport,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={"Section Sales"}
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpis?.map((card, i) => (
          <StatCard
            key={i}
            title={card.title}
            value={card.value}
            color={card.color}
            icon={card.icon}
            subtitle={card.subtitle}
            variant="v9"
          />
        ))}
      </div>

      {summary?.top_section && (
        <div
          className="bg-emerald-50 border border-emerald-200 
               rounded-lg px-4 py-2 
               flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-2 truncate">
            <Star className="w-4 h-4 text-emerald-600 shrink-0" />

            <span className="text-emerald-700 font-medium">Top Section:</span>

            <span className="text-slate-800 font-semibold truncate max-w-[220px]">
              {summary?.top_section}
            </span>

            <span className="text-slate-500">
              ({formatNumber(summary?.top_section_sales)} sold)
            </span>
          </div>
        </div>
      )}

      {/* Floors + Sections */}
      {floors && floors.length > 0 ? (
        floors.map((floor, fi) => (
          <FloorBlock
            key={floor.floorId}
            floor={floor}
            floorIdx={fi}
            totalSales={totalSales}
          />
        ))
      ) : (
        <NoDataFound
          icon={LayoutGrid}
          title="No floor data found"
          description="Try selecting a different date range."
        />
      )}
    </div>
  );
};

export default SectionSalesPage;
