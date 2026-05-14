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

/* ---------------- GET SUPER ADMIN OUTLETS PRICING ---------------- */
export const fetchSuperAdminOutletsPricing = createAsyncThunk(
  "/fetch/super/admin/outlets/pricing",
  async ({ userId }) => {
    const res = await SubscriptionServices.getSuperAdminOutletsPricingApi({
      userId,
    });
    return res.data;
  },
);

/* ---------------- SET CUSTOM SUPER ADMIN PRICING ---------------- */
export const setCustomPricingForSuperAdmin = createAsyncThunk(
  "/set/custom/pricing/super/admin",
  async ({ adminId, values }) => {
    const res = await SubscriptionServices.setCustomPricingForSuperAdmin({
      adminId,
      values,
    });
    return res.data;
  },
);

/* ---------------- REMOVE CUSTOM SUPER ADMIN PRICING ---------------- */
export const removeCustomPricingForSuperAdmin = createAsyncThunk(
  "/remove/custom/pricing/super/admin",
  async ({ adminId }) => {
    const res = await SubscriptionServices.removeCustomPricingForSuperAdmin({
      adminId,
    });
    return res.data;
  },
);

/* ---------------- GET ALL SUBSCRIPTIONS ---------------- */
export const fetchAllSubscriptions = createAsyncThunk(
  "/fetch/all/subscriptions",
  async ({ page, limit, search }) => {
    const res = await SubscriptionServices.getAllSubscriptionsApi({
      page,
      limit,
      search,
    });
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

/* ---------------- SUBSCRIPTION DASHBOARD ---------------- */
export const fetchSubscriptionDashboard = createAsyncThunk(
  "/fetch/subscription/dashboard",
  async () => {
    const res = await SubscriptionServices.getSubscriptionDashboardApi();
    return res.data;
  },
);

/* ---------------- MY SUBSCRIPTION ---------------- */
export const fetchMySubscription = createAsyncThunk(
  "/fetch/my/subscription",
  async () => {
    const res = await SubscriptionServices.getMySubscriptionApi();
    return res.data;
  },
);

/* ---------------- OUTLET SUBSCRIPTION PRICING ---------------- */
export const fetchOutletSubscriptionPricing = createAsyncThunk(
  "/fetch/outlet/subscription/pricing",
  async ({ page, limit, search }) => {
    const res = await SubscriptionServices.getOutletSubscriptionPricingApi({
      page,
      limit,
      search,
    });
    return res.data;
  },
);

/* ---------------- UPDATE OUTLET SUBSCRIPTION PRICING ---------------- */
export const updateOutletSubscriptionPricing = createAsyncThunk(
  "/update/outlet/subscription/pricing",
  async ({ outletId, values }) => {
    const res = await SubscriptionServices.updateOutletSubscriptionPricingApi({
      outletId,
      values,
    });
    return res.data;
  },
);

/* ---------------- REMOVE OUTLET SUBSCRIPTION PRICING ---------------- */
export const removeOutletSubscriptionPricing = createAsyncThunk(
  "/remove/outlet/subscription/pricing",
  async ({ outletId }) => {
    const res = await SubscriptionServices.removeOutletSubscriptionPricingApi({
      outletId,
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
    isSettingSuperAdminCustomPricing: false,

    isFetchingSubscriptions: false,

    isActivatingSubscription: false,
    isDeactivatingSubscription: false,
    isExtendingSubscription: false,

    isFetchingSubscriptionDashboard: false,
    subscriptionDashboard: null,

    isFetchingMySubscription: false,
    mySubscriptionData: null,

    isFetchingOutletSubscriptionPricing: false,
    outletSubscriptionPricing: null,

    isFetchingSuperAdminOutletsPricing: false,
    superAdminOutletsPricing: null,
    isRemovingSuperAdminCustomPricing: false,

    isUpdatingOutletSubscriptionPricing: false,
    isRemovingOutletSubscriptionPricing: false,
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
      .addCase(
        fetchAllSuperAdminSubscriptionPricing.fulfilled,
        (state, action) => {
          state.isFetchingSuperAdminSubscriptionPricing = false;
          state.allSuperAdminSubscriptionPricing = action.payload.pricings;
        },
      )
      .addCase(
        fetchAllSuperAdminSubscriptionPricing.rejected,
        (state, action) => {
          state.isFetchingSuperAdminSubscriptionPricing = false;
          toast.error(action?.error?.message);
        },
      )
      /* ---------------- FETCH SUPER ADMIN OUTLET PRICING ---------------- */
      .addCase(fetchSuperAdminOutletsPricing.pending, (state) => {
        state.isFetchingSuperAdminOutletsPricing = true;
      })
      .addCase(fetchSuperAdminOutletsPricing.fulfilled, (state, action) => {
        state.isFetchingSuperAdminOutletsPricing = false;
        state.superAdminOutletsPricing = action.payload;
      })
      .addCase(fetchSuperAdminOutletsPricing.rejected, (state, action) => {
        state.isFetchingSuperAdminOutletsPricing = false;
        toast.error(action?.error?.message);
      })

      /* ---------------- SET CUSTOM SUPER ADMIN PRICING ---------------- */

      .addCase(setCustomPricingForSuperAdmin.pending, (state) => {
        state.isSettingSuperAdminCustomPricing = true;
      })
      .addCase(setCustomPricingForSuperAdmin.fulfilled, (state, action) => {
        state.isSettingSuperAdminCustomPricing = false;

        toast.success(action.payload.message);
      })
      .addCase(setCustomPricingForSuperAdmin.rejected, (state, action) => {
        state.isSettingSuperAdminCustomPricing = false;
        toast.error(action?.error?.message);
      })

      /* ---------------- REMOVE CUSTOM SUPER ADMIN PRICING ---------------- */

      .addCase(removeCustomPricingForSuperAdmin.pending, (state) => {
        state.isRemovingSuperAdminCustomPricing = true;
      })
      .addCase(removeCustomPricingForSuperAdmin.fulfilled, (state, action) => {
        state.isRemovingSuperAdminCustomPricing = false;
        toast.success(action.payload.message);
      })
      .addCase(removeCustomPricingForSuperAdmin.rejected, (state, action) => {
        state.isRemovingSuperAdminCustomPricing = false;
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
      })

      /* ---------------- SUBSCRIPTION DASHBOARD ---------------- */

      .addCase(fetchSubscriptionDashboard.pending, (state) => {
        state.isFetchingSubscriptionDashboard = true;
      })
      .addCase(fetchSubscriptionDashboard.fulfilled, (state, action) => {
        state.isFetchingSubscriptionDashboard = false;
        state.subscriptionDashboard = action.payload;
      })
      .addCase(fetchSubscriptionDashboard.rejected, (state, action) => {
        state.isFetchingSubscriptionDashboard = false;
        toast.error(action?.error?.message);
      })

      /* ---------------- MY SUBSCRIPTION ---------------- */

      .addCase(fetchMySubscription.pending, (state) => {
        state.isFetchingMySubscription = true;
      })
      .addCase(fetchMySubscription.fulfilled, (state, action) => {
        state.isFetchingMySubscription = false;
        state.mySubscriptionData = action.payload.subscription;
      })
      .addCase(fetchMySubscription.rejected, (state, action) => {
        state.isFetchingMySubscription = false;
        toast.error(action?.error?.message);
      })

      /* ---------------- OUTLET SUBSCRIPTION PRICING ---------------- */
      .addCase(fetchOutletSubscriptionPricing.pending, (state) => {
        state.isFetchingOutletSubscriptionPricing = true;
      })
      .addCase(fetchOutletSubscriptionPricing.fulfilled, (state, action) => {
        state.isFetchingOutletSubscriptionPricing = false;
        state.outletSubscriptionPricing = action.payload.data;
      })
      .addCase(fetchOutletSubscriptionPricing.rejected, (state, action) => {
        state.isFetchingOutletSubscriptionPricing = false;
        toast.error(action?.error?.message);
      })

      /* ---------------- UPDATE OUTLET SUBSCRIPTION PRICING ---------------- */
      .addCase(updateOutletSubscriptionPricing.pending, (state) => {
        state.isUpdatingOutletSubscriptionPricing = true;
      })
      .addCase(updateOutletSubscriptionPricing.fulfilled, (state, action) => {
        state.isUpdatingOutletSubscriptionPricing = false;
        toast.success(action.payload.message);
      })
      .addCase(updateOutletSubscriptionPricing.rejected, (state, action) => {
        state.isUpdatingOutletSubscriptionPricing = false;
        toast.error(action?.error?.message);
      })

      /* ---------------- REMOVE OUTLET SUBSCRIPTION PRICING ---------------- */
      .addCase(removeOutletSubscriptionPricing.pending, (state) => {
        state.isRemovingOutletSubscriptionPricing = true;
      })
      .addCase(removeOutletSubscriptionPricing.fulfilled, (state, action) => {
        state.isRemovingOutletSubscriptionPricing = false;
        toast.success(action.payload.message);
      })
      .addCase(removeOutletSubscriptionPricing.rejected, (state, action) => {
        state.isRemovingOutletSubscriptionPricing = false;
        toast.error(action?.error?.message);
      })
  },
});

export default subscriptionSlice.reducer;
