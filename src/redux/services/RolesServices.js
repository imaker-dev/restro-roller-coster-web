import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllRolesApi: () => {
            return Api.get("/users/roles");
        },
    };
