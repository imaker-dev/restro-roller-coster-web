import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllPermissionsApi: () => {
            return Api.get("/permissions");
        },
    };
