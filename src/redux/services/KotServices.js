import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllOrdersKotApi: (status, station) => {
        return Api.get(
          status
            ? `/orders/kot/active?station=${station}&status=${status}`
            : `/orders/kot/active?station=${station}`,
        );
      },
      acceptOrderKotApi: (id) => {
        return Api.post(`/orders/kot/${id}/accept`);
      },
      prepareOrderKotApi: (id) => {
        return Api.post(`/orders/kot/${id}/preparing`);
      },
      readyOrderKotApi: (id) => {
        return Api.post(`/orders/kot/${id}/ready `);
      },
      serveOrderKotApi: (id) => {
        return Api.post(`/orders/kot/${id}/served`);
      },
      markKOtItemReadyApi: (itemId) => {
        return Api.post(`/orders/kot/items/${itemId}/ready`);
      },
    };
