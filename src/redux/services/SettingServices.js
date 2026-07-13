import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllSettingsCategoriesApi: () => {
            return Api.get("/settings/categories");
        },
        getSettingByCategoryApi:(category,outletId) => {
            return Api.get(`/settings/category/${category}?outletId=${outletId}`);
        },
        updateSettingApi:(category, values) => {
            return Api.put(`/settings/category/${category}`,values)
        }
    };
