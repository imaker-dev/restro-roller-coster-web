import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllStationsApi: (outletId) => {
        return Api.get(`/tax/kitchen-stations/${outletId}`);
      },
      createStationApi: (values) => {
        return Api.post(`/tax/kitchen-stations`, values);
      },
      updateStationApi: (kitchenStationId, values) => {
        return Api.put(`/tax/kitchen-stations/${kitchenStationId}`, values);
      },
      assignStationToUserApi:(userId,values) => {
        return Api.post(`/users/${userId}/stations`,values)
      },
      removeStationFromUserApi:(userId,stationId) => {
        return Api.delete(`/users/${userId}/stations/${stationId}`)
      }
    };
