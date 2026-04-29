import { getDeviceId } from "../../utils/deviceId.js";
import Api from "../api.js";

const deviceId = getDeviceId();

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getAllPublicMenuApi: ({ outletId }) => {
        return Api.get(`/menu/${outletId}/captain`);
      },

      startSelfOrderSessionApi: ({ values }) => {
        return Api.post(`/self-order/init`, {...values,deviceId});
      },

      getCurrentSessionInfoApi: ({ token }) => {
        return Api.get(`/self-order/session`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Device-Id": deviceId,
          },
        });
      },

      // updateSelfOrderCustomerInfoApi:({values}) => {
      //   return Api.put(`/self-order/customer`,values)
      // }

      updateSelfOrderCustomerInfoApi: ({ values }) => {
        return Api.put(`/self-order/customer`, values, {
          headers: {
            Authorization: `Bearer ${values?.token}`,
            "X-Device-Id": deviceId,
          },
        });
      },

      getSelfOrderCartApi: ({ token }) => {
        return Api.get(`/self-order/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Device-Id": deviceId,
          },
        });
      },

      saveSelfOrderCartApi: ({ token, values }) => {
        return Api.post(
          `/self-order/cart`,
          { items: values },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Device-Id": deviceId,
            },
          },
        );
      },

      placeSelfOrderApi: ({ token, values }) => {
        return Api.post(`/self-order/order`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Device-Id": deviceId,
          },
        });
      },

      getCurrentOrderStatusApi: ({ token }) => {
        return Api.get(`/self-order/order/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Device-Id": deviceId,
          },
        });
      },

      cancelSelfOrderApi: ({ token, reason }) => {
        return Api.post(
          `/self-order/order/cancel`,
          { reason },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Device-Id": deviceId,
            },
          },
        );
      },
    };
