import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllTaxGroupsApi: (outletId) => {
        return Api.get(`/tax/groups?outletId=${outletId}`);
      },
      getTaxGroupByIdApi: (id) => {
        return Api.get(`/tax/groups/${id}`);
      },
      createTaxGroupApi: (values) => {
        return Api.post(`/tax/groups`, values);
      },
      updateTaxGroupApi: (id, values) => {
        return Api.put(`/tax/groups/${id}`, values);
      },
      getAllTaxTypesApi: () => {
        return Api.get(`/tax/types`);
      },
      createTaxTypesApi: ({ values }) => {
        return Api.post(`/tax/types`, values);
      },
      getAllTaxComponentsApi: () => {
        return Api.get(`/tax/components`);
      },
      createTaxComponentApi:({values}) => {
        return Api.post(`/tax/components`,values)
      },
      updateTaxComponentApi:({id,values}) => {
        return Api.put(`/tax/components/${id}`,values)
      }
    };
