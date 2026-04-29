import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShiftHistory } from "../../redux/slices/shiftSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import PageHeader from "../../layout/PageHeader";
import ShiftDateGroup from "../../partial/report/shift-summary/ShiftDateGroup";
import NoDataFound from "../../layout/NoDataFound";
import { Download, Layers, RotateCcw } from "lucide-react";
import { formatFileDate } from "../../utils/dateFormatter";
import { handleResponse } from "../../utils/helpers";
import { downloadBlob } from "../../utils/blob";
import { exportShiftHistory } from "../../redux/slices/exportReportSlice";
import ShiftDateGroupSkeleton from "../../partial/report/shift-summary/ShiftDateGroupSkeleton";

const groupByDate = (shifts = []) => {
  if (!Array.isArray(shifts)) return [];

  const map = {};

  shifts.forEach((s) => {
    if (!map[s.sessionDate]) {
      map[s.sessionDate] = [];
    }
    map[s.sessionDate].push(s);
  });

  return Object.entries(map).sort(([a], [b]) => new Date(b) - new Date(a));
};

const ShiftHistoryPage = () => {
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState();

  const { outletId } = useSelector((state) => state.auth);
  const { isExportingShiftHistory } = useSelector(
    (state) => state.exportReport,
  );
  const { isFetchingShiftHistory, shiftHistory } = useSelector(
    (state) => state.shift,
  );
  const { shifts, pagination } = shiftHistory || {};

  const fetchShifts = () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(fetchShiftHistory({ outletId, dateRange }));
  };
  useEffect(() => {
    fetchShifts();
  }, [outletId, dateRange]);

  const grouped = groupByDate(shifts);


  const handleExportShiftSummaryReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Shift-Summary-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportShiftHistory({ outletId, dateRange })),
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
      onClick: () => handleExportShiftSummaryReport(),
      loading: isExportingShiftHistory,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchShifts,
      loading: isFetchingShiftHistory,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={"Shift History"}
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
      <div className="space-y-8">
        {isFetchingShiftHistory ? (
          <>
            {Array.from({ length: 2 }).map((_, i) => (
              <ShiftDateGroupSkeleton key={i} />
            ))}
          </>
        ) : grouped.length > 0 ? (
          grouped.map(([dateStr, dayShifts]) => (
            <ShiftDateGroup
              key={dateStr}
              dateStr={dateStr}
              shifts={dayShifts}
            />
          ))
        ) : (
          dateRange?.startDate &&
          dateRange?.endDate && (
            <NoDataFound
              icon={Layers}
              title="No shifts found"
              description="No shift records available for the selected date range."
            />
          )
        )}
      </div>
    </div>
  );
};

export default ShiftHistoryPage;
