import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      // getDailySalesReportApi: ({ outletId, dateRange }) => {
      //   const params = cleanParams({
      //     startDate: dateRange?.startDate,
      //     endDate: dateRange?.endDate,
      //   });

      //   return Api.get(`/orders/reports/${outletId}/daily-sales`, { params });
      // },
      getDailySalesReportApi: ({ outletId, dateRange }) => {
        const params = cleanParams({
          outletId,
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/reports/accurate-dsr`, { params });
      },

      getDailyReportDetailsApi: (outletId, date, page, limit) => {
        const params = cleanParams({
          startDate: date,
          endDate: date,
          page,
          limit,
        });

        return Api.get(`/orders/reports/${outletId}/daily-sales/detail`, {
          params,
        });
      },

      getItemSalesReportApi: ({ outletId, dateRange }) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/item-sales`, { params });
      },

      getCategorySalesReportApi: (outletId, dateRange) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/category-sales`, {
          params,
        });
      },

      getStaffSalesReportApi: (outletId, dateRange) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/staff`, { params });
      },

      getPaymentModeReportApi: (outletId, dateRange) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/payment-modes`, { params });
      },

      getTaxReportApi: (outletId, dateRange) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/tax`, { params });
      },

      getTaxReportDetailsApi: (outletId, date) => {
        const params = cleanParams({
          startDate: date,
          endDate: date,
        });

        return Api.get(`/orders/reports/${outletId}/tax`, { params });
      },

      getServiceTypeBreakdownReportApi: (outletId, dateRange) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/service-type-breakdown`, {
          params,
        });
      },

      getRunningTableApi: (outletId) => {
        const params = cleanParams({ outletId });

        return Api.get(`/reports/running-tables`, { params });
      },

      getRunningOrderApi: ({ outletId }) => {
        const params = cleanParams({ outletId });

        return Api.get(`/reports/running-orders`, { params });
      },

      getSectionSalesReportApi: (outletId, dateRange = {}) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/floor-section`, { params });
      },

      getStationSalesReportApi: (outletId, dateRange = {}) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/counter`, { params });
      },

      getCancellationReportApi: (outletId, dateRange = {}) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/cancellations`, { params });
      },

      getDueReportApi: (outletId, dateRange = {}, page, limit, search) => {
        const params = cleanParams({
          page,
          limit,
          search,
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/due`, { params });
      },

      getNcReportApi: (outletId, dateRange = {}, page, limit, search) => {
        const params = cleanParams({
          page,
          limit,
          search,
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/reports/${outletId}/nc`, { params });
      },

      getDiscountReportApi: ({
        outletId,
        dateRange,
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        discountType,
      }) => {
        const params = cleanParams({
          page,
          limit,
          search,
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
          sortBy,
          sortOrder,
          discountType,
        });

        return Api.get(`/reports/discounts/${outletId}/details`, { params });
      },

      getAdjustmentReportApi: ({
        outletId,
        dateRange = {},
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        discountType,
      }) => {
        const params = cleanParams({
          page,
          limit,
          search,
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
          sortBy,
          sortOrder,
          discountType,
        });

        return Api.get(`/reports/adjustments/${outletId}`, { params });
      },
    };
