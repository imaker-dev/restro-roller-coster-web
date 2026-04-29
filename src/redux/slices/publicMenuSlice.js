import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import PublicMenuServices from "../services/PublicMenuServices";
import { TOKEN_KEYS } from "../../constants";

export const fetchPublicMenu = createAsyncThunk(
  "/fetch/public/menu",
  async ({ outletId }) => {
    const res = await PublicMenuServices.getAllPublicMenuApi({ outletId });
    return res.data;
  },
);

export const startSelfOrderSession = createAsyncThunk(
  "/start/self/order/session",
  async ({ values }) => {
    const res = await PublicMenuServices.startSelfOrderSessionApi({ values });
    return res.data;
  },
);

export const fetchCurrentSessionInfo = createAsyncThunk(
  "/fetch/current/session/info",
  async ({ token }) => {
    const res = await PublicMenuServices.getCurrentSessionInfoApi({ token });
    return res.data;
  },
);

export const updateSelfOrderCustomerInfo = createAsyncThunk(
  "/update/self/order/customer-info",
  async ({ values }) => {
    const res = await PublicMenuServices.updateSelfOrderCustomerInfoApi({
      values,
    });
    return res.data;
  },
);

export const fetchSelfOrderCart = createAsyncThunk(
  "/fetch/self/order/cart",
  async ({ token }) => {
    const res = await PublicMenuServices.getSelfOrderCartApi({
      token,
    });
    return res.data;
  },
);

export const saveSelfOrderCart = createAsyncThunk(
  "/save/self/order/cart",
  async ({ token, values }) => {
    const res = await PublicMenuServices.saveSelfOrderCartApi({
      token,
      values,
    });
    return res.data;
  },
);

export const placeSelfOrder = createAsyncThunk(
  "/place/self/order",
  async ({ token, values }) => {
    const res = await PublicMenuServices.placeSelfOrderApi({
      token,
      values,
    });
    return res.data;
  },
);

export const fetchCurrentOrderStatus = createAsyncThunk(
  "/fetch/current/order/status",
  async ({ token }) => {
    const res = await PublicMenuServices.getCurrentOrderStatusApi({
      token,
    });
    return res.data;
  },
);
export const cancelSelfOrder = createAsyncThunk(
  "/cancel/self/order",
  async ({ token, reason }) => {
    const res = await PublicMenuServices.cancelSelfOrderApi({
      token,
      reason,
    });
    return res.data;
  },
);

