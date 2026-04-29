import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        signInApi: (values) => {
            return Api.post("/auth/login", values);
        },
        getMeData: () => {
            return Api.get("/auth/me");
        },
    };
