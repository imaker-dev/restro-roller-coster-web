import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllKitchenStationsAPi: (outletId) => {
            return Api.get(`/tax/kitchen-stations/${outletId}`);
        },
    };
