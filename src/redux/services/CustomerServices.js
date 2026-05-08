import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllCustomersApi: ({ outletId, search }) => {
        const params = cleanParams({
          search,
        });
        return Api.get(`/customers/${outletId}/list`, { params });
      },
      getCustomerByIdApi: (outletId, customerId) => {
        return Api.get(`/customers/${outletId}/details/${customerId}`);
      },
    };
