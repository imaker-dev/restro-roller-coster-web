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
      getSuperAdminOutletsPricingApi: ({userId}) => {
        return Api.get(`/subscriptions/pricing/super-admin/${userId}/outlets`);
      },
      setCustomPricingForSuperAdmin: ({ adminId, values }) => {
        return Api.post(`/subscriptions/pricing/super-admin/${adminId}`, values);
      },
      removeCustomPricingForSuperAdmin: ({ adminId }) => {
        return Api.delete(`/subscriptions/pricing/super-admin/${adminId}`);
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
      getSubscriptionDashboardApi: () => {
        return Api.get(`/subscriptions/dashboard`);
      },
      getMySubscriptionApi:() => {
        return Api.get(`/subscriptions/my`)
      },
      getOutletSubscriptionPricingApi: ({page,limit,search}) => {
        const params = cleanParams({page,limit,search})
        return Api.get(`/outlets/master-dashboard`, { params });
      },
      updateOutletSubscriptionPricingApi: ({ outletId, values }) => {
        return Api.post(`/subscriptions/pricing/outlet/${outletId}`,values);
      },
      removeOutletSubscriptionPricingApi: ({ outletId }) => {
        return Api.delete(`/subscriptions/pricing/outlet/${outletId}`);
      },
    };
