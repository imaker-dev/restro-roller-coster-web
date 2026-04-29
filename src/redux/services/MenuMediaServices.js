import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      uploadMenuMediaApi: (outletId, formData) => {
        return Api.post(`menu-media/${outletId}/upload`, formData);
      },

      uploadMultipleMenuMediaApi: (outletId, formData) => {
        return Api.post(`menu-media/${outletId}/upload/multiple`, formData);
      },

      getMenuMediaApi: (outletId, params = {}) => {
        return Api.get(`menu-media/${outletId}`, { params });
      },

      viewMenuMediaApi: (outletId) => {
        return Api.get(`menu-media/${outletId}/view`);
      },

      updateMenuMediaApi: (id, data) => {
        return Api.patch(`menu-media/${id}`, data);
      },

      toggleMenuMediaActiveApi: (id, isActive) => {
        return Api.patch(`menu-media/${id}/active`, { isActive });
      },

      replaceMenuMediaApi: (id, formData) => {
        return Api.patch(`menu-media/${id}/replace`, formData);
      },

      deleteMenuMediaApi: (id) => {
        return Api.delete(`menu-media/${id}`);
      },

      getAllQrCodesApi: (outletId) => {
        return Api.get(`menu-media/${outletId}/qr`);
      },

      regenerateQrApi: (outletId, menuType) => {
        return Api.post(`menu-media/${outletId}/qr/${menuType}/regenerate`);
      },

      uploadQrLogoApi: (outletId, menuType, formData) => {
        return Api.post(`menu-media/${outletId}/qr/${menuType}/logo`, formData);
      },
    };
