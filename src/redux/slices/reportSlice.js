import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import ReportServices from "../services/ReportServices";

export const fetchDailySalesReport = createAsyncThunk(
  "/fetch/daily/sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getDailySalesReportApi({
      outletId,
      dateRange,
    });
    return res.data;
  },
);
export const fetchDailySalesReportByDate = createAsyncThunk(
  "/fetch/daily/sales/report/date",
  async ({ outletId, date, page, limit }) => {
    const res = await ReportServices.getDailyReportDetailsApi(
      outletId,
      date,
      page,
      limit,
    );
    return res.data;
  },
);
export const fetchItemSalesReport = createAsyncThunk(
  "/fetch/item/sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getItemSalesReportApi({outletId, dateRange});
    return res.data;
  },
);
export const fetchCategorySalesReport = createAsyncThunk(
  "/fetch/category/sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getCategorySalesReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);
export const fetchStaffSalesReport = createAsyncThunk(
  "/fetch/staff/sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getStaffSalesReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);
export const fetchPaymentModeReport = createAsyncThunk(
  "/fetch/payment/mode/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getPaymentModeReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);
export const fetchTaxReport = createAsyncThunk(
  "/fetch/tax/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getTaxReportApi(outletId, dateRange);
    return res.data;
  },
);
export const fetchTaxReportDetails = createAsyncThunk(
  "/fetch/tax/report/details",
  async ({ outletId, date }) => {
    const res = await ReportServices.getTaxReportDetailsApi(outletId, date);
    return res.data;
  },
);
export const fetchServiceTypeBreakdownReport = createAsyncThunk(
  "/fetch/service-type/breakdown/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getServiceTypeBreakdownReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);
export const fetchRunningTable = createAsyncThunk(
  "/fetch/running/table",
  async (outletId) => {
    const res = await ReportServices.getRunningTableApi(outletId);
    return res.data;
  },
);
export const fetchRunningOrder = createAsyncThunk(
  "/fetch/running/order",
  async ({outletId}) => {
    const res = await ReportServices.getRunningOrderApi({outletId});
    return res.data;
  },
);
export const fetchSectionSalesReport = createAsyncThunk(
  "/fetch/section-sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getSectionSalesReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);
export const fetchStationSalesReport = createAsyncThunk(
  "/fetch/station-sales/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getStationSalesReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);
export const fetchCancellationReport = createAsyncThunk(
  "/fetch/canellation/report",
  async ({ outletId, dateRange }) => {
    const res = await ReportServices.getCancellationReportApi(
      outletId,
      dateRange,
    );
    return res.data;
  },
);
export const fetchDueReport = createAsyncThunk(
  "/fetch/due/report",
  async ({ outletId, dateRange, page, limit, search }) => {
    const res = await ReportServices.getDueReportApi(
      outletId,
      dateRange,
      page,
      limit,
      search,
    );
    return res.data;
  },
);
export const fetchNcReport = createAsyncThunk(
  "/fetch/nc/report",
  async ({ outletId, dateRange, page, limit, search }) => {
    const res = await ReportServices.getNcReportApi(
      outletId,
      dateRange,
      page,
      limit,
      search,
    );
    return res.data;
  },
);

export const fetchDiscountReport = createAsyncThunk(
  "/fetch/discount/report",
  async ({ outletId, dateRange, page, limit, search, sortBy, sortOrder,discountType }) => {
    const res = await ReportServices.getDiscountReportApi({
      outletId,
      dateRange,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      discountType
    });
    return res.data;
  },
);
export const fetchAdjustmentReport = createAsyncThunk(
  "/fetch/adjustment/report",
  async ({ outletId, dateRange, page, limit, search }) => {
    const res = await ReportServices.getAdjustmentReportApi({
      outletId,
      dateRange,
      page,
      limit,
      search,
    });
    return res.data;
  },
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    loading: false,
    isFetchingDailyReports: false,
    dailySalesReport: null,
    isFetchingDailyReportDetails: false,
    dailySalesReportDetails: null,
    itemSalesReport: null,
    isFetchingItemSalesReport: false,

    categorySalesReport: null,
    isFetchingCategorySalesReport: false,

    staffSalesReport: null,
    isFetchingStaffSalesReport: false,

    paymentModeReport: null,
    isFetchingPaymentModeReport: false,

    taxReport: null,
    isFetchingTaxReport: false,

    isFetchingTaxReportDetails: false,
    taxReportDetails: null,

    isFetchingRunningTable: false,
    runningTables: null,

    isFetchingRunningOrder: false,
    runningOrders: null,

    isFetchingSectionSalesReport: false,
    sectionSalesReport: null,

    isFetchingStationSalesReport: false,
    stationSalesReport: null,

    isFetchingCancellationReport: false,
    cancellationReport: null,

    isFetchingDueReport: false,
    dueReport: null,

    isFetchingNcReport: false,
    ncReport: null,

    isFetchingDiscountReport: false,
    discountReport: null,

    isFetchingAdjustmentReport:false,
    adjustmentReport:null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailySalesReport.pending, (state) => {
        state.isFetchingDailyReports = true;
      })
      .addCase(fetchDailySalesReport.fulfilled, (state, action) => {
        state.isFetchingDailyReports = false;
        state.dailySalesReport = action.payload.data;
      })
      .addCase(fetchDailySalesReport.rejected, (state, action) => {
        state.isFetchingDailyReports = false;
        toast.error(action.error.message);
      })
      .addCase(fetchDailySalesReportByDate.pending, (state) => {
        state.isFetchingDailyReportDetails = true;
      })
      .addCase(fetchDailySalesReportByDate.fulfilled, (state, action) => {
        state.isFetchingDailyReportDetails = false;
        state.dailySalesReportDetails = action.payload.data;
      })
      .addCase(fetchDailySalesReportByDate.rejected, (state, action) => {
        state.isFetchingDailyReportDetails = false;
        toast.error(action.error.message);
      })
      .addCase(fetchItemSalesReport.pending, (state) => {
        state.isFetchingItemSalesReport = true;
      })
      .addCase(fetchItemSalesReport.fulfilled, (state, action) => {
        state.isFetchingItemSalesReport = false;
        state.itemSalesReport = action.payload.data;
      })
      .addCase(fetchItemSalesReport.rejected, (state, action) => {
        state.isFetchingItemSalesReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchCategorySalesReport.pending, (state) => {
        state.isFetchingCategorySalesReport = true;
      })
      .addCase(fetchCategorySalesReport.fulfilled, (state, action) => {
        state.isFetchingCategorySalesReport = false;
        state.categorySalesReport = action.payload.data;
      })
      .addCase(fetchCategorySalesReport.rejected, (state, action) => {
        state.isFetchingCategorySalesReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchStaffSalesReport.pending, (state) => {
        state.isFetchingStaffSalesReport = true;
      })
      .addCase(fetchStaffSalesReport.fulfilled, (state, action) => {
        state.isFetchingStaffSalesReport = false;
        state.staffSalesReport = action.payload.data;
      })
      .addCase(fetchStaffSalesReport.rejected, (state, action) => {
        state.isFetchingStaffSalesReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchPaymentModeReport.pending, (state) => {
        state.isFetchingPaymentModeReport = true;
      })
      .addCase(fetchPaymentModeReport.fulfilled, (state, action) => {
        state.isFetchingPaymentModeReport = false;
        state.paymentModeReport = action.payload.data;
      })
      .addCase(fetchPaymentModeReport.rejected, (state, action) => {
        state.isFetchingPaymentModeReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchTaxReport.pending, (state) => {
        state.isFetchingTaxReport = true;
      })
      .addCase(fetchTaxReport.fulfilled, (state, action) => {
        state.isFetchingTaxReport = false;
        state.taxReport = action.payload.data;
      })
      .addCase(fetchTaxReport.rejected, (state, action) => {
        state.isFetchingTaxReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchTaxReportDetails.pending, (state) => {
        state.isFetchingTaxReportDetails = true;
      })
      .addCase(fetchTaxReportDetails.fulfilled, (state, action) => {
        state.isFetchingTaxReportDetails = false;
        state.taxReportDetails = action.payload.data;
      })
      .addCase(fetchTaxReportDetails.rejected, (state, action) => {
        state.isFetchingTaxReportDetails = false;
        toast.error(action.error.message);
      })
      .addCase(fetchServiceTypeBreakdownReport.pending, (state) => {
        state.isFetchingServiceTypeBreakdownReport = true;
      })
      .addCase(fetchServiceTypeBreakdownReport.fulfilled, (state, action) => {
        state.isFetchingServiceTypeBreakdownReport = false;
        state.serviceTypeBreakdownReport = action.payload.data;
      })
      .addCase(fetchServiceTypeBreakdownReport.rejected, (state, action) => {
        state.isFetchingServiceTypeBreakdownReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchRunningTable.pending, (state) => {
        state.isFetchingRunningTable = true;
      })
      .addCase(fetchRunningTable.fulfilled, (state, action) => {
        state.isFetchingRunningTable = false;
        state.runningTables = action.payload.data;
      })
      .addCase(fetchRunningTable.rejected, (state, action) => {
        state.isFetchingRunningTable = false;
        toast.error(action.error.message);
      })
      .addCase(fetchRunningOrder.pending, (state) => {
        state.isFetchingRunningOrder = true;
      })
      .addCase(fetchRunningOrder.fulfilled, (state, action) => {
        state.isFetchingRunningOrder = false;
        state.runningOrders = action.payload.data;
      })
      .addCase(fetchRunningOrder.rejected, (state, action) => {
        state.isFetchingRunningOrder = false;
        toast.error(action.error.message);
      })
      .addCase(fetchSectionSalesReport.pending, (state) => {
        state.isFetchingSectionSalesReport = true;
      })
      .addCase(fetchSectionSalesReport.fulfilled, (state, action) => {
        state.isFetchingSectionSalesReport = false;
        state.sectionSalesReport = action.payload.data;
      })
      .addCase(fetchSectionSalesReport.rejected, (state, action) => {
        state.isFetchingSectionSalesReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchStationSalesReport.pending, (state) => {
        state.isFetchingStationSalesReport = true;
      })
      .addCase(fetchStationSalesReport.fulfilled, (state, action) => {
        state.isFetchingStationSalesReport = false;
        state.stationSalesReport = action.payload.data;
      })
      .addCase(fetchStationSalesReport.rejected, (state, action) => {
        state.isFetchingStationSalesReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchCancellationReport.pending, (state) => {
        state.isFetchingCancellationReport = true;
      })
      .addCase(fetchCancellationReport.fulfilled, (state, action) => {
        state.isFetchingCancellationReport = false;
        state.cancellationReport = action.payload.data;
      })
      .addCase(fetchCancellationReport.rejected, (state, action) => {
        state.isFetchingCancellationReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchDueReport.pending, (state) => {
        state.isFetchingDueReport = true;
      })
      .addCase(fetchDueReport.fulfilled, (state, action) => {
        state.isFetchingDueReport = false;
        state.dueReport = action.payload;
      })
      .addCase(fetchDueReport.rejected, (state, action) => {
        state.isFetchingDueReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchNcReport.pending, (state) => {
        state.isFetchingNcReport = true;
      })
      .addCase(fetchNcReport.fulfilled, (state, action) => {
        state.isFetchingNcReport = false;
        state.ncReport = action.payload.data;
      })
      .addCase(fetchNcReport.rejected, (state, action) => {
        state.isFetchingNcReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchDiscountReport.pending, (state) => {
        state.isFetchingDiscountReport = true;
      })
      .addCase(fetchDiscountReport.fulfilled, (state, action) => {
        state.isFetchingDiscountReport = false;
        state.discountReport = action.payload.data;
      })
      .addCase(fetchDiscountReport.rejected, (state, action) => {
        state.isFetchingDiscountReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchAdjustmentReport.pending, (state) => {
        state.isFetchingAdjustmentReport = true;
      })
      .addCase(fetchAdjustmentReport.fulfilled, (state, action) => {
        state.isFetchingAdjustmentReport = false;
        state.adjustmentReport = action.payload.data;
      })
      .addCase(fetchAdjustmentReport.rejected, (state, action) => {
        state.isFetchingAdjustmentReport = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = reportSlice;
export default reducer;
