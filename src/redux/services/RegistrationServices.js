import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllRegistrationRequestsApi: ({ page, limit }) => {
        const params = cleanParams({
          page,
          limit,
        });
        return Api.get("/registration/requests", { params });
      },
      updateRegistrationRequestApi: ({ id, values }) => {
        return Api.patch(`/registration/${id}/status`, values);
      },
      generateActivationTokenApi: (values) => {
        return Api.post(`/token-generation/activation`, values);
      },
      getTokenActivationLogsApi: ({ page, limit }) => {
        const params = cleanParams({
          page,
          limit,
        });
        return Api.get(`/token-generation/log`, { params });
      },
      generateUpgradeTokenApi: (values) => {
        return Api.post(`/token-generation/upgrade`, values);
      },
    };
