import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllSectionsApi: (floorId) => {
            return Api.get(`/outlets/floors/${floorId}/sections`);
        },
        getAllSectionWithTablesApi:(floorId) => {
            return Api.get(`/outlets/floors/${floorId}/sections-with-tables`)
        },
        createSectionApi:(values) => {
            return Api.post(`/outlets/sections`,values)
        },
        updateSectionApi:(id,values) => {
            return Api.put(`/outlets/sections/${id}`,values)
        }
    };
