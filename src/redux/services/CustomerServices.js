import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllCustomersApi: (outletId) => {
            return Api.get(`/customers/${outletId}/list`);
        },
        getCustomerByIdApi:(outletId,customerId) => {
            return Api.get(`/customers/${outletId}/details/${customerId}`)
        }
    };
