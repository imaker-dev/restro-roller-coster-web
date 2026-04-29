import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllTableQrApi: (outletId) => {
            return Api.get(`/self-order/staff/qr/tables/${outletId}`);
        },
        generateSingleTableQrApi:({values}) => {
            return Api.post(`/self-order/staff/qr/generate`,values)
        },
        generateAllTableQrApi:({values}) => {
            return Api.post(`/self-order/staff/qr/generate-all`,values)
        },
    };
