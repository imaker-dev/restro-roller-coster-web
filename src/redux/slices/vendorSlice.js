import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import VendorServices from "../services/VendorServices";
import toast from "react-hot-toast";

/* ---------------- GET ALL VENDORS ---------------- */
export const fetchVendors = createAsyncThunk(
  "/fetch/vendors",
  async (outletId) => {
    const res = await VendorServices.getAllVendorsApi(outletId);
    return res.data;
  },
);

/* ---------------- GET VENDOR BY ID ---------------- */
export const fetchVendorById = createAsyncThunk(
  "/fetch/vendor/by/id",
  async (id) => {
    const res = await VendorServices.getVendorByIdApi(id);
    return res.data;
  },
);

/* ---------------- CREATE VENDOR ---------------- */
export const createVendor = createAsyncThunk(
  "/create/vendor",
  async ({ outletId, values }) => {
    const res = await VendorServices.createVendorApi(outletId, values);
    return res.data;
  },
);

/* ---------------- UPDATE VENDOR ---------------- */
export const updateVendor = createAsyncThunk(
  "/update/vendor",
  async ({ id, values }) => {
    const res = await VendorServices.updateVendorApi(id, values);
    return res.data;
  },
);

/* ---------------- SLICE ---------------- */

const vendorsSlice = createSlice({
  name: "vendor",
  initialState: {
    allVendorsData: [],
    vendorDetails: null,

    isFetchingVendors: false,
    isFetchingVendorDetails: false,
    isCreatingVendor: false,
    isUpdatingVendor: false,

    error: null,
  },

  reducers: {
    clearVendorState: (state) => {
      state.vendorDetails = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ---------------- FETCH ALL ---------------- */

      .addCase(fetchVendors.pending, (state) => {
        state.isFetchingVendors = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.isFetchingVendors = false;
        state.allVendorsData = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.isFetchingVendors = false;
        state.error = action.error.message;
      })

      /* ---------------- FETCH BY ID ---------------- */

      .addCase(fetchVendorById.pending, (state) => {
        state.isFetchingVendorDetails = true;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.isFetchingVendorDetails = false;
        state.vendorDetails = action.payload.data;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.isFetchingVendorDetails = false;
        state.error = action.error.message;
      })

      /* ---------------- CREATE ---------------- */

      .addCase(createVendor.pending, (state) => {
        state.isCreatingVendor = true;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.isCreatingVendor = false;
        toast.success(action.payload.message);
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.isCreatingVendor = false;
        state.error = action.error.message;
      })

      /* ---------------- UPDATE ---------------- */

      .addCase(updateVendor.pending, (state) => {
        state.isUpdatingVendor = true;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.isUpdatingVendor = false;
        toast.success(action.payload.message);
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.isUpdatingVendor = false;
        state.error = action.error.message;
      });
  },
});

export const { clearVendorState } = vendorsSlice.actions;

export default vendorsSlice.reducer;
