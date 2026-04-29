import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import RolesServices from "../services/RolesServices";

export const fetchAllRoles = createAsyncThunk("/fetch/roles", async () => {
  const res = await RolesServices.getAllRolesApi();
  return res.data;
});

const roleSlice = createSlice({
  name: "role",
  initialState: {
    loading: false,
    allRoles: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.allRoles = action.payload.data;
      })
      .addCase(fetchAllRoles.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = roleSlice;
export default reducer;
