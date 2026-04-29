import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllPrintersApi: (outletId) => {
            return Api.get(`/printers/status/${outletId}`);
        },
        createPrinterApi:(values) => {
            return Api.post(`/printers`,values)
        },
        updatePrinterApi:(id,values) => {
            return Api.put(`/printers/${id}`,values)
        },
        testPrinterApi:(outletId,station,printerId) => {
            return Api.get(`/printers/${printerId}/ping`)
        }
    };
