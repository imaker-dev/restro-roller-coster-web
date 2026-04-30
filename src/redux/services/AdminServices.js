import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllSuperAdminsApi: () => {
            return Api.get("/users/super-admins", );
        },
        createSuperAdminApi: ({values}) => {
            return Api.post("/users/super-admins",values);
        },
        toggleSuperAdminStatusApi:({id,isActive}) => {
            return Api.patch(`/users/super-admins/${id}/toggle-active`,{isActive})
        }
    };
