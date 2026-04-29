import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import ShiftServices from "../services/ShiftServices";

export const fetchShiftHistory = createAsyncThunk(
  "/fetch/shift/history",
  async ({outletId,dateRange}) => {
    const res = await ShiftServices.getAllShiftHistoryApi(outletId,dateRange);
    return res.data;
  },
);
export const fetchShiftHistoryByid = createAsyncThunk(
  "/fetch/shift/history/id",
  async (shiftId) => {
    const res = await ShiftServices.getShiftHistoryByIdApi(shiftId);
    return res.data;
  },
);

const shiftSlice = createSlice({
  name: "shift",
  initialState: {
    isFetchingShiftHistory: false,
    shiftHistory: null,
    isFetchingShiftHistoryDetails: false,
    shiftHistoryDetails: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShiftHistory.pending, (state) => {
        state.isFetchingShiftHistory = true;
      })
      .addCase(fetchShiftHistory.fulfilled, (state, action) => {
        state.isFetchingShiftHistory = false;
        state.shiftHistory = action.payload.data;
      })
      .addCase(fetchShiftHistory.rejected, (state, action) => {
        state.isFetchingShiftHistory = false;
        toast.error(action.error.message);
      })
      .addCase(fetchShiftHistoryByid.pending, (state) => {
        state.isFetchingShiftHistoryDetails = true;
      })
      .addCase(fetchShiftHistoryByid.fulfilled, (state, action) => {
        state.isFetchingShiftHistoryDetails = false;
        state.shiftHistoryDetails = action.payload.data;
      })
      .addCase(fetchShiftHistoryByid.rejected, (state, action) => {
        state.isFetchingShiftHistoryDetails = false;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = shiftSlice;
export default reducer;
