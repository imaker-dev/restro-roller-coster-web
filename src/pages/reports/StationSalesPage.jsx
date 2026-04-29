import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStationSalesReport } from "../../redux/slices/reportSlice";
import PageHeader from "../../layout/PageHeader";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import {
  Building2,
  CheckCircle,
  CheckCircle2,
  ChefHat,
  Clock,
  Download,
  Package,
  Receipt,
  RotateCcw,
  Ticket,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import MetaPill from "../../components/MetaPill";
import StationCard from "../../partial/report/station-report/StationCard";
import NoDataFound from "../../layout/NoDataFound";
import LoadingOverlay from "../../components/LoadingOverlay";
import { formatFileDate } from "../../utils/dateFormatter";
import { exportStationSalesReport } from "../../redux/slices/exportReportSlice";
import { handleResponse } from "../../utils/helpers";
import { downloadBlob } from "../../utils/blob";
import SmartTable from "../../components/SmartTable";

const StationSalesPage = () => {
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState();

  const { outletId } = useSelector((state) => state.auth);
  const { isExportingStationSalesReport } = useSelector(
    (state) => state.exportReport,
  );
  const { stationSalesReport, isFetchingStationSalesReport } = useSelector(
    (state) => state.report,
  );
  const { summary = {}, stations = [] } = stationSalesReport || {};

  const fetchReport = () => {
    dispatch(fetchStationSalesReport({ outletId, dateRange }));
  };

  useEffect(() => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;
    fetchReport();
  }, [outletId, dateRange]);

  const stats = [
    {
      title: "Stations",
      value: formatNumber(summary?.total_stations),
      subtitle: "Active stations",
      icon: Building2,
      color: "indigo",
    },

    {
      title: "Total Tickets",
      value: formatNumber(summary?.total_tickets),
      subtitle: "Orders processed",
      icon: Receipt,
      color: "blue",
    },
    {
      title: "Total Quantity",
      value: formatNumber(summary?.total_quantity),
      subtitle: `${formatNumber(summary?.total_items)} items`,
      icon: Package,
      color: "amber",
    },

    {
      title: "Served Items",
      value: formatNumber(summary?.served_count),
      subtitle: "Completed",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Cancelled",
      value: formatNumber(summary?.cancelled_count),
      subtitle: "Not served",
      icon: XCircle,
      color: "red",
    },
  ];

  if (isFetchingStationSalesReport) {
    return <LoadingOverlay text="Loading Satation Sales Report..." />;
  }

  const handleExportStationSalesReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Station-Sales-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportStationSalesReport({ outletId, dateRange })),
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
      onClick: () => handleExportStationSalesReport(),
      loading: isExportingStationSalesReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingStationSalesReport,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={"Station Sales"}
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

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats?.map((card, i) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            color={card.color}
            icon={card.icon}
            subtitle={card.subtitle}
            variant="v9"
            mode="solid"
          />
        ))}
      </div>

      {/* Stations Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-black text-slate-900">
            Station Performance
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Operational breakdown by station
          </p>
        </div>

        {stations.length > 0 && (
          <span className="text-[11px] font-semibold text-slate-500">
            {stations.length} station{stations.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Station cards grid */}
      {stations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {stations.map((station, i) => (
            <StationCard key={station.stationId} station={station} />
          ))}
        </div>
      ) : (
        <NoDataFound
          icon={ChefHat}
          title="No station data found"
          description="No station activity for the selected date range."
        />
      )}
    </div>
  );
};

export default StationSalesPage;
