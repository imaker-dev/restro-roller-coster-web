import { cleanParams } from "../../utils/cleanParams.js";
import Api from "../api.js";

export default false
  ? {
      message: "You are Offline. Please turn on the internet",
    }
  : {
      getGlobalPricingApi: () => {
        return Api.get(`/subscriptions/pricing`);
      },
      setNewGlobalPricingApi: ({ values }) => {
        return Api.post(`/subscriptions/pricing`, values);
      },
      getAllSuperAdminPricingApi: () => {
        return Api.get(`/subscriptions/pricing/super-admin`);
      },
      setCustomPricingForSuperAdmin: ({ userId, values }) => {
        return Api.get(`/subscriptions/pricing/super-admin/${userId}`, values);
      },
      getAllSubscriptionsApi: ({ page, limit, search }) => {
        const params = cleanParams({
          page,
          limit,
          search,
        });
        return Api.get(`/subscriptions`, { params });
      },
      forceActiveSubscriptionApi: ({ outletId, values }) => {
        return Api.post(`/subscriptions/${outletId}/activate`, values);
      },
      forceDeactiveSubscriptionApi: ({ outletId, values }) => {
        return Api.post(`/subscriptions/${outletId}/deactivate`, values);
      },
      extendSubscriptionForNDays: ({ outletId, values }) => {
        return Api.post(`/subscriptions/${outletId}/extend`, values);
      },
    };
