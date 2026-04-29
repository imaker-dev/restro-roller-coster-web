import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getStockSummaryApi: (outletId) => {
        return Api.get(`/inventory/${outletId}/stock-summary`);
      },
      getAllInventoryCategoryApi: (outletId) => {
        return Api.get(`/inventory/${outletId}/categories`);
      },
      createInventoryCategoryApi: (outletId, values) => {
        return Api.post(`/inventory/${outletId}/categories`, values);
      },
      updateInventoryCategoryApi: (id, values) => {
        return Api.put(`/inventory/categories/${id}`, values);
      },
      getAllInventoryItemApi: (outletId, page = 1, limit = 20, search) => {
        const params = cleanParams({
          page,
          limit,
          search,
        });

        return Api.get(`/inventory/${outletId}/items`, { params });
      },
      getInventoryItemByIdApi: (id) => {
        return Api.get(`/inventory/items/${id}`);
      },
      createInventoryItemApi: (outletId, values) => {
        return Api.post(`/inventory/${outletId}/items`, values);
      },
      updateInventoryItemApi: (id, values) => {
        return Api.put(`/inventory/items/${id}`, values);
      },
      createPurchaseApi: (outletId, values) => {
        return Api.post(`/inventory/${outletId}/purchases`, values);
      },
      getAllPurchaseApi: (
        outletId,
        page = 1,
        limit = 10,
        search,
        dateRange,
      ) => {
        const params = cleanParams({
          page,
          limit,
          search,
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/inventory/${outletId}/purchases`, { params });
      },
      getPurchaseByIdApi: (id) => {
        return Api.get(`/inventory/purchases/${id}`);
      },
      updatePurchasePaymentApi: (id, values) => {
        return Api.put(`/inventory/purchases/${id}/payment`, values);
      },
      cancelPurchaseApi: (id, reason) => {
        return Api.post(`/inventory/purchases/${id}/cancel`, { reason });
      },
      getAllMovementsApi: (outletId, page, limit, dateRange, search, type) => {
        const params = cleanParams({
          page,
          limit,
          search,
          movementType: type,
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/inventory/${outletId}/movements`, { params });
      },
      createAdjustmentApi: (outletId, values) => {
        return Api.post(`/inventory/${outletId}/adjustments`, values);
      },
      createWastageApi: (outletId, values) => {
        return Api.post(`/inventory/${outletId}/wastage`, values);
      },
      getAllWastageLogsApi: ({ outletId, page, limit, search, dateRange }) => {
        const params = cleanParams({
          page,
          limit,
          search: search?.trim(),
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/wastage/${outletId}`, { params });
      },
    };
