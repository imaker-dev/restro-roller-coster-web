import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import SettingServices from "../services/SettingServices";

export const fetchAllSettingsCategories = createAsyncThunk(
  "/fetch/settings/categories",
  async () => {
    const res = await SettingServices.getAllSettingsCategoriesApi();
    return res.data;
  },
);
export const fetchSettingsByCategory = createAsyncThunk(
  "/fetch/settings/categories/category",
  async (category) => {
    const res = await SettingServices.getSettingByCategoryApi(category);
    return res.data;
  },
);
export const updateSetting = createAsyncThunk(
  "/update/setting",
  async ({ key, value }) => {
    const res = await SettingServices.updateSettingApi(key, value);
    return res.data;
  },
);

const settingSlice = createSlice({
  name: "setting",
  initialState: {
    loading: false,
    allSettings: null,
    isFetchingSettingsDetails: false,
    settingDetails: null,
    isUpdatingSettings: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSettingsCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSettingsCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.allSettings = action.payload.data;
      })
      .addCase(fetchAllSettingsCategories.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(fetchSettingsByCategory.pending, (state) => {
        state.isFetchingSettingsDetails = true;
      })
      .addCase(fetchSettingsByCategory.fulfilled, (state, action) => {
        state.isFetchingSettingsDetails = false;
        state.settingDetails = action.payload.data;
      })
      .addCase(fetchSettingsByCategory.rejected, (state, action) => {
        state.isFetchingSettingsDetails = false;
        toast.error(action.error.message);
      })
      .addCase(updateSetting.pending, (state) => {
        state.isUpdatingSettings = true;
      })
      .addCase(updateSetting.fulfilled, (state, action) => {
        state.isUpdatingSettings = false;
        toast.success(action.payload.message);
      })
      .addCase(updateSetting.rejected, (state, action) => {
        state.isUpdatingSettings = false;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = settingSlice;
export default reducer;
