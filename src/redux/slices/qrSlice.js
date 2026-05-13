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
    const res = await QrServices.generateSingleTableQrApi({ values });
    return res.data;
  },
);
export const generateAllTableQr = createAsyncThunk(
  "/generate/all-table/qr",
  async ({ values }) => {
    const res = await QrServices.generateAllTableQrApi({ values });
    return res.data;
  },
);
export const downloadAllTableQr = createAsyncThunk(
  "/download/all-table/qr",
  async ({ outletId }) => {
    const res = await QrServices.downloadAllTableQrApi({ outletId });
    return res.data;
  },
);
export const downloadTableQr = createAsyncThunk(
  "/download/table/qr",
  async ({ outletId, tableId }) => {
    const res = await QrServices.downloadTableQrApi({ outletId, tableId });
    return res.data;
  },
);

const qrSlice = createSlice({
  name: "qr",
  initialState: {
    isFetchingAllTableQr: false,
    allTablesQr: null,
    isGeneratingSingleQr: false,
    isGeneratingBulkQr: false,
    isDownloadingAllQr: false,
    tableQrToDownload: null,
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
      .addCase(downloadAllTableQr.pending, (state) => {
        state.isDownloadingAllQr = true;
      })
      .addCase(downloadAllTableQr.fulfilled, (state, action) => {
        state.isDownloadingAllQr = false;
        toast.success("All table QR codes downloaded successfully.");
      })
      .addCase(downloadAllTableQr.rejected, (state, action) => {
        state.isDownloadingAllQr = false;
        toast.error(action.error.message);
      })
      .addCase(downloadTableQr.pending, (state, action) => {
        state.tableQrToDownload = action.meta.arg.tableId;
      })
      .addCase(downloadTableQr.fulfilled, (state, action) => {
        state.tableQrToDownload = null;
        toast.success("Table QR codes downloaded successfully.");
      })
      .addCase(downloadTableQr.rejected, (state, action) => {
        state.tableQrToDownload = null;
        toast.error(action.error.message);
      });
  },
});

export default qrSlice.reducer;
