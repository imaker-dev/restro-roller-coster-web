import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllOrdersApi: (
        outletId,
        page,
        limit,
        search,
        dateRange,
        orderStatus,
        orderType,
        paymentStatus,
        sortBy,
        sortOrder,
        hasOpenItems,
        hasNcItems,
      ) => {
        const params = cleanParams({
          page,
          limit,
          outletId,
          search,
          status: orderStatus,
          orderType,
          paymentStatus,
          sortBy,
          sortOrder,
          hasOpenItems,
          hasNcItems,
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });
        return Api.get("/orders/admin/list", { params });
      },
      getOrdersByIdApi: (orderId) => {
        return Api.get(`/orders/${orderId}`);
        // return Api.get(`/orders/admin/detail/${orderId}`);
      },
      downloadOrderInvoiceApi: (invoiceId) => {
        return Api.get(`/orders/invoice/${invoiceId}/download`, {
          responseType: "blob",
        });
      },
    };
