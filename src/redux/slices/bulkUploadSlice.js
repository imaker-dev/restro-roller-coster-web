import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import BulkUploadServices from "../services/BulkUploadServices";

// Download Template
export const downloadBulkUploadTemplate = createAsyncThunk(
  "/bulk-upload/menu/template",
  async () => {
    const res = await BulkUploadServices.downloadItemBulkUploadTemplateApi();
    return res.data;
  },
);

// Validate File
export const validateBulkUploadFile = createAsyncThunk(
  "/bulk-upload/menu/validate",
  async (formData) => {
    const res = await BulkUploadServices.itemBulkUploadValidateApi(formData);
    return res.data;
  },
);

// Preview File
export const previewBulkUploadFile = createAsyncThunk(
  "/bulk-upload/menu/preview",
  async (formData) => {
    const res = await BulkUploadServices.itemBulkUploadPreviewApi(formData);
    return res.data;
  },
);

// Upload File
export const uploadBulkUploadFile = createAsyncThunk(
  "/bulk-upload/menu",
  async (file) => {
    const res = await BulkUploadServices.uploadItemBulkUploadApi(file);
    return res.data;
  },
);
// Bulk Upload File Summary
export const fetchBulkUploadSummary = createAsyncThunk(
  "/fetch/bulk-upload/summary",
  async ({outletId}) => {
    const res = await BulkUploadServices.getBulkUploadSummaryApi(outletId);
    return res.data;
  },
);

const bulkUploadSlice = createSlice({
  name: "bulkUpload",
  initialState: {
    loadingTemplate: false,
    isValidating: false,
    isPreviewing: false,
    isUploading: false,
    validationData: null,
    previewData: null,
    uploadResult: null,
    isFetchingSummmary: false,
    uploadSummary: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Template
      .addCase(downloadBulkUploadTemplate.pending, (state) => {
        state.loadingTemplate = true;
      })
      .addCase(downloadBulkUploadTemplate.fulfilled, (state, action) => {
        state.loadingTemplate = false;
        toast.success("Template downloaded successfully");
      })
      .addCase(downloadBulkUploadTemplate.rejected, (state, action) => {
        state.loadingTemplate = false;
        toast.error(action.error.message);
      })

      // Validate
      .addCase(validateBulkUploadFile.pending, (state) => {
        state.isValidating = true;
      })
      .addCase(validateBulkUploadFile.fulfilled, (state, action) => {
        state.isValidating = false;
        state.validationData = action.payload.data;
        toast.success(action.payload.message);
      })
      .addCase(validateBulkUploadFile.rejected, (state, action) => {
        state.isValidating = false;
        toast.error(action.error.message);
      })

      // Preview
      .addCase(previewBulkUploadFile.pending, (state) => {
        state.isPreviewing = true;
      })
      .addCase(previewBulkUploadFile.fulfilled, (state, action) => {
        state.isPreviewing = false;
        state.previewData = action.payload.data;
      })
      .addCase(previewBulkUploadFile.rejected, (state, action) => {
        state.isPreviewing = false;
        toast.error(action.error.message);
      })

      // Upload
      .addCase(uploadBulkUploadFile.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(uploadBulkUploadFile.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadResult = action.payload.data;
        toast.success(action.payload.message);
      })
      .addCase(uploadBulkUploadFile.rejected, (state, action) => {
        state.isUploading = false;
        toast.error(action.error.message);
      })

      // summary
      .addCase(fetchBulkUploadSummary.pending, (state) => {
        state.isFetchingSummmary = true;
      })
      .addCase(fetchBulkUploadSummary.fulfilled, (state, action) => {
        state.isFetchingSummmary = false;
        state.uploadSummary = action.payload.data;
      })
      .addCase(fetchBulkUploadSummary.rejected, (state, action) => {
        state.isFetchingSummmary = false;
        toast.error(action.error.message);
      });
  },
});

export default bulkUploadSlice.reducer;
