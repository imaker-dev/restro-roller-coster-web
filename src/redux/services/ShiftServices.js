import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllShiftHistoryApi: (outletId, dateRange = {}) => {
        const params = cleanParams({
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return Api.get(`/orders/shifts/${outletId}/history`, { params });
      },
      getShiftSummaryApi: (outletId) => {
        return Api.get(`/orders/shifts/${outletId}/summary`);
      },
      getShiftHistoryByIdApi: (shiftId) => {
        return Api.get(`/orders/shifts/${shiftId}/detail`);
      },
    };
