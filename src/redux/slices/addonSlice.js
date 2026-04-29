import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import AddonServices from "../services/AddonServices";

export const fetchAllAddonGroups = createAsyncThunk(
  "/fetch/addon/groups",
  async (id) => {
    const res = await AddonServices.getAllAddonGroupsApi(id);
    return res.data;
  },
);

export const fetchAddonGroupItems = createAsyncThunk(
  "/fetch/addon/group/:id",
  async (id) => {
    const res = await AddonServices.getAddonByGroupApi(id);
    return res.data;
  },
);

export const createAddonGroup = createAsyncThunk(
  "/create/addon/group",
  async (values) => {
    const res = await AddonServices.addAddonGroupApi(values);
    return res.data;
  },
);

export const updateAddonGroup = createAsyncThunk(
  "/update/addon/group",
  async ({ id, values }) => {
    const res = await AddonServices.updateAddonGroupApi(id, values);
    return res.data;
  },
);

export const createAddonItem = createAsyncThunk(
  "/create/addon/item",
  async (values) => {
    const res = await AddonServices.createAddonGroupApi(values);
    return res.data;
  },
);
export const updateAddonItem = createAsyncThunk(
  "/update/addon/item",
  async ({id,values}) => {
    const res = await AddonServices.updateAddonItemApi(id,values);
    return res.data;
  },
);

const addonSlice = createSlice({
  name: "addon",
  initialState: {
    loading: false,
    isFetchingAddonItems: false,
    isCreatingAddonGroup: false,
    isUpdatingAddonGroup: false,
    allAddonGroups: null,
    allAddonItems: null,
    isCreatingAddonItem:false,
    isUpdatingAddonItem:false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAddonGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAddonGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.allAddonGroups = action.payload.data;
      })
      .addCase(fetchAllAddonGroups.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(fetchAddonGroupItems.pending, (state) => {
        state.isFetchingAddonItems = true;
      })
      .addCase(fetchAddonGroupItems.fulfilled, (state, action) => {
        state.isFetchingAddonItems = false;
        state.allAddonItems = action.payload.data;
      })
      .addCase(fetchAddonGroupItems.rejected, (state, action) => {
        state.isFetchingAddonItems = false;
        toast.error(action.error.message);
      })
      .addCase(createAddonGroup.pending, (state) => {
        state.isCreatingAddonGroup = true;
      })
      .addCase(createAddonGroup.fulfilled, (state, action) => {
        state.isCreatingAddonGroup = false;
        toast.success(action.payload.message);
      })
      .addCase(createAddonGroup.rejected, (state, action) => {
        state.isCreatingAddonGroup = false;
        toast.error(action.error.message);
      })
      .addCase(updateAddonGroup.pending, (state) => {
        state.isUpdatingAddonGroup = true;
      })
      .addCase(updateAddonGroup.fulfilled, (state, action) => {
        state.isUpdatingAddonGroup = false;
        toast.success(action.payload.message);
      })
      .addCase(updateAddonGroup.rejected, (state, action) => {
        state.isUpdatingAddonGroup = false;
        toast.error(action.error.message);
      })
      .addCase(createAddonItem.pending, (state) => {
        state.isCreatingAddonItem = true;
      })
      .addCase(createAddonItem.fulfilled, (state, action) => {
        state.isCreatingAddonItem = false;
        toast.success(action.payload.message);
      })
      .addCase(createAddonItem.rejected, (state, action) => {
        state.isCreatingAddonItem = false;
        toast.error(action.error.message);
      })
      .addCase(updateAddonItem.pending, (state) => {
        state.isUpdatingAddonItem = true;
      })
      .addCase(updateAddonItem.fulfilled, (state, action) => {
        state.isUpdatingAddonItem = false;
        toast.success(action.payload.message);
      })
      .addCase(updateAddonItem.rejected, (state, action) => {
        state.isUpdatingAddonItem = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = addonSlice;
export default reducer;
