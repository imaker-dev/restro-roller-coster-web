import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getItemBatchApi: (itemId, page = 1, limit = 10) => {
        const params = cleanParams({
          page,
          limit,
        });

        return Api.get(`/inventory/items/${itemId}/batches`, { params });
      },
    };
