import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import OutletServices from "../services/OutletServices";

export const fetchAllOutlets = createAsyncThunk("/fetch/outlets", async () => {
  const res = await OutletServices.getAllOutletsApi();
  return res.data;
});
export const fetchOutletById = createAsyncThunk(
  "/fetch/outlet/:id",
  async (outletId) => {
    const res = await OutletServices.getOutletById(outletId);
    return res.data;
  },
);
export const createOutlet = createAsyncThunk(
  "/create/outlet",
  async (values) => {
    const res = await OutletServices.createOutletApi(values);
    return res.data;
  },
);
export const updateOutlet = createAsyncThunk(
  "/update/outlet",
  async ({ id, values }) => {
    const res = await OutletServices.updateOutletApi(id, values);
    return res.data;
  },
);
export const outletDeletePreview = createAsyncThunk(
  "/delete/outlet/preview",
  async (outletId) => {
    const res = await OutletServices.outletDeletePreviewApi(outletId);
    return res.data;
  },
);
export const hardDeleteOutlet = createAsyncThunk(
  "/hard-delete/outlet",
  async ({outletId,confirmationCode}) => {
    const res = await OutletServices.hardDeleteOutletApi(outletId,confirmationCode);
    return res.data;
  },
);
export const fetchOutletPrintLogo = createAsyncThunk(
  "/fetch/outlet/print-logo",
  async (outletId) => {
    const res = await OutletServices.getOutletPrintLogoApi(outletId);
    return res.data;
  },
);
export const updateOutletPrintLogo = createAsyncThunk(
  "/update/outlet/print-logo",
  async ({outletId,values}) => {
    const res = await OutletServices.updateOutletPrintLogoApi(outletId,values);
    return res.data;
  },
);

const outletSlice = createSlice({
  name: "outlet",
  initialState: {
    loading: false,
    allOutlets: null,
    isCreatingOutlet: false,
    isUpdatingOutlet: false,
    isFetchingOutletDetails: false,
    outletDetails: null,
    isOpeningDeletePreview: false,
    outletPreview: null,
    isDeletingOutlet: false,
    isFetchingOutletPrintLogo:false,
    outletPrintLogo:null,
    isUpdatingOutletPrintLogo:false,
  },
  reducers: {
    resetOutletPreview: (state) => {
      state.outletPreview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOutlets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOutlets.fulfilled, (state, action) => {
        state.loading = false;
        state.allOutlets = action.payload.data;
      })
      .addCase(fetchAllOutlets.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(fetchOutletById.pending, (state) => {
        state.isFetchingOutletDetails = true;
      })
      .addCase(fetchOutletById.fulfilled, (state, action) => {
        state.isFetchingOutletDetails = false;
        state.outletDetails = action.payload.data;
      })
      .addCase(fetchOutletById.rejected, (state, action) => {
        state.isFetchingOutletDetails = false;
        toast.error(action.error.message);
      })
      .addCase(createOutlet.pending, (state) => {
        state.isCreatingOutlet = true;
      })
      .addCase(createOutlet.fulfilled, (state, action) => {
        state.isCreatingOutlet = false;
        toast.success(action.payload.message);
      })
      .addCase(createOutlet.rejected, (state, action) => {
        state.isCreatingOutlet = false;
        toast.error(action.error.message);
      })
      .addCase(updateOutlet.pending, (state) => {
        state.isUpdatingOutlet = true;
      })
      .addCase(updateOutlet.fulfilled, (state, action) => {
        state.isUpdatingOutlet = false;
        toast.success(action.payload.message);
      })
      .addCase(updateOutlet.rejected, (state, action) => {
        state.isUpdatingOutlet = false;
        toast.error(action.error.message);
      })
      .addCase(outletDeletePreview.pending, (state) => {
        state.isOpeningDeletePreview = true;
      })
      .addCase(outletDeletePreview.fulfilled, (state, action) => {
        state.isOpeningDeletePreview = false;
        state.outletPreview = action.payload.data;
      })
      .addCase(outletDeletePreview.rejected, (state, action) => {
        state.isOpeningDeletePreview = false;
        toast.error(action.error.message);
      })
      .addCase(hardDeleteOutlet.pending, (state) => {
        state.isDeletingOutlet = true;
      })
      .addCase(hardDeleteOutlet.fulfilled, (state, action) => {
        state.isDeletingOutlet = false;
        toast.success(action.payload.message);
      })
      .addCase(hardDeleteOutlet.rejected, (state, action) => {
        state.isDeletingOutlet = false;
        toast.error(action.error.message);
      })
      .addCase(fetchOutletPrintLogo.pending, (state) => {
        state.isFetchingOutletPrintLogo = true;
      })
      .addCase(fetchOutletPrintLogo.fulfilled, (state, action) => {
        state.isFetchingOutletPrintLogo = false;
        state.outletPrintLogo = action.payload.data;
      })
      .addCase(fetchOutletPrintLogo.rejected, (state, action) => {
        state.isFetchingOutletPrintLogo = false;
        toast.error(action.error.message);
      })
      .addCase(updateOutletPrintLogo.pending, (state) => {
        state.isUpdatingOutletPrintLogo = true;
      })
      .addCase(updateOutletPrintLogo.fulfilled, (state, action) => {
        state.isUpdatingOutletPrintLogo = false;
        toast.success(action.payload.message);
      })
      .addCase(updateOutletPrintLogo.rejected, (state, action) => {
        state.isUpdatingOutletPrintLogo = false;
        toast.error(action.error.message);
      })
  },
});

export const { resetOutletPreview } = outletSlice.actions;
// Export reducer
const { reducer } = outletSlice;
export default reducer;
