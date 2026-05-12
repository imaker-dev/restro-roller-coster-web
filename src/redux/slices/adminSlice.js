import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import AdminServices from "../services/AdminServices";

export const fetchAllSuperAdmins = createAsyncThunk(
  "/fetch/all/super-admins",
  async () => {
    const res = await AdminServices.getAllSuperAdminsApi();
    return res.data;
  },
);
export const fetchSuperAdminById = createAsyncThunk(
  "/fetch/all/super-admin/:id",
  async ({userId}) => {
    const res = await AdminServices.getSuperAdminByIdApi({userId});
    return res.data;
  },
);
export const createSuperAdmin = createAsyncThunk(
  "/create/super-admin",
  async ({ values }) => {
    const res = await AdminServices.createSuperAdminApi({ values });
    return res.data;
  },
);
export const toggleSuperAdminStatus = createAsyncThunk(
  "/toggle/super-admin/status",
  async ({ id, isActive }) => {
    const res = await AdminServices.toggleSuperAdminStatusApi({ id, isActive });
    return res.data;
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    isFetchingSuperAdmin: false,
    allSuperAdmins: null,

    isFetchingSuperAdminDetails: false,
    superAdminDetails:null,

    isCreatingSuperAdmin: false,
    isUpdatingStatus: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSuperAdmins.pending, (state) => {
        state.isFetchingSuperAdmin = true;
      })
      .addCase(fetchAllSuperAdmins.fulfilled, (state, action) => {
        state.isFetchingSuperAdmin = false;
        state.allSuperAdmins = action.payload;
      })
      .addCase(fetchAllSuperAdmins.rejected, (state, action) => {
        state.isFetchingSuperAdmin = false;
        toast.error(action.error.message);
      })
      .addCase(fetchSuperAdminById.pending, (state) => {
        state.isFetchingSuperAdminDetails = true;
      })
      .addCase(fetchSuperAdminById.fulfilled, (state, action) => {
        state.isFetchingSuperAdminDetails = false;
        state.superAdminDetails = action.payload.data;
      })
      .addCase(fetchSuperAdminById.rejected, (state, action) => {
        state.isFetchingSuperAdminDetails = false;
        toast.error(action.error.message);
      })
      .addCase(createSuperAdmin.pending, (state) => {
        state.isCreatingSuperAdmin = true;
      })
      .addCase(createSuperAdmin.fulfilled, (state, action) => {
        state.isCreatingSuperAdmin = false;
        toast.success(action.payload.success);
      })
      .addCase(createSuperAdmin.rejected, (state, action) => {
        state.isCreatingSuperAdmin = false;
        toast.error(action.error.message);
      })
      .addCase(toggleSuperAdminStatus.pending, (state) => {
        state.isUpdatingStatus = true;
      })
      .addCase(toggleSuperAdminStatus.fulfilled, (state, action) => {
        state.isUpdatingStatus = false;
        toast.success(action.payload.message);
      })
      .addCase(toggleSuperAdminStatus.rejected, (state, action) => {
        state.isUpdatingStatus = false;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = adminSlice;
export default reducer;
