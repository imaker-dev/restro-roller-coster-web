import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllOutsideCollectionsApi: ({ outletId, dateRange }) => {
        const params = cleanParams({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });
        console.log(params);
        return Api.get(`/orders/outside-collections/${outletId}`, {params});
      },
    };
