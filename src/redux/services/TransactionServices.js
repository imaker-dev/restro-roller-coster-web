import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllTransactionsApi: ({ page, limit, search, dateRange }) => {
        const params = cleanParams({
          page,
          limit,
          search,
          dateFrom: dateRange?.startDate,
          dateTo: dateRange?.endDate,
        });

        return Api.get(`/subscriptions/transactions`, { params });
      },

      getTransactionByIdApi: ({ transactionId }) => {
        return Api.get(`/subscriptions/transactions/${transactionId}/invoice`);
      },

      downloadTransactionInvoiceApi: ({ transactionId }) => {
        return Api.get(`/subscriptions/transactions/${transactionId}/invoice/pdf`,{responseType:"blob"});
      },
    };
