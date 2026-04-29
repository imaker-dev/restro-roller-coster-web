import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import RegistrationServices from "../services/RegistrationServices";

export const fetchAllRegistrationRequests = createAsyncThunk(
  "/fetch/registration/requests",
  async ({ page, limit }) => {
    const res = await RegistrationServices.getAllRegistrationRequestsApi({
      page,
      limit,
    });
    return res.data;
  },
);
export const updateRegistrationRequest = createAsyncThunk(
  "/update/registration/request",
  async ({ id, values }) => {
    const res = await RegistrationServices.updateRegistrationRequestApi({
      id,
      values,
    });
    return res.data;
  },
);
export const generateActivationToken = createAsyncThunk(
  "/generate/avtivation/token",
  async (values) => {
    const res = await RegistrationServices.generateActivationTokenApi(values);
    return res.data;
  },
);
export const fetchTokenActivationHistory = createAsyncThunk(
  "/token/avtivation/history",
  async ({ page, limit }) => {
    const res = await RegistrationServices.getTokenActivationLogsApi({
      page,
      limit,
    });
    return res.data;
  },
);
export const generateUpgradeToken = createAsyncThunk(
  "/generate/update/token",
  async (values) => {
    const res = await RegistrationServices.generateUpgradeTokenApi(values);
    return res.data;
  },
);

const registrationSlice = createSlice({
  name: "registration",
  initialState: {
    isFetchingAllRequests: false,
    allRegistrationRequests: null,
    isUpdatingRequest: false,
    isGeneratingActivationToken: false,
    isGeneratingUpgradeToken: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRegistrationRequests.pending, (state) => {
        state.isFetchingAllRequests = true;
      })
      .addCase(fetchAllRegistrationRequests.fulfilled, (state, action) => {
        state.isFetchingAllRequests = false;
        state.allRegistrationRequests = action.payload.data;
      })
      .addCase(fetchAllRegistrationRequests.rejected, (state, action) => {
        state.isFetchingAllRequests = false;
        toast.error(action.error.message);
      })
      .addCase(updateRegistrationRequest.pending, (state) => {
        state.isUpdatingRequest = true;
      })
      .addCase(updateRegistrationRequest.fulfilled, (state, action) => {
        state.isUpdatingRequest = false;
        toast.success(action.payload.message);
      })
      .addCase(updateRegistrationRequest.rejected, (state, action) => {
        state.isUpdatingRequest = false;
        toast.error(action.error.message);
      })
      .addCase(generateActivationToken.pending, (state) => {
        state.isGeneratingActivationToken = true;
      })
      .addCase(generateActivationToken.fulfilled, (state, action) => {
        state.isGeneratingActivationToken = false;
        toast.success(action.payload.message);
      })
      .addCase(generateActivationToken.rejected, (state, action) => {
        state.isGeneratingActivationToken = false;
        toast.error(action.error.message);
      })
      .addCase(fetchTokenActivationHistory.pending, (state) => {
        state.isFetchingTokenActivationHistory = true;
      })
      .addCase(fetchTokenActivationHistory.fulfilled, (state, action) => {
        state.isFetchingTokenActivationHistory = false;
        state.tokenActivationHistory = action.payload.data;
      })
      .addCase(fetchTokenActivationHistory.rejected, (state, action) => {
        state.isFetchingTokenActivationHistory = false;
        toast.error(action.error.message);
      })
      .addCase(generateUpgradeToken.pending, (state) => {
        state.isGeneratingUpgradeToken = true;
      })
      .addCase(generateUpgradeToken.fulfilled, (state, action) => {
        state.isGeneratingUpgradeToken = false;
        toast.success(action.payload.message);
      })
      .addCase(generateUpgradeToken.rejected, (state, action) => {
        state.isGeneratingUpgradeToken = false;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = registrationSlice;
export default reducer;