const publicMenuSlice = createSlice({
  name: "publicMenu",
  initialState: {
    qrSessionToken: localStorage.getItem(TOKEN_KEYS.QR_SESSION) || null,

    isFetchingPublicMenu: false,
    publicMenuData: null,

    isStartingSelfOrderSession: false,
    isUpdatingSelfOrderCustomerInfo: false,

    isFetchingCurrentSession: false,
    currentSessionInfo: null,

    isFetchingCart: false,
    selfOrderCartData: null,

    isSavingCart: false,
    isPlacingSelfOrder: false,

    isFetchingCurrentOrderStatus: false,
    currentOrderStatus: null,

    isCancellingOrder: false,
  },
  reducers: {
    clearSessionState: (state) => {
      state.qrSessionToken = null;
      localStorage.removeItem(TOKEN_KEYS.QR_SESSION);
      toast.success("Session End successfully");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicMenu.pending, (state) => {
        state.isFetchingPublicMenu = true;
      })
      .addCase(fetchPublicMenu.fulfilled, (state, action) => {
        state.isFetchingPublicMenu = false;
        state.publicMenuData = action.payload.data;
      })
      .addCase(fetchPublicMenu.rejected, (state, action) => {
        state.isFetchingPublicMenu = false;
        toast.error(action.error.message);
      })

      .addCase(startSelfOrderSession.pending, (state) => {
        state.isStartingSelfOrderSession = true;
      })
      // .addCase(startSelfOrderSession.fulfilled, (state, action) => {
      //   state.isStartingSelfOrderSession = false;
      //   localStorage.setItem(TOKEN_KEYS.QR_SESSION, action.payload.data.token);
      // })

      .addCase(startSelfOrderSession.fulfilled, (state, action) => {
        state.isStartingSelfOrderSession = false;
        const token = action.payload.data.token;
        state.qrSessionToken = token;
        localStorage.setItem(TOKEN_KEYS.QR_SESSION, token);
        toast.success("Session started successfully")
      })
      .addCase(startSelfOrderSession.rejected, (state, action) => {
        state.isStartingSelfOrderSession = false;
        toast.error(action.error.message);
      })

      .addCase(fetchCurrentSessionInfo.pending, (state) => {
        state.isFetchingCurrentSession = true;
      })
      .addCase(fetchCurrentSessionInfo.fulfilled, (state, action) => {
        state.isFetchingCurrentSession = false;
        state.currentSessionInfo = action.payload.data;
      })
      .addCase(fetchCurrentSessionInfo.rejected, (state, action) => {
        state.isFetchingCurrentSession = false;
        toast.error(action.error.message);
      })

      .addCase(updateSelfOrderCustomerInfo.pending, (state) => {
        state.isUpdatingSelfOrderCustomerInfo = true;
      })
      .addCase(updateSelfOrderCustomerInfo.fulfilled, (state, action) => {
        state.isUpdatingSelfOrderCustomerInfo = false;
        // toast.success(action.payload.message);
      })
      .addCase(updateSelfOrderCustomerInfo.rejected, (state, action) => {
        state.isUpdatingSelfOrderCustomerInfo = false;
        toast.error(action.error.message);
      })

      .addCase(fetchSelfOrderCart.pending, (state) => {
        state.isFetchingCart = true;
      })
      .addCase(fetchSelfOrderCart.fulfilled, (state, action) => {
        state.isFetchingCart = false;
        state.selfOrderCartData = action.payload.data;
      })
      .addCase(fetchSelfOrderCart.rejected, (state, action) => {
        state.isFetchingCart = false;
        toast.error(action.error.message);
      })

      .addCase(saveSelfOrderCart.pending, (state) => {
        state.isSavingCart = true;
      })
      .addCase(saveSelfOrderCart.fulfilled, (state, action) => {
        state.isSavingCart = false;
        // toast.success(action.payload.message);
      })
      .addCase(saveSelfOrderCart.rejected, (state, action) => {
        state.isSavingCart = false;
        toast.error(action.error.message);
      })

      .addCase(placeSelfOrder.pending, (state) => {
        state.isPlacingSelfOrder = true;
      })
      .addCase(placeSelfOrder.fulfilled, (state, action) => {
        state.isPlacingSelfOrder = false;
        toast.success(action.payload.message);
      })
      .addCase(placeSelfOrder.rejected, (state, action) => {
        state.isPlacingSelfOrder = false;
        toast.error(action.error.message);
      })

      .addCase(fetchCurrentOrderStatus.pending, (state) => {
        state.isFetchingCurrentOrderStatus = true;
      })
      .addCase(fetchCurrentOrderStatus.fulfilled, (state, action) => {
        state.isFetchingCurrentOrderStatus = false;
        state.currentOrderStatus = action.payload.data;
      })
      .addCase(fetchCurrentOrderStatus.rejected, (state, action) => {
        state.isFetchingCurrentOrderStatus = false;
        toast.error(action.error.message);
      })
      .addCase(cancelSelfOrder.pending, (state) => {
        state.isCancellingOrder = true;
      })
      .addCase(cancelSelfOrder.fulfilled, (state, action) => {
        state.isCancellingOrder = false;
        toast.success(action.payload.message);
      })
      .addCase(cancelSelfOrder.rejected, (state, action) => {
        state.isCancellingOrder = false;
        toast.error(action.error.message);
      });
  },
});

// Export actions
export const { clearSessionState } = publicMenuSlice.actions;
// Export reducer
const { reducer } = publicMenuSlice;
export default reducer;
