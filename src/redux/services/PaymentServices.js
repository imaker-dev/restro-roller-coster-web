import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        createRazorPayOrderApi: ({values}) => {
            return Api.post(`/subscriptions/create-order`,values);
        },
        verifyPaymentApi:({values}) => {
            return Api.post(`/subscriptions/verify-payment`,values)
        },
    };
