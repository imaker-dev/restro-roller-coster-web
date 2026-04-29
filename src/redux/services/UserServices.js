import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllUsersApi: (page = 1, limit = 10, search, outletId) => {
        const params = cleanParams({
          page,
          limit,
          outletId,
          search: search?.trim(),
        });

        return Api.get(`/users`, { params });
      },
      getUserByIdApi: (userId) => {
        return Api.get(`/users/${userId}`);
      },
      addUserApi: (values) => {
        return Api.post(`/users`, values);
      },
      updateUserApi: (id, values) => {
        return Api.put(`/users/${id}`, values);
      },
    };
