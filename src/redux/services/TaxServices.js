import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllTaxGroupsApi: (outletId) => {
            return Api.get(`/tax/groups?outletId=${outletId}`);
        },
        getTaxGroupByIdApi:(id) => {
            return Api.get(`/tax/groups/${id}`)
        },
        getTaxComponentsApi:() => {
            return Api.get(`/tax/components`)
        },
        createTaxGroupApi:(values) => {
            return Api.post(`/tax/groups`,values)
        },
        updateTaxGroupApi:(id,values) => {
            return Api.put(`/tax/groups/${id}`,values)
        },
    };
