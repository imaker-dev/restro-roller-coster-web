import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import SuperAdminDashboardServices from "../services/SuperAdminDashboardServices";

export const fetchSuperAdminDashboard = createAsyncThunk("/fetch/super-admin/dashboard", async ({sortBy}) => {
  const res = await SuperAdminDashboardServices.getSuperAdminDashbordApi({sortBy});
  return res.data;
});


const superAdminDashboardSlice = createSlice({
  name: "superAdminDashboard",
  initialState: {
    isfetchingSuperAdminDashboard: false,
    superAdminDashboardData:null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuperAdminDashboard.pending, (state) => {
        state.isfetchingSuperAdminDashboard = true;
      })
      .addCase(fetchSuperAdminDashboard.fulfilled, (state, action) => {
        state.isfetchingSuperAdminDashboard = false;
        state.superAdminDashboardData = action.payload.data;
      })
      .addCase(fetchSuperAdminDashboard.rejected, (state, action) => {
        state.isfetchingSuperAdminDashboard = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = superAdminDashboardSlice;
export default reducer;
