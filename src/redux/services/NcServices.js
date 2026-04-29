import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getNcReasonsApi: (outletId) => {
        return Api.get(`/orders/${outletId}/nc/reasons`);
      },
      createNcReasonsApi:(outletId,values) => {
        return Api.post(`/orders/${outletId}/nc/reasons`,values)
      },
      updateNcReasonsApi:(outletId,id,values) => {
        return Api.put(`/orders/${outletId}/nc/reasons/${id}`,values)
      }
    };
