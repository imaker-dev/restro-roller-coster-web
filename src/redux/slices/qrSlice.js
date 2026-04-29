import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import QrServices from "../services/QrServices";

// Fetch all ingredients
export const fetchAllTableQr = createAsyncThunk(
  "/fetch/table/qr",
  async ({ outletId }) => {
    const res = await QrServices.getAllTableQrApi(outletId);
    return res.data;
  },
);
export const generateSingleTableQr = createAsyncThunk(
  "/generate/single-table/qr",
  async ({ values }) => {
    const res = await QrServices.generateSingleTableQrApi({values});
    return res.data;
  },
);
export const generateAllTableQr = createAsyncThunk(
  "/generate/all-table/qr",
  async ({ values }) => {
    const res = await QrServices.generateAllTableQrApi({values});
    return res.data;
  },
);

const qrSlice = createSlice({
  name: "qr",
  initialState: {
    isFetchingAllTableQr: false,
    allTablesQr: null,
    isGeneratingSingleQr:false,
    isGeneratingBulkQr:false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch all ingredients
      .addCase(fetchAllTableQr.pending, (state) => {
        state.isFetchingAllTableQr = true;
      })
      .addCase(fetchAllTableQr.fulfilled, (state, action) => {
        state.isFetchingAllTableQr = false;
        state.allTablesQr = action.payload.data;
      })
      .addCase(fetchAllTableQr.rejected, (state, action) => {
        state.isFetchingAllTableQr = false;
        toast.error(action.error.message);
      })
      .addCase(generateSingleTableQr.pending, (state) => {
        state.isGeneratingSingleQr = true;
      })
      .addCase(generateSingleTableQr.fulfilled, (state, action) => {
        state.isGeneratingSingleQr = false;
        state.allTablesQr = action.payload.data;
      })
      .addCase(generateSingleTableQr.rejected, (state, action) => {
        state.isGeneratingSingleQr = false;
        toast.error(action.error.message);
      })
      .addCase(generateAllTableQr.pending, (state) => {
        state.isGeneratingBulkQr = true;
      })
      .addCase(generateAllTableQr.fulfilled, (state, action) => {
        state.isGeneratingBulkQr = false;
        state.allTablesQr = action.payload.data;
      })
      .addCase(generateAllTableQr.rejected, (state, action) => {
        state.isGeneratingBulkQr = false;
        toast.error(action.error.message);
      })
  },
});

export default qrSlice.reducer;
