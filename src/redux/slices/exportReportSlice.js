import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import ExportServices from "../services/ExportServices";

/* ───────────── EXPORT THUNKS ───────────── */

export const exportDailySalesReport = createAsyncThunk(
  "/export/daily/sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ExportServices.exportDailySalesReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);

export const exportDailySalesReportDetails = createAsyncThunk(
  "/export/daily/sales/report/details",
  async ({ outletId, date }) => {
    const res = await ExportServices.exportDailyReportDetailsApi(
      outletId,
      date,
    );
    return res.data;
  },
);

export const exportItemSalesReport = createAsyncThunk(
  "/export/item/sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ExportServices.exportItemSalesReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);

export const exportCategorySalesReport = createAsyncThunk(
  "/export/category/sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ExportServices.exportCategorySalesReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);

export const exportStaffSalesReport = createAsyncThunk(
  "/export/staff/sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ExportServices.exportStaffSalesReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);

export const exportPaymentModeReport = createAsyncThunk(
  "/export/payment/mode/report",
  async ({ outletId, dateRange }) => {
    const res = await ExportServices.exportPaymentModeReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);

export const exportTaxReport = createAsyncThunk(
  "/export/tax/report",
  async ({ outletId, dateRange }) => {
    const res = await ExportServices.exportTaxReportApi(outletId, dateRange);
    return res.data;
  },
);

export const exportServiceTypeBreakdownReport = createAsyncThunk(
  "/export/service-type/breakdown/report",
  async ({ outletId, dateRange }) => {
    const res = await ExportServices.exportServiceTypeBreakdownReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);

export const exportRunningTable = createAsyncThunk(
  "/export/running/table",
  async (outletId) => {
    const res = await ExportServices.exportRunningTableApi(outletId);
    return res.data;
  },
);

export const exportRunningOrder = createAsyncThunk(
  "/export/running/order",
  async (outletId) => {
    const res = await ExportServices.exportRunnigOrderApi(outletId);
    return res.data;
  },
);

export const exportSectionSalesReport = createAsyncThunk(
  "/export/section-sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ExportServices.exportSectionSalesReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);

export const exportStationSalesReport = createAsyncThunk(
  "/export/station-sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ExportServices.exportStationSalesReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);

export const exportCancellationReport = createAsyncThunk(
  "/export/cancellation/report",
  async ({ outletId, dateRange }) => {
    const res = await ExportServices.exportCancellationReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);

export const exportShiftHistory = createAsyncThunk(
  "/export/shift/history",
  async ({ outletId, dateRange }) => {
    const res = await ExportServices.exportShiftHistoryApi(outletId, dateRange);
    return res.data;
  },
);

export const exportShiftHistoryDetails = createAsyncThunk(
  "/export/shift/history/details",
  async (shiftId) => {
    const res = await ExportServices.exportShiftHistoryDetailsApi(shiftId);
    return res.data;
  },
);

export const exportDayEndSummary = createAsyncThunk(
  "/export/day-end-summary",
  async ({ outletId, dateRange }) => {
    const res = await ExportServices.exportDayEndSummaryApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);

export const exportDayEndSummaryDetails = createAsyncThunk(
  "/export/day-end-summary/details",
  async ({ outletId, date }) => {
    const res = await ExportServices.exportDayEndSummaryDetailsApi(
      outletId,
      date,
    );
    return res.data;
  },
);

export const exportOrdersReport = createAsyncThunk(
  "/export/orders/report",
  async ({
    outletId,
    search,
    dateRange,
    orderStatus,
    orderType,
    paymentStatus,
    sortBy,
    sortOrder,
  }) => {
    const res = await ExportServices.exportOrdersReportApi(
      outletId,
      dateRange,
      search,
      orderStatus,
      orderType,
      paymentStatus,
      sortBy,
      sortOrder,
    );

    return res.data;
  },
);

export const exportDueReport = createAsyncThunk(
  "/export/due/report",
  async ({ outletId, dateRange, searchTerm }) => {
    const res = await ExportServices.exportDueReportApi(
      outletId,
      dateRange,
      searchTerm,
    );
    return res.data;
  },
);

export const exportNcReport = createAsyncThunk(
  "/export/nc/report",
  async ({ outletId, dateRange }) => {
    const res = await ExportServices.exportNcReportApi(outletId, dateRange);
    return res.data;
  },
);

export const exportDiscountReport = createAsyncThunk(
  "/export/discount/report",
  async ({ outletId, dateRange, search, sortBy, sortOrder, discountType }) => {
    const res = await ExportServices.exportDiscountReportApi({
      outletId,
      dateRange,
      search,
      sortBy,
      sortOrder,
      discountType,
    });
    return res.data;
  },
);

export const exportAdjustmentReport = createAsyncThunk(
  "/export/adjustment/report",
  async ({ outletId, dateRange }) => {
    const res = await ExportServices.exportAdjustmentReportApi({
      outletId,
      dateRange,    });
    return res.data;
  },
);

/* ───────────── SLICE ───────────── */

const exportReportSlice = createSlice({
  name: "exportReport",
  initialState: {
    isExportingDailySalesReport: false,
    isExportingDailySalesReportDetails: false,
    isExportingItemSalesReport: false,
    isExportingCategorySalesReport: false,
    isExportingStaffSalesReport: false,
    isExportingPaymentModeReport: false,
    isExportingTaxReport: false,
    isExportingServiceTypeBreakdownReport: false,
    isExportingRunningTable: false,
    isExportingRunningOrder: false,
    isExportingSectionSalesReport: false,
    isExportingStationSalesReport: false,
    isExportingCancellationReport: false,

    isExportingShiftHistory: false,
    isExportingShiftHistoryDetails: false,
    isExportingDayEndSummary: false,
    isExportingDayEndSummaryDetails: false,
    isExportingOrdersReport: false,
    isExportingDueReport: false,
    isExportingNcReport: false,
    isExportingDiscountReport: false,
    isExportingAdjustmentReport: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* Daily Sales Export */
      .addCase(exportDailySalesReport.pending, (state) => {
        state.isExportingDailySalesReport = true;
      })
      .addCase(exportDailySalesReport.fulfilled, (state) => {
        state.isExportingDailySalesReport = false;
        toast.success("Daily sales report exported successfully");
      })
      .addCase(exportDailySalesReport.rejected, (state, action) => {
        state.isExportingDailySalesReport = false;
        toast.error(action.error.message);
      })

      /* Daily Sales Detail Export */
      .addCase(exportDailySalesReportDetails.pending, (state) => {
        state.isExportingDailySalesReportDetails = true;
      })
      .addCase(exportDailySalesReportDetails.fulfilled, (state) => {
        state.isExportingDailySalesReportDetails = false;
        toast.success("Daily sales report details exported successfully");
      })
      .addCase(exportDailySalesReportDetails.rejected, (state, action) => {
        state.isExportingDailySalesReportDetails = false;
        toast.error(action.error.message);
      })

      /* Item Sales Export */
      .addCase(exportItemSalesReport.pending, (state) => {
        state.isExportingItemSalesReport = true;
      })
      .addCase(exportItemSalesReport.fulfilled, (state) => {
        state.isExportingItemSalesReport = false;
        toast.success("Item sales report exported successfully");
      })
      .addCase(exportItemSalesReport.rejected, (state, action) => {
        state.isExportingItemSalesReport = false;
        toast.error(action.error.message);
      })

      /* Category Sales Export */
      .addCase(exportCategorySalesReport.pending, (state) => {
        state.isExportingCategorySalesReport = true;
      })
      .addCase(exportCategorySalesReport.fulfilled, (state) => {
        state.isExportingCategorySalesReport = false;
        toast.success("Category sales report exported successfully");
      })
      .addCase(exportCategorySalesReport.rejected, (state, action) => {
        state.isExportingCategorySalesReport = false;
        toast.error(action.error.message);
      })

      /* Staff Sales Export */
      .addCase(exportStaffSalesReport.pending, (state) => {
        state.isExportingStaffSalesReport = true;
      })
      .addCase(exportStaffSalesReport.fulfilled, (state) => {
        state.isExportingStaffSalesReport = false;
        toast.success("Staff sales report exported successfully");
      })
      .addCase(exportStaffSalesReport.rejected, (state, action) => {
        state.isExportingStaffSalesReport = false;
        toast.error(action.error.message);
      })

      /* Payment Mode Export */
      .addCase(exportPaymentModeReport.pending, (state) => {
        state.isExportingPaymentModeReport = true;
      })
      .addCase(exportPaymentModeReport.fulfilled, (state) => {
        state.isExportingPaymentModeReport = false;
        toast.success("Payment mode report exported successfully");
      })
      .addCase(exportPaymentModeReport.rejected, (state, action) => {
        state.isExportingPaymentModeReport = false;
        toast.error(action.error.message);
      })

      /* Tax Export */
      .addCase(exportTaxReport.pending, (state) => {
        state.isExportingTaxReport = true;
      })
      .addCase(exportTaxReport.fulfilled, (state) => {
        state.isExportingTaxReport = false;
        toast.success("Tax report exported successfully");
      })
      .addCase(exportTaxReport.rejected, (state, action) => {
        state.isExportingTaxReport = false;
        toast.error(action.error.message);
      })

      /* Service Type Breakdown */
      .addCase(exportServiceTypeBreakdownReport.pending, (state) => {
        state.isExportingServiceTypeBreakdownReport = true;
      })
      .addCase(exportServiceTypeBreakdownReport.fulfilled, (state) => {
        state.isExportingServiceTypeBreakdownReport = false;
        toast.success("Service type breakdown report exported successfully");
      })
      .addCase(exportServiceTypeBreakdownReport.rejected, (state, action) => {
        state.isExportingServiceTypeBreakdownReport = false;
        toast.error(action.error.message);
      })

      /* Running Tables */
      .addCase(exportRunningTable.pending, (state) => {
        state.isExportingRunningTable = true;
      })
      .addCase(exportRunningTable.fulfilled, (state) => {
        state.isExportingRunningTable = false;
        toast.success("Running tables exported successfully");
      })
      .addCase(exportRunningTable.rejected, (state, action) => {
        state.isExportingRunningTable = false;
        toast.error(action.error.message);
      })

      /* Running Orders */
      .addCase(exportRunningOrder.pending, (state) => {
        state.isExportingRunningOrder = true;
      })
      .addCase(exportRunningOrder.fulfilled, (state) => {
        state.isExportingRunningOrder = false;
        toast.success("Running orders exported successfully");
      })
      .addCase(exportRunningOrder.rejected, (state, action) => {
        state.isExportingRunningOrder = false;
        toast.error(action.error.message);
      })

      /* Section Sales */
      .addCase(exportSectionSalesReport.pending, (state) => {
        state.isExportingSectionSalesReport = true;
      })
      .addCase(exportSectionSalesReport.fulfilled, (state) => {
        state.isExportingSectionSalesReport = false;
        toast.success("Section sales report exported successfully");
      })
      .addCase(exportSectionSalesReport.rejected, (state, action) => {
        state.isExportingSectionSalesReport = false;
        toast.error(action.error.message);
      })

      /* Station Sales */
      .addCase(exportStationSalesReport.pending, (state) => {
        state.isExportingStationSalesReport = true;
      })
      .addCase(exportStationSalesReport.fulfilled, (state) => {
        state.isExportingStationSalesReport = false;
        toast.success("Station sales report exported successfully");
      })
      .addCase(exportStationSalesReport.rejected, (state, action) => {
        state.isExportingStationSalesReport = false;
        toast.error(action.error.message);
      })

      /* Cancellation */
      .addCase(exportCancellationReport.pending, (state) => {
        state.isExportingCancellationReport = true;
      })
      .addCase(exportCancellationReport.fulfilled, (state) => {
        state.isExportingCancellationReport = false;
        toast.success("Cancellation report exported successfully");
      })
      .addCase(exportCancellationReport.rejected, (state, action) => {
        state.isExportingCancellationReport = false;
        toast.error(action.error.message);
      })

      /* Shift History */
      .addCase(exportShiftHistory.pending, (state) => {
        state.isExportingShiftHistory = true;
      })
      .addCase(exportShiftHistory.fulfilled, (state) => {
        state.isExportingShiftHistory = false;
        toast.success("Shift history exported successfully");
      })
      .addCase(exportShiftHistory.rejected, (state, action) => {
        state.isExportingShiftHistory = false;
        toast.error(action.error.message);
      })

      /* Shift History Details */
      .addCase(exportShiftHistoryDetails.pending, (state) => {
        state.isExportingShiftHistoryDetails = true;
      })
      .addCase(exportShiftHistoryDetails.fulfilled, (state) => {
        state.isExportingShiftHistoryDetails = false;
        toast.success("Shift history details exported successfully");
      })
      .addCase(exportShiftHistoryDetails.rejected, (state, action) => {
        state.isExportingShiftHistoryDetails = false;
        toast.error(action.error.message);
      })

      /* Day End Summary */
      .addCase(exportDayEndSummary.pending, (state) => {
        state.isExportingDayEndSummary = true;
      })
      .addCase(exportDayEndSummary.fulfilled, (state) => {
        state.isExportingDayEndSummary = false;
        toast.success("Day end summary exported successfully");
      })
      .addCase(exportDayEndSummary.rejected, (state, action) => {
        state.isExportingDayEndSummary = false;
        toast.error(action.error.message);
      })

      /* Day End Summary Details */
      .addCase(exportDayEndSummaryDetails.pending, (state) => {
        state.isExportingDayEndSummaryDetails = true;
      })
      .addCase(exportDayEndSummaryDetails.fulfilled, (state) => {
        state.isExportingDayEndSummaryDetails = false;
        toast.success("Day end summary details exported successfully");
      })
      .addCase(exportDayEndSummaryDetails.rejected, (state, action) => {
        state.isExportingDayEndSummaryDetails = false;
        toast.error(action.error.message);
      })

      .addCase(exportOrdersReport.pending, (state) => {
        state.isExportingOrdersReport = true;
      })
      .addCase(exportOrdersReport.fulfilled, (state) => {
        state.isExportingOrdersReport = false;
        toast.success("Orders report exported successfully");
      })
      .addCase(exportOrdersReport.rejected, (state, action) => {
        state.isExportingOrdersReport = false;
        toast.error(action.error.message);
      })

      .addCase(exportDueReport.pending, (state) => {
        state.isExportingDueReport = true;
      })
      .addCase(exportDueReport.fulfilled, (state) => {
        state.isExportingDueReport = false;
        toast.success("Due report exported successfully");
      })
      .addCase(exportDueReport.rejected, (state, action) => {
        state.isExportingDueReport = false;
        toast.error(action.error.message);
      })

      .addCase(exportNcReport.pending, (state) => {
        state.isExportingNcReport = true;
      })
      .addCase(exportNcReport.fulfilled, (state) => {
        state.isExportingNcReport = false;
        toast.success("NC report exported successfully");
      })
      .addCase(exportNcReport.rejected, (state, action) => {
        state.isExportingNcReport = false;
        toast.error(action.error.message);
      })

      .addCase(exportDiscountReport.pending, (state) => {
        state.isExportingDiscountReport = true;
      })
      .addCase(exportDiscountReport.fulfilled, (state) => {
        state.isExportingDiscountReport = false;
        toast.success("Discount report exported successfully");
      })
      .addCase(exportDiscountReport.rejected, (state, action) => {
        state.isExportingDiscountReport = false;
        toast.error(action.error.message);
      })
      .addCase(exportAdjustmentReport.pending, (state) => {
        state.isExportingAdjustmentReport = true;
      })
      .addCase(exportAdjustmentReport.fulfilled, (state) => {
        state.isExportingAdjustmentReport = false;
        toast.success("Adjustment report exported successfully");
      })
      .addCase(exportAdjustmentReport.rejected, (state, action) => {
        state.isExportingAdjustmentReport = false;
        toast.error(action.error.message);
      })
  },
});

const { reducer } = exportReportSlice;
export default reducer;
