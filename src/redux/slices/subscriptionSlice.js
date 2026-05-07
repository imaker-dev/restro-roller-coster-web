import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SubscriptionServices from "../services/SubscriptionServices";
import toast from "react-hot-toast";

/* ---------------- GET GLOBAL PRICING ---------------- */

export const fetchSubscriptionGlobalPricing = createAsyncThunk(
  "/fetch/global/pricing",
  async () => {
    const res = await SubscriptionServices.getGlobalPricingApi();
    return res.data;
  },
);

/* ---------------- SET GLOBAL PRICING ---------------- */

export const updateSubscriptionGlobalPricing = createAsyncThunk(
  "/set/global/pricing",
  async ({ values }) => {
    const res = await SubscriptionServices.setNewGlobalPricingApi({
      values,
    });

    return res.data;
  },
);

/* ---------------- GET ALL SUPER ADMIN PRICING ---------------- */

export const fetchAllSuperAdminSubscriptionPricing = createAsyncThunk(
  "/fetch/super/admin/pricing",
  async () => {
    const res = await SubscriptionServices.getAllSuperAdminPricingApi();

    return res.data;
  },
);

/* ---------------- SET CUSTOM SUPER ADMIN PRICING ---------------- */

export const setCustomPricingForSuperAdmin = createAsyncThunk(
  "/set/custom/pricing/super/admin",
  async ({ userId, values }) => {
    const res = await SubscriptionServices.setCustomPricingForSuperAdmin({
      userId,
      values,
    });

    return res.data;
  },
);

/* ---------------- GET ALL SUBSCRIPTIONS ---------------- */

export const fetchAllSubscriptions = createAsyncThunk(
  "/fetch/all/subscriptions",
  async ({page,limit,search}) => {
    const res = await SubscriptionServices.getAllSubscriptionsApi({page,limit,search});

    return res.data;
  },
);

/* ---------------- FORCE ACTIVATE SUBSCRIPTION ---------------- */

export const forceActivateSubscription = createAsyncThunk(
  "/force/activate/subscription",
  async ({ outletId, values }) => {
    const res = await SubscriptionServices.forceActiveSubscriptionApi({
      outletId,
      values,
    });

    return res.data;
  },
);

/* ---------------- FORCE DEACTIVATE SUBSCRIPTION ---------------- */

export const forceDeactivateSubscription = createAsyncThunk(
  "/force/deactivate/subscription",
  async ({ outletId, values }) => {
    const res = await SubscriptionServices.forceDeactiveSubscriptionApi({
      outletId,
      values,
    });

    return res.data;
  },
);

/* ---------------- EXTEND SUBSCRIPTION ---------------- */

export const extendSubscription = createAsyncThunk(
  "/extend/subscription",
  async ({ outletId, values }) => {
    const res = await SubscriptionServices.extendSubscriptionForNDays({
      outletId,
      values,
    });

    return res.data;
  },
);

/* ---------------- SLICE ---------------- */

