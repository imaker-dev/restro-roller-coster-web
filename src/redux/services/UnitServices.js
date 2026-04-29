import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllUnitsApi: (outletId) => {
        return Api.get(`/inventory/${outletId}/units`);
      },

      createUnitApi: (outletId, values) => {
        return Api.post(`/inventory/${outletId}/units`, values);
      },
      updateUnitApi: (id, values) => {
        return Api.put(`/inventory/units/${id}`, values);
      },
    };
