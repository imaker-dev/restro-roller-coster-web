import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import PermissionServices from "../services/PermissionServices";

export const fetchAllPermissions = createAsyncThunk("/fetch/permissions", async () => {
  const res = await PermissionServices.getAllPermissionsApi();
  return res.data;
});

const permissionSlice = createSlice({
  name: "permission",
  initialState: {
    loading: false,
    allPermissions: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.allPermissions = action.payload.data;
      })
      .addCase(fetchAllPermissions.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = permissionSlice;
export default reducer;
