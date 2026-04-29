import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import NcServices from "../services/NcServices";

export const fetchNcReasons = createAsyncThunk(
  "/fetch/nc/reasons",
  async (outletId) => {
    const res = await NcServices.getNcReasonsApi(outletId);
    return res.data;
  },
);

export const createNcReason = createAsyncThunk(
  "/create/nc/reason",
  async ({ outletId, values }) => {
    const res = await NcServices.createNcReasonsApi(outletId, values);
    return res.data;
  },
);
export const updateNcReason = createAsyncThunk(
  "/update/nc/reason",
  async ({ outletId, id, values }) => {
    const res = await NcServices.updateNcReasonsApi(outletId, id, values);
    return res.data;
  },
);

const ncSlice = createSlice({
  name: "nc",
  initialState: {
    loading: false,
    ncReasons: null,
    isCreatingNcReason: false,
    isUpdatingNcReason: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNcReasons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNcReasons.fulfilled, (state, action) => {
        state.loading = false;
        state.ncReasons = action.payload.data;
      })
      .addCase(fetchNcReasons.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(createNcReason.pending, (state) => {
        state.isCreatingNcReason = true;
      })
      .addCase(createNcReason.fulfilled, (state, action) => {
        state.isCreatingNcReason = false;
        toast.success(action.payload.message);
      })
      .addCase(createNcReason.rejected, (state, action) => {
        state.isCreatingNcReason = false;
        toast.error(action.error.message);
      })
      .addCase(updateNcReason.pending, (state) => {
        state.isUpdatingNcReason = true;
      })
      .addCase(updateNcReason.fulfilled, (state, action) => {
        state.isUpdatingNcReason = false;
        toast.success(action.payload.message);
      })
      .addCase(updateNcReason.rejected, (state, action) => {
        state.isUpdatingNcReason = false;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = ncSlice;
export default reducer;
