import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllVersionsApi: () => {
        return Api.get(`/app/versions`);
      },
      getVersionByIdApi: (id) => {
        return Api.get(`/app/versions/${id}`);
      },
      createVersionApi: (values) => {
        return Api.post(`/app/versions`, values);
      },
      updateVersionApi: (id, values) => {
        return Api.put(`/app/versions/${id}`, values);
      },
      deleteVersionApi: (id) => {
        return Api.delete(`/app/versions/${id}`);
      },
    };
