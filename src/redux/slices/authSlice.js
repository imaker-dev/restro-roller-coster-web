import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import AuthServices from "../services/AuthServices";
import { TOKEN_KEYS } from "../../constants";
import { disconnectSocket } from "../../socket/socket";
import { clearAuthStorage, isLoggedIn } from "../../utils/authToken";

const logIn = isLoggedIn();

const storedOutlet = localStorage.getItem(TOKEN_KEYS.OUTLET_ID);

const resolveOutlet = (outlets) => {
  if (!outlets?.length) {
    localStorage.removeItem(TOKEN_KEYS.OUTLET_ID);
    return null;
  }

  const raw = localStorage.getItem(TOKEN_KEYS.OUTLET_ID);
  const stored = raw ? Number(raw) : null;

  const isValid = outlets.some((o) => o.id === stored);

  if (isValid) return stored;

  const defaultOutlet = outlets[0].id;
  localStorage.setItem(TOKEN_KEYS.OUTLET_ID, String(defaultOutlet));
  return defaultOutlet;
};

export const signIn = createAsyncThunk("/admin/signin", async (values) => {
  const res = await AuthServices.signInApi(values);
  return res.data;
});
export const fetchMeData = createAsyncThunk("/fetch/me", async () => {
  const res = await AuthServices.getMeData();
  return res.data;
});

export const logout = createAsyncThunk(
  "/auth/logout",
  async (_, { dispatch }) => {
    disconnectSocket();
    dispatch(clearLoginState());
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    logIn,
    loading: false,
    isLogging: false,
    meData: null,
    outlets: [],
    outletId: storedOutlet ? Number(storedOutlet) : null,
    loginSource: localStorage.getItem(TOKEN_KEYS.LOGIN_SOURCE) || "web",
  },
  reducers: {
    clearLoginState: (state) => {
      state.logIn = false;
      state.meData = null;
      clearAuthStorage();
      toast.success("Logout successfully");
    },
    setOutletId: (state, action) => {
      const id = Number(action.payload);
      state.outletId = id;
      localStorage.setItem(TOKEN_KEYS.OUTLET_ID, String(id));
    },
    setLoginFromToken: (state) => {
      state.logIn = true;
    },
    setLoginFromTokenWithSource: (state, action) => {
      const { token, source } = action.payload;

      // save token
      localStorage.setItem(TOKEN_KEYS.ACCESS, token);

      // save source
      const loginSource = source || "web";
      localStorage.setItem(TOKEN_KEYS.LOGIN_SOURCE, loginSource);

      // update state
      state.logIn = true;
      state.loginSource = loginSource;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLogging = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLogging = false;
        state.logIn = true;
        const { accessToken, refreshToken, outlets } = action.payload.data;

        state.outlets = outlets || [];
        state.outletId = resolveOutlet(outlets);

        const rememberMe = action.meta.arg.rememberMe;
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem(TOKEN_KEYS.ACCESS, accessToken);
        storage.setItem(TOKEN_KEYS.REFRESH, refreshToken);

        toast.success(action.payload.message);
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLogging = false;
        toast.error(action.error.message);
      })
      .addCase(fetchMeData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMeData.fulfilled, (state, action) => {
        state.loading = false;
        state.meData = action.payload.data;

        const outlets = action.payload.data.outlets || [];
        state.outlets = outlets;

        state.outletId = resolveOutlet(outlets);
      })

      .addCase(fetchMeData.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      });
  },
});

// Export actions
export const {
  clearLoginState,
  setOutletId,
  setLoginFromToken,
  setLoginFromTokenWithSource,
} = authSlice.actions;

// Export reducer
const { reducer } = authSlice;
export default reducer;
