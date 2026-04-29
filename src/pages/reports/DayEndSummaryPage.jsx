import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDailyEndSummary } from "../../redux/slices/dashboardSlice";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import { handleResponse } from "../../utils/helpers";
import { exportDayEndSummary } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";
import {
  RotateCcw,
  TrendingUp,
  Users,
  ArrowUpRight,
  Receipt,
  Calendar,
  Download,
} from "lucide-react";
import PageHeader from "../../layout/PageHeader";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import DayEndCard from "../../partial/report/day-end-summary-report/DayEndCard";
import DayEndCollectionSummaryCard from "../../partial/report/day-end-summary-report/DayEndCollectionSummaryCard";
import DayEndSummarySkeleton from "../../partial/report/day-end-summary-report/DayEndSummarySkeleton";
import NoDataFound from "../../layout/NoDataFound";

/* ─── helpers ─── */
const fmt = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
const fmtN = (n) => Number(n || 0).toLocaleString("en-IN");

/* ─── main page ─── */
const DayEndSummaryPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { isExportingDayEndSummary } = useSelector(
    (state) => state.exportReport,
  );
  const { dailyEndSummary, isFetchingDailyEndSummary } = useSelector(
    (state) => state.dashboard,
  );
  const { grandTotal, days, dateRange, dayCount, outsideCollections } =
    dailyEndSummary || {};

  const [dateRangeState, setDateRangeState] = useState(null);

  const fetchReport = () => {
    dispatch(fetchDailyEndSummary({ outletId, dateRange: dateRangeState }));
  };

  useEffect(() => {
    if (!outletId || !dateRangeState?.startDate || !dateRangeState?.endDate)
      return;
    fetchReport();
  }, [dateRangeState, outletId]);

  const handleExport = async () => {
    if (!dateRangeState?.startDate || !dateRangeState?.endDate) return;
    const fileName = `Day-End-Summary-Report_${formatFileDate(dateRangeState.startDate)}_to_${formatFileDate(dateRangeState.endDate)}`;
    await handleResponse(
      dispatch(exportDayEndSummary({ outletId, dateRange: dateRangeState })),
      (res) => downloadBlob({ data: res.payload, fileName }),
    );
  };

  const actions = [
    {
      label: "Export",
      icon: Download,
      onClick: handleExport,
      loading: isExportingDayEndSummary,
      loadingText: "Exporting...",
      type:"export"
    },
    {
      label: "Refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingDailyEndSummary,
      loadingText: "Refreshing...",
      type:"refresh"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Day End Summary"
        description={
          dateRange
            ? `${formatDate(dateRange.start, "long")} — ${formatDate(dateRange.end, "long")} (${dayCount} days)`
            : "Select a date range to view summary"
        }
        rightContent={
          <CustomDateRangePicker
            value={dateRangeState}
            onChange={setDateRangeState}
          />
        }
        actions={actions}
      />

      {/* Body */}
      {!dailyEndSummary && !isFetchingDailyEndSummary ? (
        <NoDataFound
          icon={Calendar}
          title=" Select a date range to get started"
          description=" Select a date range to get started"
        />
      ) : isFetchingDailyEndSummary ? (
        <DayEndSummarySkeleton />
      ) : (
        <div className="space-y-6">
          {/* ── Grand Total stats ── */}
          {grandTotal && (
            <div className="space-y-4">
              {/* price breakup accordion */}
              <DayEndCollectionSummaryCard
                grandTotal={grandTotal}
                outsideCollections={outsideCollections}
                dateRange={dateRange}
              />
            </div>
          )}

          {/* ── Day-wise breakdown ── */}
          {days && days.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-0.5">
                <Calendar size={13} className="text-gray-400" />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Day-wise breakdown
                </p>
              </div>
              <div className="space-y-2">
                {[...days]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((day) => (
                    <DayEndCard key={day.date} day={day} />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DayEndSummaryPage;
