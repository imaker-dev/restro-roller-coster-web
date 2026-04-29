import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDailySalesReport } from "../../redux/slices/reportSlice";
import PageHeader from "../../layout/PageHeader";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import {
  Download,
  RotateCcw,
  TrendingUp,
  Receipt,
  Users,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import { handleResponse } from "../../utils/helpers";
import { exportDailySalesReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";
import { formatNumber } from "../../utils/numberFormatter";
import DailySalesSummaryBreakup from "../../partial/report/daily-sales-report/DailySalesSummaryBreakup";
import DailySalesSummaryCard from "../../partial/report/daily-sales-report/DailySalesSummaryCard";
import DailySalesReportSkeleton from "../../partial/report/daily-sales-report/DailySalesReportSkeleton";
import NoDataFound from "../../layout/NoDataFound";

/* ── helpers ── */
const fmt = (n) => formatNumber(n, true);
const fmtN = (n) => formatNumber(n);

/* ── Main Page ── */
const DailySalesReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((s) => s.auth);
  const { dailySalesReport, isFetchingDailyReports } = useSelector(
    (s) => s.report,
  );
  const { isExportingDailySalesReport } = useSelector((s) => s.exportReport);
  const [dateRange, setDateRange] = useState();

  const fetchReport = () => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;
    dispatch(fetchDailySalesReport({ outletId, dateRange }));
  };

  useEffect(() => {
    fetchReport();
  }, [dateRange, outletId]);

  const handleExport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;
    const fileName = `Daily-Sales-Report_${formatFileDate(dateRange.startDate)}_to_${formatFileDate(dateRange.endDate)}`;
    await handleResponse(
      dispatch(exportDailySalesReport({ outletId, dateRange })),
      (res) => downloadBlob({ data: res.payload, fileName }),
    );
  };

  const actions = [
    {
      label: "Export",
      type: "export",
      icon: Download,
      onClick: handleExport,
      loading: isExportingDailySalesReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingDailyReports,
      loadingText: "Refreshing...",
    },
  ];

  const {
    summary,
    daily,
    dateRange: dr,
    orders,
    crossVerification,
    outsideCollections,
  } = dailySalesReport || {};

  const dayCount = daily?.length || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Sales Report"
        description={
          dr
            ? `${formatDate(dr.start, "long")} — ${formatDate(dr.end, "long")} · ${dayCount} day${dayCount !== 1 ? "s" : ""}`
            : "Select a date range to view report"
        }
        rightContent={
          <CustomDateRangePicker value={dateRange} onChange={setDateRange} />
        }
        actions={actions}
        showBackButton
      />

      {/* body */}
      {!dailySalesReport && !isFetchingDailyReports ? (
        <NoDataFound
          icon={Calendar}
          title="Select a date range to get started"
          description="Your daily sales report will appear here"
        />
      ) : isFetchingDailyReports ? (
        <DailySalesReportSkeleton />
      ) : (
        <div className="space-y-6">
          {/* ── Summary stats ── */}
          {summary && (
            <div className="space-y-4">
              {/* price breakup accordion */}
              <DailySalesSummaryBreakup
                summary={summary}
                outsideCollections={outsideCollections}
              />
            </div>
          )}

          {/* ── Day-wise ── */}
          {daily && daily.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-0.5">
                <Calendar size={13} className="text-gray-400" />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Day-wise breakdown
                </p>
              </div>
              <div className="space-y-2">
                {[...daily]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((day) => (
                    <DailySalesSummaryCard key={day.date} day={day} />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailySalesReportPage;
