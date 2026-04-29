import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllAddonGroupsApi: (outletId) => {
            return Api.get(`/menu/addon-groups/outlet/${outletId}`);
        },
        getAddonByGroupApi:(addonGroupId) => {
            return Api.get(`/menu/addons/group/${addonGroupId}`)
        },
        addAddonGroupApi:(values) => {
            return Api.post(`/menu/addon-groups`,values)
        },
        updateAddonGroupApi:(addonGroupId,values) => {
            return Api.put(`/menu/addon-groups/${addonGroupId}`,values)
        },
        createAddonGroupApi:(values) => {
            return Api.post(`/menu/addons`,values)
        },
        updateAddonItemApi:(addonId,values) => {
            return Api.put(`/menu/addons/${addonId}`,values)
        }
    };
