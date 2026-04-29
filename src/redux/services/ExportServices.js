import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      exportDailySalesReportApi: (outletId, dateRange) => {
        const params = cleanParams({
          outletId,
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        // return Api.get(`/orders/reports/${outletId}/daily-sales/export`, {
        //   params,
        //   responseType: "blob",
        // });
        return Api.get(`/reports/accurate-dsr/export`, {
          params,
          responseType: "blob",
        });
      },

      exportDailyReportDetailsApi: (outletId, date) => {
        const params = cleanParams({
          startDate: date,
          endDate: date,
        });

        return Api.get(
          `/orders/reports/${outletId}/daily-sales/detail/export`,
          {
            params,
            responseType: "blob",
          },
        );
      },

      exportItemSalesReportApi: (outletId, dateRange) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/item-sales/export`, {
          params,
          responseType: "blob",
        });
      },

      exportCategorySalesReportApi: (outletId, dateRange) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/category-sales/export`, {
          params,
          responseType: "blob",
        });
      },

      exportStaffSalesReportApi: (outletId, dateRange) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/staff/export`, {
          params,
          responseType: "blob",
        });
      },

      exportPaymentModeReportApi: (outletId, dateRange) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/payment-modes/export`, {
          params,
          responseType: "blob",
        });
      },

      exportTaxReportApi: (outletId, dateRange) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/tax/export`, {
          params,
          responseType: "blob",
        });
      },

      exportServiceTypeBreakdownReportApi: (outletId, dateRange) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(
          `/orders/reports/${outletId}/service-type-breakdown/export`,
          {
            params,
            responseType: "blob",
          },
        );
      },

      exportRunningTableApi: (outletId) => {
        return Api.get(`/reports/running-tables/export?outletId=${outletId}`, {
          responseType: "blob",
        });
      },

      exportRunnigOrderApi: (outletId) => {
        return Api.get(`/reports/running-orders/export?outletId=${outletId}`, {
          responseType: "blob",
        });
      },

      exportSectionSalesReportApi: (outletId, dateRange = {}) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/floor-section/export`, {
          params,
          responseType: "blob",
        });
      },

      exportStationSalesReportApi: (outletId, dateRange = {}) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/counter/export`, {
          params,
          responseType: "blob",
        });
      },

      exportCancellationReportApi: (outletId, dateRange = {}) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/cancellations/export`, {
          params,
          responseType: "blob",
        });
      },

      /* ───────── SHIFT HISTORY EXPORT ───────── */

      exportShiftHistoryApi: (outletId, dateRange = {}) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/shifts/${outletId}/history/export`, {
          params,
          responseType: "blob",
        });
      },

      exportShiftHistoryDetailsApi: (shiftId) => {
        return Api.get(`/orders/shifts/${shiftId}/detail/export`, {
          responseType: "blob",
        });
      },

      /* ───────── DAY END SUMMARY EXPORT ───────── */

      exportDayEndSummaryApi: (outletId, dateRange = {}) => {
        const params = cleanParams({
          outletId,
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        // return Api.get(`/reports/day-end-summary/export`, {
        //   params,
        //   responseType: "blob",
        // });
        return Api.get(`/reports/accurate-day-end-summary/export`, {
          params,
          responseType: "blob",
        });
      },

      exportDayEndSummaryDetailsApi: (outletId, date) => {
        const params = cleanParams({
          outletId,
          startDate: date,
          endDate: date,
        });

        return Api.get(`/reports/day-end-summary/detail/export`, {
          params,
          responseType: "blob",
        });
      },

      exportOrdersReportApi: ({
        outletId,
        search,
        dateRange,
        orderStatus,
        orderType,
        paymentStatus,
        sortBy,
        sortOrder,
      }) => {
        const params = cleanParams({
          outletId,
          search,
          status: orderStatus,
          orderType,
          paymentStatus,
          sortBy,
          sortOrder,
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/admin/list/export`, {
          params,
          responseType: "blob",
        });
      },

      exportDueReportApi: (outletId, dateRange, searchTerm) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
          search: searchTerm, // mapping handled here ✅
        });

        return Api.get(`/orders/reports/${outletId}/due/export`, {
          params,
          responseType: "blob",
        });
      },

      exportNcReportApi: (outletId, dateRange) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/nc/export`, {
          params,
          responseType: "blob",
        });
      },

      exportDiscountReportApi: ({
        outletId,
        dateRange,
        search,
        sortBy,
        sortOrder,
        discountType,
      }) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
          search,
          sortBy,
          sortOrder,
          discountType,
        });

        return Api.get(`/reports/discounts/${outletId}/export`, {
          params,
          responseType: "blob",
        });
      },

      exportAdjustmentReportApi: ({
        outletId,
        dateRange,
      }) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/reports/adjustments/${outletId}/export`, {
          params,
          responseType: "blob",
        });
      },
    };
