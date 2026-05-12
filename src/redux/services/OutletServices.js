import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllOutletsApi: ({ search }) => {
        const params = cleanParams({
          search,
        });

        return Api.get("/outlets", { params });
      },
      getOutletById: (id) => {
        return Api.get(`/outlets/${id}`);
      },
      createOutletApi: (values) => {
        return Api.post(`/outlets`, values);
      },
      updateOutletApi: (id, values) => {
        return Api.put(`/outlets/${id}`, values);
      },
      outletDeletePreviewApi: (outletId) => {
        return Api.get(`/outlets/${outletId}/delete-preview`);
      },
      hardDeleteOutletApi: (outletId, confirmationCode) => {
        return Api.delete(`/outlets/${outletId}/hard-delete`, {
          data: { confirmationCode },
        });
      },
      getOutletPrintLogoApi: (id) => {
        return Api.get(`/outlets/${id}/print-logo`);
      },
      updateOutletPrintLogoApi: (id, values) => {
        return Api.put(`/outlets/${id}/print-logo`, values);
      },
      assignOutletToSuperAdminApi:({outletId,superAdminId}) => {
        return Api.post(`/outlets/${outletId}/assign-super-admin`,{superAdminId})
      }
    };