const subscriptionSlice = createSlice({
  name: "subscription",

  initialState: {
    subscriptionGlobalPricing: null,
    allSuperAdminSubscriptionPricing: [],
    allSubscriptions: [],

    isFetchingSubscriptionGlobalPricing: false,
    isUpdatingSubscriptionGlobalPricing: false,

    isFetchingSuperAdminSubscriptionPricing: false,
    isSettingCustomPricing: false,

    isFetchingSubscriptions: false,

    isActivatingSubscription: false,
    isDeactivatingSubscription: false,
    isExtendingSubscription: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ---------------- FETCH GLOBAL PRICING ---------------- */

      .addCase(fetchSubscriptionGlobalPricing.pending, (state) => {
        state.isFetchingSubscriptionGlobalPricing = true;
      })
      .addCase(fetchSubscriptionGlobalPricing.fulfilled, (state, action) => {
        state.isFetchingSubscriptionGlobalPricing = false;
        state.subscriptionGlobalPricing = action.payload.pricing;
      })
      .addCase(fetchSubscriptionGlobalPricing.rejected, (state, action) => {
        state.isFetchingSubscriptionGlobalPricing = false;

        toast.error(action?.error?.message);
      })

      /* ---------------- SET GLOBAL PRICING ---------------- */

      .addCase(updateSubscriptionGlobalPricing.pending, (state) => {
        state.isUpdatingSubscriptionGlobalPricing = true;
      })
      .addCase(updateSubscriptionGlobalPricing.fulfilled, (state, action) => {
        state.isUpdatingSubscriptionGlobalPricing = false;

        toast.success(action.payload.message);
      })
      .addCase(updateSubscriptionGlobalPricing.rejected, (state, action) => {
        state.isUpdatingSubscriptionGlobalPricing = false;

        toast.error(action?.error?.message);
      })

      /* ---------------- FETCH SUPER ADMIN PRICING ---------------- */

      .addCase(fetchAllSuperAdminSubscriptionPricing.pending, (state) => {
        state.isFetchingSuperAdminSubscriptionPricing = true;
      })
      .addCase(fetchAllSuperAdminSubscriptionPricing.fulfilled, (state, action) => {
        state.isFetchingSuperAdminSubscriptionPricing = false;
        state.allSuperAdminSubscriptionPricing = action.payload.data;
      })
      .addCase(fetchAllSuperAdminSubscriptionPricing.rejected, (state, action) => {
        state.isFetchingSuperAdminSubscriptionPricing = false;

        toast.error(action?.error?.message);
      })

      /* ---------------- SET CUSTOM SUPER ADMIN PRICING ---------------- */

      .addCase(setCustomPricingForSuperAdmin.pending, (state) => {
        state.isSettingCustomPricing = true;
      })
      .addCase(setCustomPricingForSuperAdmin.fulfilled, (state, action) => {
        state.isSettingCustomPricing = false;

        toast.success(action.payload.message);
      })
      .addCase(setCustomPricingForSuperAdmin.rejected, (state, action) => {
        state.isSettingCustomPricing = false;

        toast.error(action?.error?.message);
      })

      /* ---------------- FETCH ALL SUBSCRIPTIONS ---------------- */

      .addCase(fetchAllSubscriptions.pending, (state) => {
        state.isFetchingSubscriptions = true;
      })
      .addCase(fetchAllSubscriptions.fulfilled, (state, action) => {
        state.isFetchingSubscriptions = false;
        state.allSubscriptions = action.payload;
      })
      .addCase(fetchAllSubscriptions.rejected, (state, action) => {
        state.isFetchingSubscriptions = false;

        toast.error(action?.error?.message);
      })

      /* ---------------- ACTIVATE SUBSCRIPTION ---------------- */

      .addCase(forceActivateSubscription.pending, (state) => {
        state.isActivatingSubscription = true;
      })
      .addCase(forceActivateSubscription.fulfilled, (state, action) => {
        state.isActivatingSubscription = false;

        toast.success(action.payload.message);
      })
      .addCase(forceActivateSubscription.rejected, (state, action) => {
        state.isActivatingSubscription = false;

        toast.error(action?.error?.message);
      })

      /* ---------------- DEACTIVATE SUBSCRIPTION ---------------- */

      .addCase(forceDeactivateSubscription.pending, (state) => {
        state.isDeactivatingSubscription = true;
      })
      .addCase(forceDeactivateSubscription.fulfilled, (state, action) => {
        state.isDeactivatingSubscription = false;

        toast.success(action.payload.message);
      })
      .addCase(forceDeactivateSubscription.rejected, (state, action) => {
        state.isDeactivatingSubscription = false;

        toast.error(action?.error?.message);
      })

      /* ---------------- EXTEND SUBSCRIPTION ---------------- */

      .addCase(extendSubscription.pending, (state) => {
        state.isExtendingSubscription = true;
      })
      .addCase(extendSubscription.fulfilled, (state, action) => {
        state.isExtendingSubscription = false;

        toast.success(action.payload.message);
      })
      .addCase(extendSubscription.rejected, (state, action) => {
        state.isExtendingSubscription = false;

        toast.error(action?.error?.message);
      });
  },
});

export default subscriptionSlice.reducer;
