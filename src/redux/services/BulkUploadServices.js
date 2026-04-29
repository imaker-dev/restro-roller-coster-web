import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      downloadItemBulkUploadTemplateApi: () => {
        return Api.get(`/bulk-upload/menu/template`,{responseType:"blob"});
      },
      itemBulkUploadValidateApi:(formData) => {
        return Api.post(`/bulk-upload/menu/validate`,formData)
      },
      itemBulkUploadPreviewApi:(formData) => {
        return Api.post(`/bulk-upload/menu/preview`,formData)
      },
      uploadItemBulkUploadApi:(file) => {
        return Api.post(`/bulk-upload/menu`,file)
      },
      getBulkUploadSummaryApi:(outletId) => {
        return Api.get(`/bulk-upload/history?outletId=${outletId}`)
      }
    };
