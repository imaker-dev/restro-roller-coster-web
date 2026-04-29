import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllSettingsCategoriesApi: () => {
            return Api.get("/settings/categories");
        },
        getSettingByCategoryApi:(category) => {
            return Api.get(`/settings/category/${category}`)
        },
        updateSettingApi:(key,value) => {
            return Api.put(`/settings/${key}`,{value})
        }
    };
