import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllFloorsApi: (id) => {
            return Api.get(`/outlets/${id}/floors`);
        },
        createFloorApi:(values) => {
            return Api.post(`/outlets/floors`,values)
        },
        updateFloorApi:(id,values) => {
            return Api.put(`/outlets/floors/${id}`,values)
        }
    };
