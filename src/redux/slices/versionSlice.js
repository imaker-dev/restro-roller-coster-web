import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import VersionServices from "../services/VersionServices";

export const fetchAllVersions = createAsyncThunk("/fetch/all/versions", async () => {
  const res = await VersionServices.getAllVersionsApi();
  return res.data;
});
export const fetchVersionById = createAsyncThunk("/fetch/version/:id", async (id) => {
  const res = await VersionServices.getVersionByIdApi(id);
  return res.data;
});

export const createVersion = createAsyncThunk("/create/version", async (values) => {
  const res = await VersionServices.createVersionApi(values);
  return res.data;
});

export const updateVersion = createAsyncThunk("/update/version", async ({id,values}) => {
  const res = await VersionServices.updateVersionApi(id,values);
  return res.data;
});
export const deleteVersion = createAsyncThunk("/delete/version", async (id) => {
  const res = await VersionServices.deleteVersionApi(id);
  return res.data;
});

const versionSlice = createSlice({
  name: "version",
  initialState: {
    loading: false,
    allVersions: null,
    isCreatingVersion:false,
    isUpdatingVersion:false,
    isFetchingVersionDetails:false,
    versionDetails:null,
    isDeletingVersion:false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVersions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllVersions.fulfilled, (state, action) => {
        state.loading = false;
        state.allVersions = action.payload.data;
      })
      .addCase(fetchAllVersions.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(fetchVersionById.pending, (state) => {
        state.isFetchingVersionDetails = true;
      })
      .addCase(fetchVersionById.fulfilled, (state, action) => {
        state.isFetchingVersionDetails = false;
        state.versionDetails = action.payload.data;
      })
      .addCase(fetchVersionById.rejected, (state, action) => {
        state.isFetchingVersionDetails = false;
        toast.error(action.error.message);
      })
      .addCase(createVersion.pending, (state) => {
        state.isCreatingVersion = true;
      })
      .addCase(createVersion.fulfilled, (state, action) => {
        state.isCreatingVersion = false;
        toast.success(action.payload.message)
      })
      .addCase(createVersion.rejected, (state, action) => {
        state.isCreatingVersion = false;
        toast.error(action.error.message);
      })
      .addCase(updateVersion.pending, (state) => {
        state.isUpdatingVersion = true;
      })
      .addCase(updateVersion.fulfilled, (state, action) => {
        state.isUpdatingVersion = false;
        toast.success(action.payload.message)
      })
      .addCase(updateVersion.rejected, (state, action) => {
        state.isUpdatingVersion = false;
        toast.error(action.error.message);
      })
      .addCase(deleteVersion.pending, (state) => {
        state.isDeletingVersion = true;
      })
      .addCase(deleteVersion.fulfilled, (state, action) => {
        state.isDeletingVersion = false;
        toast.success(action.payload.message)
      })
      .addCase(deleteVersion.rejected, (state, action) => {
        state.isDeletingVersion = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = versionSlice;
export default reducer;
