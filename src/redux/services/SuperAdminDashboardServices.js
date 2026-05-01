import Api from "../api.js";
import { cleanParams } from "../../utils/cleanParams.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getSuperAdminDashbordApi: ({ sortBy }) => {
        const params = cleanParams({
          sort: sortBy,
        });

        return Api.get(`/dashboard/super-admin`, { params });
      },
    };
