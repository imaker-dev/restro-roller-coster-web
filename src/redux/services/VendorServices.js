import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllVendorsApi: (outletId) => {
        return Api.get(`/inventory/${outletId}/vendors`);
      },
      getVendorByIdApi: (id) => {
        return Api.get(`/inventory/vendors/${id}`);
      },
      createVendorApi: (outletId, values) => {
        return Api.post(`/inventory/${outletId}/vendors`, values);
      },
      updateVendorApi: (id, values) => {
        return Api.put(`/inventory/vendors/${id}`, values);
      },
    };
