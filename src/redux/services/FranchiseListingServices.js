import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllFranchisesApi: () => {
        return Api.get(`/franchises/admin/list`);
      },
      getFranchiseByIdApi: (id) => {
        return Api.get(`/franchises/admin/detail/${id}`);
      },
      createFranchiseApi: (values) => {
        return Api.post(`/franchises`, values);
      },
      updateFranchiseApi: (id, values) => {
        return Api.patch(`/franchises/${id}`, values);
      },
      getFranchisesInquiryApi: (id) => {
        return Api.get(`/franchises/admin/enquiries?franchise_id=${id}`);
      },
      updateFranchisesInquiryApi: (id, values) => {
        return Api.patch(`/franchises/admin/enquiries/${id}/status`, values);
      },
    };
